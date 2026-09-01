# Kigali NbS Impact Dashboard (MVP prototype)

A public-facing, communication-first dashboard for the SUNCASA project in Kigali. It explains what nature-based solutions are, what SUNCASA is doing in the lower Nyabarongo watershed, and why it matters, through a curated set of indicators, an intervention map, and clearly labelled stories, in English and Kinyarwanda.

Built as a pre-contract demonstration for the IISD RFP "Consultancy Service for the Development of a Digital Dashboard to Communicate the Impact of Nature-Based Solutions in Kigali (MVP Stage)".

## What this demonstrates

- **MyPeg-inspired, indicator-driven, narrative-supported design.** Every indicator carries a plain-language name, a "why this matters" narrative, a definition, a source class, an update date, a responsible provider, and honest caveats.
- **Four fixed communication themes.** Climate adaptation, environmental protection and resource management, gender equality and social inclusion, employment and economic opportunities.
- **8 to 12 indicators from the PRD.** Ten implemented. Eight from Table 1, plus riparian buffer and agroforestry as data-ready Year 2 additions, each flagged core or proposed, with illustrative values shaped from published SUNCASA reporting.
- **Bilingual by structure.** English and Kinyarwanda ship in the same static page and switch instantly. Approved translations from IISD and partners drop into content files with zero code changes.
- **FMES interoperability seam.** A working adapter maps FMES-shaped exports into the dashboard with provenance intact. See [INTEROPERABILITY.md](INTEROPERABILITY.md).
- **Simple back-end, no CMS platform.** A form-based editing screen at `/admin` shows the same fields used to manage indicators, metadata, explanatory text, and stories. Saving is turned off on the public demonstration. A ~300 KB git-backed editor ([Sveltia CMS](https://github.com/sveltia/sveltia-cms)) is at `/git-editor` for technical demonstration. Production for RFA is spreadsheet first. No server, no database.
- **Host-anywhere artifact.** The build output is a folder of static files. It runs on the free demo host today and on RFA infrastructure at the National Data Center tomorrow, unchanged. See [DEPLOYMENT.md](DEPLOYMENT.md).

## Quick start

```bash
npm install
npm run dev        # develop at localhost:4321
npm run build      # validate data, then build to dist/
npm test           # pipeline tests (CSV, CRS transform, FMES adapter)
```

## How a non-technical editor updates the dashboard

Three paths, by increasing technical comfort:

1. **Form-based (demonstration).** Open `/admin` to see the indicator, metadata, and story fields filled with the live prototype data. Saving is turned off on the evaluation site so visitors cannot change the published dashboard. A git-backed form editor is at `/git-editor` and signs in with a GitHub personal access token. After handover, RFA's production path is spreadsheet first, as the proposal describes.
2. **Spreadsheet.** Maintain `data/indicators.csv` or `data/indicators.xlsx` (same columns as the export). Run `npm run ingest`, which merges values by indicator id, validates everything, and rebuilds. Export the current values any time with `npm run export`.
3. **FMES export.** Drop an approved FMES export in place and run `npm run fmes:import -- --apply`. Values update with FMES provenance attached.

All three paths feed one validated data store, and the ingest step refuses bad data with readable error messages instead of publishing it.

## Project structure

```
data/                 Canonical data: indicators, time series, sites, stories, FMES sample
scripts/              Ingest, export, FMES adapter, CRS transform, tests
src/lib/              Types, i18n dictionaries, theme definitions
src/components/       Cards, metadata blocks, React islands (map, chart, toggle)
src/pages/            Landing, themes, indicators, map, stories, learn, methodology, about-data, admin
public/git-editor/    Optional git-backed form editor (Sveltia CMS, token sign-in)
```

## Design notes

The visual identity is anchored in imigongo, Rwanda's geometric art: charcoal ink, kaolin paper, ochre red and ochre yellow, joined by highland green, Nyabarongo river blue, jacaranda bloom, and market amber. Imigongo geometry appears as pattern bands, theme glyphs, diamond map markers, and story placeholder art, all drawn as tiny inline SVG. The landing hero is a bespoke layered panorama of the thousand hills. Typography is self-hosted Newsreader (display) and Inter (body and data, tabular figures), about 145 KB of woff2 in total, so the site stays firmly low-bandwidth. Interactive JavaScript loads only for the map, the charts, and the language toggle. Everything else is static HTML and CSS, responsive from phone to desktop, with AA-verified contrast, visible focus states, a skip link, and reduced-motion support. The full system is documented in [STYLE.md](STYLE.md).

## Honest labels

Values shown are illustrative, shaped from published SUNCASA figures (for example the Year 2 tree planting total), and are labelled as such in the interface. Site locations are placeholders pending approved SUNCASA spatial data. Kinyarwanda text is a working draft demonstrating the bilingual structure, and approved translations are supplied by IISD and SUNCASA partners, as the RFP anticipates.

## Evaluation and ownership

This repository is public for the proposal period so the SUNCASA selection committee can inspect the source. It is a pre-contract demonstration, not a finished system. On award, ownership of code, configuration, and data transfers to the Rwanda Forestry Authority and SUNCASA partners.
