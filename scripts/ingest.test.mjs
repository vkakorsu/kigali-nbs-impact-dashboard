import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { parseCsv, parseCsvRecords, toCsv } from "./csv.mjs";
import { wgs84ToTmRwanda, tmRwandaToWgs84 } from "./crs.mjs";
import { mapFmesRecords, FMES_TO_DASHBOARD } from "./fmes-map.mjs";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

test("CSV parser handles quoted fields with commas and escaped quotes", () => {
  const rows = parseCsv('id,note\nabc,"hello, ""world"""\n');
  assert.deepEqual(rows, [
    ["id", "note"],
    ["abc", 'hello, "world"'],
  ]);
});

test("CSV records are keyed by header", () => {
  const records = parseCsvRecords("indicator_id,period,value\ntrees-planted,2026-Q2,1267559\n");
  assert.equal(records.length, 1);
  assert.equal(records[0].indicator_id, "trees-planted");
  assert.equal(records[0].value, "1267559");
});

test("CSV round trip preserves values", () => {
  const records = [{ id: "x", note: 'a,"b"' }];
  const parsed = parseCsvRecords(toCsv(records, ["id", "note"]));
  assert.equal(parsed[0].note, 'a,"b"');
});

test("TM Rwanda origin maps to false easting and northing", () => {
  const { easting, northing } = wgs84ToTmRwanda(0, 30);
  assert.ok(Math.abs(easting - 500000) < 0.001, `easting ${easting}`);
  assert.ok(Math.abs(northing - 5000000) < 0.001, `northing ${northing}`);
});

test("TM Rwanda round trip in Kigali is accurate to under a millimetre of angle", () => {
  const lat = -1.9536;
  const lon = 30.0605;
  const projected = wgs84ToTmRwanda(lat, lon);
  const back = tmRwandaToWgs84(projected.easting, projected.northing);
  assert.ok(Math.abs(back.lat - lat) < 1e-9, `lat drift ${back.lat - lat}`);
  assert.ok(Math.abs(back.lon - lon) < 1e-9, `lon drift ${back.lon - lon}`);
});

test("Kigali projects to plausible TM Rwanda coordinates", () => {
  // Kigali sits close to the 30 degree central meridian, so easting
  // should be near 500,000 and northing well south of the equator line.
  const { easting, northing } = wgs84ToTmRwanda(-1.9536, 30.0605);
  assert.ok(easting > 490000 && easting < 520000, `easting ${easting}`);
  assert.ok(northing > 4750000 && northing < 4800000, `northing ${northing}`);
});

test("FMES adapter maps sample payload to dashboard indicators", () => {
  const payload = JSON.parse(
    readFileSync(path.join(root, "data", "fmes-sample", "fmes-export.json"), "utf8")
  );
  const { updates, unmapped } = mapFmesRecords(payload);
  assert.equal(unmapped.length, 0);
  assert.equal(updates.length, payload.records.length);
  const treeUpdate = updates.find((u) => u.id === "trees-planted");
  assert.ok(treeUpdate);
  assert.equal(treeUpdate.value, 1267559);
  assert.equal(treeUpdate.source_class, "FMES");
  assert.equal(treeUpdate.provider, "Rwanda Forestry Authority");
});

test("FMES adapter reports unmapped codes instead of guessing", () => {
  const { updates, unmapped } = mapFmesRecords({
    custodian: "Rwanda Forestry Authority",
    records: [{ fmes_code: "FMES-IND-99", name: "Unknown", value: 1, last_updated: "2026-01-01" }],
  });
  assert.equal(updates.length, 0);
  assert.deepEqual(unmapped, ["FMES-IND-99"]);
});

test("every FMES mapping targets a real dashboard indicator", () => {
  const { indicators } = JSON.parse(
    readFileSync(path.join(root, "data", "indicators.json"), "utf8")
  );
  const ids = new Set(indicators.map((ind) => ind.id));
  for (const target of Object.values(FMES_TO_DASHBOARD)) {
    assert.ok(ids.has(target), `mapping targets missing indicator ${target}`);
  }
});

test("indicator store respects the PRD scope of 8 to 12 indicators", () => {
  const { indicators } = JSON.parse(
    readFileSync(path.join(root, "data", "indicators.json"), "utf8")
  );
  assert.ok(indicators.length >= 8 && indicators.length <= 12, `${indicators.length} indicators`);
});
