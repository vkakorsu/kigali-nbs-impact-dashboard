/**
 * Bilingual UI strings for the dashboard chrome.
 *
 * English strings are final prototype copy. Kinyarwanda strings are
 * unofficial working drafts that demonstrate the bilingual structure.
 * Per the RFP, approved Kinyarwanda translations are supplied by IISD
 * and SUNCASA partners and drop into this dictionary without any code
 * changes. Longer narrative passages are marked as awaiting approved
 * translation rather than machine-guessed.
 */

export type Lang = "en" | "rw";

export interface Bilingual {
  en: string;
  rw: string;
}

export const RW_PENDING =
  "Umwandiko mu Kinyarwanda uzashyirwamo numara kwemezwa na IISD n'abafatanyabikorwa ba SUNCASA.";

export const ui: Record<string, Bilingual> = {
  siteTitle: {
    en: "Kigali Nature-based Solutions Impact Dashboard",
    rw: "Imbonerahamwe y'ibisubizo bishingiye ku bidukikije i Kigali",
  },
  siteTagline: {
    en: "What SUNCASA is doing in the lower Nyabarongo watershed, and why it matters",
    rw: "Ibyo SUNCASA ikora mu kibaya cyo hasi cya Nyabarongo, n'impamvu bifite akamaro",
  },
  navHome: { en: "Home", rw: "Ahabanza" },
  navThemes: { en: "Themes", rw: "Ingingo" },
  navMap: { en: "Map", rw: "Ikarita" },
  navStories: { en: "Stories", rw: "Inkuru" },
  navLearn: { en: "Learn", rw: "Menya" },
  navMethodology: { en: "Methodology", rw: "Uburyo bwakoreshejwe" },
  navAboutData: { en: "About the data", rw: "Ibyerekeye imibare" },
  language: { en: "Language", rw: "Ururimi" },
  english: { en: "English", rw: "Icyongereza" },
  kinyarwanda: { en: "Kinyarwanda", rw: "Ikinyarwanda" },
  skipToContent: { en: "Skip to main content", rw: "Simbukira ku bikubiyemo" },
  openMenu: { en: "Open menu", rw: "Fungura urutonde" },
  closeMenu: { en: "Close menu", rw: "Funga urutonde" },
  headlineIndicators: { en: "Headline indicators", rw: "Imibare y'ingenzi" },
  viewIndicator: { en: "View indicator", rw: "Reba iyi mibare" },
  viewTheme: { en: "Explore this theme", rw: "Reba iyi ngingo" },
  viewAllStories: { en: "Read the stories", rw: "Soma inkuru" },
  openFullMap: { en: "Open the full map", rw: "Fungura ikarita yuzuye" },
  whereWeWork: { en: "Where SUNCASA works", rw: "Aho SUNCASA ikorera" },
  interventionSites: {
    en: "Intervention sites in the lower Nyabarongo watershed",
    rw: "Aho ibikorwa bikorerwa mu kibaya cyo hasi cya Nyabarongo",
  },
  storiesTitle: { en: "Stories from the watershed", rw: "Inkuru zo mu kibaya" },
  storyLabel: { en: "Story", rw: "Inkuru" },
  illustrative: { en: "Illustrative", rw: "Urugero" },
  proposed: { en: "Proposed", rw: "Icyifuzo" },
  core: { en: "Core", rw: "Ingenzi" },
  whyThisMatters: { en: "Why this matters", rw: "Impamvu bifite akamaro" },
  definition: { en: "Definition", rw: "Igisobanuro" },
  dataSource: { en: "Data source", rw: "Inkomoko y'imibare" },
  sourceClass: { en: "Source class", rw: "Icyiciro cy'inkomoko" },
  latestUpdate: { en: "Latest update", rw: "Ivugururwa riheruka" },
  responsibleProvider: { en: "Responsible data provider", rw: "Utanga imibare" },
  caveats: { en: "Limitations and caveats", rw: "Imbogamizi n'ibigomba kwitonderwa" },
  unit: { en: "Unit", rw: "Igipimo" },
  trend: { en: "Trend", rw: "Icyerekezo" },
  latestValue: { en: "Latest value", rw: "Umubare uheruka" },
  target: { en: "Target", rw: "Intego" },
  district: { en: "District", rw: "Akarere" },
  interventionType: { en: "Intervention type", rw: "Ubwoko bw'igikorwa" },
  areaHa: { en: "Area (hectares)", rw: "Ubuso (hegitari)" },
  backHome: { en: "Back to the dashboard", rw: "Subira ku mbonerahamwe" },
  footerNote: {
    en: "A public communication and education tool of the SUNCASA project in Kigali. Data shown are illustrative pending the SUNCASA data catalogue.",
    rw: "Igikoresho cyo gutangaza no kwigisha cy'umushinga SUNCASA i Kigali. Imibare igaragara ni urugero mu gihe hategerejwe ububiko bw'imibare bwa SUNCASA.",
  },
  partnersLine: {
    en: "SUNCASA is led by IISD and WRI with the Rwanda Forestry Authority and the City of Kigali, funded by Global Affairs Canada.",
    rw: "SUNCASA iyobowe na IISD na WRI ku bufatanye n'Ikigo cy'Amashyamba mu Rwanda (RFA) n'Umujyi wa Kigali, iterwa inkunga na Global Affairs Canada.",
  },
  draftTranslationNote: {
    en: "Kinyarwanda text on this prototype is a working draft. Approved translations are supplied by IISD and SUNCASA partners.",
    rw: "Inyandiko z'Ikinyarwanda kuri iyi porotipe ni imbanzirizamushinga. Ubusemuzi bwemejwe butangwa na IISD n'abafatanyabikorwa ba SUNCASA.",
  },
  notFoundTitle: { en: "Page not found", rw: "Iyi paji ntibonetse" },
  notFoundBody: {
    en: "The page you are looking for does not exist. Use the navigation above or return to the dashboard.",
    rw: "Paji ushaka ntibaho. Koresha urutonde ruri hejuru cyangwa usubire ku mbonerahamwe.",
  },
  updatedQuarterly: { en: "Updated quarterly", rw: "Ivugururwa buri gihembwe" },
  updatedAnnually: { en: "Updated annually", rw: "Ivugururwa buri mwaka" },
  seeMethodology: {
    en: "See the methodology page for how these figures are prepared.",
    rw: "Reba paji y'uburyo bwakoreshejwe kugira ngo umenye uko iyi mibare itegurwa.",
  },
};

/** Convenience accessor used by Astro components. */
export function t(key: keyof typeof ui): Bilingual {
  return ui[key];
}
