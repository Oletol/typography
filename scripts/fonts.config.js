/*
 * Font catalogue: the single source of truth for every typeface in the course.
 * Run `node scripts/fetch-fonts.js` after editing; it downloads the files from
 * Fontsource (npm), copies only the Cyrillic + Latin subsets into assets/fonts/
 * and regenerates assets/css/fonts.css and assets/js/fonts-data.js.
 *
 * cls  — class used in the course (see i18n: fontClass.*)
 * sub  — subclass (see i18n: fontSub.*)
 * pkg  — npm package on Fontsource
 * axes — for variable fonts: "wght" range; for static fonts: list of weights
 * ui   — the font is also used by the site interface itself
 * axisFile — Fontsource axis set to download (default "wght"; "opsz" adds the optical-size axis)
 */
module.exports = [
  // Serif / антиква
  { id: "literata", family: "Literata", cls: "serif", sub: "contemporary", pkg: "@fontsource-variable/literata", variable: true, wght: [200, 900], italic: true, opsz: [7, 72], axisFile: "opsz", ui: true },
  { id: "pt-serif", family: "PT Serif", cls: "serif", sub: "transitional", pkg: "@fontsource/pt-serif", variable: false, weights: [400, 700], italic: true },
  { id: "source-serif-4", family: "Source Serif 4", cls: "serif", sub: "transitional", pkg: "@fontsource-variable/source-serif-4", variable: true, wght: [200, 900], italic: false },
  { id: "noto-serif", family: "Noto Serif", cls: "serif", sub: "transitional", pkg: "@fontsource-variable/noto-serif", variable: true, wght: [100, 900], italic: false },
  { id: "merriweather", family: "Merriweather", cls: "serif", sub: "contemporary", pkg: "@fontsource-variable/merriweather", variable: true, wght: [300, 900], italic: false },
  { id: "lora", family: "Lora", cls: "serif", sub: "contemporary", pkg: "@fontsource-variable/lora", variable: true, wght: [400, 700], italic: false },
  { id: "spectral", family: "Spectral", cls: "serif", sub: "contemporary", pkg: "@fontsource/spectral", variable: false, weights: [400, 700], italic: false },
  { id: "eb-garamond", family: "EB Garamond", cls: "serif", sub: "oldstyle", pkg: "@fontsource-variable/eb-garamond", variable: true, wght: [400, 800], italic: false },
  { id: "cormorant", family: "Cormorant", cls: "serif", sub: "oldstyle", pkg: "@fontsource-variable/cormorant", variable: true, wght: [300, 700], italic: false },
  { id: "alegreya", family: "Alegreya", cls: "serif", sub: "oldstyle", pkg: "@fontsource-variable/alegreya", variable: true, wght: [400, 900], italic: false },
  { id: "vollkorn", family: "Vollkorn", cls: "serif", sub: "oldstyle", pkg: "@fontsource-variable/vollkorn", variable: true, wght: [400, 900], italic: false },
  { id: "playfair-display", family: "Playfair Display", cls: "serif", sub: "didone", pkg: "@fontsource-variable/playfair-display", variable: true, wght: [400, 900], italic: false },
  { id: "prata", family: "Prata", cls: "serif", sub: "didone", pkg: "@fontsource/prata", variable: false, weights: [400], italic: false },
  { id: "old-standard-tt", family: "Old Standard TT", cls: "serif", sub: "didone", pkg: "@fontsource/old-standard-tt", variable: false, weights: [400, 700], italic: false },

  // Slab / брусковые
  { id: "roboto-slab", family: "Roboto Slab", cls: "slab", sub: "slab", pkg: "@fontsource-variable/roboto-slab", variable: true, wght: [100, 900], italic: false },
  { id: "bitter", family: "Bitter", cls: "slab", sub: "slab", pkg: "@fontsource-variable/bitter", variable: true, wght: [100, 900], italic: false },
  { id: "podkova", family: "Podkova", cls: "slab", sub: "slab", pkg: "@fontsource-variable/podkova", variable: true, wght: [400, 800], italic: false },

  // Sans / гротески
  { id: "oswald", family: "Oswald", cls: "sans", sub: "grotesque", pkg: "@fontsource-variable/oswald", variable: true, wght: [200, 700], italic: false },
  { id: "inter", family: "Inter", cls: "sans", sub: "neo", pkg: "@fontsource-variable/inter", variable: true, wght: [100, 900], italic: true },
  { id: "onest", family: "Onest", cls: "sans", sub: "neo", pkg: "@fontsource-variable/onest", variable: true, wght: [100, 900], italic: false, ui: true },
  { id: "roboto", family: "Roboto", cls: "sans", sub: "neo", pkg: "@fontsource-variable/roboto", variable: true, wght: [100, 900], italic: false },
  { id: "golos-text", family: "Golos Text", cls: "sans", sub: "neo", pkg: "@fontsource-variable/golos-text", variable: true, wght: [400, 900], italic: false },
  { id: "arimo", family: "Arimo", cls: "sans", sub: "neo", pkg: "@fontsource-variable/arimo", variable: true, wght: [400, 700], italic: false },
  { id: "ibm-plex-sans", family: "IBM Plex Sans", cls: "sans", sub: "neo", pkg: "@fontsource/ibm-plex-sans", variable: false, weights: [400, 700], italic: false },
  { id: "pt-sans", family: "PT Sans", cls: "sans", sub: "humanist", pkg: "@fontsource/pt-sans", variable: false, weights: [400, 700], italic: true },
  { id: "open-sans", family: "Open Sans", cls: "sans", sub: "humanist", pkg: "@fontsource-variable/open-sans", variable: true, wght: [300, 800], italic: false },
  { id: "fira-sans", family: "Fira Sans", cls: "sans", sub: "humanist", pkg: "@fontsource/fira-sans", variable: false, weights: [400, 700], italic: false },
  { id: "source-sans-3", family: "Source Sans 3", cls: "sans", sub: "humanist", pkg: "@fontsource-variable/source-sans-3", variable: true, wght: [200, 900], italic: false },
  { id: "noto-sans", family: "Noto Sans", cls: "sans", sub: "humanist", pkg: "@fontsource-variable/noto-sans", variable: true, wght: [100, 900], italic: false },
  { id: "ubuntu", family: "Ubuntu", cls: "sans", sub: "humanist", pkg: "@fontsource/ubuntu", variable: false, weights: [400, 700], italic: false },
  { id: "commissioner", family: "Commissioner", cls: "sans", sub: "humanist", pkg: "@fontsource-variable/commissioner", variable: true, wght: [100, 900], italic: false },
  { id: "montserrat", family: "Montserrat", cls: "sans", sub: "geometric", pkg: "@fontsource-variable/montserrat", variable: true, wght: [100, 900], italic: true },
  { id: "jost", family: "Jost", cls: "sans", sub: "geometric", pkg: "@fontsource-variable/jost", variable: true, wght: [100, 900], italic: false },
  { id: "raleway", family: "Raleway", cls: "sans", sub: "geometric", pkg: "@fontsource-variable/raleway", variable: true, wght: [100, 900], italic: false },
  { id: "manrope", family: "Manrope", cls: "sans", sub: "geometric", pkg: "@fontsource-variable/manrope", variable: true, wght: [200, 800], italic: false },
  { id: "nunito", family: "Nunito", cls: "sans", sub: "geometric", pkg: "@fontsource-variable/nunito", variable: true, wght: [200, 1000], italic: false },
  { id: "comfortaa", family: "Comfortaa", cls: "sans", sub: "geometric", pkg: "@fontsource-variable/comfortaa", variable: true, wght: [300, 700], italic: false },

  // Mono / моноширинные
  { id: "jetbrains-mono", family: "JetBrains Mono", cls: "mono", sub: "mono", pkg: "@fontsource-variable/jetbrains-mono", variable: true, wght: [100, 800], italic: true },
  { id: "fira-code", family: "Fira Code", cls: "mono", sub: "mono", pkg: "@fontsource-variable/fira-code", variable: true, wght: [300, 700], italic: false },
  { id: "ibm-plex-mono", family: "IBM Plex Mono", cls: "mono", sub: "mono", pkg: "@fontsource/ibm-plex-mono", variable: false, weights: [400, 700], italic: false },
  { id: "pt-mono", family: "PT Mono", cls: "mono", sub: "mono", pkg: "@fontsource/pt-mono", variable: false, weights: [400], italic: false },
  { id: "roboto-mono", family: "Roboto Mono", cls: "mono", sub: "mono", pkg: "@fontsource-variable/roboto-mono", variable: true, wght: [100, 700], italic: false },
  { id: "source-code-pro", family: "Source Code Pro", cls: "mono", sub: "mono", pkg: "@fontsource-variable/source-code-pro", variable: true, wght: [200, 900], italic: false },

  // Display / акцидентные
  { id: "unbounded", family: "Unbounded", cls: "display", sub: "display", pkg: "@fontsource-variable/unbounded", variable: true, wght: [200, 900], italic: false },
  { id: "russo-one", family: "Russo One", cls: "display", sub: "display", pkg: "@fontsource/russo-one", variable: false, weights: [400], italic: false },
  { id: "rubik-mono-one", family: "Rubik Mono One", cls: "display", sub: "display", pkg: "@fontsource/rubik-mono-one", variable: false, weights: [400], italic: false },
  { id: "dela-gothic-one", family: "Dela Gothic One", cls: "display", sub: "display", pkg: "@fontsource/dela-gothic-one", variable: false, weights: [400], italic: false },
  { id: "yeseva-one", family: "Yeseva One", cls: "display", sub: "display", pkg: "@fontsource/yeseva-one", variable: false, weights: [400], italic: false },
  { id: "poiret-one", family: "Poiret One", cls: "display", sub: "display", pkg: "@fontsource/poiret-one", variable: false, weights: [400], italic: false },
  { id: "ruslan-display", family: "Ruslan Display", cls: "display", sub: "display", pkg: "@fontsource/ruslan-display", variable: false, weights: [400], italic: false },
  { id: "press-start-2p", family: "Press Start 2P", cls: "display", sub: "display", pkg: "@fontsource/press-start-2p", variable: false, weights: [400], italic: false },

  // Script / рукописные
  { id: "caveat", family: "Caveat", cls: "script", sub: "script", pkg: "@fontsource-variable/caveat", variable: true, wght: [400, 700], italic: false },
  { id: "marck-script", family: "Marck Script", cls: "script", sub: "script", pkg: "@fontsource/marck-script", variable: false, weights: [400], italic: false },
  { id: "bad-script", family: "Bad Script", cls: "script", sub: "script", pkg: "@fontsource/bad-script", variable: false, weights: [400], italic: false },
  { id: "neucha", family: "Neucha", cls: "script", sub: "script", pkg: "@fontsource/neucha", variable: false, weights: [400], italic: false },
  { id: "amatic-sc", family: "Amatic SC", cls: "script", sub: "script", pkg: "@fontsource/amatic-sc", variable: false, weights: [400, 700], italic: false },
  { id: "pacifico", family: "Pacifico", cls: "script", sub: "script", pkg: "@fontsource/pacifico", variable: false, weights: [400], italic: false },
  { id: "lobster", family: "Lobster", cls: "script", sub: "script", pkg: "@fontsource/lobster", variable: false, weights: [400], italic: false },
  { id: "great-vibes", family: "Great Vibes", cls: "script", sub: "script", pkg: "@fontsource/great-vibes", variable: false, weights: [400], italic: false }
];
