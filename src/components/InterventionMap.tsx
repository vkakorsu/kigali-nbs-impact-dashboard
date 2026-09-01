import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Lang = "en" | "rw";

interface SiteProps {
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
}

interface Feature {
  properties: SiteProps;
  geometry: { coordinates: [number, number] };
}

interface Props {
  features: Feature[];
}

const THEME_COLORS: Record<string, string> = {
  "climate-adaptation": "#31658c",
  "environmental-protection": "#2e7d4f",
  "gender-inclusion": "#7a4e8c",
  "employment-economy": "#b5701f",
};

const LABELS = {
  district: { en: "District", rw: "Akarere" },
  intervention: { en: "Intervention", rw: "Igikorwa" },
  area: { en: "Area", rw: "Ubuso" },
  trees: { en: "Trees", rw: "Ibiti" },
  illustrative: {
    en: "Illustrative location pending approved SUNCASA spatial data",
    rw: "Aho hantu ni urugero mu gihe hategerejwe imibare y'ahantu yemejwe ya SUNCASA",
  },
};

/** Imigongo diamond marker in the theme pigment. Styled in global.css. */
const iconCache: Record<string, L.DivIcon> = {};
function diamondIcon(color: string): L.DivIcon {
  if (!iconCache[color]) {
    iconCache[color] = L.divIcon({
      className: "site-marker",
      html: `<span style="background:${color};"></span>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      popupAnchor: [0, -12],
    });
  }
  return iconCache[color];
}

/**
 * Lightly interactive intervention map: pan, zoom, tap a site for its
 * basic attributes. OpenStreetMap tiles, no API key, no paid service.
 * The tile pane is desaturated via CSS so the diamond markers carry
 * the color. Bilingual popups follow the global language toggle via
 * the langchange event.
 */
export default function InterventionMap({ features }: Props) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("lang");
    if (stored === "rw" || stored === "en") setLang(stored);
    const onChange = (event: Event) => {
      setLang((event as CustomEvent).detail as Lang);
    };
    window.addEventListener("langchange", onChange);
    return () => window.removeEventListener("langchange", onChange);
  }, []);

  return (
    <MapContainer
      center={[-1.985, 30.06]}
      zoom={11}
      scrollWheelZoom={false}
      className="map-frame"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {features.map((feature) => {
        const p = feature.properties;
        const [lon, lat] = feature.geometry.coordinates;
        const color = THEME_COLORS[p.theme] ?? "#175943";
        return (
          <Marker key={p.id} position={[lat, lon]} icon={diamondIcon(color)}>
            <Popup>
              <div style={{ fontSize: 13, lineHeight: 1.55, maxWidth: 250 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                    paddingBottom: 6,
                    borderBottom: "1px solid rgba(26,23,20,0.12)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 10,
                      height: 10,
                      flexShrink: 0,
                      transform: "rotate(45deg)",
                      borderRadius: 2,
                      background: color,
                    }}
                  />
                  <strong style={{ fontSize: 14 }}>
                    {lang === "rw" ? p.name_rw : p.name_en}
                  </strong>
                </div>
                <span style={{ opacity: 0.6 }}>{LABELS.district[lang]}</span>{" "}
                {p.district}
                <br />
                <span style={{ opacity: 0.6 }}>{LABELS.intervention[lang]}</span>{" "}
                {lang === "rw" ? p.intervention_rw : p.intervention_en}
                {p.area_ha !== undefined && (
                  <>
                    <br />
                    <span style={{ opacity: 0.6 }}>{LABELS.area[lang]}</span>{" "}
                    {p.area_ha.toLocaleString("en-US")} ha
                  </>
                )}
                {p.trees !== undefined && (
                  <>
                    <br />
                    <span style={{ opacity: 0.6 }}>{LABELS.trees[lang]}</span>{" "}
                    {p.trees.toLocaleString("en-US")}
                  </>
                )}
                {p.illustrative && (
                  <em
                    style={{
                      display: "block",
                      marginTop: 8,
                      opacity: 0.7,
                      fontSize: 11,
                    }}
                  >
                    {LABELS.illustrative[lang]}
                  </em>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
