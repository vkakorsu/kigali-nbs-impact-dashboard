import type { Bilingual } from "./i18n";

/**
 * The four communication themes fixed by the RFP and PRD.
 *
 * Note on naming: the RFP objectives list says "biodiversity protection"
 * while PRD Table 1 uses "environmental protection and resource management"
 * for the same pillar. The dashboard uses the PRD table name as the formal
 * title and keeps biodiversity in the narrative, mirroring both documents.
 */
export interface Theme {
  slug: string;
  color: string;
  name: Bilingual;
  /** Short label for eyebrows, chips, and legends. */
  short: Bilingual;
  keyMessage: Bilingual;
  blurb: Bilingual;
}

export const themes: Theme[] = [
  {
    slug: "climate-adaptation",
    color: "var(--color-river)",
    name: {
      en: "Climate adaptation",
      rw: "Guhangana n'imihindagurikire y'ikirere",
    },
    short: { en: "Climate adaptation", rw: "Guhangana n'ikirere" },
    keyMessage: {
      en: "Nature-based solutions reduce flood and erosion risks.",
      rw: "Ibisubizo bishingiye ku bidukikije bigabanya ibyago by'imyuzure n'isuri.",
    },
    blurb: {
      en: "The lower Nyabarongo watershed carries Kigali's flood story. When rain falls hard on bare hillsides, water and soil race downhill into homes, roads, and wetlands. SUNCASA restores the micro-catchments upstream so the land holds more water, releases it slowly, and protects the people living below.",
      rw: "Ikibaya cyo hasi cya Nyabarongo ni cho gitwara inkuru y'imyuzure ya Kigali. SUNCASA isubiza ubuzima udukibaya two haruguru kugira ngo ubutaka bufate amazi menshi, buyarekure buhoro, kandi burinde abaturage bo hepfo.",
    },
  },
  {
    slug: "environmental-protection",
    color: "var(--color-forest)",
    name: {
      en: "Environmental protection and resource management",
      rw: "Kurengera ibidukikije no gucunga umutungo kamere",
    },
    short: { en: "Environment", rw: "Ibidukikije" },
    keyMessage: {
      en: "Nature-based solutions restore vegetation, biodiversity, and ecosystems.",
      rw: "Ibisubizo bishingiye ku bidukikije bisubiza ibimera, urusobe rw'ibinyabuzima n'uburyo bidukikije bikora.",
    },
    blurb: {
      en: "Trees, riparian buffers, and agroforestry plots rebuild the living systems of the watershed. Vegetation cover returns, riverbanks stabilise, and biodiversity finds room to recover alongside the people who depend on these ecosystems.",
      rw: "Ibiti, inkengero z'umugezi n'ubuhinzi-mashyamba bisubiza ubuzima ikibaya. Ibimera biragaruka, inkombe z'umugezi zirakomera, urusobe rw'ibinyabuzima rukabona umwanya wo kwisubiza.",
    },
  },
  {
    slug: "gender-inclusion",
    color: "var(--color-bloom)",
    name: {
      en: "Gender equality and social inclusion",
      rw: "Uburinganire no kudaheza mu mibereho",
    },
    short: { en: "Gender and inclusion", rw: "Uburinganire" },
    keyMessage: {
      en: "Inclusive participation strengthens the outcomes of nature-based solutions.",
      rw: "Uruhare rw'abantu bose rukomeza umusaruro w'ibisubizo bishingiye ku bidukikije.",
    },
    blurb: {
      en: "Restoration in Kigali is led with women and marginalized groups, not just for them. Participation, training, and decision-making roles are tracked openly, because who does the work shapes who benefits from it.",
      rw: "Ibikorwa byo gusubiza ubuzima ibidukikije i Kigali bikorwa ku bufatanye n'abagore n'abatishoboye. Uruhare, amahugurwa n'imyanya yo gufata ibyemezo bikurikiranwa ku mugaragaro.",
    },
  },
  {
    slug: "employment-economy",
    color: "var(--color-amber)",
    name: {
      en: "Employment and economic opportunities",
      rw: "Imirimo n'amahirwe y'ubukungu",
    },
    short: { en: "Jobs and economy", rw: "Imirimo n'ubukungu" },
    keyMessage: {
      en: "Nature-based solutions create inclusive green jobs.",
      rw: "Ibisubizo bishingiye ku bidukikije bitanga imirimo y'icyatsi ihereza bose.",
    },
    blurb: {
      en: "Tree nurseries, planting crews, terracing works, and agroforestry plots all pay wages and build skills. The dashboard tracks jobs created, disaggregated by gender and age, so the economic story of restoration is visible and honest.",
      rw: "Uburyo bwo gutera ibiti, gukora amaterasi n'ubuhinzi-mashyamba bitanga imirimo n'ubumenyi. Imbonerahamwe ikurikirana imirimo yaremwe, itandukanyijwe ku gitsina n'imyaka.",
    },
  },
];

export function getTheme(slug: string): Theme {
  const theme = themes.find((t) => t.slug === slug);
  if (!theme) throw new Error(`Unknown theme slug: ${slug}`);
  return theme;
}
