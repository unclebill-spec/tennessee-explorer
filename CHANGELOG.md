# Changelog: Tennessee Explorer

Live site: https://unclebill-spec.github.io/tennessee-explorer/. Times are US Eastern.
It is a sister site to the Kentucky Explorer (https://unclebill-spec.github.io/kentucky-explorer/). The app code was copied from the
Kentucky Explorer on Oct 1, 2026 and made generic per state, so its history up to that day is in the Kentucky CHANGELOG.
New entries are added by `publish/publish.sh -m "message"`.

## 2026-10-02
- 18:30 ET: State switcher: add the Massachusetts Explorer (KY | MA | TN); shared app code synced from Kentucky (town/county wording, multi-state switcher)
- 02:55 ET: Homes and land brought to Bill's criteria: near-hospital homes now include townhomes and condos (110: 83 houses, 20 townhomes, 7 condos; no manufactured homes), skip listings worded as-is / fixer / needs work / investor / damage, and must be within 10 min of a TN hospital with a 10+ bed ER (estimated from TN HFC licensed beds 100+ and a 24/7 ER; 55 hospitals qualify, labeled as an estimate); 5+ acre homes limited to $300k-$500k with 10-20 acres ranked best and second dwellings noted (159); 1+ acre homes 159; listings without a price dropped. Activities: 17 waterfalls, 22 distilleries (Tennessee Whiskey Trail) and 42 hiking trails added (Wikidata + OpenStreetMap Nominatim, since Overpass is still unreachable); thumbnails for every point
- 02:13 ET: Sync shared app code from Kentucky (KY 1fa5155): one county canvas until the first zoom-in (faster load, smoother zoom, same look) and a smaller map credit at bottom left; city page area labels fit their blocks better
- 01:54 ET: Phase 5: Nashville and Memphis homes by area. New city page (city.html) with 14 Nashville community planning areas and 20 Memphis-area blocks (14 Memphis 3.0 districts + 6 suburbs), 3,936 + 3,377 houses, condos and townhomes for sale, block colors by matching homes / median price / $ per sq ft / ER drive / condo share, block and listing cards, per-profile city criteria (default house/condo/townhome, <= $600k, 2+ bd, 2+ ba, 1,000+ sq ft, no acreage minimum); links from the Layers panel and the Davidson and Shelby county cards
- 01:08 ET: Phase 4: attractions (161: parks, zoos, caves, water parks, aquariums, 70 museums, 74 campgrounds), 27 always-on TN standouts, 59 businesses and 28 odd buildings for sale (Crexi) with Top 10s; airports labels
- 00:57 ET: Phase 3: permanent RN jobs (2,489 at 111 TN sites from 25+ systems; HCA partial via web search) and travel RN jobs (588 at 38 hospitals); Top 10s for perm ER/SD-MS/ICU, bonuses and travel; airports layer (11)
- 00:12 ET: Phase 2, homes and land: 385 Tennessee listings from Zillow's public search (160 homes on 5+ acres, 140 homes on 1+ acre, 85 homes within 10 minutes of a qualifying ER hospital), each with up to 4 photos, drive times to the nearest hospital and trauma center, profile matching, and 15 bargains flagged against nearby comps (Deals of the Week Top 10). Shared app code synced from Kentucky (zoom-based color fade).

## 2026-10-01
- 22:42 ET: Phase 1 base map: Tennessee Explorer launched from the Kentucky Explorer app (shared code): 95 counties colored by Appeal score, TN HFC hospitals + designated trauma centers (and border KY/AL/MS/NC/GA centers), TDOE 2024-25 A-F school letter grades, colleges, state parks/caves/arches, NOAA climate normals, Compare areas (Nashville, Memphis, Knoxville, Chattanooga, Clarksville vs Kentucky), 5 largest cities, KY | TN switcher, collapsed Map key / Search pills, landscape wheel, full screen

