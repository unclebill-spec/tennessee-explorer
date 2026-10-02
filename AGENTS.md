# AGENTS.md: handoff for agents working on Tennessee Explorer

Owner: Bill Weathersbee. Live: https://unclebill-spec.github.io/tennessee-explorer/ (repo `unclebill-spec/tennessee-explorer`, GitHub Pages from `main`).
Sister site: Kentucky Explorer (`/workspace/kentucky/`, https://unclebill-spec.github.io/kentucky-explorer/). Both sites run the **same app code**.
Everything lives on the shared work box under `/workspace/tennessee/`. Times are US Eastern.

## How the two states share code
- `app.js`, `profiles.js`, `extras.js`, `perm.js`, `areas.js` and `style.css` are identical in `/workspace/kentucky/explorer/` and `/workspace/tennessee/explorer/`.
  - Edit one, copy it to the other, and test and publish **both**.
  - Per-state settings come from `K.meta.state`, which is the `STATE` dict in each `build.py`: name, bounds, cities, labels, solo buttons, localStorage prefix, and the other state's URL.
  - Kentucky's values are the defaults inside app.js (`const ST = Object.assign({...}, K.meta.state)`, exposed as `window.KYX_ST`).
- State switcher: the "KY | TN" control next to Layers (inside the collapsed Search pill), plus a link in the Top 10s menu.
- Top pills: "Map key" (top left) and "Search" (top right) start collapsed. Phone Back, a tap outside, or Esc closes them. Test with `/workspace/kentucky/perf/test_pnl.py BASE TAG`.
- localStorage keys use `ST.ls` (`kyx_` / `tnx_`). The profile keys `kyx_prof*` are shared on purpose, because both sites are on the same origin (unclebill-spec.github.io).
- Service-worker caches are named `tnx-*` here and `kyx-*` in Kentucky. Keep them different, again because of the shared origin.
- `build.py` here is a port of Kentucky's:
  - STATEFP 47.
  - Hospitals from `data/statewide/tn_hospitals_points.csv`; schools from TDOE letter grades.
  - The old KY loaders are kept and renamed `*_ky`.

## Data (all real sources; nothing estimated)
- `scripts/tn_layers.py` (venv python `/workspace/kentucky/.venv/bin/python`) writes the following to `data/statewide/` and `data/schools/`:
  - county cost and land
  - hospitals (TN HFC July 2026 plus CMS, and KY/AL/MS/NC/GA border and trauma centers)
  - nurse market (BLS OEWS May 2025)
  - schools: TDOE 2024-25 A–F, TCAP 2026, SEDA 2025.1
  - sweet spot
- `scripts/tn_appeal_build.py` writes the Appeal score (`tn_county_appeal.csv` plus method). It uses OSRM drive times, cached in `data/statewide/raw/osrm_county_hospital_drives.json`.
- `climate/build_clim.py` writes `data/clim.json` (NOAA 1991–2020 normals).
- Compare areas: `/workspace/kentucky/compare/build_areas.py` writes one `areas.json` with KY and TN cities to **both** projects.
  - The TN page shows TN's 5 largest cities and their KY counterparts.
  - FBI crime numbers are pending: `compare/crime.py` is waiting out the DEMO_KEY rate limit, and the TN ORIs still need adding.
- Homes and land (Phase 2):
  - `scripts/tn_zsearch.py` pulls Zillow's public search results for every county in three searches (`p5` 5+ acres, `p1` 1+ acre, `nh` near-hospital homes) into `data/zsearch/<cat>/<county>.json`. It sleeps between requests and stops on a 403 or CAPTCHA.
  - `scripts/tn_listings_build.py` writes `listings.json` and `listing-photos/<id>/` (up to 4 photos each). It picks one category per listing and gets OSRM drive times to the nearest acute, Level I/II trauma and qualifying ER hospitals (cached in `data/zsearch/drives_cache.json`). It ranks by county Appeal, price, land or size, and drive time, then fetches each pick's listing page (cached in `data/zsearch/detail_cache.json`).
  - Statewide categories are detached houses and manufactured homes only. Condos and townhomes are left for the Phase 5 city sub-maps.
  - `scripts/bargains.py` flags up to 15 bargains against nearby Zillow comps (`data/zsearch/*/*.json`). It runs on every build.
- RN jobs (Phase 3):
  - `scripts/tn_perm_jobs.py` reuses `/workspace/kentucky/scripts/perm_jobs_collect.py` (imported, readers re-pointed at TN career sites) and writes `data/perm_jobs.json`. A full run takes about 25 minutes (Regional One's Paycom portal is about 14 of them).
    - `--only key1,key2` writes `data/perm_jobs.partial.json`. Then run `scripts/perm_merge.py <partial...>` to swap those systems into `perm_jobs.json`.
    - Hospital matching: TN hospitals come from `data/statewide/tn_hospitals_points.csv`, using per-system `RULES` regexes first (a `None` target means a known non-hospital site), then name tokens, then city.
    - Ascension and Covenant list pages give no facility, so the job page is read (Ascension's `locationName`; Covenant's "Facility … Department Name").
    - VUMC TempForce posts are internal temporary agency jobs, so they are marked non-permanent.
    - HCA blocks automated access. `data/hca_search_jobs.json` holds only the job pages a simple web search found, and coverage is marked partial.
  - `scripts/tn_travel_jobs.py` writes `data/travel_jobs.json` from Vivian and Advantis public TN listings in `/workspace/tj_tn`. Children's hospitals and non-hospital sites are excluded.
  - Test: `/usr/bin/python3 perf/test_perm.py BASE TAG` (TN copy of the KY test: Nashville, VUMC, Davidson).
- Airports (Phase 4): `data/airports/airports.py` writes `data/airports.json` from Wikipedia airline and destination tables, with photos in `data/airports/img/`. It covers BNA, MEM, TYS, CHA and TRI plus ATL, HSV, AVL, SDF, BHM and PAH.
- For sale (Phase 4): `data/forsale/crexi_list.py` lists Crexi's public TN listings under $1M by type into `crexi_tn_all.json`, and `crexi_details.py` saves each listing's details. Picks are hand-made in `curate.py`, and `make_forsale.py` writes `data/businesses_for_sale.json` and `data/buildings_for_sale.json` with photos.
- Attractions (Phase 4): `data/attractions/make_attractions.py` writes `data/attractions.json` (161 items: 74 campgrounds, 70 museums, 11 parks/zoos/caves, 4 water parks, 2 aquariums) with photos in `data/attractions/img/`.
  - Sources: hand-picked parks, zoos and caves via Wikipedia (`MANUAL_LL` has Nominatim coordinates where an article has none); museums from Wikidata (`wd2.py` writes `wd.json`, and museums whose article says "was a museum" are dropped); Recreation.gov federal campgrounds (`rec_tn.json`); and 35 TN state-park campgrounds.
  - Overpass (OSM) was unreachable from the box on 2026-10-02; `ovp.sh` is there for a retry.
  - The app has only 5 attraction types, so zoos, caves and the incline railway use type `amusement` with a `label` ("Zoo", "Cave attraction"). `build.py` shows the label as the kind, but the shared card kicker still says "Amusement park".
- Standouts: `data/featured.json` lists the featured attraction and activity ids (icons at every zoom).
- Top 10 businesses: `scripts/top_lists.py` (TN copy). Its appeal words (cabins, RV park, lodging) must appear in the title or category; Smokies and TN lake names add a small bonus.
- Thumbnails: `explorer/fetch_thumbs.py` (Wikidata/Commons photos, else an Esri satellite snapshot).

## Build, test, publish
- Build: `cd explorer && /usr/bin/python3 build.py`. Serve locally with `python3 -m http.server 8780`.
- Publish: `cd publish && PATH=/usr/bin:$PATH ./publish.sh -m "What changed"`. It adds a CHANGELOG entry, pulls before work and before the push, runs `secscan.sh` before **every** push (including the first), minifies, pushes and waits for Pages.
  - Check the result with `/usr/bin/python3 verify.py https://unclebill-spec.github.io/tennessee-explorer/`.
- TN tests: `perf/test_homes.py`, `perf/test_perm.py`, `perf/test_p4.py`, `perf/smoke.py` (each takes BASE TAG).
- Tests: the Kentucky suites in `/workspace/kentucky/perf/*.py` take a base URL. Some have KY-specific expectations (city names, counties).

## Phases (Bill's plan)
1. Base map: counties plus Appeal score, hospitals and trauma, schools and colleges, climate, Compare areas, state switcher, repo and Pages.
2. Homes and land listings.
3. Permanent RN jobs (reuse `perm_jobs_collect.py` for TN systems; HCA last, and if HCA blocks automation use a simple Google search only) plus travel jobs.
4. Attractions, airports, businesses and odd buildings for sale.
5. Nashville (Davidson) and Memphis (Shelby) mega-block sub-maps with neighborhood or planning-area blocks.
   - City home criteria allow condos and townhomes, have no acreage minimum and allow higher prices.
   - All of these are adjustable in profiles.

## Rules
- Never commit secrets. Run secscan before every push. Pull before pushing. Use descriptive commit messages.
- Don't get around site blocks (robots, captchas, logins). Use public pages only.
