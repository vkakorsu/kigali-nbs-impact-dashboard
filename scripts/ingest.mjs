/**
 * Data ingest and validation.
 *
 * Reads the canonical data files, validates them, and writes typed JSON
 * to src/data/generated/ for the Astro build to consume. Runs
 * automatically before every build (prebuild), and on demand with
 * `npm run ingest`.
 *
 * Analyst workflow: values can be maintained in data/indicators.csv or
 * data/indicators.xlsx (same columns as the CSV). When either file is
 * present, its values are merged over data/indicators.json by id, so a
 * non-technical analyst can update numbers in Excel and rebuild without
 * touching JSON or code.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parseCsvRecords } from "./csv.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dataDir = path.join(root, "data");
const outDir = path.join(root, "src", "data", "generated");

const THEMES = [
  "climate-adaptation",
  "environmental-protection",
  "gender-inclusion",
  "employment-economy",
];
const SOURCE_CLASSES = ["FMES", "SUNCASA monitoring", "National", "Public"];
const TRENDS = ["up", "down", "flat", "na"];

// Kigali area bounding box (WGS84) used as a sanity check for site coordinates.
const KIGALI_BBOX = { west: 29.8, east: 30.4, south: -2.25, north: -1.75 };

const errors = [];
function fail(msg) {
  errors.push(msg);
}

function loadJson(file) {
  return JSON.parse(readFileSync(path.join(dataDir, file), "utf8"));
}

// ---------------------------------------------------------------- indicators
const indicatorDoc = loadJson("indicators.json");
let indicators = indicatorDoc.indicators;

// Optional analyst override: CSV or Excel values merged over the JSON store.
const csvPath = path.join(dataDir, "indicators.csv");
const xlsxPath = path.join(dataDir, "indicators.xlsx");
let overrides = [];
if (existsSync(csvPath)) {
  overrides = parseCsvRecords(readFileSync(csvPath, "utf8"));
} else if (existsSync(xlsxPath)) {
  const { default: xlsx } = await import("xlsx");
  const wb = xlsx.readFile(xlsxPath);
  overrides = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { raw: false });
}
if (overrides.length > 0) {
  const byId = new Map(indicators.map((ind) => [ind.id, ind]));
  for (const row of overrides) {
    const target = byId.get(row.id);
    if (!target) {
      fail(`indicators override: unknown indicator id "${row.id}"`);
      continue;
    }
    if (row.value !== undefined && row.value !== "") {
      const num = Number(row.value);
      if (Number.isNaN(num)) fail(`indicators override: non-numeric value for "${row.id}"`);
      else target.value = num;
    }
    if (row.latest_update) target.latest_update = row.latest_update;
  }
  console.log(`Merged ${overrides.length} analyst override rows into the indicator store.`);
}

const ids = new Set();
for (const ind of indicators) {
  const where = `indicator "${ind.id ?? "(missing id)"}"`;
  if (!ind.id) fail(`${where}: missing id`);
  if (ids.has(ind.id)) fail(`${where}: duplicate id`);
  ids.add(ind.id);
  if (!THEMES.includes(ind.theme)) fail(`${where}: unknown theme "${ind.theme}"`);
  if (!SOURCE_CLASSES.includes(ind.source_class))
    fail(`${where}: source_class must be one of ${SOURCE_CLASSES.join(", ")}`);
  if (!TRENDS.includes(ind.trend)) fail(`${where}: invalid trend "${ind.trend}"`);
  if (!["core", "proposed"].includes(ind.status)) fail(`${where}: invalid status`);
  if (ind.value !== null && typeof ind.value !== "number")
    fail(`${where}: value must be a number or null`);
  for (const key of ["name_en", "name_rw", "definition_en", "why_en", "caveats_en", "source", "provider"]) {
    if (!ind[key]) fail(`${where}: missing ${key}`);
  }
  if (typeof ind.illustrative !== "boolean") fail(`${where}: missing illustrative flag`);
}
if (indicators.length < 8 || indicators.length > 12) {
  fail(`PRD expects 8 to 12 indicators, found ${indicators.length}`);
}

// ---------------------------------------------------------------- timeseries
const tsRecords = parseCsvRecords(readFileSync(path.join(dataDir, "timeseries.csv"), "utf8"));
const timeseries = {};
for (const row of tsRecords) {
  if (!ids.has(row.indicator_id)) {
    fail(`timeseries: unknown indicator_id "${row.indicator_id}"`);
    continue;
  }
  if (!/^\d{4}-Q[1-4]$/.test(row.period)) fail(`timeseries: bad period "${row.period}"`);
  const value = Number(row.value);
  if (Number.isNaN(value)) fail(`timeseries: non-numeric value for ${row.indicator_id} ${row.period}`);
  (timeseries[row.indicator_id] ??= []).push({ period: row.period, value });
}
for (const series of Object.values(timeseries)) {
  series.sort((p, q) => p.period.localeCompare(q.period));
}

// --------------------------------------------------------------------- sites
const sites = loadJson("sites.geojson");
if (sites.type !== "FeatureCollection") fail("sites.geojson: not a FeatureCollection");
for (const feature of sites.features) {
  const where = `site "${feature.properties?.id ?? "(missing id)"}"`;
  const [lon, lat] = feature.geometry?.coordinates ?? [];
  if (typeof lon !== "number" || typeof lat !== "number") {
    fail(`${where}: missing coordinates`);
    continue;
  }
  if (lon < KIGALI_BBOX.west || lon > KIGALI_BBOX.east || lat < KIGALI_BBOX.south || lat > KIGALI_BBOX.north)
    fail(`${where}: coordinates outside the Kigali area, check CRS (expected WGS84 lon/lat)`);
  if (!THEMES.includes(feature.properties.theme))
    fail(`${where}: unknown theme "${feature.properties.theme}"`);
  for (const key of ["name_en", "district", "intervention_en"]) {
    if (!feature.properties[key]) fail(`${where}: missing ${key}`);
  }
}

// ------------------------------------------------------------------- stories
const storiesDoc = loadJson("stories.json");
for (const story of storiesDoc.stories) {
  const where = `story "${story.id}"`;
  if (!THEMES.includes(story.theme)) fail(`${where}: unknown theme`);
  for (const key of ["title_en", "title_rw", "summary_en", "summary_rw", "body_en"]) {
    if (!story[key]) fail(`${where}: missing ${key}`);
  }
  for (const linked of story.linked_indicators ?? []) {
    if (!ids.has(linked)) fail(`${where}: links to unknown indicator "${linked}"`);
  }
}

// --------------------------------------------------------------------- write
if (errors.length > 0) {
  console.error(`Ingest failed with ${errors.length} validation error(s):`);
  for (const message of errors) console.error(`  - ${message}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(path.join(outDir, "indicators.json"), JSON.stringify(indicators, null, 2));
writeFileSync(path.join(outDir, "timeseries.json"), JSON.stringify(timeseries, null, 2));
writeFileSync(path.join(outDir, "sites.json"), JSON.stringify(sites, null, 2));
writeFileSync(path.join(outDir, "stories.json"), JSON.stringify(storiesDoc.stories, null, 2));
writeFileSync(
  path.join(outDir, "meta.json"),
  JSON.stringify(
    {
      generated: new Date().toISOString(),
      indicator_count: indicators.length,
      site_count: sites.features.length,
      story_count: storiesDoc.stories.length,
    },
    null,
    2
  )
);

console.log(
  `Ingest OK: ${indicators.length} indicators, ${Object.keys(timeseries).length} series, ${sites.features.length} sites, ${storiesDoc.stories.length} stories.`
);
