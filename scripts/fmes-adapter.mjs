/**
 * FMES adapter: demonstrates the file-exchange interoperability seam.
 *
 * Usage:
 *   npm run fmes:import              preview the mapped updates
 *   npm run fmes:import -- --apply   apply them to data/indicators.json
 *
 * Reads an FMES-shaped export (data/fmes-sample/fmes-export.json),
 * maps FMES indicator codes to dashboard indicators, and either
 * previews or applies the value updates. Applied updates set the
 * source class to FMES and the provider to the Rwanda Forestry
 * Authority, so provenance travels with the number. FMES remains the
 * system of record. The dashboard only consumes approved exports.
 *
 * At the MVP stage this is a manual, file-based exchange, which is one
 * of the mechanisms the RFP names. The same mapping table would sit
 * behind a web service or API consumer in a future phase without
 * changing the dashboard's data model. See INTEROPERABILITY.md.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { mapFmesRecords } from "./fmes-map.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dataDir = path.join(root, "data");
const apply = process.argv.includes("--apply");

const payload = JSON.parse(
  readFileSync(path.join(dataDir, "fmes-sample", "fmes-export.json"), "utf8")
);

if (payload.classification !== "Approved for public communication") {
  console.error("Refusing to import: payload is not marked as approved for public communication.");
  process.exit(1);
}

const { updates, unmapped } = mapFmesRecords(payload);

console.log(`FMES export from ${payload.custodian}, generated ${payload.generated}`);
console.log(`Mapped ${updates.length} record(s) to dashboard indicators:`);
for (const update of updates) {
  console.log(`  ${update.id}  <-  ${update.source}  (value ${update.value}, updated ${update.latest_update})`);
}
if (unmapped.length > 0) {
  console.log(`Unmapped FMES codes (no dashboard indicator consumes them): ${unmapped.join(", ")}`);
}

if (!apply) {
  console.log("\nPreview only. Run with --apply to write these updates to data/indicators.json.");
  process.exit(0);
}

const storePath = path.join(dataDir, "indicators.json");
const store = JSON.parse(readFileSync(storePath, "utf8"));
const byId = new Map(store.indicators.map((ind) => [ind.id, ind]));
let applied = 0;
for (const update of updates) {
  const indicator = byId.get(update.id);
  if (!indicator) continue;
  indicator.value = update.value;
  indicator.latest_update = update.latest_update;
  indicator.source_class = update.source_class;
  indicator.source = update.source;
  indicator.provider = update.provider;
  applied++;
}
writeFileSync(storePath, JSON.stringify(store, null, 2));
console.log(`\nApplied ${applied} update(s) to data/indicators.json. Run npm run ingest to regenerate.`);
