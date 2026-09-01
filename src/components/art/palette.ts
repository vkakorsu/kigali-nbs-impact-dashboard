/**
 * Concrete hex values for the four communication themes, used inside
 * SVG artwork and the Leaflet map where CSS custom properties are
 * inconvenient. Keep in sync with src/styles/global.css.
 *
 * The employment tone here is brighter than the AA-safe text token
 * (--color-amber #8f5710) because artwork is decorative and benefits
 * from the warmer market-amber pigment.
 */
export const themeHex: Record<string, string> = {
  "climate-adaptation": "#31658c",
  "environmental-protection": "#2e7d4f",
  "gender-inclusion": "#7a4e8c",
  "employment-economy": "#b5701f",
};

export const INK = "#1a1714";
export const PAPER = "#faf7f0";
export const MIST = "#f1ebdd";
export const GOLD = "#d99a2b";
export const OCHRE = "#9b3d22";
export const HIGHLAND = "#175943";
export const HIGHLAND_DEEP = "#0f3d2e";
export const RIVER = "#31658c";
