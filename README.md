# PlantFinder
Native plants from council planting lists, sorted by the conditions of your site. Enter an address to find its council, then filter by sun, water, size and flowering conditions.

## Run locally
The page loads its data with `fetch`, so it must be served over HTTP (opening `index.html` as a file won't work):

```
python -m http.server 8000
```

Then open http://localhost:8000.

## Project layout
```
index.html                  page structure only
css/style.css
js/app.js                   filtering, rendering, address lookup
data/councils.json          supported councils (zones, sources), suburbs, all NSW council names
data/plants/<council>.json  one council's plant list, one plant per line; loaded when that council is shown
data/photos.json            photo credit and licence per species (written by tools/fetch_photos.py)
data/photo-queries.json     alternative names to search photos under (synonyms, cultivars)
images/plants/sm|lg/        plant photos, 600 px (cards) and 1000 px (detail panel)
tools/                      maintenance scripts (below)
```

## Adding a council
1. Add the council to `councils` in `data/councils.json`. The key is its name from `nswCouncils` in lower case
   with dashes for spaces (`SYDNEY` → `sydney`, `CANADA BAY` → `canada-bay`), so address lookups can find it.
2. Add its suburbs to `suburbs` in the same file: `["Glebe", "2037", "sydney"]`.
3. Create `data/plants/<key>.json` with `{"council": "<key>", "plants": [...]}`.
   - A species that is already on another council's list keeps its existing `id`. Add the new council to
     its `councils` and `zonesBy`, and make the same change to the copy in every other file that lists it.
   - A new species gets the next free id (printed by the check below).
4. Run `node tools/check-data.mjs` and fix any errors.
5. Run `python tools/fetch_photos.py` to download photos for the new species (needs Pillow).

Species without a downloaded photo still work: the browser looks one up live from iNaturalist as before.
