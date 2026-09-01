/**
 * Mapping between FMES indicator codes and dashboard indicator ids.
 *
 * This is the heart of the interoperability seam: the dashboard never
 * redefines an FMES indicator, it consumes approved FMES values and
 * records FMES as the source class and the Rwanda Forestry Authority as
 * the responsible provider. The real code list is confirmed with RFA
 * during the inception FMES Interoperability Assessment. See
 * INTEROPERABILITY.md for the full exchange contract.
 */

export const FMES_TO_DASHBOARD = {
  "FMES-IND-03": "area-restored",
  "FMES-IND-07": "trees-planted",
  "FMES-IND-12": "agroforestry-area",
};

/**
 * Map an FMES-shaped export payload to dashboard indicator updates.
 * Returns { updates, unmapped } where updates contain the dashboard id,
 * new value, update date, and provenance fields ready to merge.
 */
export function mapFmesRecords(payload) {
  const updates = [];
  const unmapped = [];
  for (const record of payload.records ?? []) {
    const dashboardId = FMES_TO_DASHBOARD[record.fmes_code];
    if (!dashboardId) {
      unmapped.push(record.fmes_code);
      continue;
    }
    updates.push({
      id: dashboardId,
      value: record.value,
      latest_update: record.last_updated,
      source_class: "FMES",
      source: `FMES ${record.fmes_code}: ${record.name}`,
      provider: payload.custodian ?? "Rwanda Forestry Authority",
    });
  }
  return { updates, unmapped };
}
