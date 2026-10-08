# Changelog: Tennessee Explorer

Live site: https://unclebill-spec.github.io/tennessee-explorer/. Times are US Eastern.
It is a sister site to the Kentucky Explorer (https://unclebill-spec.github.io/kentucky-explorer/). The app code was copied from the
Kentucky Explorer on Oct 1, 2026 and made generic per state, so its history up to that day is in the Kentucky CHANGELOG.
New entries are added by `publish/publish.sh -m "message"`.

## 2026-10-08
- 00:16 ET: New right-side 'Hospitals' filter button: shows every hospital on the map, including hospitals within ~15 mi over the state line, with the icons they already have. While it is on, hospitals are drawn larger and on top, every trauma center sits above every other hospital (single pins and groups), and other pins shrink underneath. Hidden in Anna mode. Shared app code, same on every map.

## 2026-10-07
- 20:51 ET: Active filter on top: whatever right-side button or Top 10 list is selected (Target, Bargain, 50+ ac, Cave, Falls, Jobs, Anna's buttons, a Top 10 list...) now draws its pins 1.4x larger (its groups 1.15x) and above every other pin; always-on pins (trauma centers, airports, cities...) stay visible but smaller (0.72x) and underneath while it is on. Turning the filter off restores the normal map exactly (shared app code, same on every map).
- 17:37 ET: Target store cards: the location row now reads 'County: Davidson County' (shared app code, same on every map).
- 17:17 ET: Target stores layer: every Target in Tennessee (32, Target's own store directory) plus 4 within ~15 mi over the line (MS 2, AL 1, VA 1; tagged, not counted in county stats). Small red bullseye pins (grouped, faint dots when zoomed out), right-side 'Target' button (also in Anna mode), store cards with address, phone, regular hours and services, share links #target=<store number>, and the nearest Target (OSRM free-flow drive time) in every property card's Nearby section.
- 16:58 ET: Listings refresh: +11 new, -9 sold/off-market, 34 price drops (15 now pending/contingent, labeled); 50+ ac 68 -> 70; caves/waterfalls 43 -> 42 (+1 falls, -1 cave); bargains refreshed (3 in, 3 out); 2441 perm RN jobs; Anna: 44 eng / 49 spouse jobs (10 dead links dropped), 334 homes (2026-10-07)

## 2026-10-05
- 23:51 ET: Anna profile: engineering jobs now labeled as Shawn's (Anna's husband), leasing/billing jobs as Anna's
- 23:17 ET: Add North Carolina to the state switcher; border items now include North Carolina homes, hospitals, schools, colleges, attractions and RN jobs within ~15 mi
- 21:06 ET: Permanent RN jobs: cardiac cath lab postings are now hidden like the other cath lab jobs. 12 jobs (Ballad Bristol / Johnson City, Vanderbilt, Erlanger, UT Medical Center, Saint Thomas West, Highpoint Winchester) were filed under step-down because the word 'cardiac' matched before 'cath'; any job whose title or unit names the cath lab is now Cath lab / IR. Cath recovery, cath-lab step-down and holding jobs stay in.
- 20:41 ET: Anna update: Arnold AFB / AEDC drive times fixed (routed to the public Wattendorf Hwy entrance), 336 Anna homes in 21 counties (Tullahoma / AEDC area added), 59 spouse jobs (Tri-Cities, Spring Hill / Columbia, Greeneville, Tullahoma added), Homes Closest to School uses A/B-rated K-5 schools, Best Balance adds pay nearby and cost of living, home cards show spouse jobs and the balance breakdown
- 20:33 ET: Anna profile: 5th top button for an engineer + spouse household (engineering jobs over $120k with relocation / bonus filters, spouse leasing and AR-billing jobs, 2bd/2ba homes up to $550k, K-6 schools, Anna area score, no hospitals) with 7 Top 10s: Top Pay, Biggest Bonus (est.), Best Relocation, Best Overall Job, Homes Closest to Job, Homes Closest to School, Best Balance Homes

## 2026-10-04
- 20:41 ET: Fix: Kentucky border homes no longer say '(estimate) (estimate)' in the hospital-drive line
- 16:07 ET: Caves and waterfalls: the same land listed more than once is now shown once (most detailed listing kept); Border: caves and waterfalls on the property from neighboring states (bat / waterfall pins)
- 15:17 ET: Caves and waterfalls on the property: flying-bat and waterfall pins + groups, 'Cave' and 'Falls' buttons, Map key, card with the listing's own words, acres, price and Nearby
- 10:48 ET: 50+ acre lots under $250k (land or home): small black star pins + groups, '50+ ac' button, Map key row, card with acres, $/acre, dwelling and Nearby; border listings too
- 08:03 ET: State switcher: shrinks and scrolls sideways on narrow phones (10 maps)
- 07:33 ET: State switcher: add New Hampshire (10 maps)
- 06:15 ET: State switcher: add Utah (9 maps)

## 2026-10-03
- 20:56 ET: State switcher: add Idaho (8 maps)
- 18:22 ET: State switcher: Montana and Wyoming added
- 17:09 ET: Pin the bottom Top 10 pill row snug against the bottom-left edge of the map (5 px + safe area, same place on every window size, after cards open/close, resizes and full screen); zoom, scale and OpenStreetMap credit move up with it and stay uncovered; on short windows (e.g. 1366x600 above the Windows taskbar) the right-hand filter column now fits above Areas instead of being cut off
- 16:32 ET: Fix the bottom Top 10 pill row on desktop: after a window resize or full-screen change while a card was open the pills were measured while hidden and collapsed into two tiny overlapping pills at the left; the row now re-measures when it is shown again, pills size to their full titles and the row widens to hold exactly 3 whole pills (one pill per mouse-wheel notch, swipe and snap on phones unchanged)
- 15:53 ET: Bargains are purple with a star everywhere: the right-side Bargain filter button (column and landscape wheel), the Map key heading, the deal note on cards and the Top 10 'Bargain' mark now use the same purple star (#8e24aa) as the bargain pins and Deals pill instead of the yellow emoji
- 15:34 ET: Border items: pins up to ~15 mi outside the state line that meet this map's own criteria, from Kentucky (homes, jobs, hospitals, graded schools...) plus Virginia, North Carolina, Georgia, Alabama, Mississippi, Arkansas and Missouri. Same icons, filters, Top 10s and share links; each card is tagged with its state; county/town stats and appeal scores unchanged (explorer/border.json, shared border_build.py + build.py hook + app.js/style.css)
- 14:37 ET: Purple bargain icon (pins, groups, Map key, Deals pill); bottom Top 10 pills show exactly 3 whole buttons and snap one button or one page at a time; right-side filter buttons scroll with the mouse wheel and wheel events over them no longer zoom the map
- 14:04 ET: Add ski areas and notable mountain peaks layers: ski/peak icons, cards with trails, lifts, vertical, snowfall, season, ticket and pass prices (season + source labeled), discounts, special days; peaks with elevation, prominence, activities, estimated summit weather; Ski and Peaks solo buttons, Map key, zoom tiers, share links #ski= / #peak=
- 12:49 ET: State switcher: add Vermont (KY / MA / ME / TN / VT); shared app code with the per-state caps/cabin config (no change for this state)
- 10:48 ET: State switcher: add Maine (new Maine Explorer); Compare areas shows n/a for a missing school result
- 07:51 ET: Tapping the Davidson (Nashville) or Shelby (Memphis) county block now opens its city map (city.html#nashville / #memphis) directly; phone Back and the page's '‹ TN map' link return to the map at the same view, and the city page links to the county card. Other counties keep their card; #county links and search still open the card. Shared app.js: generic per-state ST.cityPage config (same change as Massachusetts' Boston).

## 2026-10-02
- 19:40 ET: Shared app.js: Top-10 pill carousel no longer clones pills when they all fit (MA showed 'Deals' twice); home price labels and Max price menus read configurable caps (ST.caps, Tennessee unchanged: $500k / $425k / $325k); secscan 'sk-' key pattern no longer matches mid-word (false positive on job URLs).
- 18:30 ET: State switcher: add the Massachusetts Explorer (KY | MA | TN); shared app code synced from Kentucky (town/county wording, multi-state switcher)
- 02:55 ET: Homes and land brought to Bill's criteria: near-hospital homes now include townhomes and condos (110: 83 houses, 20 townhomes, 7 condos; no manufactured homes), skip listings worded as-is / fixer / needs work / investor / damage, and must be within 10 min of a TN hospital with a 10+ bed ER (estimated from TN HFC licensed beds 100+ and a 24/7 ER; 55 hospitals qualify, labeled as an estimate); 5+ acre homes limited to $300k-$500k with 10-20 acres ranked best and second dwellings noted (159); 1+ acre homes 159; listings without a price dropped. Activities: 17 waterfalls, 22 distilleries (Tennessee Whiskey Trail) and 42 hiking trails added (Wikidata + OpenStreetMap Nominatim, since Overpass is still unreachable); thumbnails for every point
- 02:13 ET: Sync shared app code from Kentucky (KY 1fa5155): one county canvas until the first zoom-in (faster load, smoother zoom, same look) and a smaller map credit at bottom left; city page area labels fit their blocks better
- 01:54 ET: Phase 5: Nashville and Memphis homes by area. New city page (city.html) with 14 Nashville community planning areas and 20 Memphis-area blocks (14 Memphis 3.0 districts + 6 suburbs), 3,936 + 3,377 houses, condos and townhomes for sale, block colors by matching homes / median price / $ per sq ft / ER drive / condo share, block and listing cards, per-profile city criteria (default house/condo/townhome, <= $600k, 2+ bd, 2+ ba, 1,000+ sq ft, no acreage minimum); links from the Layers panel and the Davidson and Shelby county cards
- 01:08 ET: Phase 4: attractions (161: parks, zoos, caves, water parks, aquariums, 70 museums, 74 campgrounds), 27 always-on TN standouts, 59 businesses and 28 odd buildings for sale (Crexi) with Top 10s; airports labels
- 00:57 ET: Phase 3: permanent RN jobs (2,489 at 111 TN sites from 25+ systems; HCA partial via web search) and travel RN jobs (588 at 38 hospitals); Top 10s for perm ER/SD-MS/ICU, bonuses and travel; airports layer (11)
- 00:12 ET: Phase 2, homes and land: 385 Tennessee listings from Zillow's public search (160 homes on 5+ acres, 140 homes on 1+ acre, 85 homes within 10 minutes of a qualifying ER hospital), each with up to 4 photos, drive times to the nearest hospital and trauma center, profile matching, and 15 bargains flagged against nearby comps (Deals of the Week Top 10). Shared app code synced from Kentucky (zoom-based color fade).

## 2026-10-01
- 22:42 ET: Phase 1 base map: Tennessee Explorer launched from the Kentucky Explorer app (shared code): 95 counties colored by Appeal score, TN HFC hospitals + designated trauma centers (and border KY/AL/MS/NC/GA centers), TDOE 2024-25 A-F school letter grades, colleges, state parks/caves/arches, NOAA climate normals, Compare areas (Nashville, Memphis, Knoxville, Chattanooga, Clarksville vs Kentucky), 5 largest cities, KY | TN switcher, collapsed Map key / Search pills, landscape wheel, full screen

