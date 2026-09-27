// Runs the old inline "Plant database" <script> from a single-file index.html and returns
// the final values the app reads (after all the patch steps in that script have run).
// Usage: node tools/eval-legacy-data.mjs [path/to/index.html]  -> prints a summary
import fs from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

export function evalLegacyData(htmlPath) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const start = html.indexOf("// ===== Plant database =====");
  if (start < 0) throw new Error("No inline plant database found in " + htmlPath);
  const end = html.indexOf("</script>", start);
  const code = html.slice(start, end) +
    "\n;globalThis.__out = { COUNCILS, PLANTS, SUBURBS, COLOUR_GROUPS, USAGES, NSW_COUNCILS };";
  const ctx = vm.createContext({});
  vm.runInContext(code, ctx);
  // Round-trip through JSON so the result is plain data (drops undefined fields)
  return JSON.parse(JSON.stringify(ctx.__out));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const d = evalLegacyData(process.argv[2] || "index.html");
  const by = {};
  d.PLANTS.forEach((p) => p.councils.forEach((c) => (by[c] = (by[c] || 0) + 1)));
  console.log("plants:", d.PLANTS.length, "per council:", by, "suburbs:", d.SUBURBS.length);
}
