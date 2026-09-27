"""Download one openly licensed photo per plant species and store it with the site.

    python tools/fetch_photos.py                 # fetch species that have no photo yet
    python tools/fetch_photos.py --retry-misses  # also retry species where nothing was found last time
    python tools/fetch_photos.py --force "Banksia serrata"   # re-fetch specific species

Writes:
    images/plants/sm/<slug>.webp   600 px wide, for cards
    images/plants/lg/<slug>.webp   1000 px wide, for the detail panel
    data/photos.json               credit, licence and source for every photo (the site shows the credit)

Sources, in order: iNaturalist default photo, other iNaturalist taxon photos, Wikipedia/Wikimedia Commons.
Only openly licensed photos are used ("all rights reserved" is skipped). Note that CC BY-NC photos are
fine for a non-commercial site but not for commercial use; the licence code is saved so they can be filtered.

To use your own photo: save it as images/plants/{sm,lg}/<slug>.webp and add an entry to data/photos.json
with your credit. Species already in photos.json are never overwritten unless named with --force.
"""
import argparse
import io
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / "images" / "plants"
PHOTOS_JSON = ROOT / "data" / "photos.json"
QUERIES_JSON = ROOT / "data" / "photo-queries.json"
SIZES = {"sm": 600, "lg": 1000}
UA = "PlantFinder/1.0 (council native plant finder; photo cache build script)"
API_GAP = 1.1  # seconds between API calls (iNaturalist asks for about 1 request per second)

_last_call = 0.0


def slug(sci):
    return re.sub(r"[^a-z0-9]+", "-", sci.lower()).strip("-")


def get(url, api=True):
    global _last_call
    if api:
        wait = _last_call + API_GAP - time.time()
        if wait > 0:
            time.sleep(wait)
        _last_call = time.time()
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code == 404:
                raise
            if attempt == 3:
                raise
            time.sleep(30 if e.code == 429 else 5)
        except (urllib.error.URLError, TimeoutError):
            if attempt == 3:
                raise
            time.sleep(5)


def get_json(url):
    return json.loads(get(url))


def is_open(code):
    return bool(code) and code != "all rights reserved"


def inat_large(url):
    return url.replace("/medium.", "/large.").replace("/square.", "/large.")


def find_inat(q):
    plain = not re.search(r"var\.|subsp\.|'", q)
    d = get_json("https://api.inaturalist.org/v1/taxa?is_active=true&per_page=10"
                 + ("&rank=species" if plain else "") + "&q=" + urllib.parse.quote(q))
    res = d.get("results") or []
    genus = q.split(" ")[0]
    t = (next((x for x in res if x.get("name") == q), None)
         or next((x for x in res if x.get("matched_term") == q), None)
         or next((x for x in res if x.get("name", "").split(" ")[0] == genus), None))
    if not t:
        return None

    def pack(ph):
        return {"url": inat_large(ph["medium_url"]), "credit": ph.get("attribution", ""),
                "src": "iNaturalist", "license": ph.get("license_code"),
                "page": "https://www.inaturalist.org/photos/%s" % ph["id"] if ph.get("id") else None}

    ph = t.get("default_photo")
    if ph and is_open(ph.get("license_code")) and ph.get("medium_url"):
        return pack(ph)
    full = get_json("https://api.inaturalist.org/v1/taxa/%d" % t["id"])
    photos = [x.get("photo") for x in ((full.get("results") or [{}])[0].get("taxon_photos") or [])]
    ph = next((x for x in photos if x and is_open(x.get("license_code")) and x.get("medium_url")), None)
    return pack(ph) if ph else None


def find_wiki(q):
    try:
        s = get_json("https://en.wikipedia.org/api/rest_v1/page/summary/" + urllib.parse.quote(q.replace(" ", "_")))
    except urllib.error.HTTPError:
        return None
    src = s.get("originalimage") or s.get("thumbnail")
    if not src:
        return None
    file = urllib.parse.unquote(re.sub(r"^\d+px-", "", src["source"].split("/")[-1]))
    d = get_json("https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo"
                 "&iiprop=url|extmetadata&iiurlwidth=1000&titles=File:" + urllib.parse.quote(file))
    page = next(iter((d.get("query") or {}).get("pages", {}).values()), None)
    ii = page and (page.get("imageinfo") or [None])[0]
    if not ii:
        return None
    md = ii.get("extmetadata") or {}
    lic = (md.get("LicenseShortName") or {}).get("value", "")
    if not re.search(r"cc|public domain|pd", lic, re.I):
        return None
    artist = re.sub(r"<[^>]+>", "", (md.get("Artist") or {}).get("value", "Unknown")).strip()
    return {"url": ii.get("thumburl") or ii["url"], "credit": "© %s (%s), via Wikimedia Commons" % (artist, lic),
            "src": "Wikimedia", "license": lic, "page": ii.get("descriptionurl")}


def save_images(url, name):
    im = Image.open(io.BytesIO(get(url, api=False)))
    im = im.convert("RGB")
    for folder, width in SIZES.items():
        out = im if im.width <= width else im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
        (IMG_DIR / folder).mkdir(parents=True, exist_ok=True)
        out.save(IMG_DIR / folder / (name + ".webp"), "WEBP", quality=78, method=6)


def all_species():
    files = sorted((ROOT / "data" / "plants").glob("*.json"))
    return sorted({p["sci"] for f in files for p in json.loads(f.read_text("utf8"))["plants"]})


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--retry-misses", action="store_true")
    ap.add_argument("--force", nargs="*", default=[])
    args = ap.parse_args()

    photos = json.loads(PHOTOS_JSON.read_text("utf8")) if PHOTOS_JSON.exists() else {}
    queries = {k: v for k, v in json.loads(QUERIES_JSON.read_text("utf8")).items() if not k.startswith("_")}
    todo = []
    for sci in all_species():
        e = photos.get(sci)
        have = e and not e.get("miss") and all((IMG_DIR / f / (e["file"] + ".webp")).exists() for f in SIZES)
        if sci in args.force or not e or (e.get("miss") and args.retry_misses) or (e and not e.get("miss") and not have):
            todo.append(sci)
    print("%d species, %d to fetch" % (len(all_species()), len(todo)))

    for i, sci in enumerate(todo, 1):
        m = queries.get(sci, {})
        q = m.get("q", sci)
        try:
            info = find_inat(q) or find_wiki(q)
            if info:
                name = slug(sci)
                save_images(info.pop("url"), name)
                info = {"file": name, **info}
                if m.get("note"):
                    info["note"] = m["note"]
                photos[sci] = {k: v for k, v in info.items() if v}
                print("[%d/%d] ok    %s (%s)" % (i, len(todo), sci, info["src"]))
            else:
                photos[sci] = {"miss": True}
                print("[%d/%d] none  %s" % (i, len(todo), sci))
        except Exception as e:  # keep going; the site falls back to a live lookup for this one
            print("[%d/%d] error %s: %s" % (i, len(todo), sci, e), file=sys.stderr)
            continue
        PHOTOS_JSON.write_text(json.dumps(dict(sorted(photos.items())), ensure_ascii=False, indent=1) + "\n", "utf8")

    misses = sorted(k for k, v in photos.items() if v.get("miss"))
    if misses:
        print("No photo found for:", ", ".join(misses))


if __name__ == "__main__":
    main()
