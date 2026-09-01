# FMES Interoperability Approach

How this dashboard is designed to work beside the Rwanda Forestry Authority's Forest Monitoring and Evaluation System (FMES), consume its approved data, and never compete with it.

## Position: FMES is the system of record

FMES is Rwanda's national forestry monitoring platform. It collects field data through a mobile app and web platform, records forest boundaries by GPS, calculates forestry indicators from that field data, and generates official reports including forest cut permits. It is credential-gated, custodianship sits with RFA, and it is currently undergoing an upgrade under the LuxDev-financed SFERE programme, after which the Ministry of Environment intends to make it mandatory for all reforestation actors.

This dashboard takes the only sensible position available to an MVP-stage communication tool:

- FMES **owns** forestry data, indicator definitions, calculations, and metadata structures.
- The dashboard **consumes** approved FMES exports and **presents** them for public communication.
- The dashboard **never** redefines an FMES indicator, never duplicates an FMES calculation, and never stores an FMES data set it can reference instead.

This directly implements the RFP requirement to "avoid unnecessary duplication of FMES data sets, calculations, indicator definitions, and metadata structures."

## The seam, implemented today

The MVP implements a file-exchange mechanism, one of the exchange options the RFP names, and the one appropriate to the MVP budget and to FMES mid-upgrade:

1. RFA exports an approved data set from FMES (JSON shown here, CSV equally supported).
2. `npm run fmes:import` maps FMES indicator codes to dashboard indicators through one explicit mapping table (`scripts/fmes-map.mjs`), previews the changes, and refuses payloads not marked as approved for public communication.
3. `npm run fmes:import -- --apply` applies the values. Provenance travels with the number: source class becomes `FMES`, the source records the FMES indicator code, and the provider becomes the Rwanda Forestry Authority.
4. The site rebuilds. Every FMES-sourced figure on the dashboard now says so, visibly, in its metadata block.

A sample FMES-shaped payload lives at `data/fmes-sample/fmes-export.json`, and the adapter behaviour is covered by automated tests (`npm test`). The real export schema and code list are confirmed with RFA during the inception FMES Interoperability Assessment.

## Spatial data

Approved FMES spatial information typically uses Rwanda's national grid, ITRF2005 / TM Rwanda (transverse Mercator, central meridian 30 east, scale 0.9999, false easting 500,000 m, false northing 5,000,000 m, GRS80, no EPSG code). The dashboard serves WGS84 GeoJSON, the web standard, and `scripts/crs.mjs` documents and performs the transformation on ingest with tested sub-millimetre round-trip accuracy. GIS teams can also use the equivalent proj4 definition documented in that file. Nobody at RFA has to change how they produce spatial data for the dashboard to consume it.

## Upgrade path, no rework

The mapping table is the contract. It does not care how the payload arrives:

| Phase | Mechanism | What changes |
| --- | --- | --- |
| MVP (now) | Manual file exchange of approved exports | Nothing, this is what ships |
| Post-FMES upgrade | Scheduled pull from an FMES web service or API, or a read-only database view | A fetch step replaces the manual file drop. The mapping table, data model, and dashboard are untouched |
| Full integration (future phase) | Automated consumption of approved FMES data sets | Same mapping table, same provenance model |

Because the dashboard's architecture already treats FMES as an upstream source with its own codes and definitions, future integration is an operations change, not a redesign. This satisfies the RFP requirement that "the architecture must support future implementation" of FMES data exchange without full integration at the MVP stage.

## Governance guardrails

- Only data classified as approved for public communication is imported. The adapter enforces this and exits otherwise.
- Every import is a version-controlled change with a full audit trail and one-step rollback.
- Indicator definitions shown on the dashboard for FMES-sourced indicators are quoted from FMES, not rewritten, once the assessment confirms the authoritative definitions.
- The dashboard remains read-only and public. It holds no credentials for FMES and requests none. Data flows one way, from approved exports to public presentation.
