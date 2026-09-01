/**
 * Data export. Writes the indicator store and time series back out as
 * CSV files that open directly in Excel, so the data flows both ways:
 * analysts can pull the current published values, adjust them, and
 * re-ingest. Keeps the dashboard interoperable with spreadsheet-based
 * workflows in both directions.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { toCsv } from "./csv.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dataDir = path.join(root, "data");
const outDir = path.join(root, "exports");

const { indicators } = JSON.parse(readFileSync(path.join(dataDir, "indicators.json"), "utf8"));

mkdirSync(outDir, { recursive: true });

const indicatorColumns = [
  "id",
  "theme",
  "status",
  "name_en",
  "name_rw",
  "unit_en",
  "value",
  "target",
  "trend",
  "latest_update",
  "update_frequency",
  "source_class",
  "source",
  "provider",
  "definition_en",
  "caveats_en",
  "illustrative",
];
writeFileSync(path.join(outDir, "indicators.csv"), toCsv(indicators, indicatorColumns));

const timeseriesCsv = readFileSync(path.join(dataDir, "timeseries.csv"), "utf8");
writeFileSync(path.join(outDir, "timeseries.csv"), timeseriesCsv);

console.log(`Exported ${indicators.length} indicators and the full time series to exports/.`);
