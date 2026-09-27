// Checks data/councils.json and data/plants/*.json for mistakes. Run after editing the data:
//   node tools/check-data.mjs
// A species on several councils' lists is stored in each of those files, so the copies must stay identical
// (same id, same fields). Edit every copy, or copy the corrected line from one file to the others.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));
const errors = [], warnings = [];
const err = (m) => errors.push(m), warn = (m) => warnings.push(m);

const { councils, suburbs } = read("data/councils.json");
const photos = fs.existsSync(path.join(ROOT, "data/photos.json")) ? read("data/photos.json") : {};

const REQUIRED = ["id", "sci", "common", "type", "h", "w", "sun", "water", "soil", "months", "colour", "hex", "cg", "tox", "allergy", "pot", "uses", "note", "councils", "zonesBy"];
const TYPES = ["Tree", "Shrub", "Climber", "Groundcover", "Fern", "Grass", "Strappy", "Sedge & Rush"];
const SUN = ["FS", "PS", "S"], WATER = ["LW", "MW", "HW"];
const range = (a) => Array.isArray(a) && a.length === 2 && a.every((n) => typeof n === "number") && a[0] <= a[1];

const bySci = new Map(); // sci -> [{ file, rec }]
const byId = new Map(); // id -> sci
for (const key of Object.keys(councils)) {
  const file = "data/plants/" + key + ".json";
  if (!fs.existsSync(path.join(ROOT, file))) { err(key + ": missing " + file); continue; }
  const d = read(file);
  if (d.council !== key) err(file + ': "council" should be "' + key + '"');
  const seen = new Set();
  d.plants.forEach((p, i) => {
    const at = file + " #" + (i + 1) + " " + (p.sci || "(no sci)");
    REQUIRED.forEach((k) => { if (p[k] === undefined) err(at + ": missing " + k); });
    if (seen.has(p.sci)) err(at + ": listed twice in this file");
    seen.add(p.sci);
    if (!TYPES.includes(p.type)) err(at + ": unknown type " + p.type);
    if (!range(p.h) || !range(p.w)) err(at + ": h and w must be [min, max] in metres");
    (p.sun || []).forEach((s) => { if (!SUN.includes(s)) err(at + ": unknown sun code " + s); });
    if (!WATER.includes(p.water)) err(at + ": unknown water code " + p.water);
    (p.months || []).forEach((m) => { if (!(m >= 1 && m <= 12)) err(at + ": month out of range " + m); });
    if (!(p.councils || []).includes(key)) err(at + ': "councils" must include "' + key + '"');
    (p.councils || []).forEach((c) => {
      if (!councils[c]) return err(at + ": unknown council " + c);
      ((p.zonesBy || {})[c] || []).forEach((z) => { if (!councils[c].zones[z]) err(at + ": zone " + z + " is not defined for " + c); });
    });
    Object.keys(p.zonesBy || {}).forEach((c) => { if (!(p.councils || []).includes(c)) err(at + ": zonesBy has " + c + " but councils does not"); });
    if (byId.has(p.id) && byId.get(p.id) !== p.sci) err(at + ": id " + p.id + " is already used by " + byId.get(p.id));
    byId.set(p.id, p.sci);
    if (!bySci.has(p.sci)) bySci.set(p.sci, []);
    bySci.get(p.sci).push({ file, key, rec: p });
    if (!photos[p.sci]) warn(p.sci + ": no photo yet (run python tools/fetch_photos.py)");
  });
}

for (const [sci, copies] of bySci) {
  const first = JSON.stringify(copies[0].rec);
  copies.slice(1).forEach((c) => { if (JSON.stringify(c.rec) !== first) err(sci + ": copies differ between " + copies[0].file + " and " + c.file); });
  copies[0].rec.councils.forEach((k) => { if (councils[k] && !copies.some((c) => c.key === k)) err(sci + ": councils lists " + k + " but it is not in data/plants/" + k + ".json"); });
}
suburbs.forEach((s) => { if (!Array.isArray(s) || s.length < 3) err("suburbs: bad entry " + JSON.stringify(s)); });

const nextId = Math.max(...byId.keys()) + 1;
[...new Set(warnings)].forEach((w) => console.log("warning: " + w));
errors.forEach((e) => console.log("ERROR: " + e));
console.log(bySci.size + " species in " + Object.keys(councils).length + " councils, " + errors.length + " errors. Next free id: " + nextId);
process.exit(errors.length ? 1 : 0);
