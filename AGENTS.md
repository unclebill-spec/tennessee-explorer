# AGENTS.md: handoff for agents working on Tennessee Explorer

Owner: Bill Weathersbee. Live: https://unclebill-spec.github.io/tennessee-explorer/ (repo `unclebill-spec/tennessee-explorer`, GitHub Pages from `main`).
Sister site: Kentucky Explorer (`/workspace/kentucky/`, https://unclebill-spec.github.io/kentucky-explorer/). Both sites run the **same app code**.
Everything lives on the shared work box under `/workspace/tennessee/`. Times are US Eastern.

## How the two states share code
- `app.js`, `profiles.js`, `extras.js`, `perm.js`, `areas.js` and `style.css` are identical in `/workspace/kentucky/explorer/` and `/workspace/tennessee/explorer/`.
  - Edit one, copy it to the other, and test and publish **both**.
  - Per-state settings come from `K.meta.state`, which is the `STATE` dict in each `build.py`: name, bounds, cities, labels, solo buttons, localStorage prefix, and the other state's URL.
  - Kentucky's values are the defaults inside app.js (`const ST = Object.assign({...}, K.meta.state)`, exposed as `window.KYX_ST`).
- State switcher: the "KY | TN" control next to Layers, plus a link in the Top 10s menu.
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
- Thumbnails: `explorer/fetch_thumbs.py` (Wikidata/Commons photos, else an Esri satellite snapshot).

## Build, test, publish
- Build: `cd explorer && /usr/bin/python3 build.py`. Serve locally with `python3 -m http.server 8780`.
- Publish: `cd publish && PATH=/usr/bin:$PATH ./publish.sh -m "What changed"`. It adds a CHANGELOG entry, pulls before work and before the push, runs `secscan.sh` before **every** push (including the first), minifies, pushes and waits for Pages.
  - Check the result with `/usr/bin/python3 verify.py https://unclebill-spec.github.io/tennessee-explorer/`.
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
