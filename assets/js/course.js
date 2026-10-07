/*
 * Course content. Every text field is { ru, en }.
 *
 * Module:  { id, minutes, title, goal, topics[], cards[], cheatsheet[], readings[], draft? }
 * Card:    { kind: "try" | "idea" | "web" | "check", title, body?, points?[], code?, demo?, sources?[], quiz? }
 *   body    — keep it short: 60–80 words at most; put details into points[]
 *   points  — 2–4 short bullet points
 *   code    — CSS/HTML snippet (plain string or { ru, en } when it has comments)
 *   demo    — id of an interactive demo from demos.js
 *   sources — readings shown under “Further reading” (always with an active link)
 *   quiz    — { q, options[], answer (index), explain }
 *   match   — { q, pairs: [{ term, def }] } — matching exercise (definitions ↔ terms)
 * Reading: { title, url, type: "book" | "online", lang: "ru" | "en", author?, site?, note? }
 *
 * Modules marked draft: true show their planned topics instead of finished cards.
 */
(function () {
  "use strict";

  function t(ru, en) { return { ru: ru, en: en }; }

  /* ---------- sources (every item has an active link) ---------- */
  var R = {
    bringhurst: { type: "book", lang: "ru", author: "Роберт Брингхерст", site: "Skillbox Media", note: t("обзор книги", "book review"), url: "https://skillbox.ru/media/design/elements-of-typo-style/", title: t("«Основы стиля в типографике»", "The Elements of Typographic Style") },
    ruder: { type: "book", lang: "ru", author: "Эмиль Рудер", site: "Skillbox Media", note: t("обзор книги", "book review"), url: "https://skillbox.ru/media/design/ruder-book/", title: t("«Типографика»", "Typographie") },
    gordon: { type: "book", lang: "ru", author: "Юрий Гордон", site: "Лабиринт", url: "https://www.labirint.ru/books/826800/", title: t("«Книга про буквы от Аа до Яя»", "A Book about Letters from Aa to Яя (in Russian)") },
    rutterBook: { type: "book", lang: "en", author: "Richard Rutter", url: "https://book.webtypography.net/", title: t("Web Typography: A Handbook for Designing Beautiful and Effective Responsive Typography", "Web Typography: A Handbook for Designing Beautiful and Effective Responsive Typography") },
    rutter: { type: "online", lang: "en", author: "Richard Rutter", url: "https://webtypography.net/", title: t("The Elements of Typographic Style Applied to the Web — правила Брингхерста для веба", "The Elements of Typographic Style Applied to the Web") },
    rutterMeasure: { type: "online", lang: "en", author: "Richard Rutter", url: "https://webtypography.net/2.1.2", title: t("2.1.2 Choose a comfortable measure — о длине строки в CSS", "2.1.2 Choose a comfortable measure") },
    rutterLeading: { type: "online", lang: "en", author: "Richard Rutter", url: "https://webtypography.net/2.2.1", title: t("2.2.1 Choose a basic leading — об интерлиньяже в CSS", "2.2.1 Choose a basic leading that suits the typeface, text and measure") },
    rutterRhythm: { type: "online", lang: "en", author: "Richard Rutter", url: "https://webtypography.net/2.2.2", title: t("2.2.2 Add and delete vertical space in measured intervals — о вертикальном ритме", "2.2.2 Add and delete vertical space in measured intervals") },
    rutterParagraphs: { type: "online", lang: "en", author: "Richard Rutter", url: "https://webtypography.net/2.3.2", title: t("2.3.2 Абзацные отступы в сплошном тексте", "2.3.2 In continuous text mark all paragraphs after the first with an indent") },
    butterick: { type: "online", lang: "en", author: "Matthew Butterick", url: "https://practicaltypography.com/", title: t("Practical Typography", "Practical Typography") },
    butterickLength: { type: "online", lang: "en", author: "Matthew Butterick", url: "https://practicaltypography.com/line-length.html", title: t("Practical Typography: Line length", "Practical Typography: Line length") },
    butterickSpacing: { type: "online", lang: "en", author: "Matthew Butterick", url: "https://practicaltypography.com/line-spacing.html", title: t("Practical Typography: Line spacing", "Practical Typography: Line spacing") },
    baymard: { type: "online", lang: "en", site: "Baymard Institute", url: "https://baymard.com/blog/line-length-readability", title: t("Readability: the optimal line length — исследование длины строки", "Readability: The Optimal Line Length") },
    comeau: { type: "online", lang: "en", author: "Josh W. Comeau", url: "https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/", title: t("The Surprising Truth About Pixels and Accessibility — px или rem", "The Surprising Truth About Pixels and Accessibility") },
    webdevDesignType: { type: "online", lang: "ru", site: "web.dev", url: "https://web.dev/learn/design/typography?hl=ru", title: t("Адаптивный дизайн: типографика (ch, clamp, масштабирование)", "Learn Responsive Design: Typography") },
    webdevCssType: { type: "online", lang: "en", site: "web.dev", url: "https://web.dev/learn/css/typography", title: t("Learn CSS: Text and typography", "Learn CSS: Text and typography") },
    mdnLineHeight: { type: "online", lang: "ru", site: "MDN", url: "https://developer.mozilla.org/ru/docs/Web/CSS/line-height", title: t("line-height: безразмерные значения и наследование", "line-height") },
    mdnHyphens: { type: "online", lang: "ru", site: "MDN", url: "https://developer.mozilla.org/ru/docs/Web/CSS/hyphens", title: t("hyphens: переносы и атрибут lang", "hyphens") },
    mdnTextWrap: { type: "online", lang: "en", site: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap", title: t("text-wrap: balance и pretty", "text-wrap: balance and pretty") },
    mdnTextBoxTrim: { type: "online", lang: "en", site: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim", title: t("text-box-trim: обрезка полуинтерлиньяжа", "text-box-trim") },
    mdnFontFace: { type: "online", lang: "ru", site: "MDN", url: "https://developer.mozilla.org/ru/docs/Web/CSS/@font-face", title: t("@font-face", "@font-face") },
    mdnVariable: { type: "online", lang: "en", site: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide", title: t("Руководство по вариативным шрифтам", "Variable fonts guide") },
    wcagContrast: { type: "online", lang: "en", site: "W3C", url: "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html", title: t("WCAG 1.4.3 Contrast (Minimum)", "WCAG 1.4.3 Contrast (Minimum)") },
    wcagResize: { type: "online", lang: "en", site: "W3C", url: "https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html", title: t("WCAG 1.4.4 Resize Text — увеличение до 200 %", "WCAG 1.4.4 Resize Text") },
    wcagVisual: { type: "online", lang: "en", site: "W3C", url: "https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation.html", title: t("WCAG 1.4.8 Visual Presentation — до 80 знаков, без выключки", "WCAG 1.4.8 Visual Presentation") },
    wcagSpacing: { type: "online", lang: "en", site: "W3C", url: "https://www.w3.org/WAI/WCAG21/Understanding/text-spacing.html", title: t("WCAG 1.4.12 Text Spacing", "WCAG 1.4.12 Text Spacing") },
    gfBaseline: { type: "online", lang: "en", site: "Google Fonts Knowledge", url: "https://fonts.google.com/knowledge/glossary/baseline", title: t("Глоссарий: Baseline", "Glossary: Baseline") },
    gfXHeight: { type: "online", lang: "en", site: "Google Fonts Knowledge", url: "https://fonts.google.com/knowledge/glossary/x_height", title: t("Глоссарий: x-height", "Glossary: x-height") },
    gfCapHeight: { type: "online", lang: "en", site: "Google Fonts Knowledge", url: "https://fonts.google.com/knowledge/glossary/cap_height", title: t("Глоссарий: Cap height", "Glossary: Cap height") },
    gfAscender: { type: "online", lang: "en", site: "Google Fonts Knowledge", url: "https://fonts.google.com/knowledge/glossary/ascender", title: t("Глоссарий: Ascender", "Glossary: Ascender") },
    gfDescender: { type: "online", lang: "en", site: "Google Fonts Knowledge", url: "https://fonts.google.com/knowledge/glossary/descender", title: t("Глоссарий: Descender", "Glossary: Descender") },
    gfCounter: { type: "online", lang: "en", site: "Google Fonts Knowledge", url: "https://fonts.google.com/knowledge/glossary/counter", title: t("Глоссарий: Counter (внутрибуквенный просвет)", "Glossary: Counter") },
    gfContrast: { type: "online", lang: "en", site: "Google Fonts Knowledge", url: "https://fonts.google.com/knowledge/glossary/contrast", title: t("Глоссарий: Contrast", "Glossary: Contrast") },
    gfAperture: { type: "online", lang: "en", site: "Google Fonts Knowledge", url: "https://fonts.google.com/knowledge/glossary/aperture", title: t("Глоссарий: Aperture", "Glossary: Aperture") },
    gfEm: { type: "online", lang: "en", site: "Google Fonts Knowledge", url: "https://fonts.google.com/knowledge/glossary/em", title: t("Глоссарий: Em (кегельная площадка)", "Glossary: Em") },
    mdnFontSizeAdjust: { type: "online", lang: "en", site: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-size-adjust", title: t("font-size-adjust", "font-size-adjust") },
    mdnOpticalSizing: { type: "online", lang: "en", site: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing", title: t("font-optical-sizing", "font-optical-sizing") },
    skillboxCyrillic: { type: "online", lang: "ru", site: "Skillbox Media", url: "https://skillbox.ru/media/design/kak-otlichit-khoroshuyu-kirillitsu-ot-plokhoy/", title: t("Как отличить хорошую кириллицу от плохой", "How to tell good Cyrillic from bad (in Russian)") },
    vcAnatomy: { type: "online", lang: "ru", site: "vc.ru", url: "https://vc.ru/139065-anatomiya-shriftov", title: t("Анатомия шрифтов — иллюстрированный словарь элементов знака", "Anatomy of type — an illustrated glossary (in Russian)") },
    voxWiki: { type: "online", lang: "en", site: "Wikipedia", url: "https://en.wikipedia.org/wiki/Vox-ATypI_classification", title: t("Классификация Vox-ATypI", "Vox-ATypI classification") },
    localfontsClass: { type: "online", lang: "en", site: "Localfonts", url: "https://localfonts.eu/typeface-classification/", title: t("Typeface classification — обзор классификации с примерами", "Typeface classification") },
    gfSerif: { type: "online", lang: "en", site: "Google Fonts Knowledge", url: "https://fonts.google.com/knowledge/glossary/serif", title: t("Глоссарий: Serif", "Glossary: Serif") },
    gfSansSerif: { type: "online", lang: "en", site: "Google Fonts Knowledge", url: "https://fonts.google.com/knowledge/glossary/sans_serif", title: t("Глоссарий: Sans serif", "Glossary: Sans serif") },
    mdnFontFamily: { type: "online", lang: "ru", site: "MDN", url: "https://developer.mozilla.org/ru/docs/Web/CSS/Reference/Properties/font-family", title: t("font-family: родовые семейства шрифтов", "font-family") },
    mdnNumeric: { type: "online", lang: "ru", site: "MDN", url: "https://developer.mozilla.org/ru/docs/Web/CSS/Reference/Properties/font-variant-numeric", title: t("font-variant-numeric: табличные цифры", "font-variant-numeric") },
    modernStacks: { type: "online", lang: "en", url: "https://modernfontstacks.com/", title: t("Modern Font Stacks — системные наборы шрифтов по классам", "Modern Font Stacks") },
    meduza: { type: "online", lang: "ru", site: "Медуза", author: "Сергей Сурганов", url: "https://meduza.io/feature/2017/01/29/kak-vybrat-shrift", title: t("Как выбрать шрифт", "How to choose a typeface (in Russian)") },
    mdnFontWeight: { type: "online", lang: "ru", site: "MDN", url: "https://developer.mozilla.org/ru/docs/Web/CSS/Reference/Properties/font-weight", title: t("font-weight: значения и подбор недоступного начертания", "font-weight") },
    mdnFontSynthesis: { type: "online", lang: "en", site: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-synthesis", title: t("font-synthesis: синтез начертаний", "font-synthesis") },
    mdnEm: { type: "online", lang: "ru", site: "MDN", url: "https://developer.mozilla.org/ru/docs/Web/HTML/Reference/Elements/em", title: t("Элемент <em> и его отличие от <i>", "The <em> element") },
    webdevVariable: { type: "online", lang: "en", site: "web.dev", url: "https://web.dev/articles/variable-fonts", title: t("Introduction to variable fonts on the web", "Introduction to variable fonts on the web") },
    skyengItalic: { type: "online", lang: "ru", site: "Skyeng", url: "https://skyeng.ru/it-industry/design/kursiv-naklonnoye-nachertaniye-bukv-v-kompyuternom-shrifte/", title: t("Курсив: наклонное начертание букв в компьютерном шрифте", "Italic in digital type (in Russian)") },
    butterickCaps: { type: "online", lang: "en", author: "Matthew Butterick", url: "https://practicaltypography.com/all-caps.html", title: t("Practical Typography: All caps", "Practical Typography: All caps") },
    butterickLetterspacing: { type: "online", lang: "en", author: "Matthew Butterick", url: "https://practicaltypography.com/letterspacing.html", title: t("Practical Typography: Letterspacing", "Practical Typography: Letterspacing") },
    timBrown: { type: "online", lang: "en", author: "Tim Brown", site: "A List Apart", url: "https://alistapart.com/article/more-meaningful-typography/", title: t("More Meaningful Typography — модульная шкала в веб-дизайне (2011)", "More Meaningful Typography (2011)") },
    utopia: { type: "online", lang: "en", site: "Utopia", url: "https://utopia.fyi/type/calculator/", title: t("Utopia — калькулятор адаптивной типографической шкалы", "Utopia fluid type scale calculator") },
    butterickHeadings: { type: "online", lang: "en", author: "Matthew Butterick", url: "https://practicaltypography.com/headings.html", title: t("Practical Typography: Headings", "Practical Typography: Headings") },
    mdnClamp: { type: "online", lang: "ru", site: "MDN", url: "https://developer.mozilla.org/ru/docs/Web/CSS/Reference/Values/clamp", title: t("clamp(): значение в заданном диапазоне", "clamp()") },
    mdnLength: { type: "online", lang: "en", site: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/length", title: t("<length>: единицы lh и rlh", "<length>: lh and rlh units") },
    mdnHeadings: { type: "online", lang: "ru", site: "MDN", url: "https://developer.mozilla.org/ru/docs/Web/HTML/Reference/Elements/Heading_Elements", title: t("Элементы <h1>–<h6>: правила использования", "<h1>–<h6> heading elements") },
    wcagHeadings: { type: "online", lang: "en", site: "W3C WAI", url: "https://www.w3.org/WAI/tutorials/page-structure/headings/", title: t("Web Accessibility Tutorials: Headings", "Web Accessibility Tutorials: Headings") },
    butterickMixing: { type: "online", lang: "en", author: "Matthew Butterick", url: "https://practicaltypography.com/mixing-fonts.html", title: t("Practical Typography: Mixing fonts", "Practical Typography: Mixing fonts") },
    skillboxPairs: { type: "online", lang: "ru", author: "Дарья Тамилина", site: "Skillbox Media", url: "https://skillbox.ru/media/design/chto_takoe_shriftovye_pary_i_kak_ikh_podbirat/", title: t("Что такое шрифтовые пары и как их подбирать", "What font pairs are and how to choose them (in Russian)") },
    skillboxPairsTools: { type: "online", lang: "ru", author: "Полина Старцева", site: "Skillbox Media", url: "https://skillbox.ru/media/design/shriftovye-pary/", title: t("Шрифтовые пары: 7 сервисов в помощь дизайнеру", "Font pairs: 7 services for designers (in Russian)") },
    gfPtSans: { type: "online", lang: "en", site: "Google Fonts", url: "https://fonts.google.com/specimen/PT+Sans/about", title: t("PT Sans: описание гарнитуры и проекта Public Types of Russian Federation", "PT Sans: about the typeface") },
    webdevFontBest: { type: "online", lang: "en", site: "web.dev", url: "https://web.dev/articles/font-best-practices", title: t("Best practices for fonts — производительность веб-шрифтов", "Best practices for fonts") },
    gost52872: { type: "online", lang: "ru", site: "Тифлоцентр", url: "https://tiflocentre.ru/documents/gost-r-52872-2019.php", title: t("ГОСТ Р 52872-2019: требования доступности интернет-ресурсов", "GOST R 52872-2019: accessibility requirements (in Russian)") },
    wcagNonText: { type: "online", lang: "en", site: "W3C", url: "https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html", title: t("WCAG 1.4.11 Non-text Contrast", "WCAG 1.4.11 Non-text Contrast") },
    wcagReflow: { type: "online", lang: "en", site: "W3C", url: "https://www.w3.org/WAI/WCAG21/Understanding/reflow.html", title: t("WCAG 1.4.10 Reflow — перекомпоновка при 320 CSS px", "WCAG 1.4.10 Reflow") },
    wcagUseOfColor: { type: "online", lang: "en", site: "W3C", url: "https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html", title: t("WCAG 1.4.1 Use of Color", "WCAG 1.4.1 Use of Color") },
    g183: { type: "online", lang: "en", site: "W3C", url: "https://www.w3.org/WAI/WCAG21/Techniques/general/G183", title: t("Техника G183: контраст 3:1 между ссылкой и окружающим текстом", "Technique G183: 3:1 contrast between links and surrounding text") },
    wcagTarget: { type: "online", lang: "en", site: "W3C", url: "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html", title: t("WCAG 2.2: 2.5.8 Target Size (Minimum)", "WCAG 2.2: 2.5.8 Target Size (Minimum)") },
    wcagImagesOfText: { type: "online", lang: "en", site: "W3C", url: "https://www.w3.org/WAI/WCAG21/Understanding/images-of-text.html", title: t("WCAG 1.4.5 Images of Text", "WCAG 1.4.5 Images of Text") },
    webaimContrast: { type: "online", lang: "en", site: "WebAIM", url: "https://webaim.org/resources/contrastchecker/", title: t("WebAIM Contrast Checker — проверка контраста", "WebAIM Contrast Checker") },
    mdnLightDark: { type: "online", lang: "en", site: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark", title: t("light-dark(): цвета для светлой и тёмной схем", "light-dark()") },
    mdnPrefersContrast: { type: "online", lang: "en", site: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast", title: t("prefers-contrast", "prefers-contrast") },
    mdnForcedColors: { type: "online", lang: "en", site: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors", title: t("forced-colors: режим принудительных цветов", "forced-colors") },
    bdaGuide: { type: "online", lang: "en", site: "British Dyslexia Association", url: "https://www.bdadyslexia.org.uk/advice/employers/creating-a-dyslexia-friendly-workplace/dyslexia-friendly-style-guide", title: t("Dyslexia friendly style guide", "Dyslexia friendly style guide") },
    dyslexieStudy: { type: "online", lang: "en", site: "University of Michigan, Dyslexia Help", url: "https://dyslexiahelp.umich.edu/latest/does-dyslexie-font-help-dyslexic-readers/", title: t("Does the Dyslexie font help dyslexic readers? — обзор исследования Kuster et al.", "Does the Dyslexie font help dyslexic readers?") },
    mdnFontDisplay: { type: "online", lang: "en", site: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display", title: t("font-display: периоды блокировки, подмены и отказа", "font-display") },
    mdnSizeAdjust: { type: "online", lang: "en", site: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust", title: t("size-adjust: подгонка резервного шрифта", "size-adjust") },
    mdnPreload: { type: "online", lang: "en", site: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload", title: t("rel=preload: предварительная загрузка и атрибут crossorigin", "rel=preload") },
    mdnQuotes: { type: "online", lang: "en", site: "MDN", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/quotes", title: t("quotes: кавычки в зависимости от языка", "quotes") },
    chromeCache: { type: "online", lang: "en", site: "Chrome for Developers", url: "https://developer.chrome.com/blog/http-cache-partitioning", title: t("Gaining security and privacy by partitioning the cache", "Gaining security and privacy by partitioning the cache") },
    lgMuenchen: { type: "online", lang: "de", site: "IHK", url: "https://www.ihk.de/bergische/recht-und-steuern/wettbewerbsrecht/google-fonts-5646176", title: t("Решение земельного суда Мюнхена от 20.01.2022 о Google Fonts", "Munich Regional Court ruling of 20.01.2022 on Google Fonts") },
    oflWiki: { type: "online", lang: "en", site: "Wikipedia", url: "https://en.wikipedia.org/wiki/SIL_Open_Font_License", title: t("SIL Open Font License", "SIL Open Font License") },
    typograf: { type: "online", lang: "ru", site: "Студия Артемия Лебедева", url: "https://www.artlebedev.ru/typograf/", title: t("Типограф — автоматическая расстановка кавычек, тире и неразрывных пробелов", "Typograf (in Russian)") },
    habrDashes: { type: "online", lang: "ru", site: "Хабр", url: "https://habr.com/ru/articles/20588/", title: t("Чёрточки: только ли тире, минус и дефис?", "Dashes in Russian typography (in Russian)") },
    melQuotes: { type: "online", lang: "ru", site: "Мел", url: "https://mel.fm/gramotnost/9275361-kavychki-elochki-ili-lapki-kak-rasstavlyat-ikh-pravilno", title: t("Кавычки-ёлочки или лапки: как расставлять их правильно", "Guillemets or low-high quotes (in Russian)") },
    gfOvershoot: { type: "online", lang: "en", site: "Google Fonts Knowledge", url: "https://fonts.google.com/knowledge/glossary/overshoot", title: t("Глоссарий: Overshoot (нависание)", "Glossary: Overshoot") },
    vcKorolkova: { type: "online", lang: "ru", author: "Александра Королькова", site: "vc.ru", url: "https://vc.ru/design/248026-kak-shrifty-ispolzuyut-v-dizayne", title: t("Как шрифты используют в дизайне — шкала нейтральности и выразительности (2021)", "How typefaces are used in design (2021, in Russian)") },
    korolkovaBook: { type: "book", lang: "ru", author: "Александра Королькова", site: "Wikipedia", note: t("об авторе", "about the author"), url: "https://en.wikipedia.org/wiki/Alexandra_Korolkova", title: t("«Живая типографика» (2007; 4-е изд. 2012)", "Living Typography (in Russian; 2007, 4th ed. 2012)") },
    emigreLicko: { type: "online", lang: "en", author: "Zuzana Licko", site: "Emigre", url: "https://www.emigre.com/Essays/ZuzanaLicko/Tind2015", title: t("Интервью 2015 г.: «People read best what we read most»", "Interview (2015): “People read best what we read most”") },
    brumberger: { type: "online", lang: "en", author: "Eva Brumberger", site: "Technical Communication", url: "https://www.ingentaconnect.com/contentone/stc/tc/2003/00000050/00000002/art00008", title: t("The Rhetoric of Typography: The Awareness and Impact of Typeface Appropriateness (2003)", "The Rhetoric of Typography: The Awareness and Impact of Typeface Appropriateness (2003)") },
    noordzij: { type: "book", lang: "en", author: "Gerrit Noordzij", site: "Typotheque", url: "https://www.typotheque.com/books/the-stroke", title: t("The Stroke: Theory of Writing — теория контраста как следа инструмента", "The Stroke: Theory of Writing") },
    gfKnowledge: { type: "online", lang: "en", site: "Google Fonts", url: "https://fonts.google.com/knowledge", title: t("Google Fonts Knowledge", "Google Fonts Knowledge") },
    typeScale: { type: "online", lang: "en", url: "https://typescale.com/", title: t("Type Scale — генератор шкалы", "Type Scale — scale generator") }
  };

  var modules = [
    {
      id: "anatomy", minutes: 60,
      title: t("Анатомия шрифта", "Anatomy of type"),
      goal: t("Освоить терминологию строения знака и понять, как элементы шрифта влияют на восприятие текста на экране.", "Master the terminology of letter structure and understand how the parts of a typeface affect on-screen reading."),
      topics: [],
      cards: [
        {
          kind: "try", demo: "metrics",
          title: t("Метрические линии шрифта", "Vertical metrics of a typeface"),
          body: t("Выберите гарнитуру и сравните положение основных линий. Обратите внимание, как различаются высота строчных, высота прописных и глубина нижних выносных элементов при одном и том же кегле.", "Select a typeface and compare the position of the main lines. Note how the x-height, cap height and descender depth differ at the same font size.")
        },
        {
          kind: "idea",
          title: t("Система линий шрифта", "The system of typeface lines"),
          figure: "lines",
          body: t("Знаки шрифта располагаются относительно системы горизонтальных линий, которая определяет их пропорции и согласованность в строке.", "Glyphs are positioned relative to a system of horizontal lines that defines their proportions and consistency within a line."),
          points: [
            t("Базовая линия (baseline) — линия, на которой стоят знаки; нижние выносные элементы опускаются ниже неё.", "Baseline — the line on which glyphs sit; descenders extend below it."),
            t("Линия строчных и высота строчных (x-height) — высота строчных знаков без выносных элементов, например x, н, о.", "x-height — the height of lowercase letters without ascenders or descenders, such as x and o."),
            t("Линия прописных (cap height) — высота прописных знаков; как правило, немного ниже линии верхних выносных элементов.", "Cap height — the height of capitals; usually slightly lower than the ascender line."),
            t("Линии верхних и нижних выносных элементов (ascender, descender) — границы элементов, выходящих за высоту строчных (б, d, h; р, у, p, g).", "Ascender and descender lines — the limits of strokes extending beyond the x-height (b, d, h; p, g, y).")
          ],
          sources: [R.gfBaseline, R.gfXHeight, R.gfCapHeight, R.gfAscender, R.gfDescender]
        },
        {
          kind: "task",
          title: t("Найдите линии шрифта", "Find the type lines"),
          body: t("Установите базовую линию, линию строчных и линию прописных на образце. Шрифт выбирается случайно; задание можно повторять с другими гарнитурами.", "Place the baseline, x-height and cap height on the specimen. The typeface is chosen at random; repeat the exercise with other typefaces."),
          demo: "tLines"
        },
        {
          kind: "idea",
          title: t("Элементы знака", "Parts of a letterform"),
          figure: "elements",
          body: t("Для описания и сравнения гарнитур используется устойчивая терминология, обозначающая отдельные элементы знака.", "A stable terminology for individual parts of a letterform is used to describe and compare typefaces."),
          points: [
            t("Основной штрих (stem) — главный, как правило вертикальный, элемент знака; соединительный штрих (hairline) — тонкий элемент, связывающий основные.", "Stem — the main, usually vertical, stroke; hairline — the thin stroke connecting the main ones."),
            t("Контраст — соотношение толщины основных и соединительных штрихов: от монолинейных гротесков до высококонтрастных антикв.", "Contrast — the ratio between thick and thin strokes, from monolinear sans to high-contrast serifs."),
            t("Засечка (serif) — оконечный элемент штриха; по наличию и форме засечек разграничиваются классы шрифтов.", "Serif — a finishing stroke at the end of a main stroke; type classes are distinguished by the presence and form of serifs."),
            t("Внутрибуквенный просвет (counter) — замкнутое (о, d) или открытое (с, u) пространство внутри знака; апертура — степень раскрытости полуоткрытых форм (с, е, а).", "Counter — the enclosed (o, d) or open (c, u) space inside a letter; aperture — the degree of openness of partially open forms (c, e, a).")
          ],
          sources: [R.gfCounter, R.gfContrast, R.gfAperture, R.vcAnatomy]
        },
        {
          kind: "check",
          title: t("Контроль: терминология", "Review: terminology"),
          match: {
            q: t("Сопоставьте определения и термины.", "Match the definitions to the terms."),
            pairs: [
              { term: t("Базовая линия", "Baseline"), def: t("Линия, на которой стоят знаки строки", "The line on which the glyphs of a line sit") },
              { term: t("Высота строчных", "x-height"), def: t("Высота строчных знаков без выносных элементов", "The height of lowercase letters without ascenders or descenders") },
              { term: t("Нижний выносной элемент", "Descender"), def: t("Часть знака, опускающаяся ниже базовой линии", "The part of a letter that extends below the baseline") },
              { term: t("Контраст", "Contrast"), def: t("Соотношение толщины основных и соединительных штрихов", "The ratio between thick and thin strokes") },
              { term: t("Апертура", "Aperture"), def: t("Степень раскрытости полуоткрытых форм, например с и е", "The degree of openness of partially open forms such as c and e") },
              { term: t("Внутрибуквенный просвет", "Counter"), def: t("Пространство, ограниченное штрихами внутри знака", "The space enclosed by strokes inside a letter") }
            ]
          }
        },
        {
          kind: "web",
          title: t("Кегль и кегельная площадка", "Font size and the em box"),
          body: t("Значение font-size задаёт высоту кегельной площадки (em), а не высоту знаков. Доля, которую в ней занимают строчные и прописные знаки, определяется проектом гарнитуры, поэтому при одинаковом кегле разные шрифты воспринимаются как разные по размеру.", "font-size sets the height of the em box, not of the letters. The share of it occupied by lowercase and capital letters is determined by the type design, so at the same size different typefaces appear to differ in size."),
          points: [
            t("Значение line-height: normal определяется вертикальными метриками файла шрифта (область содержимого) и различается у разных гарнитур; поэтому интерлиньяж следует задавать явно.", "line-height: normal is derived from the font file's vertical metrics (the content area) and varies between typefaces, so line height should be set explicitly."),
            t("При замене гарнитуры в макете кегль, как правило, требует корректировки, даже если числовое значение font-size сохраняется.", "When a typeface is replaced in a layout, the size usually needs adjusting even if the font-size value stays the same.")
          ],
          demo: "xheight",
          sources: [R.gfEm, R.mdnLineHeight]
        },
        {
          kind: "idea",
          title: t("Высота строчных и удобочитаемость", "x-height and readability"),
          figure: "xheight",
          body: t("Высота строчных во многом определяет видимый размер шрифта. Гарнитуры, разработанные для экранного чтения и интерфейсов, как правило, имеют увеличенную высоту строчных: это повышает различимость знаков при малом кегле.", "x-height largely determines the apparent size of a typeface. Typefaces designed for screen reading and interfaces tend to have a large x-height, which improves character recognition at small sizes."),
          points: [
            t("Чрезмерная высота строчных сокращает выносные элементы и ослабляет различие очертаний слов, что может снижать скорость чтения длинных текстов.", "An excessive x-height shortens ascenders and descenders and weakens word-shape distinctions, which may slow down reading of long texts."),
            t("Гарнитуры с малой высотой строчных требуют большего кегля для достижения той же удобочитаемости.", "Typefaces with a small x-height require a larger size to achieve the same readability.")
          ],
          sources: [R.gfXHeight, R.butterick]
        },
        {
          kind: "web",
          title: t("Свойство font-size-adjust", "The font-size-adjust property"),
          body: t("Пока веб-шрифт загружается или если он недоступен, текст отображается резервным шрифтом. Если высота строчных у двух шрифтов различается, текст визуально меняет размер, а строки могут перестраиваться. Свойство font-size-adjust масштабирует любой используемый шрифт так, чтобы его высота строчных составляла заданную долю кегля.", "While a web font loads, or if it is unavailable, text is rendered in a fallback font. If the two fonts differ in x-height, the text visibly changes size and lines may reflow. font-size-adjust scales whichever font is in use so that its x-height equals a given fraction of the font size."),
          points: [
            t("Значение from-font берёт соотношение из первого доступного шрифта списка font-family.", "The from-font value takes the ratio from the first available font in the font-family list."),
            t("Свойство поддерживается всеми основными браузерами с 2024 года (Baseline 2024).", "The property is supported by all major browsers since 2024 (Baseline 2024).")
          ],
          code: "body {\n  font-family: \"Montserrat\", Georgia, serif;\n  font-size-adjust: ex-height 0.52;\n}",
          demo: "fsadjust",
          sources: [R.mdnFontSizeAdjust]
        },
        {
          kind: "task",
          title: t("Согласуйте высоту строчных", "Match the x-heights"),
          body: t("Подберите кегль второго шрифта так, чтобы его строчные знаки визуально совпали с эталоном. Проверка сравнивает измеренные значения x-height.", "Adjust the second typeface's size so that its lowercase letters match the reference. The check compares measured x-heights."),
          demo: "tXMatch"
        },
        {
          kind: "idea",
          title: t("Контраст, засечки и апертура на экране", "Contrast, serifs and aperture on screen"),
          figure: "screen",
          body: t("Элементы, обеспечивающие выразительность шрифта в крупном кегле, при малом кегле могут снижать удобочитаемость. На экране это проявляется сильнее, чем в печати, из-за ограниченного числа пикселей, приходящихся на штрих.", "Features that make a typeface expressive at large sizes may reduce readability at small sizes. On screen this is more pronounced than in print because few pixels are available per stroke."),
          points: [
            t("Тонкие соединительные штрихи высококонтрастных антикв при малом кегле и низкой плотности пикселей теряют чёткость; такие гарнитуры уместны преимущественно в заголовках.", "The hairlines of high-contrast serifs lose definition at small sizes and low pixel density; such typefaces suit headings primarily."),
            t("Открытая апертура (характерна для гуманистических гротесков) улучшает различение знаков с, е, о, а при малом кегле.", "An open aperture, typical of humanist sans, improves the distinction of c, e, o and a at small sizes."),
            t("Для интерфейсов, кодов и паролей существенна различимость пар I / l / 1 и O / 0.", "For interfaces, codes and passwords the distinction of I / l / 1 and O / 0 is essential.")
          ],
          sources: [R.gfContrast, R.gfAperture]
        },
        {
          kind: "try", demo: "legibility",
          title: t("Различимость знаков при малом кегле", "Character distinction at small sizes"),
          body: t("Уменьшите кегль и увеличьте размытие, имитирующее экран с низкой плотностью пикселей. Определите, в каких гарнитурах пары сходных знаков перестают различаться раньше.", "Reduce the size and increase the blur that simulates a low-density screen. Identify in which typefaces similar characters become indistinguishable first.")
        },
        {
          kind: "web",
          title: t("Оптический кегль и вариативные шрифты", "Optical size and variable fonts"),
          body: t("В металлическом наборе каждый кегль гравировался отдельно: мелкие кегли получали более открытые формы и сниженный контраст, крупные — более тонкую прорисовку. Вариативные шрифты воспроизводят этот принцип с помощью оси оптического размера (opsz).", "In metal type each size was cut separately: small sizes received more open forms and lower contrast, large sizes finer detail. Variable fonts reproduce this principle through the optical size axis (opsz)."),
          points: [
            t("Свойство font-optical-sizing по умолчанию имеет значение auto: браузер выбирает оптический размер в соответствии с кеглем.", "font-optical-sizing defaults to auto: the browser selects the optical size according to the font size."),
            t("Ось opsz есть не во всех шрифтах; её наличие указывается в описании гарнитуры (например, у Literata — от 7 до 72).", "Not all fonts have an opsz axis; it is listed in the typeface description (Literata, for example, covers 7 to 72).")
          ],
          code: t("/* значение по умолчанию */\nh1, p { font-optical-sizing: auto; }", "/* default value */\nh1, p { font-optical-sizing: auto; }"),
          demo: "opsz",
          sources: [R.mdnOpticalSizing, R.mdnVariable]
        },
        {
          kind: "idea",
          title: t("Как читать название шрифта", "How to read a font name"),
          figure: "fontname",
          body: t("Полное название начертания состоит из двух частей. Первая — имя семейства: его указывают в font-family. Вторая — характеристики конкретного начертания: их задают свойствами font-weight, font-style, font-stretch или они определяют, какой файл подключать. Слова всегда идут в одном порядке: от общего к частному.", "A full style name has two parts. The first is the family name, used in font-family. The second describes the particular style: it maps to font-weight, font-style and font-stretch or tells you which file to load. The words always follow the same order, from general to specific."),
          points: [
            t("Имя семейства может включать проект или производителя (PT, IBM, Noto), собственное имя (Plex, Roboto, Source), класс (Sans, Serif, Mono) и номер версии (Source Serif 4). Всё это вместе — значение font-family: «PT Sans», «IBM Plex Sans», «Source Serif 4».", "The family name may include a project or foundry (PT, IBM, Noto), a proper name (Plex, Roboto, Source), a class (Sans, Serif, Mono) and a version number (Source Serif 4). Together they form the font-family value: “PT Sans”, “IBM Plex Sans”, “Source Serif 4”."),
            t("Характеристики начертания перечисляются в порядке: оптический размер → ширина → насыщенность → наклон. Например: Source Serif 4 | Display | Semibold | Italic; IBM Plex Sans | Condensed | Medium | Italic.", "Style features are listed in the order optical size → width → weight → slope. For example: Source Serif 4 | Display | Semibold | Italic; IBM Plex Sans | Condensed | Medium | Italic."),
            t("Если признак не указан, действует значение по умолчанию: оптический размер Text, ширина Normal, насыщенность Regular (400), прямое начертание. Поэтому «PT Sans Bold» — это обычная ширина, прямое начертание, насыщенность 700.", "If a feature is omitted, the default applies: Text optical size, Normal width, Regular (400) weight, upright. So “PT Sans Bold” means normal width, upright, weight 700."),
            t("Иногда слово-признак становится частью имени семейства: Playfair Display, PT Sans Caption и PT Sans Narrow подключаются как отдельные семейства. Это проверяют в каталоге: если вариант указан в font-family, он часть имени.", "Sometimes a feature word becomes part of the family name: Playfair Display, PT Sans Caption and PT Sans Narrow are loaded as separate families. Check the catalogue: if the variant appears in font-family, it is part of the name.")
          ],
          sources: [R.gfPtSans, R.mdnOpticalSizing]
        },
        {
          kind: "idea",
          title: t("Обозначения в названиях шрифтов", "Labels in font names"),
          figure: "fontterms",
          body: t("Слова-признаки образуют упорядоченные шкалы. Насыщенность и ширина соответствуют числовым значениям CSS, оптический размер — кеглю, для которого рассчитан рисунок. Зная шкалы, можно по названию файла определить, какое начертание в нём находится.", "Feature words form ordered scales. Weight and width map to numeric CSS values, optical size to the type size the design is made for. Knowing the scales, you can tell from a file name which style it contains."),
          points: [
            t("Насыщенность: Thin (100) → ExtraLight (200) → Light (300) → Regular (400) → Medium (500) → SemiBold (600) → Bold (700) → ExtraBold (800) → Black (900). Синонимы: Hairline = Thin, Heavy = Black, DemiBold = SemiBold, UltraBold = ExtraBold.", "Weight: Thin (100) → ExtraLight (200) → Light (300) → Regular (400) → Medium (500) → SemiBold (600) → Bold (700) → ExtraBold (800) → Black (900). Synonyms: Hairline = Thin, Heavy = Black, DemiBold = SemiBold, UltraBold = ExtraBold."),
            t("Ширина: Ultra Condensed (50 %) → Extra Condensed → Condensed / Narrow → Semi Condensed → Normal (100 %) → Semi Expanded → Expanded / Wide → Extra Expanded → Ultra Expanded (200 %). В CSS — свойство font-stretch.", "Width: Ultra Condensed (50%) → Extra Condensed → Condensed / Narrow → Semi Condensed → Normal (100%) → Semi Expanded → Expanded / Wide → Extra Expanded → Ultra Expanded (200%). In CSS: font-stretch."),
            t("Оптический размер: Caption → Small Text → Text → Subhead → Display — от мелкого кегля к крупному. Наклон: Roman (прямое, обычно не пишется), Italic (курсив), Oblique (наклонное). Тип файла: Variable — вариативный, Pro — расширенный набор знаков, SC — капитель.", "Optical size: Caption → Small Text → Text → Subhead → Display — from small to large sizes. Slope: Roman (upright, usually omitted), Italic, Oblique. File type: Variable, Pro (extended character set), SC (small caps).")
          ],
          sources: [R.mdnFontWeight, R.mdnVariable]
        },
        {
          kind: "task",
          title: t("Разберите название шрифта", "Parse a font name"),
          body: t("Разберите 12 названий реальных шрифтов: для каждого слова укажите, что оно обозначает. Задание засчитывается при 10 полностью верных разборах.", "Parse 12 real font names: for every word, state what it denotes. The exercise is passed with 10 fully correct parses."),
          demo: "tFontName"
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("Какая гарнитура предпочтительнее для подписей интерфейса кеглем 12–14 px на экранах с низкой плотностью пикселей?", "Which typeface is preferable for 12–14 px interface labels on low-density screens?"),
            options: [t("Высококонтрастная антиква с тонкими горизонтальными засечками", "A high-contrast serif with thin horizontal serifs"), t("Гротеск с открытой апертурой и увеличенной высотой строчных", "A sans with open aperture and a large x-height"), t("Рукописный шрифт с наклоном и связным начертанием знаков", "A slanted script with connected letterforms")],
            answer: 1,
            explain: t("Открытая апертура и увеличенная высота строчных повышают различимость знаков при малом кегле; тонкие штрихи высококонтрастных антикв на таких экранах теряют чёткость.", "Open aperture and a large x-height improve character recognition at small sizes; the thin strokes of high-contrast serifs lose definition on such screens.")
          }
        },
        {
          kind: "try", demo: "cyrillic",
          title: t("Выносные элементы в кириллице и латинице", "Ascenders and descenders in Cyrillic and Latin"),
          body: t("Сравните доли строчных знаков с выносными элементами в русском и английском вариантах одного и того же предложения.", "Compare the share of lowercase letters with ascenders and descenders in the Russian and English versions of the same sentence.")
        },
        {
          kind: "idea",
          title: t("Особенности строчной кириллицы", "Specifics of lowercase Cyrillic"),
          figure: "cyrlower",
          body: t("Большинство строчных кириллических знаков вписывается в высоту строчных: верхние выносные элементы имеют лишь б и ф, нижние — д, р, у, ф, ц, щ. Обилие вертикальных штрихов (и, н, п, т, ш, щ) создаёт эффект «частокола»: очертания слов менее разнообразны, чем в латинице, а текстура набора — более однородна.", "Most lowercase Cyrillic letters fit within the x-height: only б and ф have ascenders, and д, р, у, ф, ц, щ have descenders. The abundance of vertical stems (и, н, п, т, ш, щ) creates a ‘picket fence’ effect: word shapes are less varied than in Latin, and the texture of the setting is more uniform."),
          points: [
            t("Качество кириллицы в шрифтах, изначально разработанных для латиницы, существенно различается; её следует оценивать отдельно.", "The quality of Cyrillic in typefaces originally designed for Latin varies considerably and must be evaluated separately."),
            t("Знаки, выявляющие качество проработки кириллицы: Л и Д (согласованность форм), б (не должна напоминать цифру 6), Ф (собственный, а не составной овал).", "Letters that reveal the quality of a Cyrillic design: Л and Д (consistent forms), б (must not resemble the digit 6), Ф (a proper oval rather than a composite one)."),
            t("Для проверки используют панграммы, например «Съешь же ещё этих мягких французских булок да выпей чаю».", "Pangrams are used for testing, e.g. «Съешь же ещё этих мягких французских булок да выпей чаю».")
          ],
          sources: [R.skillboxCyrillic, R.gordon]
        },
        {
          kind: "web",
          title: t("Диакритические знаки и обрезка текста", "Diacritics and clipped text"),
          body: t("Диакритические знаки прописных Ё и Й выходят за линию прописных, а нижние выносные элементы — за базовую линию. При малом интерлиньяже в сочетании с overflow: hidden или фиксированной высотой элемента эти части знаков обрезаются. Особенно часто это происходит в кнопках, навигации и крупных заголовках с line-height около 1.", "The diacritics of the capitals Ё and Й extend above the cap height, and descenders go below the baseline. With tight line height combined with overflow: hidden or a fixed element height, these parts are clipped. This occurs most often in buttons, navigation and large headings with line-height around 1."),
          points: [
            t("Проверяйте компоненты на строках с прописными Ё, Й и строчными д, р, у, щ.", "Test components with strings containing capital Ё, Й and lowercase д, р, у, щ."),
            t("Для однострочных элементов предпочтительно задавать вертикальные внутренние отступы, а не фиксированную высоту.", "For single-line elements, prefer vertical padding to a fixed height.")
          ],
          code: t(".button {\n  line-height: 1.25;\n  padding-block: 0.6em;  /* вместо height: 40px */\n}", ".button {\n  line-height: 1.25;\n  padding-block: 0.6em;  /* instead of height: 40px */\n}"),
          demo: "clip",
          sources: [R.mdnLineHeight]
        },
        {
          kind: "web",
          title: t("Наличие кириллицы в файле шрифта", "Cyrillic coverage in the font file"),
          body: t("Если в файле веб-шрифта отсутствуют кириллические знаки, браузер подставляет каждый недостающий знак из следующего шрифта в списке font-family. В результате в одном слове смешиваются разные гарнитуры. Такая ситуация возникает при выборе шрифта без кириллицы или при подключении только латинского подмножества.", "If a web font file lacks Cyrillic glyphs, the browser substitutes each missing character from the next font in the font-family list. As a result, different typefaces are mixed within a single word. This happens when a font without Cyrillic is chosen or only the Latin subset is loaded."),
          points: [
            t("При выборе гарнитуры проверяйте поддержку языка (в каталоге Google Fonts — фильтр по языку или письменности).", "When choosing a typeface, check language support (in the Google Fonts catalogue, filter by language or writing system)."),
            t("Помимо букв, проверяйте наличие ё, кавычек «», длинного тире, знаков № и ₽.", "Besides letters, check for ё, guillemets «», the em dash, № and ₽.")
          ],
          demo: "fallbackmix",
          sources: [R.mdnFontFace, R.gfKnowledge]
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("В навигационном меню с line-height: 1 и overflow: hidden у слова «ЙОГУРТ» обрезается верхняя часть первой буквы. Какова причина?", "In a navigation menu with line-height: 1 and overflow: hidden, the top of the first letter of «ЙОГУРТ» is clipped. What is the cause?"),
            options: [t("Шрифт не содержит кириллицы, и знак берётся из резервного", "The font lacks Cyrillic, so the glyph comes from a fallback"), t("Знак над Й выходит за пределы строки высотой в один кегль", "The mark above Й extends beyond a one-em line box"), t("Не указан атрибут lang, и браузер неверно определяет язык", "The lang attribute is missing, so the language is misdetected")],
            answer: 1,
            explain: t("Знак над Й расположен выше линии прописных и не умещается в строку высотой 1em; overflow: hidden обрезает выступающую часть.", "The mark above Й sits above the cap height and does not fit into a 1em line box; overflow: hidden clips the protruding part.")
          }
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("Почему при line-height: normal высота строки у разных шрифтов с одинаковым кеглем различается?", "Why does line-height: normal produce different line heights for fonts of the same size?"),
            options: [t("Значение normal берётся из вертикальных метрик файла шрифта", "normal comes from the vertical metrics in the font file"), t("Браузер всегда применяет к кеглю коэффициент 1.2 без исключений", "The browser always applies a fixed factor of 1.2 to the size"), t("Высота строки зависит от ширины контейнера и длины абзаца", "Line height depends on container width and paragraph length")],
            answer: 0,
            explain: t("Значение normal определяется метриками конкретного шрифта (восхождение, нисхождение, межстрочный зазор), поэтому оно непредсказуемо при смене гарнитуры. Интерлиньяж следует задавать явно.", "normal depends on the metrics of the specific font (ascent, descent, line gap) and is unpredictable when the typeface changes. Line height should be set explicitly.")
          }
        }
      ],
      cheatsheet: [
        t("Основные линии: базовая, строчных (x-height), прописных (cap height), верхних и нижних выносных элементов.", "Main lines: baseline, x-height, cap height, ascender and descender lines."),
        t("font-size задаёт высоту кегельной площадки (em), а не знаков: при смене гарнитуры кегль требует корректировки.", "font-size sets the em box, not the letters: adjust the size when changing typefaces."),
        t("line-height: normal зависит от метрик шрифта; интерлиньяж задаётся явно.", "line-height: normal depends on font metrics; set line height explicitly."),
        t("Увеличенная высота строчных и открытая апертура повышают различимость при малом кегле.", "A large x-height and open aperture improve legibility at small sizes."),
        t("Высококонтрастные антиквы — преимущественно для крупного кегля; учитывайте плотность пикселей экрана.", "High-contrast serifs suit large sizes; account for screen pixel density."),
        t("font-size-adjust выравнивает видимый размер основного и резервного шрифтов (Baseline 2024).", "font-size-adjust aligns the apparent size of primary and fallback fonts (Baseline 2024)."),
        t("Для вариативных шрифтов с осью opsz используется font-optical-sizing: auto (значение по умолчанию).", "Variable fonts with an opsz axis use font-optical-sizing: auto (the default)."),
        t("Строчная кириллица беднее выносными элементами; качество кириллицы проверяется отдельно (Л, Д, б, Ф).", "Lowercase Cyrillic has fewer ascenders and descenders; check Cyrillic quality separately (Л, Д, б, Ф)."),
        t("Компоненты проверяются на строках с Ё, Й, д, р, у, щ; вместо фиксированной высоты — внутренние отступы.", "Test components with Ё, Й, д, р, у, щ; use padding instead of fixed heights."),
        t("Наличие кириллицы, ё, «», —, №, ₽ в файле шрифта проверяется до утверждения гарнитуры.", "Verify Cyrillic, ё, «», —, № and ₽ in the font file before approving a typeface.")
      ],
      readings: [R.gordon, R.skillboxCyrillic, R.bringhurst, R.vcAnatomy, R.gfXHeight, R.gfCapHeight, R.gfCounter, R.gfAperture, R.gfContrast, R.gfEm, R.mdnFontSizeAdjust, R.mdnOpticalSizing, R.mdnLineHeight]
    },
    {
      id: "classes", minutes: 55,
      title: t("Классификация шрифтов", "Type classification"),
      goal: t("Различать классы шрифтов, их стилистические и функциональные характеристики и область применения в интерфейсах.", "Distinguish type classes, their stylistic and functional characteristics, and their use in interfaces."),
      topics: [],
      cards: [
        {
          kind: "try", demo: "specimen",
          title: t("Одна фраза — разные классы", "One sentence, different classes"),
          body: t("Прочтите одну и ту же фразу, набранную двенадцатью гарнитурами. Сформулируйте, какую стилистическую тональность — официальную, нейтральную, техническую, неформальную — передаёт каждый образец, а затем откройте классификацию.", "Read the same sentence set in twelve typefaces. Describe the stylistic tone each sample conveys — formal, neutral, technical, informal — and then reveal the classification.")
        },
        {
          kind: "idea",
          title: t("Принципы классификации", "Principles of classification"),
          figure: "classtree",
          body: t("Классификации шрифтов основываются на совокупности формальных признаков и историческом происхождении гарнитур. Ни одна из существующих систем не является исчерпывающей: многие современные шрифты сочетают признаки нескольких групп.", "Type classifications rest on a combination of formal features and the historical origin of typefaces. No existing system is exhaustive: many contemporary typefaces combine features of several groups."),
          points: [
            t("Основные признаки: наличие и форма засечек, степень контраста, наклон оси контраста, пропорции и характер апертуры.", "Main features: presence and form of serifs, degree of contrast, inclination of the contrast axis, proportions and aperture."),
            t("Классификация Vox-ATypI (принята в 1962 году) выделяет классические, современные и каллиграфические группы; в 2021 году ATypI отказалась от неё и приступила к разработке новой системы, охватывающей разные письменности.", "The Vox-ATypI classification (adopted in 1962) distinguishes classical, modern and calligraphic groups; in 2021 ATypI de-adopted it and began work on a new system covering different scripts."),
            t("В отечественной полиграфии применялась группировка шрифтов по ГОСТ 3489.1-71, основанная на наличии и форме засечек и контрасте.", "Soviet and Russian printing used the grouping defined in GOST 3489.1-71, based on serif presence and form and on contrast."),
            t("В веб-практике используется укрупнённая схема каталогов шрифтов: антиква, гротеск, моноширинные, акцидентные и рукописные шрифты; в этом курсе брусковые шрифты выделены в отдельный класс.", "Web practice uses the broad scheme of font catalogues: serif, sans serif, monospace, display and handwriting; this course treats slab serifs as a separate class.")
          ],
          sources: [R.voxWiki, R.localfontsClass]
        },
        {
          kind: "idea",
          title: t("Антиква: исторические группы", "Serif: historical groups"),
          body: t("Антиквой называют шрифты с засечками, восходящие к ренессансному римскому письму. Её исторические группы различаются прежде всего контрастом, осью контраста и формой засечек.", "Serif typefaces descend from Renaissance roman letterforms. Their historical groups differ primarily in contrast, axis of contrast and serif shape."),
          points: [
            t("Антиква старого стиля (XV–XVII вв.): умеренный контраст, наклонная ось, скошенные засечки с плавным переходом к штриху. Пример — Garamond (EB Garamond).", "Old-style (15th–17th c.): moderate contrast, inclined axis, bracketed angled serifs. Example: Garamond (EB Garamond)."),
            t("Переходная антиква (XVIII в.): более высокий контраст, ось, близкая к вертикальной, более горизонтальные засечки. Примеры — Baskerville, Times; PT Serif, Source Serif.", "Transitional (18th c.): higher contrast, near-vertical axis, flatter serifs. Examples: Baskerville, Times; PT Serif, Source Serif."),
            t("Классицистическая (новая) антиква, дидоны (конец XVIII — XIX в.): высокий контраст, вертикальная ось, тонкие горизонтальные засечки без переходов. Примеры — Bodoni, Didot; Playfair Display.", "Didone (late 18th–19th c.): high contrast, vertical axis, thin unbracketed horizontal serifs. Examples: Bodoni, Didot; Playfair Display."),
            t("Современные текстовые антиквы, в том числе экранные: умеренный контраст, увеличенная высота строчных, прочные засечки. Примеры — Merriweather, Literata.", "Contemporary text serifs, including screen serifs: moderate contrast, large x-height, sturdy serifs. Examples: Merriweather, Literata.")
          ],
          demo: "contrastaxis",
          sources: [R.voxWiki, R.gfSerif, R.bringhurst]
        },
        {
          kind: "web",
          title: t("Антиква на экране", "Serif type on screen"),
          body: t("С распространением экранов высокой плотности антиква стала полноценным решением для основного текста на сайтах, прежде всего в изданиях и лонгридах. Вместе с тем выбор подгруппы определяется кеглем и условиями отображения.", "With the spread of high-density screens, serif type has become a viable choice for body text on websites, particularly in publications and long reads. The choice of subgroup, however, depends on size and display conditions."),
          points: [
            t("Для основного текста предпочтительны современные текстовые антиквы с умеренным контрастом и увеличенной высотой строчных.", "For body text, prefer contemporary text serifs with moderate contrast and a large x-height."),
            t("Дидоны и иные высококонтрастные антиквы применяются в заголовках крупного кегля; в мелком кегле тонкие штрихи теряют чёткость.", "Didones and other high-contrast serifs belong in large headings; at small sizes their hairlines lose definition."),
            t("Если в гарнитуре есть ось оптического размера (opsz), браузер адаптирует контраст к кеглю автоматически.", "If the typeface has an optical size axis (opsz), the browser adapts contrast to the size automatically.")
          ],
          sources: [R.mdnOpticalSizing, R.gfSerif]
        },
        {
          kind: "idea",
          title: t("Брусковые шрифты", "Slab serifs"),
          body: t("Брусковые шрифты (slab serif, в классификации Vox-ATypI — механистические) имеют прямоугольные засечки, по толщине близкие к основным штрихам, и низкий контраст. Они возникли в XIX веке как шрифты для рекламы и плакатов.", "Slab serifs (mechanistic in the Vox-ATypI classification) have rectangular serifs close in weight to the main strokes and low contrast. They emerged in the 19th century for advertising and posters."),
          points: [
            t("Благодаря низкому контрасту и массивным засечкам устойчивы к неблагоприятным условиям отображения.", "Low contrast and heavy serifs make them robust under poor display conditions."),
            t("Применяются в заголовках, навигации, а также в основном тексте при наличии текстовых вариантов (например, Bitter, разработанный для чтения с экрана).", "They are used in headings and navigation, and in body text when text versions exist (e.g. Bitter, designed for on-screen reading)."),
            t("Создают «технический», «редакционный» или «плакатный» характер в зависимости от пропорций.", "Depending on proportions, they convey a technical, editorial or poster-like character.")
          ],
          sources: [R.voxWiki]
        },
        {
          kind: "idea",
          title: t("Гротески: подгруппы", "Sans serif: subgroups"),
          figure: "grotesques",
          body: t("Гротески (рубленые шрифты, sans serif) лишены засечек; как правило, они имеют низкий контраст и увеличенную высоту строчных. Подгруппы различаются пропорциями, формой овалов и апертурой.", "Sans serif typefaces lack serifs; they typically have low contrast and a large x-height. Subgroups differ in proportions, oval shapes and aperture."),
          points: [
            t("Старые гротески (XIX — начало XX в.): некоторая неравномерность рисунка, лёгкий контраст. Пример узкого гротеска — Oswald.", "Grotesques (19th–early 20th c.): some irregularity of design and slight contrast. A condensed example: Oswald."),
            t("Неогротески (с середины XX в.): нейтральность, единообразие, закрытая апертура. Примеры — Helvetica, Arial; Inter, Roboto, Golos.", "Neo-grotesques (from the mid-20th c.): neutrality, uniformity, closed aperture. Examples: Helvetica, Arial; Inter, Roboto, Golos."),
            t("Гуманистические гротески: пропорции, близкие к антикве, открытая апертура, лёгкая модуляция штриха; хорошо читаются в мелком кегле. Примеры — Frutiger, Gill Sans; PT Sans, Open Sans, Fira Sans.", "Humanist sans: proportions close to serif type, open aperture, slight stroke modulation; highly legible at small sizes. Examples: Frutiger, Gill Sans; PT Sans, Open Sans, Fira Sans."),
            t("Геометрические гротески: формы построены на окружности и прямоугольнике. Примеры — Futura; Montserrat, Jost. Выразительны в заголовках, но в длинном тексте читаются хуже гуманистических.", "Geometric sans: forms built on the circle and rectangle. Examples: Futura; Montserrat, Jost. Expressive in headings but less readable than humanist sans in long text.")
          ],
          sources: [R.gfSansSerif, R.voxWiki]
        },
        {
          kind: "task", demo: "guess",
          title: t("Определите класс шрифта", "Identify the type class"),
          body: t("Определите класс шрифта по образцу. Гарнитуры выбираются случайным образом из каталога курса (59 шрифтов), поэтому при повторном прохождении набор будет другим.", "Identify the class of each sample. Typefaces are drawn at random from the course catalogue (59 fonts), so each attempt brings a different set.")
        },
        {
          kind: "task",
          title: t("Определите подгруппу шрифта", "Identify the subgroup"),
          body: t("Для шести случайно выбранных шрифтов укажите историко-стилистическую подгруппу.", "Name the historical and stylistic subgroup of six randomly chosen typefaces."),
          demo: "tSubclass"
        },
        {
          kind: "web",
          title: t("Родовые семейства CSS", "CSS generic font families"),
          body: t("Список font-family должен завершаться родовым семейством: оно определяет, каким шрифтом браузер отобразит текст, если ни одна из указанных гарнитур недоступна. Родовые семейства соответствуют основным классам шрифтов.", "A font-family list must end with a generic family: it determines how the browser renders text if none of the listed typefaces is available. Generic families correspond to the main type classes."),
          points: [
            t("serif, sans-serif, monospace, cursive, fantasy — классические родовые семейства; cursive и fantasy дают непредсказуемый результат и в интерфейсах практически не используются.", "serif, sans-serif, monospace, cursive and fantasy are the classic generics; cursive and fantasy are unpredictable and rarely used in interfaces."),
            t("system-ui, ui-serif, ui-sans-serif, ui-monospace, ui-rounded — системные шрифты платформы; поддержка ключевых слов ui-* различается в браузерах.", "system-ui, ui-serif, ui-sans-serif, ui-monospace and ui-rounded map to platform fonts; support for the ui-* keywords varies across browsers."),
            t("Резервные шрифты в списке подбираются того же класса, что и основной.", "Fallback fonts in the list should belong to the same class as the primary font.")
          ],
          code: "body { font-family: \"PT Serif\", Georgia, \"Times New Roman\", serif; }\ncode { font-family: \"JetBrains Mono\", ui-monospace, Consolas, monospace; }",
          demo: "stacks",
          sources: [R.mdnFontFamily]
        },
        {
          kind: "web",
          title: t("Системные шрифты", "System fonts"),
          body: t("Системный шрифт не требует загрузки и привычен пользователю платформы, однако его рисунок различается в разных операционных системах, а качество кириллицы зависит от конкретной платформы. По рекомендации MDN, system-ui предназначен для элементов интерфейса, а не для набора протяжённых текстов.", "A system font needs no download and is familiar to platform users, but its design differs across operating systems, and Cyrillic quality depends on the platform. As MDN notes, system-ui is intended for interface elements rather than long text."),
          points: [
            t("Системные наборы шрифтов можно подбирать по классу (переходная антиква, гуманистический гротеск, неогротеск и др.) — без загрузки веб-шрифтов.", "System font stacks can be chosen by class (transitional serif, humanist sans, neo-grotesque, etc.) without loading web fonts."),
            t("Для длинных текстов предпочтительно указывать sans-serif или serif, настройку которых пользователь может изменить в браузере.", "For long texts prefer sans-serif or serif, which users can customise in the browser.")
          ],
          code: t("/* интерфейс */\n.app { font-family: system-ui, sans-serif; }\n/* статья */\n.article { font-family: Charter, \"Bitstream Charter\", \"Sitka Text\", Cambria, serif; }", "/* interface */\n.app { font-family: system-ui, sans-serif; }\n/* article */\n.article { font-family: Charter, \"Bitstream Charter\", \"Sitka Text\", Cambria, serif; }"),
          sources: [R.mdnFontFamily, R.modernStacks]
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("Задано font-family: \"Inter\". Файл шрифта не загрузился, а в системе Inter не установлен. Каким шрифтом будет отображён текст?", "font-family: \"Inter\" is set. The font file fails to load and Inter is not installed. How will the text be rendered?"),
            options: [t("Ближайшим по рисунку гротеском из числа установленных в системе", "The most similar sans installed on the system"), t("Шрифтом по умолчанию из настроек браузера, обычно антиквой", "The browser's default font, usually a serif"), t("Никаким: текст останется невидимым до загрузки файла", "None: the text stays invisible until the file loads")],
            answer: 1,
            explain: t("Браузер не подбирает шрифт по сходству рисунка. Без родового семейства он использует шрифт по умолчанию, обычно антикву. Поэтому список следует завершать ключевым словом sans-serif.", "Browsers do not match fonts by design. Without a generic family they use the default font, usually a serif. The list should therefore end with sans-serif.")
          }
        },
        {
          kind: "task",
          title: t("Составьте список font-family", "Compose a font-family list"),
          body: t("Для трёх задач составьте список шрифтов с резервными вариантами и родовым семейством. Проверка оценивает класс резервных шрифтов и завершение списка.", "For three tasks compose a font list with fallbacks and a generic family. The check assesses the fallback class and the end of the list."),
          demo: "tStack"
        },
        {
          kind: "idea",
          title: t("Моноширинные шрифты и табличные цифры", "Monospaced fonts and tabular figures"),
          body: t("В моноширинных шрифтах все знаки имеют одинаковую ширину. Это обеспечивает вертикальное выравнивание символов, что необходимо для программного кода, но снижает удобочитаемость сплошного текста.", "In monospaced fonts every character has the same width. This ensures vertical alignment of characters, essential for code, but reduces the readability of continuous text."),
          points: [
            t("Области применения: фрагменты кода, технические идентификаторы, терминальный вывод, иногда — стилистический акцент в заголовках.", "Uses: code snippets, technical identifiers, terminal output, occasionally a stylistic accent in headings."),
            t("Для выравнивания цифр в таблицах и интерфейсах не требуется моноширинный шрифт: достаточно включить табличные цифры свойством font-variant-numeric: tabular-nums, если они предусмотрены в гарнитуре.", "Aligning figures in tables and interfaces does not require a monospaced font: enable tabular figures with font-variant-numeric: tabular-nums if the typeface provides them.")
          ],
          code: "td.amount, .price, .timer {\n  font-variant-numeric: tabular-nums;\n}",
          demo: "tabular",
          sources: [R.mdnNumeric]
        },
        {
          kind: "idea",
          title: t("Акцидентные и рукописные шрифты", "Display and script typefaces"),
          body: t("Акцидентные шрифты предназначены для заголовков, логотипов, афиш и коротких надписей; рукописные имитируют письмо пером, кистью или маркером. Их задача — выразительность, а не удобочитаемость протяжённого текста.", "Display typefaces are intended for headlines, logos, posters and short texts; script typefaces imitate writing with a pen, brush or marker. Their purpose is expressiveness rather than readability of long text."),
          points: [
            t("Применяются в крупном кегле и в ограниченном объёме: заголовки, акценты, элементы фирменного стиля.", "Use them at large sizes and sparingly: headings, accents, brand elements."),
            t("Часто имеют одно начертание и неполный набор знаков; кириллица нередко проработана слабее латиницы — проверку следует проводить на реальном тексте.", "They often come in one style with an incomplete character set; Cyrillic is frequently weaker than Latin, so test with real copy."),
            t("Текст, набранный прописными рукописного шрифта, читается особенно плохо.", "Script typefaces set in all capitals are particularly hard to read.")
          ],
          sources: [R.skillboxCyrillic, R.meduza]
        },
        {
          kind: "web",
          title: t("Класс шрифта и жанр ресурса", "Type class and the genre of a website"),
          body: t("Выбор класса шрифта определяется функцией текста и жанром ресурса. Типовые решения не являются обязательными, но отражают сложившиеся ожидания пользователей.", "The choice of type class follows the function of the text and the genre of the website. Typical solutions are not mandatory but reflect established user expectations."),
          points: [
            t("Онлайн-издания и лонгриды: антиква для основного текста, гротеск для навигации и служебных элементов.", "Online publications and long reads: serif for body text, sans for navigation and UI elements."),
            t("Цифровые сервисы и приложения: неогротеск или гуманистический гротеск, табличные цифры для финансовых данных.", "Digital services and apps: neo-grotesque or humanist sans, tabular figures for financial data."),
            t("Государственные и справочные порталы: нейтральный гротеск высокой удобочитаемости, минимум начертаний.", "Government and reference portals: a neutral, highly legible sans with few styles."),
            t("Проекты для детей и сферы досуга: округлые геометрические гротески, рукописные шрифты как акцент.", "Children's and leisure projects: rounded geometric sans, script faces as accents.")
          ],
          sources: [R.meduza, R.butterick]
        },
        {
          kind: "check",
          title: t("Контроль: класс шрифта и задача", "Review: type class and task"),
          match: {
            q: t("Сопоставьте задачи и типографические решения.", "Match the tasks to the typographic solutions."),
            pairs: [
              { term: t("Антиква для основного текста, гротеск для навигации", "Serif for body text, sans for navigation"), def: t("Лонгрид онлайн-издания", "A long read in an online publication") },
              { term: t("Неогротеск с табличными цифрами", "Neo-grotesque with tabular figures"), def: t("Интерфейс банковского приложения", "A banking app interface") },
              { term: t("Гротеск для текста, моноширинный шрифт для кода", "Sans for text, monospace for code"), def: t("Документация для разработчиков", "Developer documentation") },
              { term: t("Округлый геометрический гротеск с рукописными акцентами", "Rounded geometric sans with script accents"), def: t("Сайт детской творческой студии", "A children's art studio website") },
              { term: t("Акцидентный шрифт в заголовках, нейтральный гротеск в тексте", "Display face for headings, neutral sans for text"), def: t("Промостраница музыкального фестиваля", "A music festival landing page") }
            ]
          }
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("Какой подгруппе гротесков соответствуют пропорции, близкие к антикве, открытая апертура и лёгкая модуляция штриха?", "Which sans subgroup has proportions close to serif type, open aperture and slight stroke modulation?"),
            options: [t("Неогротески швейцарской школы", "Swiss-school neo-grotesques"), t("Геометрические гротески", "Geometric sans"), t("Гуманистические гротески", "Humanist sans")],
            answer: 2,
            explain: t("Гуманистические гротески наследуют пропорции ренессансной антиквы; открытая апертура обеспечивает их хорошую различимость в мелком кегле.", "Humanist sans inherit Renaissance serif proportions; their open aperture makes them highly legible at small sizes.")
          }
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("Какой набор признаков характерен для классицистической антиквы (дидоны)?", "Which set of features characterises didone serifs?"),
            options: [t("Наклонная ось контраста, умеренный контраст, засечки со скруглёнными переходами", "Inclined axis, moderate contrast, bracketed serifs with smooth transitions"), t("Вертикальная ось контраста, высокий контраст, тонкие горизонтальные засечки", "Vertical axis, high contrast, thin horizontal serifs"), t("Низкий контраст, массивные прямоугольные засечки толщиной с основной штрих", "Low contrast, heavy rectangular serifs as thick as the stems")],
            answer: 1,
            explain: t("Наклонная ось контраста и скошенные засечки характерны для антиквы старого стиля, а низкий контраст и прямоугольные засечки — для брусковых шрифтов.", "An inclined axis and angled bracketed serifs characterise old-style serifs, while low contrast and rectangular serifs characterise slab serifs.")
          }
        }
      ],
      cheatsheet: [
        t("Классификация опирается на засечки, контраст, ось контраста, пропорции и апертуру; многие шрифты сочетают признаки нескольких групп.", "Classification relies on serifs, contrast, contrast axis, proportions and aperture; many typefaces combine features of several groups."),
        t("Антиква: старого стиля (наклонная ось), переходная, классицистическая (вертикальная ось, высокий контраст), современная текстовая.", "Serif: old-style (inclined axis), transitional, didone (vertical axis, high contrast), contemporary text."),
        t("Дидоны и высококонтрастные антиквы — для крупного кегля; для текста на экране — антиквы с умеренным контрастом.", "Didones and high-contrast serifs suit large sizes; on screen, use moderate-contrast serifs for text."),
        t("Брусковые: прямоугольные засечки, низкий контраст, устойчивость к условиям отображения.", "Slab serifs: rectangular serifs, low contrast, robust rendering."),
        t("Гротески: старые, неогротески (нейтральность, закрытая апертура), гуманистические (открытая апертура), геометрические (окружность и прямоугольник).", "Sans: grotesque, neo-grotesque (neutral, closed aperture), humanist (open aperture), geometric (circle and rectangle)."),
        t("Список font-family завершается родовым семейством того же класса.", "End every font-family list with a generic family of the same class."),
        t("system-ui — для интерфейса, не для протяжённых текстов.", "system-ui is for interfaces, not for long text."),
        t("Для выравнивания цифр — font-variant-numeric: tabular-nums, а не моноширинный шрифт.", "Align figures with font-variant-numeric: tabular-nums rather than a monospaced font."),
        t("Акцидентные и рукописные шрифты — только в крупном кегле и в ограниченном объёме; кириллицу проверять отдельно.", "Display and script faces only at large sizes and sparingly; check Cyrillic separately.")
      ],
      readings: [R.voxWiki, R.localfontsClass, R.bringhurst, R.gfSerif, R.gfSansSerif, R.mdnFontFamily, R.modernStacks, R.mdnNumeric, R.meduza, R.skillboxCyrillic]
    },
    {
      id: "character", minutes: 55,
      title: t("Характер шрифта", "Typeface character"),
      goal: t("Оценивать характер шрифта и выбирать степень его выразительности в соответствии с задачей, объёмом текста и средой чтения.", "Assess typeface character and choose its degree of expressiveness to suit the task, the amount of text and the reading environment."),
      topics: [t("Нейтральность и выразительность", "Neutrality and expressiveness"), t("Круг шрифтов: жанр и степень выразительности", "The type wheel: genre and expressiveness"), t("Привычность и удобочитаемость", "Familiarity and readability"), t("Оптика, логика, традиция", "Optics, logic, tradition"), t("Характер в интерфейсе", "Character in interfaces")],
      cards: [
        {
          kind: "try",
          title: t("Один текст — разные голоса", "One text, different voices"),
          body: t("Введите короткую фразу и сравните, как меняется её восприятие в восьми гарнитурах. Сформулируйте для каждого образца два-три определения: строгий, дружелюбный, праздничный, технологичный, архаичный. Затем отметьте флажок и сравните свои определения с характеристикой каждого шрифта и степенью выраженности его характера.", "Enter a short phrase and compare how its perception changes across eight typefaces. Give each sample two or three adjectives: strict, friendly, festive, technical, archaic. Then tick the box and compare your adjectives with each typeface's character and how strongly it is expressed."),
          demo: "voices"
        },
        {
          kind: "idea",
          title: t("Нейтральность и выразительность", "Neutrality and expressiveness"),
          figure: "neutrality",
          body: t("Характер шрифта — совокупность ассоциаций, которые форма знаков вызывает у читателя. А. Королькова предлагает располагать шрифты на шкале между двумя полюсами: шрифтами для передачи информации, не отвлекающими от содержания, и шрифтами с сильным эмоциональным зарядом. Выбирая положение на шкале, дизайнер распределяет внимание читателя между смыслом текста и его эмоциональной окраской.", "Typeface character is the set of associations that letterforms evoke in the reader. Alexandra Korolkova proposes placing typefaces on a scale between two poles: faces that convey information without distracting from the content, and faces with a strong emotional charge. By choosing a position on the scale, the designer distributes the reader's attention between the meaning of the text and its emotional colouring."),
          points: [
            t("Чем больше объём текста, тем ближе к нейтральному полюсу должен быть шрифт.", "The more text there is, the closer to the neutral pole the typeface should be."),
            t("Выразительный шрифт оправдан там, где эмоция входит в сообщение: в заголовке промостраницы, логотипе, афише.", "An expressive face is justified where emotion is part of the message: a promo headline, a logo, a poster."),
            t("Исследования показывают, что читатели воспринимают «персону» шрифта и соотносят её с содержанием текста; несоответствие влияет на восприятие текста (Brumberger, 2003).", "Research shows that readers perceive a typeface's persona and relate it to the content; a mismatch affects how the text is perceived (Brumberger, 2003).")
          ],
          sources: [R.vcKorolkova, R.brumberger]
        },
        {
          kind: "idea",
          title: t("Круг шрифтов: жанр и степень выразительности", "The type wheel: genre and expressiveness"),
          figure: "wheel",
          body: t("Шкалу нейтральности удобно развернуть в круг. В центре находятся текстовые шрифты: их характер приглушён, и разные гарнитуры этой зоны близки по впечатлению. Далее располагаются регулярные шрифты для заголовков и коротких текстов. На периферии — акцидентные шрифты с ярко выраженным характером. Направление от центра задаёт жанр: антиквы, брусковые, гротески, концептуально-логические шрифты, имитации, рукописные, исторические почерки, каллиграфические.", "The neutrality scale can be unfolded into a wheel. Text faces sit at the centre: their character is muted, and different typefaces in this zone make a similar impression. Next come regular faces for headings and short texts. Display faces with a strong character occupy the edge. The direction from the centre sets the genre: serif, slab serif, sans serif, conceptual and logical, imitations, handwritten, historical scripts, calligraphic."),
          points: [
            t("Удалённость от центра определяет допустимый объём текста и минимальный кегль.", "Distance from the centre determines the acceptable amount of text and the minimum size."),
            t("Жанр определяет ассоциации: книжная традиция, техника, рукотворность, история.", "Genre determines associations: book tradition, technology, handcraft, history."),
            t("Классификация по характеру дополняет формальную классификацию модуля 2, а не заменяет её.", "Classification by character complements the formal classification of Module 2 rather than replacing it.")
          ],
          sources: [R.vcKorolkova]
        },
        {
          kind: "try",
          title: t("Практикум: шрифты каталога на круге", "Practice: the course typefaces on the wheel"),
          body: t("Выберите точки в разных зонах круга и сравните образцы. Обратите внимание, что у центра различия между жанрами сглаживаются, а на периферии усиливаются. Найдите шрифты, положение которых вы бы оспорили, и сформулируйте аргументы.", "Select points in different zones of the wheel and compare the specimens. Notice that genre differences fade near the centre and grow towards the edge. Find typefaces whose position you would dispute and formulate your arguments."),
          demo: "charwheel"
        },
        {
          kind: "task",
          title: t("Определите зону круга", "Assign the wheel zone"),
          body: t("Отнесите шесть шрифтов к текстовым, регулярным или акцидентным.", "Assign six typefaces to the text, regular or display zone."),
          demo: "tZones"
        },
        {
          kind: "idea",
          title: t("Лучше всего читается привычное", "We read best what is familiar"),
          body: t("Удобочитаемость определяется не только объективными свойствами формы знаков, но и опытом читателя. Зузана Личко сформулировала это так: «Люди читают лучше всего то, что они читают чаще всего». Готический шрифт, трудный для современного читателя, был привычным для немецкого читателя начала XX века. Поэтому текстовые шрифты консервативны: новаторство в них ограничено деталями, а эксперименты с формой уместны в акцидентном наборе.", "Readability depends not only on the objective properties of letterforms but also on the reader's experience. Zuzana Licko put it this way: “People read best what we read most.” Blackletter, difficult for today's readers, was familiar to German readers in the early twentieth century. This is why text faces are conservative: innovation is limited to details, while experiments with form belong to display setting."),
          points: [
            t("Для основного текста выбирайте гарнитуры с привычными пропорциями и формами знаков.", "For body text choose typefaces with familiar proportions and letterforms."),
            t("Непривычная форма замедляет чтение, но привлекает внимание: это допустимо в заголовке, а не в абзаце.", "Unfamiliar forms slow reading but attract attention: acceptable in a headline, not in a paragraph."),
            t("Привычность зависит от аудитории: моноширинный шрифт привычен разработчику, но не широкому читателю.", "Familiarity depends on the audience: a monospaced face is familiar to developers but not to the general reader.")
          ],
          sources: [R.emigreLicko, R.korolkovaBook]
        },
        {
          kind: "try",
          title: t("Практикум: привычная и непривычная форма", "Practice: familiar and unfamiliar forms"),
          body: t("Прочитайте два текста и сравните скорость чтения. Повторите упражнение с другой акцидентной гарнитурой.", "Read the two texts and compare reading speed. Repeat with another display typeface."),
          demo: "familiar"
        },
        {
          kind: "idea",
          title: t("Оптика, логика, традиция", "Optics, logic, tradition"),
          figure: "factors",
          body: t("Форма шрифтового знака складывается под действием трёх факторов. Их анализ позволяет объяснить характер шрифта, а не только описать его.", "The form of a letter is shaped by three factors. Analysing them makes it possible to explain a typeface's character rather than merely describe it."),
          points: [
            t("Оптика: форма корректируется с учётом особенностей зрительного восприятия — нависания округлых знаков, утончения штрихов в местах соединений, компенсации горизонталей.", "Optics: form is corrected for visual perception — overshoot of round letters, thinning of strokes at joins, compensation of horizontals."),
            t("Логика: все знаки подчинены единому принципу построения — следу инструмента (пера, кисти) или конструктивному правилу (модулю, геометрии).", "Logic: all letters follow a single construction principle — the trace of a tool (pen, brush) or a constructive rule (module, geometry)."),
            t("Традиция: форма опирается на исторически сложившийся образ знаков и привычки читателя; для кириллицы это отдельная традиция, а не перерисованная латиница.", "Tradition: form rests on the historically established image of letters and on reading habits; Cyrillic has its own tradition and is not redrawn Latin.")
          ],
          sources: [R.noordzij, R.skillboxCyrillic]
        },
        {
          kind: "try",
          title: t("Практикум: оптическая компенсация", "Practice: optical compensation"),
          body: t("Определите, в каком из двух вариантов фигуры выглядят одинаковыми по высоте. Затем включите направляющие и проверьте свой ответ.", "Decide in which of the two versions the shapes look equal in height. Then switch on the guides and check your answer."),
          demo: "optics",
          sources: [R.gfOvershoot]
        },
        {
          kind: "idea",
          title: t("Логика инструмента и характер", "Tool logic and character"),
          figure: "tool",
          body: t("Г. Нордзей описывает контраст штриха как результат движения инструмента. Широконечное перо даёт трансляционный контраст с наклонной осью (антиква старого стиля), остроконечное перо с переменным нажимом — экспансионный контраст с вертикальной осью (классицистическая антиква). Поэтому ось и тип контраста, рассмотренные в модуле 2, — это не только признаки классификации, но и источник характера: живой и динамичный у антиквы старого стиля, торжественный и статичный у дидонов.", "Gerrit Noordzij describes stroke contrast as the result of the tool's movement. A broad-nib pen produces translation contrast with an inclined axis (old-style serif); a pointed pen with varying pressure produces expansion contrast with a vertical axis (didone). The axis and type of contrast covered in Module 2 are therefore not only classification features but also a source of character: lively and dynamic in old-style serifs, ceremonial and static in didones."),
          sources: [R.noordzij, R.gfContrast]
        },
        {
          kind: "web",
          title: t("Характер в интерфейсе", "Character in interfaces"),
          figure: "uiroles",
          body: t("В интерфейсе текст выполняет служебную функцию: подписи полей, кнопки, сообщения, таблицы. Пользователь решает задачу, а не читает, поэтому интерфейсный шрифт должен оставаться незаметным. Характер продукта передаётся через заголовки, крупные цифры, иллюстрации и тон текстов, тогда как основной набор интерфейса выполняется нейтральной гарнитурой из центра круга.", "In an interface, text performs a service function: field labels, buttons, messages, tables. Users perform tasks rather than read, so the interface typeface should stay unobtrusive. Product character is conveyed through headings, large figures, illustrations and tone of voice, while the bulk of the interface is set in a neutral typeface from the centre of the wheel."),
          points: [
            t("Интерфейсные гарнитуры (Inter, Golos, Onest, системные шрифты) рассчитаны на мелкий кегль и плотные экраны.", "Interface typefaces (Inter, Golos, Onest, system fonts) are designed for small sizes and dense screens."),
            t("Фирменный акцидентный шрифт ограничивают маркетинговыми страницами и крупными заголовками.", "A brand display face is limited to marketing pages and large headings."),
            t("Характер должен сохраняться при подмене: резервный шрифт в font-family выбирают того же жанра.", "Character must survive fallback: choose a fallback in font-family from the same genre.")
          ],
          code: t("/* нейтральный интерфейс, характер — в заголовках */\n:root {\n  --font-ui: \"Golos Text\", system-ui, sans-serif;\n  --font-display: \"Unbounded\", \"Arial Black\", sans-serif;\n}\nbody, button, input { font-family: var(--font-ui); }\n.hero-title { font-family: var(--font-display); }", "/* neutral interface, character in headings */\n:root {\n  --font-ui: \"Golos Text\", system-ui, sans-serif;\n  --font-display: \"Unbounded\", \"Arial Black\", sans-serif;\n}\nbody, button, input { font-family: var(--font-ui); }\n.hero-title { font-family: var(--font-display); }"),
          sources: [R.modernStacks, R.meduza]
        },
        {
          kind: "try",
          title: t("Характер и кегль на экране", "Character and size on screen"),
          body: t("Сравните, как проявляется характер шрифта в разных кеглях. Определите минимальный кегль, при котором особенности формы ещё различимы.", "Compare how the typeface's character shows at different sizes. Find the smallest size at which its features are still distinguishable."),
          demo: "sizechar"
        },
        {
          kind: "task",
          title: t("Голос для задачи", "A voice for the task"),
          body: t("Для каждой задачи выберите гарнитуру, характер и степень выразительности которой соответствуют содержанию и объёму текста.", "For each task choose the typeface whose character and degree of expressiveness suit the content and the amount of text."),
          demo: "brandvoice"
        },
        {
          kind: "check",
          title: t("Контроль: жанры круга", "Review: genres of the wheel"),
          match: {
            q: t("Сопоставьте описания с жанрами круга шрифтов.", "Match the descriptions to the genres of the type wheel."),
            pairs: [
              { term: t("Имитации", "Imitations"), def: t("Шрифт воспроизводит растр старых игровых приставок", "The typeface reproduces the pixel grid of early game consoles") },
              { term: t("Концептуально-логические", "Conceptual and logical"), def: t("Все знаки построены из окружностей и прямых одной толщины", "All letters are built from circles and straight lines of one weight") },
              { term: t("Исторические почерки", "Historical scripts"), def: t("Шрифт стилизует древнерусский устав", "The typeface stylises early Russian ustav script") },
              { term: t("Каллиграфические", "Calligraphic"), def: t("Форма и контраст заданы остроконечным пером с нажимом", "Form and contrast come from a pointed pen with pressure") },
              { term: t("Рукописные", "Handwritten"), def: t("Неровный ритм и форма, как при письме фломастером", "Uneven rhythm and form, as if written with a felt-tip pen") }
            ]
          }
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("Почему эксперименты с непривычной формой знаков уместны в заголовке промостраницы, но не в основном тексте статьи?", "Why are experiments with unfamiliar letterforms acceptable in a promo headline but not in article body text?"),
            options: [t("Непривычная форма замедляет чтение: в коротком заголовке это допустимо", "Unfamiliar forms slow reading, which is acceptable in a short headline"), t("Акцидентные шрифты не содержат кириллицы для мелкого кегля и длинных абзацев", "Display faces lack Cyrillic for small sizes and paragraphs"), t("Браузеры ограничивают применение акцидентных шрифтов в элементе <p>", "Browsers restrict display faces inside the <p> element")],
            answer: 0,
            explain: t("Удобочитаемость зависит от привычности формы. Замедление допустимо, когда текст короток и цель — привлечь внимание.", "Readability depends on familiarity. Slowing the reader down is acceptable when the text is short and the goal is to attract attention.")
          }
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("Какой фактор объясняет, почему буква О выходит за линию прописных и базовую линию?", "Which factor explains why the letter O extends beyond the cap height and baseline?"),
            options: [t("Традиция", "Tradition"), t("Логика инструмента", "Tool logic"), t("Оптика", "Optics")],
            answer: 2,
            explain: t("Округлая форма касается направляющей в одной точке и при равной геометрической высоте выглядит меньше; нависание компенсирует эту иллюзию.", "A round form touches the guide at a single point and looks smaller at equal geometric height; overshoot compensates for this illusion.")
          }
        }
      ],
      cheatsheet: [
        t("Характер шрифта — ассоциации, которые вызывает форма знаков; его выбирают так же осознанно, как кегль и интерлиньяж.", "Typeface character is the associations evoked by letterforms; choose it as deliberately as size and line height."),
        t("Шкала нейтральности: чем больше текста, тем ближе к нейтральному полюсу шрифт.", "Neutrality scale: the more text, the closer to the neutral pole."),
        t("Круг шрифтов: центр — текстовые, далее регулярные, периферия — акцидентные; направление задаёт жанр.", "Type wheel: centre — text faces, then regular, edge — display; direction sets the genre."),
        t("Лучше всего читается привычное: эксперименты с формой — в заголовках, не в основном тексте.", "We read best what is familiar: experiment with form in headings, not in body text."),
        t("Форму знака объясняют оптика, логика построения и традиция.", "Letterforms are explained by optics, construction logic and tradition."),
        t("Тип и ось контраста отражают инструмент и во многом определяют характер антиквы.", "Contrast type and axis reflect the tool and largely determine a serif's character."),
        t("В интерфейсе основной набор нейтрален; характер продукта — в заголовках, цифрах, тоне текстов.", "In interfaces the bulk of text is neutral; product character lives in headings, figures and tone of voice."),
        t("Характер проверяется в реальном кегле и с резервным шрифтом того же жанра.", "Check character at the real size and with a fallback of the same genre.")
      ],
      readings: [R.vcKorolkova, R.korolkovaBook, R.emigreLicko, R.brumberger, R.noordzij, R.gfOvershoot, R.meduza, R.skillboxCyrillic]
    },
    {
      id: "weights", minutes: 50,
      title: t("Начертание и насыщенность", "Styles and weights"),
      goal: t("Выбирать начертания для выделения и построения иерархии с учётом их технической реализации и производительности страницы.", "Choose styles for emphasis and hierarchy with regard to their technical implementation and page performance."),
      topics: [],
      cards: [
        {
          kind: "try", demo: "weightscale",
          title: t("Шкала насыщенности", "The weight scale"),
          body: t("Выберите гарнитуру и сравните девять значений насыщенности. Обратите внимание, что диапазон доступных значений у шрифтов различается, а значения за его пределами отображаются ближайшим доступным начертанием.", "Select a typeface and compare the nine weight values. Note that the available range differs between fonts, and values outside it are rendered with the nearest available weight.")
        },
        {
          kind: "idea",
          title: t("Гарнитура, семейство, начертание", "Typeface, family, style"),
          figure: "family",
          body: t("Гарнитура — совокупность шрифтов, объединённых общим рисунком. Начертание — вариант гарнитуры, различающийся насыщенностью, наклоном или шириной. Набор начертаний одной гарнитуры образует семейство; в CSS он объединяется общим значением font-family.", "A typeface is a set of fonts sharing a common design. A style is a variant of the typeface differing in weight, slope or width. All styles of one typeface form a family; in CSS they share a common font-family value."),
          points: [
            t("Насыщенность (weight) — толщина штрихов: от светлого до сверхжирного.", "Weight — stroke thickness, from thin to black."),
            t("Наклон: прямое, курсивное (italic) или наклонное (oblique) начертание.", "Slope: upright, italic or oblique."),
            t("Ширина (width): узкое (condensed), нормальное, широкое (extended) начертание.", "Width: condensed, normal or extended."),
            t("Технически каждое начертание статического шрифта — отдельный файл; вариативный шрифт содержит диапазон начертаний в одном файле.", "Technically, each style of a static font is a separate file; a variable font contains a range of styles in one file.")
          ],
          sources: [R.mdnFontWeight, R.mdnVariable]
        },
        {
          kind: "idea",
          title: t("Числовые значения насыщенности", "Numeric weight values"),
          body: t("В CSS насыщенность задаётся числом от 1 до 1000; традиционно используются значения, кратные 100. Ключевые слова normal и bold соответствуют 400 и 700. Названия начертаний (Light, Medium, Semi Bold) условны и могут различаться у разных словолитен, поэтому ориентироваться следует на числовое значение.", "In CSS, weight is a number from 1 to 1000; values in steps of 100 are traditional. The keywords normal and bold correspond to 400 and 700. Style names (Light, Medium, Semi Bold) are conventional and vary between foundries, so rely on the numeric value."),
          points: [
            t("100 Thin · 200 Extra Light · 300 Light · 400 Regular · 500 Medium · 600 Semi Bold · 700 Bold · 800 Extra Bold · 900 Black.", "100 Thin · 200 Extra Light · 300 Light · 400 Regular · 500 Medium · 600 Semi Bold · 700 Bold · 800 Extra Bold · 900 Black."),
            t("Относительные значения bolder и lighter учитывают только четыре ступени (100, 400, 700, 900) и дают неочевидный результат.", "The relative values bolder and lighter consider only four steps (100, 400, 700, 900) and give non-obvious results."),
            t("По данным MDN, начертания 100 и 200 затрудняют чтение людям со слабым зрением, особенно при недостаточном контрасте.", "According to MDN, weights 100 and 200 are hard to read for people with low vision, especially with low contrast.")
          ],
          sources: [R.mdnFontWeight]
        },
        {
          kind: "check",
          title: t("Контроль: названия начертаний", "Review: style names"),
          match: {
            q: t("Сопоставьте числовые значения font-weight и общепринятые названия начертаний.", "Match font-weight values to the conventional style names."),
            pairs: [
              { term: t("Thin", "Thin"), def: t("100", "100") },
              { term: t("Light", "Light"), def: t("300", "300") },
              { term: t("Regular", "Regular"), def: t("400", "400") },
              { term: t("Semi Bold", "Semi Bold"), def: t("600", "600") },
              { term: t("Bold", "Bold"), def: t("700", "700") },
              { term: t("Black", "Black"), def: t("900", "900") }
            ]
          }
        },
        {
          kind: "web",
          title: t("Подбор недоступного начертания", "Matching an unavailable weight"),
          body: t("Если запрошенная насыщенность не подключена, браузер выбирает ближайшую доступную по алгоритму спецификации CSS. Для значений 400–500 сначала проверяются более насыщенные начертания до 500, затем менее насыщенные; для значений выше 500 — более насыщенные, для значений ниже 400 — менее насыщенные.", "If the requested weight is not loaded, the browser selects the nearest available one using the CSS algorithm. For 400–500 it first checks heavier weights up to 500, then lighter ones; above 500 it looks for heavier weights; below 400, for lighter ones."),
          points: [
            t("При наличии только 400 и 700 значения 500 отображаются как 400, а 600 — как 700: «полужирный» в макете превращается в жирный на сайте.", "With only 400 and 700 loaded, 500 renders as 400 and 600 as 700: a semibold in the mockup becomes bold on the site."),
            t("Насыщенности, используемые в макете, должны совпадать с подключёнными в @font-face.", "The weights used in the mockup must match those declared in @font-face.")
          ],
          code: "@font-face {\n  font-family: \"PT Sans\";\n  src: url(pt-sans-400.woff2) format(\"woff2\");\n  font-weight: 400;\n}\n@font-face {\n  font-family: \"PT Sans\";\n  src: url(pt-sans-700.woff2) format(\"woff2\");\n  font-weight: 700;\n}",
          demo: "weightfallback",
          sources: [R.mdnFontWeight, R.mdnFontFace]
        },
        {
          kind: "task",
          title: t("Какое начертание применит браузер", "Which weight will the browser use"),
          body: t("По набору доступных начертаний и значению font-weight определите начертание, которое выберет браузер.", "Given the available weights and a font-weight value, determine which weight the browser will choose."),
          demo: "tWeightMatch"
        },
        {
          kind: "web",
          title: t("Синтезированные начертания", "Synthesised styles"),
          body: t("Если в семействе нет полужирного или курсивного начертания, браузер по умолчанию синтезирует его: утолщает штрихи или механически наклоняет прямое начертание. Синтезированные начертания уступают по качеству спроектированным: нарушаются пропорции, внутрибуквенные просветы заплывают, курсивные формы знаков отсутствуют.", "If a family lacks a bold or italic style, the browser synthesises it by default, thickening strokes or mechanically slanting the upright. Synthesised styles are inferior to designed ones: proportions are distorted, counters fill in, and true italic forms are missing."),
          points: [
            t("Свойство font-synthesis управляет синтезом; значение none запрещает его полностью (поддерживается всеми браузерами с 2022 года).", "font-synthesis controls synthesis; none disables it entirely (supported in all browsers since 2022)."),
            t("Синтез — признак того, что нужное начертание не подключено или отсутствует в гарнитуре; это следует исправлять на уровне выбора шрифта.", "Synthesis indicates that the required style is not loaded or does not exist; fix this at the font selection stage.")
          ],
          code: t("/* запрет синтеза */\nbody { font-synthesis: none; }", "/* disable synthesis */\nbody { font-synthesis: none; }"),
          demo: "synth",
          sources: [R.mdnFontSynthesis]
        },
        {
          kind: "idea",
          title: t("Курсив и наклонное начертание", "Italic and oblique"),
          body: t("Курсив (italic) — самостоятельный рисунок, восходящий к рукописному письму: знаки изменяют форму, а не только наклон. Наклонное начертание (oblique) — механически наклонённое прямое; в гротесках оно встречается чаще, чем истинный курсив.", "Italic is an independent design rooted in handwriting: letters change shape, not merely slope. Oblique is a mechanically slanted upright; it is more common than true italic in sans serif typefaces."),
          points: [
            t("В кириллическом курсиве ряд знаков принципиально меняет форму: т, и, п, д, г. Синтезированный наклон этих форм не воспроизводит.", "In Cyrillic italic several letters change form fundamentally: т, и, п, д, г. A synthesised slant does not reproduce these forms."),
            t("Качественный кириллический курсив предусматривает собственную форму д, не повторяющую латинскую g.", "A well-designed Cyrillic italic has its own form of д that does not copy the Latin g."),
            t("В CSS: font-style: italic или font-style: oblique с углом наклона, например oblique 10deg (для вариативных шрифтов с осью slnt).", "In CSS: font-style: italic, or font-style: oblique with an angle such as oblique 10deg (for variable fonts with a slnt axis).")
          ],
          demo: "italic",
          sources: [R.skyengItalic, R.skillboxCyrillic, R.mdnVariable]
        },
        {
          kind: "task",
          title: t("Распознайте синтезированное начертание", "Spot the synthesised style"),
          body: t("В каждом наборе один образец набран начертанием, которого нет в шрифте. Найдите его.", "In each set one sample uses a style missing from the font. Find it."),
          demo: "tFaux"
        },
        {
          kind: "web",
          title: t("Вариативные шрифты", "Variable fonts"),
          body: t("Вариативный шрифт содержит в одном файле непрерывный диапазон начертаний по одной или нескольким осям. Насыщенность может принимать любое значение в пределах диапазона, например 437, что позволяет точно настраивать иерархию и адаптировать начертание к условиям отображения.", "A variable font contains a continuous range of styles along one or more axes in a single file. Weight can take any value within the range, e.g. 437, allowing precise hierarchy and adaptation to display conditions."),
          points: [
            t("Зарегистрированные оси соответствуют свойствам CSS: wght — font-weight, wdth — font-stretch, slnt и ital — font-style, opsz — font-optical-sizing.", "Registered axes map to CSS properties: wght to font-weight, wdth to font-stretch, slnt and ital to font-style, opsz to font-optical-sizing."),
            t("Свойство font-variation-settings следует использовать только для нестандартных осей (их теги записываются прописными буквами): оно не наследуется по отдельным осям и переопределяет весь набор значений.", "Use font-variation-settings only for custom axes (their tags are uppercase): it overrides the entire set of values rather than individual axes."),
            t("В @font-face диапазон задаётся двумя значениями: font-weight: 100 900.", "In @font-face the range is given as two values: font-weight: 100 900.")
          ],
          code: "@font-face {\n  font-family: \"Inter\";\n  src: url(inter-var.woff2) format(\"woff2-variations\");\n  font-weight: 100 900;\n}\nh1 { font-weight: 640; }\n.custom { font-variation-settings: \"GRAD\" 50; }",
          demo: "variable",
          sources: [R.mdnVariable, R.webdevVariable]
        },
        {
          kind: "web",
          title: t("Начертания и производительность", "Styles and performance"),
          figure: "files",
          body: t("Каждое начертание статического шрифта загружается отдельным файлом, а при разделении на подмножества — несколькими. Количество подключаемых начертаний прямо влияет на объём загрузки и скорость отображения текста.", "Each style of a static font is loaded as a separate file, or several files when split into subsets. The number of styles directly affects payload size and text rendering speed."),
          points: [
            t("Пример из каталога курса: PT Serif в четырёх начертаниях (400, 700 и их курсивы) — 8 файлов кириллицы и латиницы общим объёмом около 210 КБ; вариативный Inter с диапазоном 100–900 и курсивом — 4 файла, около 136 КБ.", "An example from the course catalogue: PT Serif in four styles (400, 700 and their italics) is 8 Cyrillic and Latin files, about 210 KB; variable Inter with a 100–900 range plus italic is 4 files, about 136 KB."),
            t("Вариативный шрифт выгоден, если используется несколько насыщенностей; при одном начертании выигрыша в объёме может не быть.", "A variable font pays off when several weights are used; with a single style there may be no size gain."),
            t("Подключайте только начертания, действительно используемые в макете; как правило, достаточно трёх-четырёх.", "Load only the styles actually used in the design; three or four are usually enough.")
          ],
          sources: [R.webdevVariable, R.mdnFontFace]
        },
        {
          kind: "idea",
          title: t("Средства выделения в тексте", "Means of emphasis in text"),
          figure: "emphasis",
          body: t("Выделение должно быть соразмерно задаче и не нарушать ровность набора. Как правило, достаточно одного средства выделения; сочетание нескольких (полужирный курсив прописными) снижает удобочитаемость.", "Emphasis should match its purpose without disrupting the evenness of the setting. One means of emphasis is usually enough; combining several (bold italic capitals) reduces readability."),
          points: [
            t("Курсив — для смыслового выделения в основном тексте, названий, иноязычных слов; полужирное — для ключевых терминов, подписей и элементов интерфейса.", "Italic for semantic emphasis in body text, titles and foreign words; bold for key terms, labels and interface elements."),
            t("Подчёркивание в вебе зарезервировано за ссылками; использовать его для выделения не следует.", "On the web, underlining is reserved for links and should not be used for emphasis."),
            t("Прописные допустимы в коротких надписях и подписях; набор прописными требует увеличения межбуквенного интервала на 5–12 % (letter-spacing: 0.05–0.12em). Длинный текст прописными читается плохо.", "Capitals suit short labels and captions; all-caps setting needs 5–12% extra letter spacing (letter-spacing: 0.05–0.12em). Long all-caps text is hard to read."),
            t("Семантика HTML: <em> — смысловое ударение, <strong> — важность; <i> и <b> — стилистическое выделение без дополнительного смысла.", "HTML semantics: <em> for stress emphasis, <strong> for importance; <i> and <b> for stylistic distinction without added meaning.")
          ],
          code: ".label {\n  text-transform: uppercase;\n  letter-spacing: 0.08em;\n  font-size: 0.8125rem;\n}",
          sources: [R.butterickCaps, R.butterickLetterspacing, R.mdnEm]
        },
        {
          kind: "web",
          title: t("Насыщенность в тёмной теме", "Weight in dark mode"),
          body: t("Светлый текст на тёмном фоне воспринимается более насыщенным, чем тёмный текст той же насыщенности на светлом фоне. В тёмной теме насыщенность основного текста при необходимости снижают; вариативные шрифты позволяют сделать это с шагом в несколько единиц.", "Light text on a dark background appears heavier than dark text of the same weight on a light background. In dark mode the body weight may be reduced; variable fonts allow this in small increments."),
          points: [
            t("Коррекцию проверяют визуально на реальных экранах: восприятие зависит от яркости, контраста и способа сглаживания шрифтов в операционной системе.", "Verify the adjustment visually on real screens: perception depends on brightness, contrast and the operating system's font smoothing."),
            t("Свойство -webkit-font-smoothing действует только в macOS и делает текст визуально тоньше; применять его глобально не рекомендуется.", "-webkit-font-smoothing works only on macOS and makes text appear thinner; applying it globally is not recommended.")
          ],
          code: t("@media (prefers-color-scheme: dark) {\n  body { font-weight: 370; }  /* вариативный шрифт */\n}", "@media (prefers-color-scheme: dark) {\n  body { font-weight: 370; }  /* variable font */\n}"),
          demo: "darkweight",
          sources: [R.mdnFontWeight, R.mdnVariable]
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("Подключены только начертания 400 и 700. Для подзаголовков задано font-weight: 600. Какое начертание отобразит браузер?", "Only weights 400 and 700 are loaded. Subheadings use font-weight: 600. Which weight will the browser render?"),
            options: [t("400", "400"), t("700", "700"), t("Синтезированное 600", "A synthesised 600")],
            answer: 1,
            explain: t("Для значений выше 500 браузер ищет более насыщенное доступное начертание; ближайшее — 700. Синтез насыщенности применяется, только если более жирных начертаний нет вовсе.", "Above 500 the browser looks for a heavier available weight; the nearest is 700. Weight synthesis applies only when no heavier style exists at all.")
          }
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("В гарнитуре нет курсивного начертания, а в тексте используется элемент <em>. Что увидит пользователь при настройках по умолчанию?", "The typeface has no italic and the text uses <em>. What will the user see with default settings?"),
            options: [t("Прямое начертание без какого-либо выделения", "Upright text without any emphasis"), t("Механически наклонённое прямое начертание", "A mechanically slanted upright"), t("Курсивное начертание из резервного шрифта", "The italic of the fallback font")],
            answer: 1,
            explain: t("По умолчанию font-synthesis разрешает синтез, и браузер наклоняет прямое начертание. Формы знаков, характерные для курсива, при этом не воспроизводятся.", "By default font-synthesis allows synthesis and the browser slants the upright. Italic letterforms are not reproduced.")
          }
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("В каком случае переход на вариативный шрифт, скорее всего, не уменьшит объём загрузки?", "When is switching to a variable font unlikely to reduce payload size?"),
            options: [t("В макете используются пять насыщенностей", "The design uses five weights"), t("Используется только одно начертание", "Only one style is used"), t("Нужны прямое начертание и курсив в трёх насыщенностях", "Upright and italic in three weights are needed")],
            answer: 1,
            explain: t("Вариативный файл содержит весь диапазон начертаний; при использовании одного начертания статический файл обычно меньше.", "A variable file contains the entire range; when only one style is used, a static file is usually smaller.")
          }
        }
      ],
      cheatsheet: [
        t("Гарнитура — общий рисунок; начертание — вариант по насыщенности, наклону или ширине; семейство — набор начертаний.", "Typeface: shared design; style: a variant by weight, slope or width; family: the set of styles."),
        t("Насыщенность задаётся числом: 400 — normal, 700 — bold; ориентируйтесь на числа, а не на названия.", "Weight is numeric: 400 normal, 700 bold; rely on numbers, not names."),
        t("Насыщенности макета должны совпадать с подключёнными; иначе 500 станет 400, а 600 — 700.", "Mockup weights must match loaded weights; otherwise 500 becomes 400 and 600 becomes 700."),
        t("Синтезированные начертания — признак ошибки подключения; font-synthesis: none запрещает синтез.", "Synthesised styles indicate a loading error; font-synthesis: none disables synthesis."),
        t("Курсив — самостоятельный рисунок; в кириллице меняются формы т, и, п, д, г.", "Italic is an independent design; in Cyrillic the forms of т, и, п, д, г change."),
        t("Вариативные шрифты: оси через font-weight, font-stretch, font-style; font-variation-settings — только для нестандартных осей.", "Variable fonts: use font-weight, font-stretch, font-style; font-variation-settings only for custom axes."),
        t("Подключайте только используемые начертания (обычно 3–4); вариативный шрифт выгоден при нескольких насыщенностях.", "Load only the styles you use (usually 3–4); variable fonts pay off with several weights."),
        t("Одно средство выделения за раз; подчёркивание — только для ссылок; прописные — с разрядкой 0.05–0.12em.", "One means of emphasis at a time; underline only links; caps with 0.05–0.12em spacing."),
        t("В тёмной теме насыщенность основного текста допустимо снизить; результат проверяется на реальных экранах.", "In dark mode body weight may be reduced; verify on real screens.")
      ],
      readings: [R.mdnFontWeight, R.mdnFontSynthesis, R.mdnVariable, R.webdevVariable, R.mdnFontFace, R.skyengItalic, R.skillboxCyrillic, R.butterickCaps, R.butterickLetterspacing, R.mdnEm]
    },
    {
      id: "setting", minutes: 50,
      title: t("Кегль, интерлиньяж, длина строки", "Size, line height, line length"),
      goal: t("Определять параметры основного текста, обеспечивающие удобочитаемость на устройствах различного формата, и корректно реализовывать их средствами CSS.", "Determine body text parameters that ensure readability across devices and implement them correctly in CSS."),
      topics: [],
      cards: [
        {
          kind: "try", demo: "measure",
          title: t("Оптимальная длина строки", "Optimal line length"),
          body: t("Изменяйте ширину колонки и оцените, при какой длине строки переход к началу следующей строки не требует усилий, а при какой чтение замедляется.", "Change the column width and assess at which line length moving to the next line is effortless and at which reading slows down.")
        },
        {
          kind: "idea",
          title: t("Длина строки: 45–75 знаков", "Line length: 45–75 characters"),
          figure: "measure",
          body: t("Оптимальная длина строки основного текста составляет 45–75 знаков с пробелами, в среднем около 65. Чрезмерно длинная строка затрудняет возвратное движение глаз к началу следующей строки; чрезмерно короткая дробит синтагмы и повышает частоту переводов строки.", "The optimal line length for body text is 45–75 characters including spaces, about 65 on average. Overlong lines hinder the return sweep to the next line; overly short lines fragment phrases and increase the frequency of line breaks."),
          points: [
            t("По данным пользовательских исследований Baymard Institute, оптимальный диапазон составляет 50–75 знаков.", "User research by the Baymard Institute places the optimum at 50–75 characters."),
            t("Критерий WCAG 1.4.8 (уровень AAA) ограничивает длину строки 80 знаками.", "WCAG success criterion 1.4.8 (level AAA) limits line length to 80 characters."),
            t("Без явного ограничения ширины текстового блока длина строки на широкоформатных мониторах выходит за допустимые пределы.", "Without an explicit width limit on the text block, line length exceeds acceptable bounds on wide monitors.")
          ],
          sources: [R.rutterMeasure, R.baymard, R.butterickLength, R.wcagVisual]
        },
        {
          kind: "web",
          title: t("Единица ch: возможности и ограничения", "The ch unit: uses and limitations"),
          body: t("Ширину текстового блока целесообразно задавать в единицах ch: в этом случае она пропорциональна кеглю. Следует учитывать, что 1ch равен ширине цифры «0» в текущем шрифте, а не средней ширине знака. Поэтому одно и то же значение, например 65ch, вмещает разное число знаков в зависимости от гарнитуры и языка текста.", "Setting the text block width in ch units keeps it proportional to the font size. Note, however, that 1ch equals the width of the digit “0” in the current font, not the average character width. The same value, e.g. 65ch, therefore holds a different number of characters depending on the typeface and the language of the text."),
          points: [
            t("Ограничение ширины применяется к текстовому блоку, а не к странице в целом: фон и иллюстрации могут занимать всю ширину окна.", "The width limit applies to the text block, not the page as a whole: backgrounds and images may span the full window."),
            t("Результат следует проверять на реальном тексте: средняя длина слова и ширина знаков в русском и английском текстах различаются.", "Verify the result with real copy: average word length and character width differ between Russian and English text.")
          ],
          code: t(".article p,\n.article li {\n  max-width: 65ch;   /* пропорционально font-size */\n}", ".article p,\n.article li {\n  max-width: 65ch;   /* proportional to font-size */\n}"),
          demo: "chcompare",
          sources: [R.webdevDesignType, R.rutterMeasure]
        },
        {
          kind: "web",
          title: t("Длина строки на мобильных устройствах", "Line length on mobile devices"),
          figure: "mobile",
          body: t("На мобильных устройствах длина строки определяется шириной экрана. При кегле 16–18 px и боковых полях 16–20 px строка содержит примерно 35–50 знаков, что считается приемлемым для чтения с экрана смартфона.", "On mobile devices line length is determined by the screen width. At 16–18 px with 16–20 px side margins a line holds roughly 35–50 characters, which is considered acceptable for reading on a smartphone."),
          points: [
            t("Уменьшение кегля ради увеличения числа знаков в строке снижает удобочитаемость.", "Reducing the font size to fit more characters per line impairs readability."),
            t("Боковые поля обязательны: текст, примыкающий к краю экрана, воспринимается хуже.", "Side margins are essential: text touching the screen edge is harder to read."),
            t("Длинные слова и URL-адреса могут выходить за пределы контейнера; свойство overflow-wrap: break-word предотвращает такое переполнение.", "Long words and URLs may overflow the container; overflow-wrap: break-word prevents this.")
          ],
          code: t(".article {\n  padding-inline: 1rem;      /* боковые поля */\n  overflow-wrap: break-word; /* перенос длинных URL */\n}", ".article {\n  padding-inline: 1rem;      /* side margins */\n  overflow-wrap: break-word; /* wrap long URLs */\n}"),
          sources: [R.webdevDesignType]
        },
        {
          kind: "try", demo: "leading",
          title: t("Подбор интерлиньяжа", "Choosing line height"),
          body: t("Подберите значение, при котором строки не сливаются визуально, а текстовый блок сохраняет целостность. Зафиксируйте выбранное значение.", "Find a value at which the lines do not merge visually and the text block remains coherent. Note the value you chose.")
        },
        {
          kind: "idea",
          title: t("Интерлиньяж основного текста: 1.4–1.6", "Body text line height: 1.4–1.6"),
          body: t("Для основного текста, как правило, применяется line-height в диапазоне 1.4–1.6, для заголовков — 1.1–1.25. Конкретное значение определяется гарнитурой, кеглем и длиной строки.", "Body text typically uses a line-height of 1.4–1.6, headings 1.1–1.25. The exact value depends on the typeface, size and line length."),
          points: [
            t("Чем длиннее строка, тем больший интерлиньяж требуется для уверенного перехода к следующей строке.", "The longer the line, the more line height is needed for a reliable return sweep."),
            t("Гарнитуры с большой высотой строчных знаков визуально плотнее и требуют увеличенного интерлиньяжа.", "Typefaces with a large x-height appear denser and require more line height."),
            t("Для крупного кегля, в частности в заголовках, относительный интерлиньяж уменьшают.", "At large sizes, notably in headings, relative line height is reduced.")
          ],
          sources: [R.rutterLeading, R.butterickSpacing]
        },
        {
          kind: "web",
          title: t("Безразмерное значение line-height", "Unitless line-height"),
          body: t("Свойство line-height наследуется. Безразмерное значение наследуется как коэффициент, и интерлиньяж каждого элемента вычисляется от его собственного кегля. Значение в px или em наследуется как уже вычисленная длина, поэтому элемент с крупным кеглем получает интерлиньяж, рассчитанный для основного текста.", "line-height is inherited. A unitless value is inherited as a factor, so each element's line height is computed from its own font size. A px or em value is inherited as an already computed length, so an element with a large font size receives the line height calculated for body text."),
          code: t("body { line-height: 1.5; }     /* ✓ коэффициент */\nbody { line-height: 1.5em; }   /* ✗ 24px для всех потомков */\nbody { line-height: 24px; }    /* ✗ аналогично */", "body { line-height: 1.5; }     /* ✓ factor */\nbody { line-height: 1.5em; }   /* ✗ 24px for all descendants */\nbody { line-height: 24px; }    /* ✗ same issue */"),
          demo: "lhinherit",
          sources: [R.mdnLineHeight]
        },
        {
          kind: "web",
          title: t("Полуинтерлиньяж", "Half-leading"),
          figure: "halfleading",
          body: t("В CSS разница между значением line-height и высотой шрифта распределяется поровну над строкой и под ней (полуинтерлиньяж, half-leading). Вследствие этого текстовый блок имеет дополнительные отступы сверху и снизу, что затрудняет точное выравнивание текста относительно пиктограмм и границ контейнера.", "In CSS the difference between line-height and the font's height is distributed equally above and below the line (half-leading). As a result, a text block carries extra space at the top and bottom, which complicates precise alignment with icons and container edges."),
          points: [
            t("Величина этих отступов возрастает с увеличением line-height; её необходимо учитывать при переносе отступов из макета.", "This space grows with line-height and must be accounted for when transferring spacing from a mockup."),
            t("Свойство text-box-trim позволяет обрезать текстовый блок по высоте прописных и базовой линии (Baseline с 2026 г.; более ранние версии браузеров его не поддерживают).", "text-box-trim trims the text block to cap height and baseline (Baseline since 2026; earlier browser versions do not support it).")
          ],
          code: "h2, .card-title {\n  text-box: trim-both cap alphabetic;\n}",
          sources: [R.mdnTextBoxTrim]
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("Для body задано line-height: 24px, для h1 — font-size: 40px. Как будет отображаться заголовок в две строки?", "body has line-height: 24px and h1 has font-size: 40px. How will a two-line heading render?"),
            options: [t("Строки заголовка перекроются", "The heading lines will overlap"), t("Браузер пересчитает интерлиньяж до 60px", "The browser will recalculate it to 60px"), t("Заголовок не наследует line-height, изменений не будет", "Headings do not inherit line-height, so nothing changes")],
            answer: 0,
            explain: t("Элемент h1 наследует вычисленное значение 24 px при кегле 40 px, вследствие чего строки перекрываются. При line-height: 1.5 интерлиньяж заголовка составил бы 60 px.", "h1 inherits the computed 24 px at a 40 px font size, so the lines overlap. With line-height: 1.5 the heading would get 60 px.")
          }
        },
        {
          kind: "idea",
          title: t("Кегль: 16 px как нижняя граница", "Font size: 16 px as the lower bound"),
          body: t("Значение 16 px соответствует размеру шрифта браузера по умолчанию и рассматривается как минимально допустимое для основного текста; для протяжённых текстов нередко используют 17–20 px. При этом кегль определяет высоту кегельной площадки, а не самих знаков: при одинаковом кегле гарнитура с большей высотой строчных воспринимается крупнее.", "16 px is the browser's default font size and is regarded as the minimum for body text; long-form text often uses 17–20 px. Font size, however, defines the height of the em box rather than of the letters: at the same size, a typeface with a larger x-height appears bigger."),
          demo: "xheight",
          sources: [R.butterick, R.webdevCssType]
        },
        {
          kind: "web",
          title: t("Пункт и пиксель", "Points and pixels"),
          figure: "ptpx",
          body: t("В полиграфии и текстовых редакторах кегль измеряется в пунктах (pt), в CSS — в пикселях и производных единицах. В CSS обе единицы привязаны к дюйму: 1 pt = 1/72 дюйма, 1 px = 1/96 дюйма, следовательно 1 pt = 4/3 px, а 12 pt = 16 px.", "In print and word processors type is measured in points (pt), in CSS in pixels and derived units. In CSS both are tied to the inch: 1 pt = 1/72 inch, 1 px = 1/96 inch, hence 1 pt = 4/3 px and 12 pt = 16 px."),
          points: [
            t("CSS-пиксель — опорная единица, а не точка экрана. На экранах высокой плотности он отображается несколькими физическими пикселями: при device pixel ratio 2 — квадратом 2 × 2.", "A CSS pixel is a reference unit, not a screen dot. On high-density screens it is drawn with several physical pixels: a 2 × 2 square at a device pixel ratio of 2."),
            t("Пороговые значения WCAG заданы в пунктах: крупный текст — от 18 pt (24 px) или от 14 pt полужирного начертания (≈ 18,67 px).", "WCAG thresholds are given in points: large text starts at 18 pt (24 px) or 14 pt bold (≈ 18.67 px)."),
            t("Пункты в CSS уместны только в стилях для печати (@media print); для экрана используют rem.", "Points belong only in print styles (@media print); use rem for screens.")
          ],
          sources: [R.mdnLength, R.wcagContrast]
        },
        {
          kind: "task",
          title: t("Пункты, пиксели и плотность экрана", "Points, pixels and screen density"),
          body: t("Переведите значения из пунктов в пиксели и обратно, рассчитайте число физических пикселей при заданной плотности экрана.", "Convert between points and pixels and calculate physical pixels for a given screen density."),
          demo: "tPtPx"
        },
        {
          kind: "web",
          title: t("Единица rem и пользовательские настройки", "The rem unit and user settings"),
          body: t("Браузер позволяет пользователю изменить базовый размер шрифта. Значения в px эту настройку игнорируют, значения в rem учитывают: 1rem равен базовому размеру, по умолчанию 16 px. Масштабирование страницы действует в обоих случаях, однако настройкой базового размера шрифта пользуются, в частности, люди со слабым зрением.", "Browsers let users change the default font size. Values in px ignore this setting, values in rem respect it: 1rem equals the base size, 16 px by default. Page zoom works in both cases, but the base font-size setting is relied upon, among others, by people with low vision."),
          points: [
            t("Не следует задавать html { font-size } в пикселях: это отменяет пользовательскую настройку.", "Do not set html { font-size } in pixels: it overrides the user setting."),
            t("Кегль задаётся в rem; толщина рамок и тени могут задаваться в px.", "Font sizes are set in rem; borders and shadows may remain in px.")
          ],
          code: t("/* 18px при настройках по умолчанию */\nbody { font-size: 1.125rem; }\nsmall { font-size: 0.875rem; }  /* 14px */", "/* 18px with default settings */\nbody { font-size: 1.125rem; }\nsmall { font-size: 0.875rem; }  /* 14px */"),
          demo: "remsim",
          sources: [R.comeau]
        },
        {
          kind: "web",
          title: t("Адаптивный кегль и ограничения единицы vw", "Fluid font size and the limits of vw"),
          figure: "vwchart",
          body: t("Кегль, заданный исключительно в единицах vw, не изменяется при масштабировании страницы, что квалифицируется как несоответствие критерию WCAG 1.4.4 (типовая ошибка F94). Рекомендуется сочетать rem и vw в функции clamp(), задающей минимальное значение, плавное изменение и максимальное значение.", "A font size set solely in vw does not change with page zoom, which constitutes a failure of WCAG 1.4.4 (common failure F94). Combine rem and vw within clamp(), which defines a minimum, a fluid range and a maximum."),
          points: [
            t("Адаптивный кегль наиболее востребован для заголовков; кегль основного текста обычно варьируется в пределах 1–2 px.", "Fluid sizing matters most for headings; body text size usually varies by 1–2 px."),
            t("В Safari на iOS поля ввода с кеглем менее 16 px вызывают автоматическое масштабирование страницы при получении фокуса.", "In Safari on iOS, form fields smaller than 16 px trigger automatic page zoom on focus.")
          ],
          code: "h1 {\n  font-size: clamp(1.75rem, 1.2rem + 2.5vw, 3rem);\n}\ninput, select, textarea {\n  font-size: max(1rem, 16px);\n}",
          sources: [R.wcagResize, R.webdevDesignType]
        },
        {
          kind: "task",
          title: t("Расчёт единиц и интерлиньяжа", "Units and line height"),
          body: t("Выполните расчёты в rem, px и ch, включая наследование line-height. Допускается десятичная запятая.", "Calculate values in rem, px and ch, including line-height inheritance."),
          demo: "tUnits"
        },
        {
          kind: "try", demo: "wrap",
          title: t("Перенос строк и переносы слов", "Line wrapping and hyphenation"),
          body: t("Включайте и отключайте свойства и проанализируйте, как изменяются разбивка заголовка на строки и правый край абзаца в узкой колонке.", "Toggle the properties and analyse how the line breaks of the heading and the right edge of the paragraph change in a narrow column.")
        },
        {
          kind: "web",
          title: t("Свойства text-wrap и hyphens", "text-wrap and hyphens"),
          points: [
            t("text-wrap: balance выравнивает длину строк заголовка. Свойство действует только для коротких блоков: до 6 строк в Chromium и до 10 в Firefox.", "text-wrap: balance evens out the line lengths of a heading. It applies only to short blocks: up to 6 lines in Chromium and 10 in Firefox."),
            t("text-wrap: pretty предназначено для абзацев: браузер избегает висячей строки из одного слова в конце абзаца.", "text-wrap: pretty is intended for paragraphs: the browser avoids a single-word last line."),
            t("hyphens: auto включает автоматическую расстановку переносов только при указании языка документа или блока, например <html lang=\"ru\">.", "hyphens: auto enables automatic hyphenation only when the language of the document or block is declared, e.g. <html lang=\"ru\">."),
            t("Переносы особенно значимы в узких колонках и в русском тексте с высокой средней длиной слова; выключка по формату без переносов в вебе не рекомендуется.", "Hyphenation matters most in narrow columns and in Russian text with its long average word length; justified text without hyphenation is not recommended on the web.")
          ],
          code: "h1, h2, h3 { text-wrap: balance; }\np { text-wrap: pretty; hyphens: auto; }\n\n<html lang=\"ru\">",
          sources: [R.mdnTextWrap, R.mdnHyphens, R.wcagVisual]
        },
        {
          kind: "web",
          title: t("Разделение абзацев и устойчивость к изменению интервалов", "Paragraph separation and resilience to spacing changes"),
          body: t("В веб-типографике абзацы, как правило, разделяются вертикальным отступом, а не абзацным отступом первой строки; одновременное применение обоих приёмов избыточно. Кроме того, вёрстка должна сохранять работоспособность при изменении интервалов пользователем (критерий WCAG 1.4.12).", "In web typography paragraphs are usually separated by vertical space rather than a first-line indent; using both at once is redundant. The layout must also remain functional when users change text spacing (WCAG 1.4.12)."),
          points: [
            t("Согласно WCAG 1.4.12, содержимое не должно утрачиваться при line-height 1.5, отступе после абзаца 2em, letter-spacing 0.12em и word-spacing 0.16em.", "Under WCAG 1.4.12 no content may be lost at line-height 1.5, paragraph spacing 2em, letter-spacing 0.12em and word-spacing 0.16em."),
            t("Основная причина несоответствия — фиксированная высота текстовых контейнеров; вместо height следует использовать min-height.", "The main cause of failure is a fixed height on text containers; use min-height instead of height.")
          ],
          code: t("p + p { margin-top: 1em; }   /* отступ между абзацами */\n.card { min-height: 12rem; }  /* не height */", "p + p { margin-top: 1em; }   /* space between paragraphs */\n.card { min-height: 12rem; }  /* not height */"),
          demo: "spacing",
          sources: [R.wcagSpacing, R.rutterParagraphs, R.rutterRhythm]
        },
        {
          kind: "task",
          title: t("Исправьте набор абзаца", "Fix the paragraph setting"),
          body: t("Абзац набран с ошибками. Добейтесь выполнения всех требований на десктопе и на смартфоне одновременно.", "The paragraph is badly set. Meet all requirements on desktop and smartphone at once."),
          demo: "tParagraph"
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("Какое значение кегля заголовка корректно масштабируется как при изменении ширины окна, так и при увеличении страницы?", "Which heading font size scales correctly with both the window width and page zoom?"),
            options: [t("font-size: clamp(1.75em, 2.5vw + 1.5vh, 3.25em)", "font-size: clamp(1.75em, 2.5vw + 1.5vh, 3.25em)"), t("font-size: clamp(1.75rem, 1rem + 2.5vw, 3rem)", "font-size: clamp(1.75rem, 1rem + 2.5vw, 3rem)"), t("font-size: calc(3vw + 1vh + 1vmin + 0.5vmax)", "font-size: calc(3vw + 1vh + 1vmin + 0.5vmax)")],
            answer: 1,
            explain: t("Если переменная часть выражена только в единицах области просмотра (vw, vh, vmin, vmax), кегль не реагирует на увеличение страницы. В clamp(1.75rem, 1rem + 2.5vw, 3rem) слагаемое и границы в rem учитывают и увеличение, и пользовательский размер шрифта.", "When the variable part uses only viewport units (vw, vh, vmin, vmax), the size ignores page zoom. In clamp(1.75rem, 1rem + 2.5vw, 3rem) the rem term and bounds respect both zoom and the user's font size.")
          }
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("Для абзацев задано hyphens: auto, однако в русском тексте переносы не расставляются. Какова наиболее вероятная причина?", "Paragraphs have hyphens: auto, yet Russian text is not hyphenated. What is the most likely cause?"),
            options: [t("Не задана выключка по формату через text-align: justify", "text-align: justify is not set"), t("Не указан атрибут lang=\\\"ru\\\" у элемента html или у блока", "The lang=\"ru\" attribute is missing on html or the block"), t("Используемый веб-шрифт не поддерживает автоматические переносы", "The web font does not support automatic hyphenation")],
            answer: 1,
            explain: t("Словарь переносов выбирается браузером на основании атрибута lang. При его отсутствии язык текста не определён и переносы не расставляются.", "The browser selects the hyphenation dictionary based on the lang attribute. Without it the language is undetermined and no hyphenation is applied.")
          }
        }
      ],
      cheatsheet: [
        t("Длина строки основного текста — 45–75 знаков; ограничение (max-width: 65ch) задаётся текстовому блоку и проверяется на реальном тексте.", "Body line length: 45–75 characters; the limit (max-width: 65ch) is set on the text block and verified with real copy."),
        t("На мобильных устройствах допустима длина строки 35–50 знаков; уменьшать кегль и боковые поля не следует.", "On mobile devices 35–50 characters per line is acceptable; do not reduce the font size or side margins."),
        t("line-height основного текста — 1.4–1.6, заголовков — 1.1–1.25; значение указывается без единиц измерения.", "line-height: 1.4–1.6 for body text, 1.1–1.25 for headings; always unitless."),
        t("Полуинтерлиньяж учитывается при выравнивании; для обрезки используется text-box: trim-both cap alphabetic.", "Account for half-leading in alignment; trim it with text-box: trim-both cap alphabetic."),
        t("Кегль основного текста — не менее 16 px; задаётся в rem, значение html { font-size } в px не указывается.", "Body size at least 16 px, set in rem; never set html { font-size } in px."),
        t("Адаптивный кегль задаётся функцией clamp() с сочетанием rem и vw; кегль полей ввода — не менее 16 px.", "Fluid sizes use clamp() combining rem and vw; form fields at least 16 px."),
        t("text-wrap: balance применяется к заголовкам, pretty — к абзацам; hyphens: auto требует атрибута lang.", "text-wrap: balance for headings, pretty for paragraphs; hyphens: auto requires lang."),
        t("Абзацы разделяются вертикальным отступом; для текстовых контейнеров используется min-height вместо height (WCAG 1.4.12).", "Separate paragraphs with vertical space; use min-height rather than height on text containers (WCAG 1.4.12).")
      ],
      readings: [R.rutter, R.rutterBook, R.bringhurst, R.butterickLength, R.butterickSpacing, R.baymard, R.comeau, R.webdevDesignType, R.mdnLineHeight, R.mdnTextWrap, R.mdnHyphens, R.wcagVisual, R.wcagSpacing, R.wcagResize]
    },
    {
      id: "scale", minutes: 50,
      title: t("Шкала и иерархия", "Type scale and hierarchy"),
      goal: t("Строить согласованную систему кеглей — от подписей до заголовка первого уровня — и описывать её средствами CSS.", "Build a consistent system of sizes from captions to the top-level heading and express it in CSS."),
      topics: [],
      cards: [
        {
          kind: "try", demo: "hierarchy",
          title: t("Иерархия текста на странице", "Text hierarchy on a page"),
          body: t("Переключите три варианта оформления одного и того же фрагмента статьи. Оцените, в каком варианте структура текста — рубрика, заголовок, лид, подзаголовок, основной текст, подпись — считывается до начала чтения.", "Switch between three treatments of the same article fragment. Assess in which variant the structure — kicker, headline, lead, subheading, body, caption — is apparent before reading begins.")
        },
        {
          kind: "idea",
          title: t("Типографическая иерархия", "Typographic hierarchy"),
          body: t("Типографическая иерархия — система визуальных различий, отражающая относительную значимость элементов текста. Она позволяет читателю оценить структуру страницы до начала чтения и быстро находить нужные фрагменты.", "Typographic hierarchy is a system of visual distinctions reflecting the relative importance of text elements. It lets readers grasp the page structure before reading and locate information quickly."),
          points: [
            t("Средства иерархии: кегль, насыщенность, цвет и контраст, регистр и разрядка, пробелы, положение на странице.", "Means of hierarchy: size, weight, colour and contrast, case and letter spacing, white space, position."),
            t("Каждый уровень должен заметно отличаться от соседнего; незначительные различия воспринимаются как ошибка, а не как иерархия.", "Each level must differ noticeably from the adjacent one; slight differences read as errors rather than hierarchy."),
            t("Количество уровней заголовков следует ограничивать: как правило, достаточно двух-трёх.", "Limit the number of heading levels: two or three are usually sufficient.")
          ],
          sources: [R.butterickHeadings, R.webdevDesignType]
        },
        {
          kind: "idea",
          title: t("Модульная шкала", "The modular scale"),
          figure: "modscale",
          body: t("Модульная шкала — последовательность кеглей, каждый из которых получается умножением предыдущего на постоянный коэффициент. Базовым значением обычно служит кегль основного текста. Шкала обеспечивает согласованность размеров и сокращает число произвольных решений.", "A modular scale is a sequence of sizes, each obtained by multiplying the previous one by a constant ratio. The base is usually the body text size. The scale ensures consistency between sizes and reduces arbitrary decisions."),
          points: [
            t("Формула: кегль = базовый кегль × коэффициентⁿ, где n — номер ступени (отрицательный для мелких элементов).", "Formula: size = base × ratioⁿ, where n is the step (negative for small elements)."),
            t("Распространённые коэффициенты носят названия музыкальных интервалов: 1.125 (большая секунда), 1.2 (малая терция), 1.25 (большая терция), 1.333 (чистая кварта), 1.5 (чистая квинта), 1.618 (золотое сечение).", "Common ratios are named after musical intervals: 1.125 (major second), 1.2 (minor third), 1.25 (major third), 1.333 (perfect fourth), 1.5 (perfect fifth), 1.618 (golden ratio)."),
            t("В веб-дизайне подход популяризировал Тим Браун (A List Apart, 2011), подчёркивая, что шкала — инструмент, а не догма: рассчитанные значения допустимо корректировать.", "In web design the approach was popularised by Tim Brown (A List Apart, 2011), who stressed that scales are tools, not dogma: calculated values may be adjusted.")
          ],
          sources: [R.timBrown, R.typeScale]
        },
        {
          kind: "try", demo: "scalegen",
          title: t("Генератор модульной шкалы", "Modular scale generator"),
          body: t("Задайте базовый кегль, коэффициент и гарнитуру. Сравните, как меняется разрыв между ступенями при коэффициентах 1.2 и 1.5, и обратите внимание на размер верхних ступеней.", "Set the base size, ratio and typeface. Compare the gaps between steps at ratios of 1.2 and 1.5, and note the size of the upper steps.")
        },
        {
          kind: "idea",
          title: t("Выбор коэффициента", "Choosing a ratio"),
          figure: "ratios",
          body: t("Коэффициент определяет контрастность иерархии. Небольшие коэффициенты дают сдержанную, плотную систему; крупные — выразительную, с резким разрывом между заголовками и текстом.", "The ratio determines the contrast of the hierarchy. Small ratios give a restrained, compact system; large ones an expressive system with sharp contrast between headings and text."),
          points: [
            t("1.125–1.2 — интерфейсы, информационно насыщенные страницы, мобильные экраны.", "1.125–1.2: interfaces, information-dense pages, mobile screens."),
            t("1.25–1.333 — универсальный диапазон для сайтов и изданий.", "1.25–1.333: a versatile range for websites and publications."),
            t("1.5–1.618 — промостраницы и выразительные заголовки на широких экранах; верхние ступени быстро становятся очень крупными, поэтому число ступеней ограничивают.", "1.5–1.618: landing pages and expressive headlines on wide screens; upper steps grow very large quickly, so the number of steps is limited."),
            t("Рассчитанные значения разумно округлять до целых пикселей или удобных значений rem.", "Round calculated values to whole pixels or convenient rem values.")
          ],
          sources: [R.typeScale, R.timBrown]
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("Базовый кегль — 16 px, коэффициент шкалы — 1.25. Каков кегль второй ступени вверх (n = 2)?", "The base size is 16 px and the ratio is 1.25. What is the size at step n = 2?"),
            options: [t("20 px", "20 px"), t("25 px", "25 px"), t("32 px", "32 px")],
            answer: 1,
            explain: t("16 × 1.25² = 16 × 1.5625 = 25 px. Значение 20 px соответствует первой ступени.", "16 × 1.25² = 16 × 1.5625 = 25 px. 20 px corresponds to the first step.")
          }
        },
        {
          kind: "task",
          title: t("Расчёт шкалы и clamp()", "Scale and clamp() calculations"),
          body: t("Вычислите кегли ступеней, модульное отношение и коэффициенты адаптивного выражения clamp().", "Calculate step sizes, the ratio and the coefficients of a fluid clamp() expression."),
          demo: "tScaleCalc"
        },
        {
          kind: "web",
          title: t("Шкала в пользовательских свойствах CSS", "The scale as CSS custom properties"),
          body: t("Ступени шкалы удобно хранить в пользовательских свойствах CSS (дизайн-токенах). Компоненты ссылаются на токены, а не на конкретные значения, поэтому изменение шкалы выполняется в одном месте и согласованно применяется ко всему сайту.", "Store the scale steps in CSS custom properties (design tokens). Components reference tokens rather than raw values, so the scale is changed in one place and applied consistently across the site."),
          points: [
            t("Числовые токены (--step-0, --step-1) описывают шкалу, смысловые (--font-size-h2, --font-size-caption) — её применение.", "Numeric tokens (--step-0, --step-1) describe the scale; semantic tokens (--font-size-h2, --font-size-caption) describe its use."),
            t("Те же токены используются в макете (переменные Figma), что упрощает согласование дизайна и вёрстки.", "The same tokens are used in the mockup (Figma variables), simplifying design–code alignment.")
          ],
          code: ":root {\n  --step-0: 1rem;       /* 16px */\n  --step-1: 1.25rem;    /* 20px */\n  --step-2: 1.5625rem;  /* 25px */\n  --step-3: 1.9531rem;  /* 31.25px */\n\n  --font-size-body: var(--step-0);\n  --font-size-h2:   var(--step-3);\n}\nh2 { font-size: var(--font-size-h2); }",
          sources: [R.utopia, R.mdnClamp]
        },
        {
          kind: "web",
          title: t("Адаптивная шкала", "Fluid type scale"),
          body: t("На узком экране крупные ступени шкалы занимают непропорционально много места, поэтому для мобильных устройств выбирают меньший базовый кегль и коэффициент, для широких экранов — больший. Функция clamp() позволяет плавно интерполировать каждую ступень между двумя состояниями без медиазапросов.", "On narrow screens large steps take disproportionate space, so mobile layouts use a smaller base and ratio, wide screens larger ones. clamp() interpolates each step smoothly between two states without media queries."),
          points: [
            t("Предпочтительное значение внутри clamp() записывается как сумма rem и vw: так кегль реагирует и на ширину окна, и на масштабирование страницы (WCAG 1.4.4).", "The preferred value in clamp() is a sum of rem and vw, so the size responds both to window width and to page zoom (WCAG 1.4.4)."),
            t("Расчёт удобно выполнять в специализированных калькуляторах, например Utopia, который генерирует токены --step-n.", "Use a dedicated calculator such as Utopia, which generates --step-n tokens.")
          ],
          demo: "fluidscale",
          sources: [R.utopia, R.mdnClamp, R.wcagResize]
        },
        {
          kind: "idea",
          title: t("Средства иерархии помимо кегля", "Hierarchy beyond size"),
          body: t("Кегль — не единственное и не всегда лучшее средство иерархии. Сочетание нескольких средств позволяет обойтись меньшим разрывом в размерах, что особенно важно на мобильных экранах.", "Size is neither the only nor always the best means of hierarchy. Combining means allows smaller size differences, which matters especially on mobile screens."),
          points: [
            t("Насыщенность: полужирный подзаголовок при умеренном увеличении кегля.", "Weight: a semibold subheading with a modest size increase."),
            t("Цвет и контраст: вторичная информация набирается приглушённым цветом, сохраняющим контраст не менее 4.5:1.", "Colour and contrast: secondary information in a muted colour that keeps at least 4.5:1 contrast."),
            t("Регистр и разрядка: рубрики и надписи прописными с увеличенным межбуквенным интервалом.", "Case and letter spacing: kickers and labels in capitals with extra tracking."),
            t("Пробелы: по закону близости заголовок должен быть ближе к тексту, к которому относится, чем к предыдущему.", "White space: by the law of proximity, a heading must be closer to the text it introduces than to the preceding text.")
          ],
          demo: "proximity",
          sources: [R.butterickHeadings, R.rutterRhythm]
        },
        {
          kind: "web",
          title: t("Интерлиньяж и отступы заголовков", "Heading line height and spacing"),
          figure: "headspace",
          body: t("Заголовки набираются с меньшим интерлиньяжем, чем основной текст (1.1–1.25), а вертикальные отступы между элементами целесообразно выводить из базового интерлиньяжа. Это создаёт вертикальный ритм — согласованность интервалов по всей странице.", "Headings use tighter line height than body text (1.1–1.25), and vertical spacing between elements is best derived from the base line height. This creates vertical rhythm, a consistency of intervals across the page."),
          points: [
            t("Отступ над заголовком делается больше, чем под ним: margin-block: 2em 0.5em.", "Space above a heading is larger than below: margin-block: 2em 0.5em."),
            t("Единицы lh и rlh равны интерлиньяжу элемента и корневого элемента соответственно и позволяют задавать отступы, кратные строке.", "The lh and rlh units equal the line height of the element and of the root, allowing spacing in multiples of a line."),
            t("Для многострочных заголовков применяйте text-wrap: balance.", "Apply text-wrap: balance to multi-line headings.")
          ],
          code: "h2 {\n  font-size: var(--step-3);\n  line-height: 1.2;\n  margin-block: 2rlh 0.5rlh;\n  text-wrap: balance;\n}",
          sources: [R.rutterRhythm, R.mdnLength, R.mdnTextWrap]
        },
        {
          kind: "task",
          title: t("Восстановите иерархию", "Restore the hierarchy"),
          body: t("Исправьте кегли заголовков и отбивки так, чтобы иерархия страницы читалась однозначно.", "Fix heading sizes and spacing so that the page hierarchy reads unambiguously."),
          demo: "tHierarchy"
        },
        {
          kind: "web",
          title: t("Семантика и оформление заголовков", "Heading semantics and presentation"),
          body: t("Уровень заголовка в HTML определяется структурой документа, а не желаемым размером. Вспомогательные технологии используют заголовки для навигации, поэтому нарушение их последовательности затрудняет работу со страницей.", "The HTML heading level is determined by document structure, not by the desired size. Assistive technologies use headings for navigation, so an inconsistent sequence hinders use of the page."),
          points: [
            t("На странице, как правило, один заголовок h1, описывающий её содержание.", "A page usually has a single h1 describing its content."),
            t("Уровни не пропускаются: за h2 следует h3, а не h4.", "Levels are not skipped: h2 is followed by h3, not h4."),
            t("Визуальный размер задаётся классами: заголовок карточки может быть h3 и при этом набираться кеглем основного текста.", "Visual size is set by classes: a card title can be an h3 while set at body size.")
          ],
          code: t("<h2 class=\"title-l\">Каталог курсов</h2>\n<article>\n  <h3 class=\"title-s\">Веб-типографика</h3>\n</article>\n\n.title-l { font-size: var(--step-3); }\n.title-s { font-size: var(--step-1); }", "<h2 class=\"title-l\">Course catalogue</h2>\n<article>\n  <h3 class=\"title-s\">Web typography</h3>\n</article>\n\n.title-l { font-size: var(--step-3); }\n.title-s { font-size: var(--step-1); }"),
          sources: [R.mdnHeadings, R.wcagHeadings]
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("В разделе с заголовком h2 расположены карточки товаров. Название товара по макету набрано кеглем основного текста. Какая разметка корректна?", "A section with an h2 heading contains product cards. In the mockup, product names are set at body size. Which markup is correct?"),
            options: [t("<p><b>Название</b></p> — заголовок для карточки не нужен", "<p><b>Name</b></p> — the card needs no heading"), t("<h3 class=\"title-s\">Название</h3> — уровень по структуре", "<h3 class=\"title-s\">Name</h3> — level by structure"), t("<h6>Название</h6> — уровень выбран по самому мелкому кеглю", "<h6>Name</h6> — level chosen for the smallest size")],
            answer: 1,
            explain: t("Название карточки — заголовок подраздела внутри h2, поэтому ему соответствует h3; кегль задаётся классом. Выбор h6 ради размера нарушает последовательность уровней.", "The card title is a subsection heading within the h2, so h3 is appropriate; size is set by a class. Choosing h6 for its size breaks the heading sequence.")
          }
        },
        {
          kind: "check", demo: "audit",
          title: t("Анализ образца", "Sample analysis"),
          quiz: {
            q: t("Какие ошибки построения иерархии допущены в образце?", "Which hierarchy errors does the sample contain?"),
            options: [t("Подзаголовок не отличается от текста, отбивка над ним меньше, чем под ним", "The subheading looks like body text and has less space above than below"), t("Слишком много уровней заголовков, а весь текст выключен по центру страницы", "Too many heading levels and all text is centred on the page"), t("Лид набран более крупным кеглем, чем основной текст под ним", "The lead is set larger than the body text below it")],
            answer: 0,
            explain: t("Подзаголовок «Методика» набран кеглем и насыщенностью основного текста и визуально примыкает к следующему абзацу хуже, чем к предыдущему. Кроме того, рубрика, лид и подпись также не дифференцированы.", "The subheading “Method” has the size and weight of body text and is closer to the preceding paragraph than to the following one. The kicker, lead and caption are not differentiated either.")
          }
        },
        {
          kind: "check",
          title: t("Контроль: коэффициенты шкалы", "Review: scale ratios"),
          match: {
            q: t("Сопоставьте коэффициенты модульной шкалы и их названия.", "Match the modular scale ratios to their names."),
            pairs: [
              { term: t("Большая секунда", "Major second"), def: t("1.125", "1.125") },
              { term: t("Малая терция", "Minor third"), def: t("1.2", "1.2") },
              { term: t("Большая терция", "Major third"), def: t("1.25", "1.25") },
              { term: t("Чистая кварта", "Perfect fourth"), def: t("1.333", "1.333") },
              { term: t("Чистая квинта", "Perfect fifth"), def: t("1.5", "1.5") },
              { term: t("Золотое сечение", "Golden ratio"), def: t("1.618", "1.618") }
            ]
          }
        }
      ],
      cheatsheet: [
        t("Иерархия строится кеглем, насыщенностью, цветом, регистром, пробелами; соседние уровни должны заметно различаться.", "Build hierarchy with size, weight, colour, case and space; adjacent levels must differ noticeably."),
        t("Два-три уровня заголовков обычно достаточно.", "Two or three heading levels are usually enough."),
        t("Модульная шкала: кегль = база × коэффициентⁿ; шкала — инструмент, значения можно корректировать.", "Modular scale: size = base × ratioⁿ; it is a tool, values may be adjusted."),
        t("1.125–1.2 — интерфейсы и мобильные экраны; 1.25–1.333 — универсально; 1.5–1.618 — выразительные заголовки.", "1.125–1.2 for interfaces and mobile; 1.25–1.333 versatile; 1.5–1.618 for expressive headlines."),
        t("Шкала хранится в токенах (--step-n), компоненты используют смысловые токены.", "Keep the scale in tokens (--step-n); components use semantic tokens."),
        t("Адаптивная шкала — clamp() с rem + vw; на мобильных меньше база и коэффициент.", "Fluid scale: clamp() with rem + vw; smaller base and ratio on mobile."),
        t("Отступ над заголовком больше, чем под ним; интерлиньяж заголовков 1.1–1.25.", "More space above a heading than below; heading line height 1.1–1.25."),
        t("Уровень h1–h6 — по структуре, размер — классом; один h1, без пропуска уровней.", "h1–h6 by structure, size by class; one h1, no skipped levels.")
      ],
      readings: [R.timBrown, R.typeScale, R.utopia, R.butterickHeadings, R.rutterRhythm, R.mdnClamp, R.mdnLength, R.mdnHeadings, R.wcagHeadings, R.webdevDesignType]
    },
    {
      id: "pairing", minutes: 50,
      title: t("Сочетание шрифтов", "Font pairing"),
      goal: t("Подбирать сочетания гарнитур на основе структурного сходства и функционального контраста с учётом кириллицы и объёма загрузки.", "Pair typefaces based on structural affinity and functional contrast, with attention to Cyrillic and payload size."),
      topics: [],
      cards: [
        {
          kind: "try", demo: "pairbuilder",
          title: t("Конструктор шрифтовой пары", "Font pair builder"),
          body: t("Подберите гарнитуры для заголовков и основного текста. Сравните несколько вариантов: две антиквы, антикву с гротеском, два гротеска одного подкласса. Наблюдения под образцом фиксируют формальные признаки сочетания, но окончательную оценку даёте вы.", "Choose typefaces for headings and body text. Compare several options: two serifs, a serif with a sans, two sans of the same subclass. The observations below the sample record formal features of the pairing, but the final judgement is yours.")
        },
        {
          kind: "idea",
          title: t("Функции шрифтов в макете", "Functions of typefaces in a layout"),
          figure: "roles",
          body: t("Вторая гарнитура оправдана, только если она выполняет отдельную функцию: заголовки и основной текст, интерфейс и содержание, текст и программный код. Во многих случаях иерархию достаточно построить средствами одной гарнитуры — кеглем, насыщенностью и курсивом.", "A second typeface is justified only when it serves a distinct function: headings vs body, interface vs content, text vs code. In many cases one typeface suffices, with hierarchy built through size, weight and italic."),
          points: [
            t("Большинство макетов допускает вторую гарнитуру, немногие — третью; четыре и более практически всегда избыточны.", "Most layouts tolerate a second typeface, few a third; four or more are almost always excessive."),
            t("За каждой гарнитурой закрепляется постоянная роль; смена шрифта внутри абзаца недопустима.", "Each typeface has a consistent role; switching fonts within a paragraph is not acceptable."),
            t("Перед добавлением новой гарнитуры следует исчерпать возможности начертаний уже выбранной.", "Before adding a typeface, exhaust the styles of the one already chosen.")
          ],
          sources: [R.butterickMixing, R.skillboxPairs]
        },
        {
          kind: "idea",
          title: t("Контраст и общность", "Contrast and affinity"),
          figure: "contrastcommon",
          body: t("Удачная пара сочетает явное различие по одному-двум признакам с общностью по остальным. Различие обеспечивает функциональное разграничение, общность — целостность макета.", "A successful pair combines a clear difference in one or two features with affinity in the others. The difference separates functions; the affinity keeps the layout coherent."),
          points: [
            t("Параметры сравнения: пропорции, апертура, насыщенность и наклон, форма овалов, контраст штриха.", "Parameters for comparison: proportions, aperture, weight and slope, oval shape, stroke contrast."),
            t("Типичный источник общности — сходные пропорции, близкая высота строчных, общая историческая или конструктивная основа.", "Typical sources of affinity: similar proportions, close x-heights, a shared historical or constructional basis."),
            t("Сочетание двух сходных, но не идентичных гарнитур (например, двух неогротесков) создаёт конфликт: различие воспринимается как ошибка, а не как замысел.", "Pairing two similar but non-identical typefaces (e.g. two neo-grotesques) creates conflict: the difference reads as a mistake rather than intent."),
            t("Сочетание двух выразительных акцидентных шрифтов приводит к конкуренции: ни один не становится доминирующим.", "Combining two expressive display faces leads to competition: neither dominates.")
          ],
          sources: [R.skillboxPairs, R.butterickMixing]
        },
        {
          kind: "check", demo: "pairsamples",
          title: t("Анализ сочетаний", "Analysing pairings"),
          quiz: {
            q: t("Какое из трёх сочетаний построено по принципу «контраст и общность»?", "Which of the three pairings follows the principle of contrast and affinity?"),
            options: [t("Вариант А", "Option A"), t("Вариант Б", "Option B"), t("Вариант В", "Option C")],
            answer: 2, fixedOrder: true,
            explain: t("А — два выразительных шрифта, к тому же рукописный в основном тексте: конкуренция и низкая удобочитаемость. Б — два близких неогротеска (Roboto и Inter): конфликт сходства. В — классицистическая антиква в заголовках и гуманистический гротеск в тексте: ясное функциональное различие.", "A: two expressive faces, with a script in body text: competition and poor readability. B: two similar neo-grotesques (Roboto and Inter), a conflict of similarity. C: a didone for headings and a humanist sans for text, a clear functional distinction.")
          }
        },
        {
          kind: "task",
          title: t("Найдите конфликтную пару", "Find the conflicting pair"),
          body: t("В каждом наборе одна пара составлена из слишком похожих гарнитур. Найдите её.", "In each set one pair consists of typefaces that are too similar. Find it."),
          demo: "tConflict"
        },
        {
          kind: "idea",
          title: t("Суперсемейства", "Superfamilies"),
          body: t("Суперсемейство — набор гарнитур разных классов, спроектированных по единым принципам: с согласованными пропорциями, высотой строчных и характером. Это наиболее надёжный способ получить гармоничное сочетание антиквы, гротеска и моноширинного шрифта.", "A superfamily is a set of typefaces of different classes designed on common principles, with consistent proportions, x-height and character. It is the most reliable way to combine a serif, a sans and a monospace harmoniously."),
          points: [
            t("PT Sans, PT Serif и PT Mono созданы компанией ParaType в рамках проекта «Общедоступные шрифты народов России» и отличаются развитой кириллицей.", "PT Sans, PT Serif and PT Mono were created by ParaType for the Public Types of Russian Federation project and have extensive Cyrillic support."),
            t("Другие примеры из каталога курса: Source Sans / Source Serif / Source Code (Adobe), Roboto / Roboto Slab / Roboto Mono, IBM Plex Sans / Plex Mono, Noto Sans / Noto Serif.", "Other examples from the course catalogue: Source Sans / Source Serif / Source Code (Adobe), Roboto / Roboto Slab / Roboto Mono, IBM Plex Sans / Plex Mono, Noto Sans / Noto Serif."),
            t("Сочетания гарнитур одного автора также, как правило, гармоничны.", "Typefaces by the same designer also tend to pair well.")
          ],
          demo: "superfamily",
          sources: [R.gfPtSans, R.butterickMixing]
        },
        {
          kind: "web",
          title: t("Согласование гарнитур в одной строке", "Aligning typefaces on the same line"),
          body: t("Когда две гарнитуры используются в одной строке — фрагменты кода в тексте, интерфейсные метки внутри абзаца, — различие высоты строчных делает их визуально несоразмерными. Обычная практика — уменьшать кегль кода (например, 0.9em), однако точнее выравнивать высоту строчных свойством font-size-adjust.", "When two typefaces share a line — code in prose, interface labels within a paragraph — differing x-heights make them look mismatched. A common fix is to shrink code (e.g. 0.9em), but font-size-adjust aligns x-heights more precisely."),
          code: t("p { font-family: \"PT Serif\", serif; }\ncode {\n  font-family: \"JetBrains Mono\", monospace;\n  font-size-adjust: ex-height 0.50;  /* как у PT Serif */\n}", "p { font-family: \"PT Serif\", serif; }\ncode {\n  font-family: \"JetBrains Mono\", monospace;\n  font-size-adjust: ex-height 0.50;  /* matches PT Serif */\n}"),
          demo: "inlinemix",
          sources: [R.mdnFontSizeAdjust]
        },
        {
          kind: "idea",
          title: t("Кириллица в шрифтовой паре", "Cyrillic in a font pair"),
          body: t("Рекомендации по сочетанию шрифтов и сервисы подбора пар, как правило, ориентированы на латиницу. Кириллица одной из гарнитур может быть проработана слабее или иметь иной характер, чем латиница, и пара, удачная в английском тексте, может не сложиться в русском.", "Pairing guides and pairing services are usually Latin-oriented. The Cyrillic of one typeface may be weaker or differ in character from its Latin, so a pair that works in English may fail in Russian."),
          points: [
            t("Оценивайте пару на русском тексте с характерными знаками: Ж, Ф, Д, Л, б, ы.", "Evaluate the pair on Russian text with characteristic letters: Ж, Ф, Д, Л, б, ы."),
            t("Проверяйте, во всех ли нужных начертаниях есть кириллица.", "Check that Cyrillic is available in all the styles you need."),
            t("Для кириллицы существуют специализированные инструменты подбора пар, например комбинатор кириллических шрифтов Typotheque.", "Dedicated Cyrillic pairing tools exist, such as Typotheque's Cyrillic font combinator.")
          ],
          sources: [R.skillboxPairsTools, R.skillboxCyrillic]
        },
        {
          kind: "web",
          title: t("Стоимость шрифтовой пары", "The cost of a font pair"),
          body: t("Каждая дополнительная гарнитура увеличивает число загружаемых файлов и задержку отображения текста. Шрифтовая пара должна укладываться в бюджет загрузки: как правило, не более двух гарнитур по два-три начертания.", "Each additional typeface increases the number of files and delays text rendering. A font pair must fit the loading budget: usually no more than two typefaces with two or three styles each."),
          points: [
            t("Пример из каталога курса: вариативные Playfair Display и Source Sans 3 (прямые начертания, полный диапазон насыщенности) — 4 файла кириллицы и латиницы, около 104 КБ; статические PT Serif и PT Sans в насыщенностях 400 и 700 — 8 файлов, около 250 КБ.", "Course catalogue example: variable Playfair Display and Source Sans 3 (upright, full weight range) are 4 Cyrillic and Latin files, about 104 KB; static PT Serif and PT Sans at 400 and 700 are 8 files, about 250 KB."),
            t("Компромиссное решение — системный шрифт для интерфейса и одна веб-гарнитура для заголовков или основного текста.", "A compromise: a system font for the interface and a single web typeface for headings or body text."),
            t("Стратегии загрузки (font-display, preload, подмножества) рассматриваются в модуле 9.", "Loading strategies (font-display, preload, subsetting) are covered in module 9.")
          ],
          sources: [R.webdevFontBest, R.webdevVariable]
        },
        {
          kind: "web",
          title: t("Роли шрифтов в CSS", "Font roles in CSS"),
          body: t("Шрифтовую пару удобно описывать через пользовательские свойства, отражающие роли, а не названия гарнитур. Это позволяет заменить гарнитуру в одном месте и обеспечивает согласованность между макетом и кодом.", "Describe the font pair with custom properties named after roles rather than typefaces. This lets you replace a typeface in one place and keeps design and code consistent."),
          points: [
            t("Для каждой роли задаётся собственный список резервных шрифтов того же класса.", "Each role gets its own fallback list of the same class."),
            t("Типичные роли: --font-heading, --font-body, --font-ui, --font-mono.", "Typical roles: --font-heading, --font-body, --font-ui, --font-mono.")
          ],
          code: ":root {\n  --font-heading: \"Playfair Display\", Georgia, serif;\n  --font-body: \"Source Sans 3\", system-ui, sans-serif;\n  --font-mono: \"Source Code Pro\", ui-monospace, monospace;\n}\nh1, h2, h3 { font-family: var(--font-heading); }\nbody { font-family: var(--font-body); }\ncode { font-family: var(--font-mono); }",
          sources: [R.mdnFontFamily]
        },
        {
          kind: "task",
          title: t("Подберите гарнитуру для роли", "Choose a typeface for a role"),
          body: t("Подберите гарнитуру для заголовков новостного портала и для кода в документации. Проверка оценивает класс, насыщенность и согласование высоты строчных.", "Choose a typeface for news headlines and for code in documentation. The check assesses class, weight and x-height matching."),
          demo: "tHeadPick"
        },
        {
          kind: "task", demo: "brief",
          title: t("Шрифтовая пара для задачи", "A font pair for a brief"),
          body: t("Для каждого из четырёх проектов выберите наиболее уместное сочетание. После выбора будет показано обоснование.", "For each of four projects, choose the most appropriate pairing. A rationale is shown after each choice.")
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("Для заголовков выбран Roboto, для основного текста — Arimo. Какова основная проблема сочетания?", "Roboto is chosen for headings and Arimo for body text. What is the main problem?"),
            options: [t("Слишком высокий контраст между гарнитурами заголовков и основного текста", "Too much contrast between the heading and body typefaces"), t("Две близкие гарнитуры одного подкласса: различие выглядит ошибкой", "Two similar faces of one subclass: the difference looks like an error"), t("В одной из гарнитур отсутствуют кириллица и полноценный курсив", "One of the typefaces lacks Cyrillic and a true italic")],
            answer: 1,
            explain: t("Оба шрифта — неогротески со сходным рисунком. Их сочетание не создаёт функционального различия, но нарушает единство; уместнее использовать одну гарнитуру в разных насыщенностях.", "Both are neo-grotesques with similar designs. The pairing creates no functional distinction yet breaks unity; one typeface in different weights is preferable.")
          }
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("В каком случае использование третьей гарнитуры наиболее оправдано?", "When is a third typeface most justified?"),
            options: [t("Для выделения важных слов и терминов в основном тексте", "To emphasise important words and terms in body text"), t("Для фрагментов программного кода в технической документации", "For code snippets in technical documentation"), t("Для разнообразного оформления заголовков в разных разделах сайта", "For varied heading styles across sections of the site")],
            answer: 1,
            explain: t("Моноширинный шрифт для кода выполняет отдельную, чётко определённую функцию. Выделение в тексте решается начертаниями, а различные гарнитуры для заголовков разрушают единство системы.", "A monospace for code serves a distinct, well-defined function. Emphasis is handled by styles, and different typefaces for headings break the system's unity.")
          }
        }
      ],
      cheatsheet: [
        t("Вторая гарнитура нужна только для отдельной функции; третья — редко (например, моноширинная для кода).", "Add a second typeface only for a distinct function; a third rarely (e.g. monospace for code)."),
        t("Пара = явное различие по одному-двум признакам + общность по остальным.", "Pair = clear difference in one or two features + affinity in the rest."),
        t("Избегайте сочетания сходных гарнитур одного подкласса и двух акцидентных шрифтов.", "Avoid pairing similar typefaces of one subclass or two display faces."),
        t("Суперсемейства (PT, Source, Roboto, IBM Plex, Noto) — надёжная основа пары.", "Superfamilies (PT, Source, Roboto, IBM Plex, Noto) are a reliable basis."),
        t("Шрифты в одной строке согласуются по высоте строчных (font-size-adjust или коррекция кегля).", "Fonts on the same line are aligned by x-height (font-size-adjust or size correction)."),
        t("Пару проверяют на русском тексте и во всех нужных начертаниях.", "Test the pair in Russian text and in every required style."),
        t("Бюджет загрузки: не более двух гарнитур по 2–3 начертания; вариативные файлы экономнее.", "Loading budget: up to two typefaces with 2–3 styles each; variable files are leaner."),
        t("Шрифты описываются ролями в CSS (--font-heading, --font-body, --font-mono).", "Describe fonts by role in CSS (--font-heading, --font-body, --font-mono).")
      ],
      readings: [R.butterickMixing, R.skillboxPairs, R.skillboxPairsTools, R.gfPtSans, R.skillboxCyrillic, R.mdnFontSizeAdjust, R.webdevFontBest, R.webdevVariable, R.mdnFontFamily]
    },
    {
      id: "responsive", minutes: 55,
      title: t("Адаптивность и доступность", "Responsive and accessible type"),
      goal: t("Обеспечивать удобочитаемость текста на экранах различного формата и для пользователей с различными потребностями в соответствии с WCAG 2.1 и ГОСТ Р 52872-2019.", "Ensure text readability across screen formats and for users with diverse needs in line with WCAG 2.1 and GOST R 52872-2019."),
      topics: [],
      cards: [
        {
          kind: "try", demo: "contrastcheck",
          title: t("Проверка контраста", "Checking contrast"),
          body: t("Подберите цвета текста и фона и проследите, как требования WCAG зависят от кегля и насыщенности. Проверьте типичные сочетания: серый текст на белом, белый текст на светлом цветном фоне, текст-заполнитель в поле ввода.", "Choose text and background colours and observe how WCAG requirements depend on size and weight. Check typical combinations: grey on white, white on a light coloured background, placeholder text in a field.")
        },
        {
          kind: "idea",
          title: t("Требования к контрасту текста", "Text contrast requirements"),
          figure: "contrastscale",
          body: t("Контраст определяется как отношение относительной яркости более светлого и более тёмного цветов и выражается величиной от 1:1 до 21:1. Требования WCAG 2.1 положены в основу российского стандарта ГОСТ Р 52872-2019, действующего с 1 апреля 2020 года.", "Contrast is the ratio of the relative luminance of the lighter and darker colours, ranging from 1:1 to 21:1. WCAG 2.1 requirements underlie the Russian standard GOST R 52872-2019, in force since 1 April 2020."),
          points: [
            t("Уровень AA (критерий 1.4.3): не менее 4.5:1 для обычного текста и 3:1 для крупного. Крупным считается текст от 18 pt (около 24 px) или от 14 pt полужирного начертания (около 18.5 px).", "Level AA (1.4.3): at least 4.5:1 for normal text and 3:1 for large text. Large text is 18 pt (about 24 px) or 14 pt bold (about 18.5 px) and above."),
            t("Уровень AAA (критерий 1.4.6): 7:1 для обычного текста и 4.5:1 для крупного.", "Level AAA (1.4.6): 7:1 for normal text and 4.5:1 for large text."),
            t("Исключения: логотипы, декоративный текст, неактивные элементы интерфейса.", "Exceptions: logotypes, decorative text, inactive interface components."),
            t("Для границ полей, значков и индикаторов фокуса действует критерий 1.4.11 — не менее 3:1 относительно соседних цветов.", "Field borders, icons and focus indicators fall under 1.4.11: at least 3:1 against adjacent colours.")
          ],
          sources: [R.wcagContrast, R.wcagNonText, R.gost52872]
        },
        {
          kind: "web",
          title: t("Контраст на практике", "Contrast in practice"),
          body: t("Формальное соответствие коэффициенту не гарантирует удобочитаемости: на восприятие влияют насыщенность и кегль, сглаживание шрифта и условия освещения. Наиболее частые нарушения связаны с вторичным текстом и элементами, оформленными «по макету».", "Formal compliance does not guarantee readability: weight and size, font smoothing and lighting affect perception. Most violations involve secondary text and elements styled to match a mockup."),
          points: [
            t("Серый текст-заполнитель (placeholder) и подписи к полям часто не достигают 4.5:1; заполнитель не должен заменять подпись поля.", "Grey placeholder text and field hints often fall below 4.5:1; a placeholder must not replace a field label."),
            t("Белый текст на насыщенном светлом фоне (голубом, оранжевом, зелёном) обычно не достигает 4.5:1 — характерная ошибка в кнопках.", "White text on a light saturated background (light blue, orange, green) usually falls short of 4.5:1, a typical button error."),
            t("Текст поверх изображения требует подложки или затемнения, обеспечивающего контраст по всей площади текста.", "Text over images needs an overlay ensuring contrast across the whole text area."),
            t("Светлые начертания снижают фактическую различимость при формально достаточном контрасте. Альтернативные модели расчёта, учитывающие кегль и насыщенность (например, APCA), обсуждаются профессиональным сообществом, но нормативными не являются.", "Light weights reduce actual legibility even with formally sufficient contrast. Alternative models accounting for size and weight (e.g. APCA) are discussed professionally but are not normative.")
          ],
          sources: [R.webaimContrast, R.wcagContrast]
        },
        {
          kind: "task",
          title: t("Соответствует ли AA", "Does it pass AA"),
          body: t("Для каждого образца определите, соответствует ли сочетание цветов и кегля требованиям WCAG AA.", "For each sample decide whether the colour and size combination meets WCAG AA."),
          demo: "tWcagJudge"
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("Какой из серых цветов на белом фоне минимально достаточен для основного текста кеглем 16 px по уровню AA?", "Which grey on white is the minimum acceptable for 16 px body text at level AA?"),
            options: [t("#999999 (контраст 2.85:1)", "#999999 (contrast 2.85:1)"), t("#767676 (контраст 4.54:1)", "#767676 (contrast 4.54:1)"), t("#AAAAAA (контраст 2.32:1)", "#AAAAAA (contrast 2.32:1)")],
            answer: 1,
            explain: t("Для обычного текста требуется не менее 4.5:1; #767676 — один из самых светлых серых, удовлетворяющих этому требованию на белом фоне.", "Normal text requires at least 4.5:1; #767676 is among the lightest greys that meet it on white.")
          }
        },
        {
          kind: "task",
          title: t("Исправьте контраст", "Fix the contrast"),
          body: t("Доведите контраст до требуемого уровня, изменяя только светлоту цвета и не утрачивая его характера.", "Raise contrast to the required level by changing lightness only, without losing the colour's character."),
          demo: "tFixContrast"
        },
        {
          kind: "web",
          title: t("Тёмная тема", "Dark mode"),
          body: t("Тёмная тема реализуется по системной настройке пользователя (prefers-color-scheme). Свойство color-scheme сообщает браузеру о поддерживаемых схемах, а функция light-dark() (Baseline 2024) позволяет задавать пары цветов без дублирования правил.", "Dark mode follows the user's system setting (prefers-color-scheme). The color-scheme property tells the browser which schemes are supported, and light-dark() (Baseline 2024) defines colour pairs without duplicating rules."),
          points: [
            t("Контраст проверяется в обеих темах: цвет, достаточный на белом фоне, может оказаться недостаточным на тёмном.", "Check contrast in both themes: a colour sufficient on white may be insufficient on dark."),
            t("Сочетание чисто белого текста с чисто чёрным фоном даёт максимальный контраст 21:1, однако многие дизайн-системы используют смягчённые пары, чтобы снизить эффект ореола.", "Pure white on pure black gives the maximum 21:1, but many design systems use softened pairs to reduce halation."),
            t("Насыщенность основного текста в тёмной теме допустимо снизить (см. модуль 3).", "Body weight may be reduced in dark mode (see module 3).")
          ],
          code: ":root { color-scheme: light dark; }\nbody {\n  color: light-dark(#1b2233, #e3e6eb);\n  background: light-dark(#ffffff, #16181d);\n}",
          demo: "darkpair",
          sources: [R.mdnLightDark]
        },
        {
          kind: "web",
          title: t("Пользовательские настройки отображения", "User display preferences"),
          body: t("Пользователь может изменить базовый размер шрифта, масштаб страницы, контрастность и цветовую схему. Вёрстка должна корректно работать при любом сочетании этих настроек и не блокировать их.", "Users may change the base font size, page zoom, contrast and colour scheme. The layout must work with any combination of these settings and must not block them."),
          points: [
            t("Не запрещайте масштабирование: значения maximum-scale=1 и user-scalable=no в метатеге viewport препятствуют увеличению текста.", "Do not disable zoom: maximum-scale=1 and user-scalable=no in the viewport meta tag prevent text enlargement."),
            t("prefers-contrast: more позволяет усилить контраст и толщину рамок по запросу пользователя.", "prefers-contrast: more lets you strengthen contrast and borders on request."),
            t("В режиме принудительных цветов (forced-colors, например высококонтрастная тема Windows) браузер заменяет цвета системными и отключает тени, поэтому смысл не должен передаваться только цветом фона или тенью текста.", "In forced-colors mode (e.g. Windows high contrast), the browser replaces colours with system colours and removes shadows, so meaning must not rely on background colour or text shadow alone.")
          ],
          code: "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n\n@media (prefers-contrast: more) {\n  body { color: #000; }\n}\n@media (forced-colors: active) {\n  .badge { border: 1px solid CanvasText; }\n}",
          sources: [R.mdnPrefersContrast, R.mdnForcedColors, R.wcagResize]
        },
        {
          kind: "web",
          title: t("Перекомпоновка при увеличении", "Reflow on zoom"),
          body: t("Критерий WCAG 1.4.10 требует, чтобы при ширине области просмотра 320 CSS px — что соответствует увеличению 400 % при исходной ширине 1280 px — содержимое читалось без горизонтальной прокрутки. Для текста это означает отказ от фиксированной ширины блоков и гибкую разметку.", "WCAG 1.4.10 requires that at a 320 CSS px viewport — equivalent to 400% zoom at 1280 px — content reads without horizontal scrolling. For text this means no fixed block widths and a flexible layout."),
          points: [
            t("Ширина текстовых блоков задаётся через max-width в ch или rem, а не через width в пикселях.", "Text block width uses max-width in ch or rem, not width in pixels."),
            t("Исключения — таблицы данных, карты, схемы, код с значимыми отступами; их помещают в отдельный прокручиваемый контейнер.", "Exceptions — data tables, maps, diagrams, code with meaningful indentation — go into their own scrolling container."),
            t("Медиазапросы удобно задавать в em или rem: тогда макет перестраивается и при увеличении базового размера шрифта.", "Write media queries in em or rem so the layout also adapts when the base font size grows.")
          ],
          code: ".article { max-width: 65ch; padding-inline: 1rem; }\n@media (min-width: 48em) { .layout { display: grid; } }\n.table-wrap { overflow-x: auto; }",
          demo: "reflow",
          sources: [R.wcagReflow, R.comeau]
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("В шаблоне сайта указано <meta name=\"viewport\" content=\"width=device-width, maximum-scale=1, user-scalable=no\">. В чём проблема?", "A template has <meta name=\"viewport\" content=\"width=device-width, maximum-scale=1, user-scalable=no\">. What is the problem?"),
            options: [t("Страница перестанет адаптироваться к ширине экрана устройства", "The page will stop adapting to the screen width"), t("Пользователь не сможет увеличить текст жестом масштабирования", "Users cannot enlarge text with the zoom gesture"), t("Браузер не будет загружать веб-шрифты и подставит системные шрифты", "The browser will skip web fonts and use system fonts")],
            answer: 1,
            explain: t("Запрет масштабирования лишает пользователей со слабым зрением возможности увеличить текст и противоречит критерию WCAG 1.4.4. Достаточно width=device-width, initial-scale=1.", "Disabling zoom prevents low-vision users from enlarging text and conflicts with WCAG 1.4.4. width=device-width, initial-scale=1 is sufficient.")
          }
        },
        {
          kind: "idea",
          title: t("Ссылки, фокус и интерактивные элементы", "Links, focus and interactive elements"),
          body: t("Ссылки в тексте должны распознаваться не только по цвету: пользователи с нарушениями цветового зрения могут не различить их. Если ссылка выделена только цветом, её контраст с окружающим текстом должен составлять не менее 3:1 (техника G183); более надёжное решение — подчёркивание.", "Links in text must be recognisable by more than colour, which users with colour vision deficiencies may not perceive. If only colour is used, the link must contrast at least 3:1 with surrounding text (technique G183); underlining is more reliable."),
          points: [
            t("Оформление подчёркивания настраивается свойствами text-decoration-thickness и text-underline-offset.", "Underlines can be refined with text-decoration-thickness and text-underline-offset."),
            t("Индикатор фокуса клавиатуры должен быть видимым (критерий 2.4.7) и контрастным (1.4.11); удалять outline без замены недопустимо.", "The keyboard focus indicator must be visible (2.4.7) and contrasting (1.4.11); never remove outline without a replacement."),
            t("Размер области нажатия интерактивных элементов — не менее 24×24 CSS px (WCAG 2.2, критерий 2.5.8); ссылки внутри предложений из этого требования исключены.", "Interactive targets must be at least 24×24 CSS px (WCAG 2.2, 2.5.8); links within sentences are exempt.")
          ],
          code: "a {\n  text-decoration: underline;\n  text-decoration-thickness: 1px;\n  text-underline-offset: 0.18em;\n}\na:focus-visible { outline: 3px solid currentColor; outline-offset: 2px; }",
          demo: "links",
          sources: [R.wcagUseOfColor, R.g183, R.wcagTarget]
        },
        {
          kind: "idea",
          title: t("Дислексия и слабое зрение", "Dyslexia and low vision"),
          body: t("Рекомендации British Dyslexia Association ориентированы на общую удобочитаемость и полезны всем читателям. Специализированные «дислексические» шрифты, по данным исследований, не дают преимущества: в работе Кустера и соавторов (2017) шрифт Dyslexie не улучшил ни скорость, ни точность чтения у детей с дислексией по сравнению с Arial.", "British Dyslexia Association guidance focuses on general readability and benefits all readers. Specialised “dyslexia fonts” show no advantage in research: Kuster et al. (2017) found that Dyslexie did not improve reading speed or accuracy in children with dyslexia compared with Arial."),
          points: [
            t("Кегль 16–19 px, интерлиньяж около 1.5, выравнивание по левому краю без выключки по формату.", "Size 16–19 px, line spacing around 1.5, left alignment without justification."),
            t("Для выделения — полужирное начертание; курсив, подчёркивание и набор прописными затрудняют распознавание слов.", "Use bold for emphasis; italics, underlining and all caps hinder word recognition."),
            t("Однотонный фон без узоров; тёмный текст на светлом, но не обязательно чисто белом фоне.", "Plain backgrounds without patterns; dark text on a light, not necessarily pure white, background."),
            t("Важнее всего — не препятствовать пользовательским настройкам: размеру шрифта, интервалам, цветам.", "Above all, do not block user settings for font size, spacing and colours.")
          ],
          demo: "readability",
          sources: [R.bdaGuide, R.dyslexieStudy, R.wcagSpacing]
        },
        {
          kind: "web",
          title: t("Текст для вспомогательных технологий", "Text for assistive technologies"),
          body: t("Программы экранного доступа читают текст, а не его изображение. Поэтому оформление должно создаваться средствами CSS, а язык текста — указываться в разметке.", "Screen readers read text, not images of it. Styling must therefore be done with CSS, and the language of text declared in markup."),
          points: [
            t("Атрибут lang у элемента html и у иноязычных фрагментов определяет произношение синтезатора речи, а также правила переносов (критерии 3.1.1 и 3.1.2).", "The lang attribute on html and on foreign-language fragments determines speech synthesis pronunciation and hyphenation (3.1.1 and 3.1.2)."),
            t("Изображения текста не допускаются, если тот же результат достижим средствами CSS (критерий 1.4.5); исключение — логотипы.", "Images of text are not allowed when CSS can achieve the result (1.4.5); logotypes are an exception."),
            t("Разрядка создаётся свойством letter-spacing, а не пробелами между буквами: текст «Т Е К С Т» читается программами экранного доступа по буквам.", "Letter spacing must use letter-spacing, not spaces between letters: “T E X T” is read letter by letter by screen readers."),
            t("Прописные создаются свойством text-transform: uppercase, а исходный текст набирается в обычном регистре.", "Capitals are produced with text-transform: uppercase while the source text keeps normal case.")
          ],
          code: t("<html lang=\"ru\">\n<p>Термин <span lang=\"en\">kerning</span> обозначает…</p>\n\n.label { text-transform: uppercase; letter-spacing: 0.08em; }", "<html lang=\"en\">\n<p>The term <span lang=\"fr\">mise en page</span> means…</p>\n\n.label { text-transform: uppercase; letter-spacing: 0.08em; }"),
          sources: [R.wcagImagesOfText, R.mdnHyphens]
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("В макете рубрика набрана вразрядку прописными: «Н О В О С Т И». Как корректно реализовать это в вёрстке?", "A mockup sets a kicker in spaced capitals: “N E W S”. How should it be implemented?"),
            options: [t("Набрать в HTML «Н О В О С Т И» с пробелами между всеми буквами", "Type the letters with spaces between them in HTML"), t("Набрать «Новости», задать text-transform и letter-spacing", "Type “News” and set text-transform and letter-spacing"), t("Вставить рубрику изображением с подписью в атрибуте alt", "Insert the kicker as an image with alt text")],
            answer: 1,
            explain: t("Пробелы между буквами разрушают слово для программ экранного доступа и поиска, изображение текста нарушает критерий 1.4.5. Регистр и разрядка задаются средствами CSS.", "Spaces between letters break the word for screen readers and search, and an image of text violates 1.4.5. Case and spacing belong in CSS.")
          }
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("Заказчик предлагает подключить «шрифт для людей с дислексией» вместо основного. Какой аргумент наиболее обоснован?", "A client suggests replacing the main font with a “dyslexia font”. Which argument is best supported?"),
            options: [t("Такие шрифты доказанно ускоряют чтение у всех пользователей сайта", "Such fonts are proven to speed up reading for all users"), t("Исследования не подтверждают пользы; важнее удобочитаемый набор", "Research shows no benefit; readable typesetting matters more"), t("Применение таких шрифтов обязательно по требованиям WCAG 2.1", "Such fonts are mandatory under WCAG 2.1")],
            answer: 1,
            explain: t("Дислексия — языковое, а не зрительное нарушение; в исследовании Кустера и соавторов шрифт Dyslexie не дал преимуществ перед Arial. WCAG не предписывает конкретных гарнитур.", "Dyslexia is a language-based, not visual, disorder; Kuster et al. found no advantage of Dyslexie over Arial. WCAG prescribes no specific typefaces.")
          }
        },
        {
          kind: "check",
          title: t("Контроль: критерии WCAG", "Review: WCAG criteria"),
          match: {
            q: t("Сопоставьте критерии WCAG и их требования.", "Match the WCAG criteria to their requirements."),
            pairs: [
              { term: t("1.4.3 Контраст (минимальный)", "1.4.3 Contrast (Minimum)"), def: t("4.5:1 для обычного текста, 3:1 для крупного", "4.5:1 for normal text, 3:1 for large text") },
              { term: t("1.4.4 Изменение размера текста", "1.4.4 Resize Text"), def: t("Увеличение текста до 200 % без потери содержимого", "Text resizable to 200% without loss of content") },
              { term: t("1.4.10 Перекомпоновка", "1.4.10 Reflow"), def: t("Отсутствие горизонтальной прокрутки при ширине 320 CSS px", "No horizontal scrolling at 320 CSS px width") },
              { term: t("1.4.12 Межстрочные интервалы", "1.4.12 Text Spacing"), def: t("Сохранность содержимого при увеличенных интервалах", "No loss of content with increased spacing") },
              { term: t("1.4.1 Использование цвета", "1.4.1 Use of Color"), def: t("Цвет не является единственным средством передачи информации", "Colour is not the only means of conveying information") },
              { term: t("2.5.8 Размер области нажатия", "2.5.8 Target Size"), def: t("Не менее 24×24 CSS px для интерактивных элементов", "At least 24×24 CSS px for interactive targets") }
            ]
          }
        }
      ],
      cheatsheet: [
        t("Контраст текста: 4.5:1 (обычный), 3:1 (крупный: от 24 px или 18.5 px полужирного); AAA — 7:1.", "Text contrast: 4.5:1 normal, 3:1 large (24 px+ or 18.5 px bold); AAA 7:1."),
        t("Элементы интерфейса и фокус — не менее 3:1 к соседним цветам.", "UI components and focus: at least 3:1 against adjacent colours."),
        t("Проверяйте вторичный текст, заполнители, кнопки и текст на изображениях; контраст — в обеих темах.", "Check secondary text, placeholders, buttons and text on images; contrast in both themes."),
        t("Не запрещайте масштабирование; учитывайте prefers-contrast и forced-colors.", "Never disable zoom; support prefers-contrast and forced-colors."),
        t("320 CSS px без горизонтальной прокрутки: max-width вместо width, медиазапросы в em.", "320 CSS px without horizontal scrolling: max-width instead of width, media queries in em."),
        t("Ссылки — не только цветом; видимый фокус; области нажатия от 24×24 px.", "Links not by colour alone; visible focus; targets 24×24 px or larger."),
        t("Удобочитаемость для всех: 16–19 px, интерлиньяж ~1.5, выравнивание влево, без курсива и капса в длинном тексте.", "Readability for all: 16–19 px, line spacing ~1.5, left aligned, no long italics or caps."),
        t("Регистр и разрядка — средствами CSS; язык — атрибутом lang; текст — текстом, а не изображением.", "Case and spacing via CSS; language via lang; text as text, not images.")
      ],
      readings: [R.gost52872, R.wcagContrast, R.wcagNonText, R.webaimContrast, R.wcagReflow, R.wcagUseOfColor, R.g183, R.wcagTarget, R.wcagImagesOfText, R.mdnLightDark, R.mdnPrefersContrast, R.mdnForcedColors, R.bdaGuide, R.dyslexieStudy, R.comeau]
    },
    {
      id: "webfonts", minutes: 55,
      title: t("Веб-шрифты и кириллица", "Web fonts and Cyrillic"),
      goal: t("Подключать шрифты с учётом производительности, стабильности макета и лицензионных условий и соблюдать нормы русского набора в вёрстке.", "Load fonts with regard to performance, layout stability and licensing, and follow Russian typesetting conventions in markup."),
      topics: [],
      cards: [
        {
          kind: "try", demo: "loadedfonts",
          title: t("Какие файлы загружает браузер", "Which files the browser downloads"),
          body: t("Ниже приведён список файлов шрифтов, уже загруженных этой страницей. Выведите английский, а затем русский текст шрифтом Bitter и проследите, какие файлы добавятся в список в каждом случае.", "Below is the list of font files this page has already loaded. Display English and then Russian text in Bitter and observe which files are added in each case.")
        },
        {
          kind: "web",
          title: t("Правило @font-face", "The @font-face rule"),
          figure: "fontface",
          body: t("Правило @font-face связывает имя семейства с файлом шрифта и описывает, какое начертание и какие знаки этот файл содержит. Каждому сочетанию насыщенности, стиля и подмножества знаков соответствует отдельное правило.", "@font-face binds a family name to a font file and describes which style and which characters the file contains. Each combination of weight, style and character subset gets its own rule."),
          points: [
            t("font-family — имя, по которому семейство вызывается в CSS; src — адрес файла и формат.", "font-family is the name used in CSS; src gives the file URL and format."),
            t("font-weight и font-style описывают начертание файла; для вариативного шрифта указывается диапазон.", "font-weight and font-style describe the file's style; a variable font declares a range."),
            t("unicode-range перечисляет знаки, содержащиеся в файле: браузер загружает файл, только если на странице есть знаки из этого диапазона.", "unicode-range lists the characters in the file: the browser downloads it only if the page contains characters from that range."),
            t("font-display определяет поведение текста во время загрузки.", "font-display defines text behaviour during loading.")
          ],
          code: "@font-face {\n  font-family: \"Bitter\";\n  src: url(\"/fonts/bitter-cyrillic-wght.woff2\") format(\"woff2-variations\");\n  font-weight: 100 900;\n  font-style: normal;\n  font-display: swap;\n  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}",
          sources: [R.mdnFontFace]
        },
        {
          kind: "web",
          title: t("Формат WOFF2 и подмножества знаков", "WOFF2 and character subsets"),
          figure: "subsets",
          body: t("Формат WOFF2 поддерживается всеми современными браузерами и обеспечивает наилучшее сжатие; другие форматы для новых проектов не требуются. Разделение шрифта на подмножества сокращает объём: русскоязычному сайту, как правило, нужны кириллическое и латинское подмножества.", "WOFF2 is supported by all modern browsers and compresses best; other formats are unnecessary for new projects. Splitting a font into subsets reduces size: a Russian-language site usually needs the Cyrillic and Latin subsets."),
          points: [
            t("Латинское подмножество необходимо и в русском тексте: в нём находятся цифры, знаки препинания и латинские слова.", "The Latin subset is needed even for Russian text: it contains digits, punctuation and Latin words."),
            t("Расширенная кириллица (cyrillic-ext) требуется для языков, использующих дополнительные знаки, например казахского или башкирского.", "Extended Cyrillic (cyrillic-ext) is needed for languages with additional letters, such as Kazakh or Bashkir."),
            t("При самостоятельном создании подмножеств проверяйте наличие ё, №, кавычек «» „“, тире и знака ₽.", "When subsetting yourself, check for ё, №, «» „“ quotes, dashes and ₽.")
          ],
          sources: [R.webdevFontBest, R.mdnFontFace]
        },
        {
          kind: "try", demo: "displaysim",
          title: t("Моделирование font-display", "Simulating font-display"),
          body: t("Выберите значение font-display и время загрузки шрифта и запустите моделирование. Сравните, когда текст невидим, когда отображается резервным шрифтом и применяется ли веб-шрифт после загрузки.", "Choose a font-display value and a load time and run the simulation. Compare when text is invisible, when it is shown in the fallback, and whether the web font is applied after loading.")
        },
        {
          kind: "web",
          title: t("Стратегии отображения: font-display", "Display strategies: font-display"),
          figure: "fdtimeline",
          body: t("Пока веб-шрифт загружается, браузер либо скрывает текст (FOIT — flash of invisible text), либо показывает его резервным шрифтом с последующей заменой (FOUT — flash of unstyled text). Дескриптор font-display управляет этим поведением через периоды блокировки, подмены и отказа.", "While a web font loads, the browser either hides text (FOIT, flash of invisible text) or shows it in a fallback and swaps later (FOUT, flash of unstyled text). font-display controls this through block, swap and failure periods."),
          points: [
            t("swap — текст сразу виден резервным шрифтом, веб-шрифт применяется в любой момент после загрузки; подходит, если гарнитура важна для облика сайта.", "swap: text is visible immediately in the fallback and the web font is applied whenever it arrives; suits typefaces essential to the site's identity."),
            t("block — текст скрыт до 3 секунд; оправдано только для шрифтов, без которых содержимое теряет смысл (например, шрифтов-пиктограмм).", "block: text hidden for up to 3 s; justified only for fonts without which content loses meaning (e.g. icon fonts)."),
            t("fallback — короткий период подмены; если шрифт не успел загрузиться, остаётся резервный.", "fallback: a short swap period; if the font is late, the fallback stays."),
            t("optional — веб-шрифт используется, только если он доступен практически сразу (например, из кэша); исключает смещение макета.", "optional: the web font is used only if available almost immediately (e.g. from cache); prevents layout shift.")
          ],
          sources: [R.mdnFontDisplay, R.webdevFontBest]
        },
        {
          kind: "web",
          title: t("Смещение макета и метрики резервного шрифта", "Layout shift and fallback metrics"),
          body: t("При замене резервного шрифта веб-шрифтом строки перестраиваются, если гарнитуры различаются шириной знаков и вертикальными метриками. Это смещение содержимого (CLS) ухудшает восприятие страницы. Дескрипторы @font-face позволяют подогнать резервный шрифт под метрики основного.", "When a web font replaces the fallback, lines reflow if the typefaces differ in character width and vertical metrics. This layout shift (CLS) degrades the experience. @font-face descriptors let you fit the fallback to the primary font's metrics."),
          points: [
            t("size-adjust масштабирует резервный шрифт (Baseline с 2023 года).", "size-adjust scales the fallback font (Baseline since 2023)."),
            t("ascent-override, descent-override и line-gap-override выравнивают вертикальные метрики и высоту строки.", "ascent-override, descent-override and line-gap-override align vertical metrics and line height."),
            t("Значения рассчитываются для конкретной пары шрифтов; их генерируют инструменты сборки и сервисы подбора резервных шрифтов.", "Values are computed for a specific font pair; build tools and fallback-matching services generate them.")
          ],
          code: "@font-face {\n  font-family: \"Inter Fallback\";\n  src: local(\"Arial\");\n  size-adjust: 107%;\n  ascent-override: 90%;\n}\nbody { font-family: \"Inter\", \"Inter Fallback\", sans-serif; }",
          demo: "fallbackmetrics",
          sources: [R.mdnSizeAdjust, R.webdevFontBest]
        },
        {
          kind: "web",
          title: t("Предварительная загрузка", "Preloading"),
          figure: "preload",
          body: t("Браузер узнаёт о необходимости шрифта поздно — после загрузки CSS и построения дерева отображения. Подсказка preload позволяет начать загрузку раньше, но применять её следует только к одному-двум файлам, необходимым для первого экрана.", "The browser discovers a font late, after loading CSS and building the render tree. preload starts the download earlier but should be used only for the one or two files needed for the first screen."),
          points: [
            t("Для шрифтов атрибут crossorigin обязателен даже при загрузке с того же домена: шрифты запрашиваются в анонимном режиме CORS. Без атрибута файл будет загружен дважды.", "Fonts require the crossorigin attribute even from the same origin, as they are fetched in anonymous CORS mode. Without it the file is downloaded twice."),
            t("Избыточная предварительная загрузка конкурирует с другими критически важными ресурсами.", "Excessive preloading competes with other critical resources.")
          ],
          code: "<link rel=\"preload\" href=\"/fonts/inter-cyrillic-wght.woff2\"\n      as=\"font\" type=\"font/woff2\" crossorigin>",
          sources: [R.mdnPreload]
        },
        {
          kind: "task",
          title: t("Соберите правило @font-face", "Build an @font-face rule"),
          body: t("Заполните правило подключения шрифта для двух сценариев загрузки.", "Complete the font-loading rule for two loading scenarios."),
          demo: "tFontFace"
        },
        {
          kind: "idea",
          title: t("Собственный хостинг и внешние сервисы", "Self-hosting and font services"),
          body: t("Шрифты можно подключать с внешнего сервиса (например, Google Fonts) или размещать на собственном сервере. Решение влияет на производительность, защиту персональных данных и устойчивость сайта.", "Fonts can be served by an external service (e.g. Google Fonts) or self-hosted. The choice affects performance, personal data protection and resilience."),
          points: [
            t("С 2020 года браузеры разделяют HTTP-кэш по сайтам (в Chrome — с версии 86), поэтому файл шрифта, загруженный на одном сайте, не используется повторно на другом; прежний аргумент об общем кэше утратил силу.", "Since 2020 browsers partition the HTTP cache by site (Chrome from version 86), so a font downloaded on one site is not reused on another; the shared-cache argument no longer holds."),
            t("При загрузке со стороннего сервера ему передаётся IP-адрес посетителя. В 2022 году земельный суд Мюнхена признал такое подключение Google Fonts без согласия пользователя нарушением GDPR.", "Loading from a third-party server discloses the visitor's IP address. In 2022 the Munich Regional Court held that embedding Google Fonts this way without consent violated the GDPR."),
            t("Собственный хостинг исключает зависимость от доступности внешнего сервиса и даёт полный контроль над подмножествами и кэшированием.", "Self-hosting removes dependence on an external service and gives full control over subsets and caching.")
          ],
          sources: [R.chromeCache, R.lgMuenchen, R.webdevFontBest]
        },
        {
          kind: "idea",
          title: t("Лицензирование шрифтов", "Font licensing"),
          body: t("Шрифт — объект авторского права, и его использование на сайте регулируется лицензией. Лицензия на установку шрифта на компьютер (десктопная) обычно не даёт права встраивать его в сайт: для этого требуется веб-лицензия.", "A font is copyrighted, and its use on a website is governed by a licence. A desktop licence usually does not permit embedding the font in a website; that requires a web licence."),
          points: [
            t("SIL Open Font License (OFL) разрешает свободно использовать, встраивать, изменять и распространять шрифт; продавать его отдельно запрещено. Под этой лицензией распространяются все шрифты курса.", "The SIL Open Font License (OFL) allows free use, embedding, modification and distribution; selling the font on its own is prohibited. All fonts in this course use it."),
            t("Если в лицензии OFL заявлено зарезервированное имя (Reserved Font Name), изменённую версию, в том числе подмножество, нельзя распространять под исходным именем.", "If an OFL font declares a Reserved Font Name, a modified version, including a subset, cannot be distributed under the original name."),
            t("Коммерческие веб-лицензии обычно ограничены числом просмотров страниц или доменов; условия проверяются до утверждения гарнитуры.", "Commercial web licences are usually limited by page views or domains; check the terms before approving a typeface.")
          ],
          sources: [R.oflWiki, R.gfKnowledge]
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("В разметке указано <link rel=\"preload\" href=\"/fonts/inter.woff2\" as=\"font\" type=\"font/woff2\">, и шрифт загружается дважды. Что исправить?", "The markup has <link rel=\"preload\" href=\"/fonts/inter.woff2\" as=\"font\" type=\"font/woff2\"> and the font downloads twice. What should be fixed?"),
            options: [t("Добавить атрибут crossorigin", "Add the crossorigin attribute"), t("Заменить формат на WOFF", "Switch the format to WOFF"), t("Перенести ссылку в конец документа", "Move the link to the end of the document")],
            answer: 0,
            explain: t("Шрифты загружаются в анонимном режиме CORS; без crossorigin запрос предварительной загрузки не совпадает с основным, и браузер загружает файл повторно.", "Fonts are fetched in anonymous CORS mode; without crossorigin the preload request does not match the actual one and the browser fetches the file again.")
          }
        },
        {
          kind: "try", demo: "typo",
          title: t("Практикум: нормы русского набора", "Practice: Russian typesetting norms"),
          body: t("Нажмите кнопку и сравните исходный текст с результатом: кавычки, тире, диапазоны и неразрывные пробелы. Затем отредактируйте исходный текст и проверьте, какие случаи правила не охватывают.", "Press the button and compare the source text with the result: quotes, dashes, ranges and non-breaking spaces. Then edit the source and check which cases the rules miss.")
        },
        {
          kind: "idea",
          title: t("Нормы русского набора", "Russian typesetting norms"),
          figure: "rumarks",
          body: t("Русская типографская традиция использует собственные знаки и правила, которые не совпадают с английскими. На экране их нарушение так же заметно, как в печати, и снижает доверие к тексту.", "Russian typographic tradition has its own characters and rules that differ from English. On screen their violation is as noticeable as in print and undermines trust in the text."),
          points: [
            t("Кавычки: основные — «ёлочки», вложенные — „лапки“: «шрифт — это „голос“ текста».", "Quotes: primary «guillemets», nested „low-high quotes“: «шрифт — это „голос“ текста»."),
            t("Тире (—) отделяется пробелами и разделяет части предложения; дефис (-) соединяет части слова без пробелов; короткое тире (–) обозначает числовые диапазоны без пробелов: 10–15; минус (−) — отдельный знак.", "The em dash (—) is spaced and separates parts of a sentence; the hyphen (-) joins word parts without spaces; the en dash (–) marks numeric ranges without spaces: 10–15; the minus (−) is a separate character."),
            t("Неразрывные пробелы: после коротких предлогов и союзов, перед тире, между числом и единицей измерения, между инициалами и фамилией.", "Non-breaking spaces: after short prepositions and conjunctions, before a dash, between a number and a unit, between initials and surname."),
            t("Буква ё снимает неоднозначность (все — всё, узнаем — узнаём) и особенно важна в интерфейсах и названиях.", "The letter ё removes ambiguity (все/всё, узнаем/узнаём) and matters especially in interfaces and names.")
          ],
          sources: [R.habrDashes, R.melQuotes, R.typograf]
        },
        {
          kind: "web",
          title: t("Типографика русского текста в вёрстке", "Russian typography in markup"),
          body: t("Типографские знаки вводятся непосредственно в кодировке UTF-8 или именованными ссылками HTML. Для текстов из систем управления контентом применяют автоматические типографы, однако их результат требует проверки.", "Typographic characters are entered directly in UTF-8 or as HTML named references. Automatic typographers are used for CMS content, but their output must be checked."),
          points: [
            t("Ссылки HTML: &nbsp; — неразрывный пробел, &mdash; — тире, &ndash; — короткое тире, &laquo; и &raquo; — «ёлочки», &bdquo; и &ldquo; — „лапки“, &minus; — минус.", "HTML references: &nbsp; non-breaking space, &mdash; em dash, &ndash; en dash, &laquo; and &raquo; guillemets, &bdquo; and &ldquo; low-high quotes, &minus; minus."),
            t("Элемент <q> со свойством quotes: auto выводит кавычки, соответствующие языку из атрибута lang.", "The <q> element with quotes: auto renders quotes appropriate to the lang attribute."),
            t("Проверяйте наличие всех этих знаков в выбранном шрифте и подмножестве.", "Check that the chosen font and subset contain all these characters.")
          ],
          code: "<html lang=\"ru\">\n<p>Курс рассчитан на&nbsp;10&ndash;15&nbsp;занятий&nbsp;&mdash; около трёх месяцев.</p>\n<p><q>Шрифт&nbsp;&mdash; это <q>голос</q> текста</q></p>\n\nq { quotes: auto; }",
          sources: [R.mdnQuotes, R.typograf]
        },
        {
          kind: "task",
          title: t("Выберите правильный набор", "Choose the correct setting"),
          body: t("В каждом задании выберите вариант, набранный по нормам типографики.", "In each question choose the variant that follows typesetting conventions."),
          demo: "tTypoDrill"
        },
        {
          kind: "check",
          title: t("Контроль: типографские знаки", "Review: typographic characters"),
          match: {
            q: t("Сопоставьте знаки и их назначение в русском наборе.", "Match the characters to their use in Russian typesetting."),
            pairs: [
              { term: t("«  »", "«  »"), def: t("Основные кавычки", "Primary quotation marks") },
              { term: t("„  “", "„  “"), def: t("Кавычки внутри кавычек", "Nested quotation marks") },
              { term: t("— (тире)", "— (em dash)"), def: t("Разделение частей предложения, с пробелами", "Separating parts of a sentence, spaced") },
              { term: t("– (короткое тире)", "– (en dash)"), def: t("Числовой диапазон без пробелов", "Numeric range without spaces") },
              { term: t("- (дефис)", "- (hyphen)"), def: t("Соединение частей слова без пробелов", "Joining parts of a word without spaces") },
              { term: t("&nbsp;", "&nbsp;"), def: t("Запрет переноса строки между словами", "Preventing a line break between words") }
            ]
          }
        },
        {
          kind: "check",
          title: t("Контрольный вопрос", "Review question"),
          quiz: {
            q: t("Какое значение font-display предпочтительно для основного текста, если стабильность макета важнее точного совпадения гарнитуры при первом посещении?", "Which font-display value suits body text when layout stability matters more than an exact typeface match on the first visit?"),
            options: [t("block", "block"), t("swap", "swap"), t("fallback", "fallback"), t("optional", "optional")],
            answer: 3,
            explain: t("optional использует веб-шрифт, только если он доступен практически сразу, поэтому замена шрифта и смещение макета исключены; при последующих посещениях шрифт обычно уже в кэше. block скрывает текст, swap и fallback допускают замену шрифта после отображения текста.", "optional uses the web font only if it is available almost immediately, so no font swap or layout shift occurs; on later visits the font is usually cached. block hides text; swap and fallback allow a swap after text is shown.")
          }
        }
      ],
      cheatsheet: [
        t("Только WOFF2; кириллическое и латинское подмножества с unicode-range.", "WOFF2 only; Cyrillic and Latin subsets with unicode-range."),
        t("font-display: swap — для фирменной гарнитуры, optional — когда важнее стабильность макета; block — почти никогда.", "font-display: swap for brand typefaces, optional when layout stability matters more; block almost never."),
        t("Резервный шрифт подгоняется дескрипторами size-adjust и *-override для снижения CLS.", "Fit the fallback with size-adjust and *-override descriptors to reduce CLS."),
        t("preload — только для 1–2 файлов первого экрана и всегда с crossorigin.", "preload only 1–2 first-screen files, always with crossorigin."),
        t("Собственный хостинг: нет общего кэша между сайтами, нет передачи IP третьим лицам.", "Self-hosting: no cross-site cache anyway, no IP disclosure to third parties."),
        t("Для сайта нужна веб-лицензия; OFL разрешает встраивание, но не продажу шрифта отдельно.", "Websites need a web licence; OFL permits embedding but not selling the font on its own."),
        t("«Ёлочки» и „лапки“, тире с пробелами, короткое тире в диапазонах, неразрывные пробелы, буква ё.", "Guillemets and low-high quotes, spaced em dash, en dash in ranges, non-breaking spaces, the letter ё."),
        t("Знаки — в UTF-8 или ссылками HTML; <q> с quotes: auto и lang; результат типографа проверяется.", "Characters in UTF-8 or HTML references; <q> with quotes: auto and lang; check typographer output.")
      ],
      readings: [R.mdnFontFace, R.mdnFontDisplay, R.mdnSizeAdjust, R.mdnPreload, R.webdevFontBest, R.chromeCache, R.lgMuenchen, R.oflWiki, R.mdnQuotes, R.typograf, R.habrDashes, R.melQuotes, R.gordon]
    }
  ];

  var general = [R.rutter, R.rutterBook, R.bringhurst, R.ruder, R.gordon, R.butterick, R.webdevDesignType, R.webdevCssType, R.gfKnowledge, R.comeau, R.baymard];

  window.COURSE = { modules: modules, general: general };
})();
