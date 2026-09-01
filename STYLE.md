# Visual style guide

Kigali NbS Impact Dashboard. This document is the design sign-off artifact for the prototype and the seed of the "simple visual style guide" deliverable in RFP section 4.3.

## Voice

Calm, factual, and warm. The dashboard communicates on behalf of a public programme, so it never shouts, never decorates for decoration's sake, and never hides a caveat. Numbers carry their paperwork. Stories carry their labels.

## Identity: imigongo, hills, river

The visual signature is drawn from imigongo, Rwanda's geometric relief art of zigzags, diamonds, and stepped triangles painted in charcoal, kaolin white, and ochre. Imigongo geometry appears as:

- thin pattern bands that divide sections and trim the footer (`src/components/art/ImigongoBand.astro`)
- four theme glyphs used on cards, chapter headers, and the map legend (`src/components/art/ThemeGlyph.astro`)
- story placeholder compositions where photography will eventually sit (`src/components/art/StoryArt.astro`)
- diamond site markers on the map and diamond bullets in lists
- the favicon and wordmark

The landing hero is a bespoke layered SVG panorama of the thousand hills with the Nyabarongo ribbon (`src/components/art/HillsPanorama.astro`). No stock photography is used anywhere. Pattern is trim, never wallpaper: one band per section boundary at most.

## Palette

Defined as tokens in `src/styles/global.css`. Contrast ratios are against paper `#FAF7F0`.

| Token | Hex | Role | Contrast |
| --- | --- | --- | --- |
| ink | `#1A1714` | Text, charcoal pigment | 16.7:1 |
| paper | `#FAF7F0` | Page background, kaolin | - |
| mist | `#F1EBDD` | Section wash | - |
| ochre | `#9B3D22` | Imigongo red, accents, focus ring | 6.4:1 |
| gold | `#D99A2B` | Imigongo yellow, decorative, dark-band accent | decorative only |
| highland | `#175943` | Primary green, links, buttons | 7.8:1 |
| highland-deep | `#0F3D2E` | Dark bands, footer | 13.4:1 |
| river | `#31658C` | Climate adaptation theme | 5.9:1 |
| forest | `#2E7D4F` | Environment theme | 4.7:1 |
| bloom | `#7A4E8C` | Gender and inclusion theme | 6.0:1 |
| amber | `#8F5710` | Jobs and economy theme (text-safe) | 5.6:1 |

Rules: gold is never used as text on paper. Small text uses ink at 70 percent opacity or more. On dark bands, paper text stays at 70 percent opacity or more. The four theme accents are the only saturated colors on a page, so they always mean something.

## Typography

Self-hosted woff2, latin subset, about 145 KB total, preloaded in `Base.astro`.

- **Newsreader 500/600** for display: headlines, big figures, story titles. Class `.headline`, hero scale `.display` (clamp 2.6rem to 4.4rem).
- **Inter 400/500/600** for body, UI, and data. Tabular figures via `.tnum` wherever numbers align.
- `.eyebrow` is the small-caps section label (0.72rem, 0.14em tracking).
- Narrative text sits inside `.measure` (68ch) with `.lede` for openers.

## Layout and components

- Max width 72rem (`max-w-6xl`), 1rem side padding, generous vertical rhythm (`py-12` to `py-14` per section).
- Hairline rules everywhere: `--rule` = ink at 14 percent. No heavy borders, no drop shadows at rest.
- Cards use `.card-surface`: near-white surface, hairline border, 12px radius, gentle lift on hover.
- Indicator cards carry an eyebrow theme label, a Newsreader tabular value, a zero-JS SVG sparkline, and a source footer.
- Source classes (FMES, SUNCASA monitoring, National, Public) each have a fixed chip style, used identically on the data passport, the register table, and the About the data page.
- Dark bands (`highland-deep`) reserve gold for figures and eyebrows.

## Maps and charts

- Basemap tiles are desaturated by CSS filter so theme-colored diamond markers carry the story.
- Popups and chart tooltips are kaolin cards with hairline borders, set in Inter.
- Charts show one series, hairline grid, no zoom, no brush. Communication, not analysis.

## Motion

Two effects only: soft reveal on scroll and count-up on headline figures. Both run only when JavaScript is available and `prefers-reduced-motion` is not set, via the `motion-ok` class on `html`. Without JavaScript nothing is hidden and final values render in full.

## Accessibility

- WCAG AA contrast verified for every text and accent pairing above.
- Focus ring: 3px ochre on light surfaces, gold inside dark bands (both pass 3:1 non-text contrast).
- Skip link, `lang` attributes on both language layers, instant EN/RW toggle, `aria-hidden` on all decorative SVG.

## Photography policy

The prototype ships no photographs. Story art fields are clearly labelled placeholders. When IISD and SUNCASA partners supply approved photography, images replace the imigongo fields at the same aspect ratio with the caption slot retained for credits.
