/**
 * Typed access to the generated data. These JSON files are produced by
 * `npm run ingest` (runs automatically before every build) from the
 * canonical files in data/.
 */
import indicatorsJson from "../data/generated/indicators.json";
import timeseriesJson from "../data/generated/timeseries.json";
import sitesJson from "../data/generated/sites.json";
import storiesJson from "../data/generated/stories.json";

export type SourceClass = "FMES" | "SUNCASA monitoring" | "National" | "Public";
export type Trend = "up" | "down" | "flat" | "na";
export type IndicatorStatus = "core" | "proposed";

export interface Indicator {
  id: string;
  theme: string;
  status: IndicatorStatus;
  name_en: string;
  name_rw: string;
  unit_en: string;
  unit_rw: string;
  value: number | null;
  target: number | null;
  trend: Trend;
  latest_update: string | null;
  update_frequency: string;
  source_class: SourceClass;
  source: string;
  provider: string;
  definition_en: string;
  why_en: string;
  caveats_en: string;
  illustrative: boolean;
  disaggregation?: { women_share: number; youth_share: number };
}

export interface TimeseriesPoint {
  period: string;
  value: number;
}

export interface Story {
  id: string;
  theme: string;
  title_en: string;
  title_rw: string;
  summary_en: string;
  summary_rw: string;
  body_en: string;
  body_rw: string;
  linked_indicators: string[];
  photo_placeholder: string;
  illustrative: boolean;
}

export interface SiteFeature {
  type: "Feature";
  properties: {
    id: string;
    name_en: string;
    name_rw: string;
    district: string;
    intervention_en: string;
    intervention_rw: string;
    theme: string;
    area_ha?: number;
    trees?: number;
    illustrative: boolean;
  };
  geometry: { type: "Point"; coordinates: [number, number] };
}

export const indicators = indicatorsJson as unknown as Indicator[];
export const timeseries = timeseriesJson as unknown as Record<string, TimeseriesPoint[]>;
export const sites = sitesJson as unknown as {
  type: "FeatureCollection";
  features: SiteFeature[];
};
export const stories = storiesJson as unknown as Story[];

export function indicatorsByTheme(themeSlug: string): Indicator[] {
  return indicators.filter((ind) => ind.theme === themeSlug);
}

export function getIndicator(id: string): Indicator {
  const found = indicators.find((ind) => ind.id === id);
  if (!found) throw new Error(`Unknown indicator: ${id}`);
  return found;
}

export function formatValue(value: number | null): string {
  if (value === null) return "-";
  return value.toLocaleString("en-US");
}
