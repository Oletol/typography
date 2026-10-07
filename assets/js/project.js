/* Final project: build a type system for a case, review it, export CSS and a report. MIT License. */
(function () {
  "use strict";

  var VP_MIN = 360, VP_MAX = 1280;
  var VIEWS = [{ id: "d", w: 1280, pad: 64 }, { id: "z", w: 640, pad: 32 }, { id: "m", w: 375, pad: 20 }];
  var RATIOS = [[1.067, "1.067"], [1.125, "1.125"], [1.2, "1.2"], [1.25, "1.25"], [1.333, "1.333"], [1.414, "1.414"], [1.5, "1.5"], [1.618, "1.618"]];
  var CLASS_ORDER = ["serif", "slab", "sans", "mono", "display", "script"];
  var FALLBACK = { serif: "Georgia, serif", slab: "Georgia, serif", sans: "system-ui, sans-serif", mono: "ui-monospace, monospace", display: "system-ui, sans-serif", script: "cursive" };
  var DEFAULTS = {
    caseId: "univ", customName: "", customBrief: "", author: "", group: "",
    body: "pt-sans", bodyW: 400, head: "", headW: 700, accent: "",
    base: 16, baseM: 16, ratio: 1.2, ratioM: 1.2,
    lhBody: 1.5, lhHead: 1.2, measure: 70,
    fg: "#1b2233", bg: "#ffffff", link: "#1f5fbf", underline: true,
    whyFonts: "", whyParams: "", manual: {}, view: "d", spacing: false
  };

  var S = {
    ru: {
      intro: "Разработайте типографическую систему для одного из кейсов: подберите гарнитуры, шкалу кеглей, интерлиньяж, ширину колонки и цвета, проверьте результат на трёх ширинах экрана и сформируйте отчёт. Данные проекта сохраняются в этом браузере.",
      s1: "Кейс", s2: "Гарнитуры", s3: "Кегль и шкала", s4: "Интерлиньяж и строка", s5: "Цвет", s6: "Обоснование и авторство",
      caseSel: "Кейс проекта", audience: "Аудитория", content: "Содержание", tone: "Тональность", req: "Требования",
      customName: "Название проекта", customBrief: "Бриф: аудитория, содержание, тональность, требования",
      body: "Основной текст", head: "Заголовки", accent: "Акцентная гарнитура (надзаголовки, цифры, код)",
      same: "Как у основного текста", none: "Не используется", weight: "Насыщенность",
      variable: "вариативный", italicYes: "есть курсив", italicNo: "нет курсива",
      base: "Базовый кегль, десктоп (1280 px)", baseM: "Базовый кегль, мобильный (360 px)",
      ratio: "Модульное отношение, десктоп", ratioM: "Модульное отношение, мобильный",
      scaleTbl: "Шкала", lvl: "Уровень", lvlNames: { 4: "H1", 3: "H2", 2: "H3", 1: "Лид", 0: "Текст", "-1": "Подпись" },
      lhBody: "Интерлиньяж основного текста", lhHead: "Интерлиньяж заголовков", measure: "Максимальная ширина абзаца",
      fg: "Текст", bg: "Фон", link: "Ссылки", underline: "Подчёркивать ссылки",
      author: "Автор", group: "Группа", whyFonts: "Обоснование выбора гарнитур", whyParams: "Обоснование параметров набора",
      whyFontsPh: "Почему эти гарнитуры соответствуют брифу, аудитории и тональности? Как сочетаются гарнитуры заголовков и текста?",
      whyParamsPh: "Как выбраны кегль, шкала, интерлиньяж и ширина колонки? Как система адаптируется к мобильным устройствам?",
      preview: "Предпросмотр", vD: "1280 px", vZ: "Масштаб 200 %", vM: "375 px",
      vHint: { d: "Десктоп, ширина области просмотра 1280 CSS px.", z: "Масштабирование 200 % на экране 1280 px эквивалентно области просмотра 640 CSS px (WCAG 1.4.4).", m: "Смартфон, ширина области просмотра 375 CSS px." },
      spacing: "Пользовательские интервалы (WCAG 1.4.12)",
      checks: "Проверка системы", auto: "Автоматические проверки", manual: "Самопроверка",
      autoNote: "Проверки рассчитываются по параметрам системы. Ссылка «М…» указывает модуль курса.",
      manualNote: "Отметьте пункты, которые вы проверили самостоятельно.",
      summary: function (a, b, c, d) { return "Автоматические проверки: " + a + " из " + b + ". Самопроверка: " + c + " из " + d + "."; },
      export: "Экспорт", exportNote: "CSS-файл содержит подключение шрифтов, переменные шкалы с clamp() и базовые стили. Отчёт — HTML-документ с параметрами системы, обоснованием, результатами проверки и образцом набора; его можно распечатать или сохранить в PDF средствами браузера.",
      dlCss: "Скачать CSS", dlReport: "Скачать отчёт (HTML)", copyCss: "Скопировать CSS", copied: "Скопировано",
      reset: "Начать заново", resetConfirm: "Нажмите ещё раз, чтобы сбросить проект",
      files: function (n, kb) { return "Файлов шрифтов: " + n + (kb ? ", ≈ " + kb + " КБ (кириллица и латиница)" : ""); },
      c: {
        size: ["Кегль основного текста на десктопе не менее 16 px", "Кегль основного текста на десктопе менее 16 px"],
        sizeM: ["Кегль основного текста на мобильных устройствах не менее 16 px", "Кегль основного текста на мобильных устройствах менее 16 px"],
        lh: ["Интерлиньяж основного текста в диапазоне 1.4–1.7", "Интерлиньяж основного текста вне рекомендуемого диапазона 1.4–1.7"],
        lhHead: ["Интерлиньяж заголовков меньше, чем у основного текста (1.0–1.35)", "Интерлиньяж заголовков следует сделать меньше, чем у основного текста (1.0–1.35)"],
        chars: function (n, ok) { return "Длина строки на десктопе ≈ " + n + " знаков" + (ok ? " (45–75)" : " — вне диапазона 45–75"); },
        charsM: function (n, ok) { return "Длина строки на мобильных ≈ " + n + " знаков" + (ok ? "" : " — менее 30: кегль велик для узкого экрана"); },
        hier: function (r, ok) { return "Отношение H1 к основному тексту на десктопе: " + r + (ok ? "" : " — иерархия выражена слабо (рекомендуется не менее 2)"); },
        ratioM: ["Соседние уровни шкалы различимы на мобильных (отношение ≥ 1.125)", "Модульное отношение на мобильных менее 1.125: соседние уровни неразличимы"],
        overflow: function (w, ok) { return ok ? "Самое длинное слово H1 помещается в ширину 375 px" : "Слово «" + w + "» в H1 не помещается в ширину 375 px: возникнет горизонтальная прокрутка (WCAG 1.4.10)"; },
        contrast: function (r, ok) { return "Контраст текста и фона " + r + ":1" + (ok ? (Number(r) >= 7 ? " (AAA)" : " (AA)") : " — ниже 4.5:1 (WCAG 1.4.3)"); },
        linkBg: function (r, ok) { return "Контраст ссылок и фона " + r + ":1" + (ok ? "" : " — ниже 4.5:1"); },
        linkText: function (r, u, ok) { return u ? "Ссылки выделены подчёркиванием, а не только цветом (WCAG 1.4.1)" : "Ссылки без подчёркивания: контраст с текстом " + r + ":1" + (ok ? " — требуется дополнительный признак при наведении и фокусе" : " — менее 3:1, ссылки неразличимы (WCAG 1.4.1)"); },
        bodyCls: ["Гарнитура основного текста пригодна для сплошного чтения", "Акцидентная или рукописная гарнитура непригодна для основного текста", "Моноширинная гарнитура в основном тексте снижает скорость чтения"],
        bodyW: ["Насыщенность основного текста 350–500", "Насыщенность основного текста вне диапазона 350–500"],
        italic: ["Гарнитура основного текста имеет курсивное начертание", "У гарнитуры основного текста нет курсива: браузер синтезирует наклонное начертание", "Бриф требует полноценного курсива, а у гарнитуры основного текста его нет"],
        bold: ["Полужирное начертание (700) доступно в гарнитуре основного текста", "В гарнитуре основного текста нет начертания 700: выделение будет синтезировано"],
        pair: ["Гарнитуры заголовков и текста образуют контрастную или гармоничную пару", "Две разные гарнитуры одного подкласса: различие воспринимается как ошибка, а не как контраст", "Акцидентные или рукописные гарнитуры использованы одновременно в двух ролях"],
        mono: ["Для фрагментов кода предусмотрена моноширинная гарнитура", "Бриф содержит фрагменты кода: выберите моноширинную акцентную гарнитуру"],
        decor: ["Гарнитура заголовков соответствует сдержанной тональности брифа", "Бриф исключает декоративные эффекты: акцидентная гарнитура в заголовках противоречит тональности"],
        files: function (n, kb, ok) { return "Шрифтовых файлов: " + n + (kb ? ", ≈ " + kb + " КБ" : "") + (ok ? "" : " — объём велик; сократите число гарнитур или начертаний (М9)"); }
      },
      m: [
        ["tone", "Гарнитуры соответствуют брифу, аудитории и тональности", "М3, М7"],
        ["hier", "Иерархия различима при беглом просмотре: уровни заголовков, лид, подписи", "М6"],
        ["prox", "Отбивка над заголовком больше, чем под ним: заголовок связан со своим текстом", "М6"],
        ["zoom", "В режимах «Масштаб 200 %» и «Пользовательские интервалы» текст не обрезается и не перекрывается", "М8"],
        ["typo", "Тексты набраны по нормам русского набора: кавычки, тире, неразрывные пробелы", "М9"],
        ["lic", "Лицензии гарнитур допускают веб-использование и размещение файлов на собственном сервере", "М9"],
        ["load", "Подключение продумано: WOFF2, подмножества, font-display, предзагрузка только основного файла", "М9"]
      ],
      rTitle: "Типографическая система", rCase: "Кейс", rBrief: "Бриф", rFonts: "Гарнитуры", rRole: "Роль", rFamily: "Гарнитура", rClass: "Класс", rWeights: "Начертания",
      rScale: "Шкала кеглей", rParams: "Параметры набора", rColors: "Цвета", rWhy: "Обоснование", rChecks: "Результаты проверки", rSpecimen: "Образец набора (десктоп, 1280 px)",
      rCss: "CSS-код", rDate: "Дата", rNoText: "не заполнено", rOk: "выполнено", rNo: "не выполнено", rFluid: "Значение CSS",
      cssHead: "Типографическая система", cssFonts: "1. Шрифты: файлы WOFF2 размещаются на собственном сервере, пути указаны относительно этого CSS-файла",
      cssPreload: "Предзагрузка основного файла (в <head> документа):", cssTokens: "2. Переменные: гибкая шкала между областями просмотра 360 и 1280 px", cssBase: "3. Базовые стили"
    },
    en: {
      intro: "Develop a type system for one of the cases: choose typefaces, a type scale, line height, column width and colours, check the result at three viewport widths and generate a report. Project data is stored in this browser.",
      s1: "Case", s2: "Typefaces", s3: "Size and scale", s4: "Line height and measure", s5: "Colour", s6: "Rationale and authorship",
      caseSel: "Project case", audience: "Audience", content: "Content", tone: "Tone", req: "Requirements",
      customName: "Project name", customBrief: "Brief: audience, content, tone, requirements",
      body: "Body text", head: "Headings", accent: "Accent face (eyebrows, figures, code)",
      same: "Same as body text", none: "Not used", weight: "Weight",
      variable: "variable", italicYes: "has italic", italicNo: "no italic",
      base: "Base size, desktop (1280 px)", baseM: "Base size, mobile (360 px)",
      ratio: "Scale ratio, desktop", ratioM: "Scale ratio, mobile",
      scaleTbl: "Scale", lvl: "Level", lvlNames: { 4: "H1", 3: "H2", 2: "H3", 1: "Lead", 0: "Body", "-1": "Caption" },
      lhBody: "Body line height", lhHead: "Heading line height", measure: "Maximum paragraph width",
      fg: "Text", bg: "Background", link: "Links", underline: "Underline links",
      author: "Author", group: "Group", whyFonts: "Rationale for typeface choice", whyParams: "Rationale for setting parameters",
      whyFontsPh: "Why do these typefaces suit the brief, audience and tone? How do the heading and body faces work together?",
      whyParamsPh: "How were the size, scale, line height and column width chosen? How does the system adapt to mobile devices?",
      preview: "Preview", vD: "1280 px", vZ: "200% zoom", vM: "375 px",
      vHint: { d: "Desktop, 1280 CSS px viewport.", z: "200% zoom on a 1280 px screen equals a 640 CSS px viewport (WCAG 1.4.4).", m: "Smartphone, 375 CSS px viewport." },
      spacing: "User text spacing (WCAG 1.4.12)",
      checks: "System review", auto: "Automatic checks", manual: "Self-assessment",
      autoNote: "Checks are computed from the system parameters. “M…” refers to the course module.",
      manualNote: "Tick the items you have verified yourself.",
      summary: function (a, b, c, d) { return "Automatic checks: " + a + " of " + b + ". Self-assessment: " + c + " of " + d + "."; },
      export: "Export", exportNote: "The CSS file contains font loading, fluid scale variables with clamp() and base styles. The report is an HTML document with the system parameters, rationale, review results and a type specimen; it can be printed or saved as PDF from the browser.",
      dlCss: "Download CSS", dlReport: "Download report (HTML)", copyCss: "Copy CSS", copied: "Copied",
      reset: "Start over", resetConfirm: "Click again to reset the project",
      files: function (n, kb) { return "Font files: " + n + (kb ? ", ≈ " + kb + " KB (Cyrillic and Latin)" : ""); },
      c: {
        size: ["Desktop body size is at least 16 px", "Desktop body size is below 16 px"],
        sizeM: ["Mobile body size is at least 16 px", "Mobile body size is below 16 px"],
        lh: ["Body line height is within 1.4–1.7", "Body line height is outside the recommended 1.4–1.7"],
        lhHead: ["Heading line height is tighter than body text (1.0–1.35)", "Heading line height should be tighter than body text (1.0–1.35)"],
        chars: function (n, ok) { return "Desktop line length ≈ " + n + " characters" + (ok ? " (45–75)" : " — outside 45–75"); },
        charsM: function (n, ok) { return "Mobile line length ≈ " + n + " characters" + (ok ? "" : " — below 30: the size is too large for a narrow screen"); },
        hier: function (r, ok) { return "H1 to body ratio on desktop: " + r + (ok ? "" : " — weak hierarchy (2 or more recommended)"); },
        ratioM: ["Adjacent scale steps are distinguishable on mobile (ratio ≥ 1.125)", "Mobile ratio below 1.125: adjacent steps are indistinguishable"],
        overflow: function (w, ok) { return ok ? "The longest H1 word fits a 375 px width" : "The word “" + w + "” in H1 does not fit a 375 px width: horizontal scrolling will occur (WCAG 1.4.10)"; },
        contrast: function (r, ok) { return "Text–background contrast " + r + ":1" + (ok ? (Number(r) >= 7 ? " (AAA)" : " (AA)") : " — below 4.5:1 (WCAG 1.4.3)"); },
        linkBg: function (r, ok) { return "Link–background contrast " + r + ":1" + (ok ? "" : " — below 4.5:1"); },
        linkText: function (r, u, ok) { return u ? "Links are underlined, not distinguished by colour alone (WCAG 1.4.1)" : "Links are not underlined: contrast with text " + r + ":1" + (ok ? " — an extra cue on hover and focus is required" : " — below 3:1, links are indistinguishable (WCAG 1.4.1)"); },
        bodyCls: ["The body face is suitable for continuous reading", "Display and script faces are unsuitable for body text", "A monospaced body face slows reading"],
        bodyW: ["Body weight is within 350–500", "Body weight is outside 350–500"],
        italic: ["The body face has a true italic", "The body face has no italic: the browser will synthesise an oblique", "The brief requires a true italic, but the body face has none"],
        bold: ["A bold (700) is available in the body face", "The body face has no 700 weight: emphasis will be synthesised"],
        pair: ["Heading and body faces form a contrasting or harmonious pair", "Two different faces of the same subclass: the difference reads as a mistake, not as contrast", "Display or script faces are used in two roles at once"],
        mono: ["A monospaced face is provided for code", "The brief includes code snippets: choose a monospaced accent face"],
        decor: ["The heading face matches the restrained tone of the brief", "The brief rules out decorative effects: a display heading face contradicts the tone"],
        files: function (n, kb, ok) { return "Font files: " + n + (kb ? ", ≈ " + kb + " KB" : "") + (ok ? "" : " — a heavy payload; reduce the number of faces or weights (M9)"); }
      },
      m: [
        ["tone", "The typefaces match the brief, audience and tone", "M3, M7"],
        ["hier", "The hierarchy is clear at a glance: heading levels, lead, captions", "M6"],
        ["prox", "Space above a heading exceeds the space below it, binding it to its text", "M6"],
        ["zoom", "In “200% zoom” and “User text spacing” modes no text is clipped or overlapped", "M8"],
        ["typo", "Texts follow typesetting conventions: quotes, dashes, non-breaking spaces", "M9"],
        ["lic", "Font licences permit web use and self-hosting", "M9"],
        ["load", "Loading is planned: WOFF2, subsets, font-display, preload of the main file only", "M9"]
      ],
      rTitle: "Type system", rCase: "Case", rBrief: "Brief", rFonts: "Typefaces", rRole: "Role", rFamily: "Typeface", rClass: "Class", rWeights: "Styles",
      rScale: "Type scale", rParams: "Setting parameters", rColors: "Colours", rWhy: "Rationale", rChecks: "Review results", rSpecimen: "Type specimen (desktop, 1280 px)",
      rCss: "CSS code", rDate: "Date", rNoText: "not provided", rOk: "done", rNo: "not done", rFluid: "CSS value",
      cssHead: "Type system", cssFonts: "1. Fonts: WOFF2 files are self-hosted; paths are relative to this CSS file",
      cssPreload: "Preload the main file (in the document <head>):", cssTokens: "2. Variables: fluid scale between 360 and 1280 px viewports", cssBase: "3. Base styles"
    }
  };
  var MOD = { size: "5", sizeM: "8", lh: "5", lhHead: "6", chars: "5", charsM: "8", hier: "6", ratioM: "6", overflow: "8", contrast: "8", linkBg: "8", linkText: "8", bodyCls: "2", bodyW: "4", italic: "4", bold: "4", pair: "7", mono: "2", decor: "3", files: "9" };

  function s(k) { var v = S[App.lang][k]; return typeof v === "function" ? v.apply(null, Array.prototype.slice.call(arguments, 1)) : v; }
  var esc = function (x) { return App.esc(x); };
  function font(id) { return window.FONTS.find(function (f) { return f.id === id; }) || null; }
  function stack(f) { return '"' + f.family + '", ' + FALLBACK[f.cls]; }
  function weightsOf(f) {
    if (!f.variable) return f.weights.slice();
    var out = [];
    for (var w = Math.ceil(f.wght[0] / 100) * 100; w <= f.wght[1]; w += 100) out.push(w);
    return out;
  }
  function nearest(list, w) { return list.reduce(function (a, b) { return Math.abs(b - w) < Math.abs(a - w) ? b : a; }, list[0]); }
  function hasWeight(f, w) { return f.variable ? w >= f.wght[0] && w <= f.wght[1] : f.weights.indexOf(w) >= 0; }
  function contrast(a, b) { return window.TypeUtil.contrast(a, b); }
  function fmtR(r) { return (Math.floor(r * 100) / 100).toFixed(2); }
  function round(x, n) { var p = Math.pow(10, n == null ? 2 : n); return Math.round(x * p) / p; }
  function caseOf(id) { return window.PROJECT_CASES.find(function (c) { return c.id === id; }) || window.PROJECT_CASES[0]; }

  /* fluid size: px at 360 and 1280 viewports, linear in between */
  function sizes(st, step) {
    return { min: st.baseM * Math.pow(st.ratioM, step), max: st.base * Math.pow(st.ratio, step) };
  }
  function sizeAt(st, step, vw) {
    var z = sizes(st, step), lo = Math.min(z.min, z.max), hi = Math.max(z.min, z.max);
    var slope = (z.max - z.min) / (VP_MAX - VP_MIN);
    return Math.min(hi, Math.max(lo, z.min + slope * (vw - VP_MIN)));
  }
  function clampCss(st, step) {
    var z = sizes(st, step);
    if (Math.abs(z.max - z.min) < 0.01) return round(z.max / 16, 4) + "rem";
    var slope = (z.max - z.min) / (VP_MAX - VP_MIN), icpt = z.min - slope * VP_MIN;
    var lo = Math.min(z.min, z.max), hi = Math.max(z.min, z.max);
    return "clamp(" + round(lo / 16, 4) + "rem, " + round(icpt / 16, 4) + "rem + " + round(slope * 100, 4) + "vw, " + round(hi / 16, 4) + "rem)";
  }

  /* inline markup of case texts */
  function inline(txt) {
    return esc(txt)
      .replace(/\[\[(.+?)\]\]/g, '<a href="#" onclick="return false">$1</a>')
      .replace(/(^|[\s(«])_(.+?)_(?=[\s.,;:)»]|$)/g, "$1<em>$2</em>")
      .replace(/\*(.+?)\*/g, "<strong>$1</strong>")
      .replace(/`(.+?)`/g, "<code>$1</code>");
  }

  function fontOptions(selected, emptyLabel) {
    var html = emptyLabel ? '<option value="">' + esc(emptyLabel) + "</option>" : "";
    CLASS_ORDER.forEach(function (cls) {
      var list = window.FONTS.filter(function (f) { return f.cls === cls; });
      html += '<optgroup label="' + esc(App.T("fontClass")[cls]) + '">' + list.map(function (f) {
        return '<option value="' + f.id + '"' + (f.id === selected ? " selected" : "") + ">" + esc(f.family) + "</option>";
      }).join("") + "</optgroup>";
    });
    return html;
  }
  function fontNote(f) {
    if (!f) return "";
    return App.T("fontSub")[f.sub] + " · " + (f.variable ? s("variable") + " " + f.wght[0] + "–" + f.wght[1] : f.weights.join(", ")) + " · " + (f.italic ? s("italicYes") : s("italicNo"));
  }

  /* ---------- font files: parse fonts.css once, estimate payload ---------- */
  var cssBlocks = null, sizeCache = {};
  function loadCssBlocks() {
    if (cssBlocks) return Promise.resolve(cssBlocks);
    return fetch("assets/css/fonts.css").then(function (r) { return r.text(); }).then(function (t) {
      cssBlocks = (t.match(/@font-face\s*{[^}]*}/g) || []).map(function (b) {
        var w = (b.match(/font-weight:\s*([\d ]+);/) || [])[1] || "400";
        return {
          text: b, family: (b.match(/font-family:\s*'([^']+)'/) || [])[1],
          italic: /font-style:\s*italic/.test(b), weight: w.trim().split(/\s+/).map(Number),
          url: (b.match(/url\(([^)]+)\)/) || [])[1]
        };
      });
      return cssBlocks;
    }).catch(function () { cssBlocks = []; return cssBlocks; });
  }
  function usedBlocks(st) {
    if (!cssBlocks) return [];
    var roles = roleFonts(st), need = {};
    function want(f, w, it) { if (!f) return; (need[f.family] = need[f.family] || []).push({ w: w, it: it }); }
    want(roles.body, st.bodyW, false); want(roles.body, 700, false); want(roles.body, st.bodyW, true);
    want(roles.head, st.headW, false);
    if (roles.accent) { want(roles.accent, 400, false); want(roles.accent, 500, false); }
    return cssBlocks.filter(function (b) {
      var req = need[b.family]; if (!req) return false;
      return req.some(function (r) {
        if (r.it !== b.italic) return false;
        return b.weight.length === 2 ? r.w >= b.weight[0] && r.w <= b.weight[1] : nearest(fontWeightsFor(b.family, r.it), r.w) === b.weight[0];
      });
    });
  }
  function fontWeightsFor(family, italic) {
    return cssBlocks.filter(function (b) { return b.family === family && b.italic === italic; }).map(function (b) { return b.weight[0]; });
  }
  function fileSize(url) {
    if (sizeCache[url] != null) return Promise.resolve(sizeCache[url]);
    return fetch(new URL(url, new URL("assets/css/", document.baseURI)).href, { method: "HEAD" })
      .then(function (r) { var n = Number(r.headers.get("content-length")) || 0; sizeCache[url] = n; return n; })
      .catch(function () { return 0; });
  }

  function roleFonts(st) {
    var body = font(st.body) || window.FONTS[0];
    return { body: body, head: st.head ? font(st.head) || body : body, accent: st.accent ? font(st.accent) : null };
  }

  /* ---------- checks ---------- */
  var measureCanvas = document.createElement("canvas").getContext("2d");
  function charsAt(st, view, roles) {
    var probe = document.createElement("p");
    var v = VIEWS.filter(function (x) { return x.id === view; })[0];
    probe.style.cssText = "position:absolute;left:-9999px;top:0;visibility:hidden;margin:0;";
    probe.style.width = (v.w - 2 * v.pad) + "px";
    probe.style.maxWidth = st.measure + "ch";
    probe.style.fontFamily = stack(roles.body);
    probe.style.fontWeight = st.bodyW;
    probe.style.fontSize = sizeAt(st, 0, v.w) + "px";
    probe.textContent = caseOf(st.caseId)[App.lang].p1.replace(/\[\[|\]\]|[_*`]/g, "");
    document.body.appendChild(probe);
    var n = window.TypeUtil.charsPerLine(probe);
    probe.remove();
    return n;
  }
  function longestWord(st, roles) {
    var words = caseOf(st.caseId)[App.lang].h1.split(/\s+/), px = sizeAt(st, 4, 375), worst = { w: "", px: 0 };
    measureCanvas.font = st.headW + " " + px + "px " + stack(roles.head);
    words.forEach(function (w) { var x = measureCanvas.measureText(w).width; if (x > worst.px) worst = { w: w, px: x }; });
    return worst;
  }

  function runChecks(st, fileInfo) {
    var C = S[App.lang].c, roles = roleFonts(st), out = [], cs = caseOf(st.caseId);
    function add(key, state, text) { out.push({ key: key, state: state, text: text, mod: MOD[key] }); }
    add("size", st.base >= 16 ? "good" : "bad", C.size[st.base >= 16 ? 0 : 1]);
    add("sizeM", st.baseM >= 16 ? "good" : "warn", C.sizeM[st.baseM >= 16 ? 0 : 1]);
    add("lh", st.lhBody >= 1.4 && st.lhBody <= 1.7 ? "good" : (st.lhBody >= 1.3 && st.lhBody <= 1.9 ? "warn" : "bad"), C.lh[st.lhBody >= 1.4 && st.lhBody <= 1.7 ? 0 : 1]);
    var lhOk = st.lhHead < st.lhBody && st.lhHead >= 1 && st.lhHead <= 1.35;
    add("lhHead", lhOk ? "good" : "warn", C.lhHead[lhOk ? 0 : 1]);
    var cd = charsAt(st, "d", roles), cdOk = cd >= 45 && cd <= 75;
    add("chars", cdOk ? "good" : (cd >= 40 && cd <= 85 ? "warn" : "bad"), C.chars(cd, cdOk));
    var cm = charsAt(st, "m", roles);
    add("charsM", cm >= 30 ? "good" : "warn", C.charsM(cm, cm >= 30));
    var hr = sizeAt(st, 4, 1280) / sizeAt(st, 0, 1280), hrOk = hr >= 2;
    add("hier", hrOk ? "good" : (hr >= 1.6 ? "warn" : "bad"), C.hier(hr.toFixed(2), hrOk));
    add("ratioM", st.ratioM >= 1.125 ? "good" : "warn", C.ratioM[st.ratioM >= 1.125 ? 0 : 1]);
    var lw = longestWord(st, roles), lwOk = lw.px <= 375 - 40;
    add("overflow", lwOk ? "good" : "bad", C.overflow(lw.w, lwOk));
    var ct = contrast(st.fg, st.bg), ctOk = ct >= 4.5;
    add("contrast", ctOk ? "good" : "bad", C.contrast(fmtR(ct), ctOk));
    var cl = contrast(st.link, st.bg), clOk = cl >= 4.5;
    add("linkBg", clOk ? "good" : "bad", C.linkBg(fmtR(cl), clOk));
    var clt = contrast(st.link, st.fg);
    add("linkText", st.underline ? "good" : (clt >= 3 ? "warn" : "bad"), C.linkText(fmtR(clt), st.underline, clt >= 3));
    var bc = roles.body.cls;
    add("bodyCls", bc === "display" || bc === "script" ? "bad" : (bc === "mono" ? "warn" : "good"), C.bodyCls[bc === "display" || bc === "script" ? 1 : (bc === "mono" ? 2 : 0)]);
    var bwOk = st.bodyW >= 350 && st.bodyW <= 500;
    add("bodyW", bwOk ? "good" : "warn", C.bodyW[bwOk ? 0 : 1]);
    var itRule = cs.rules.italic;
    add("italic", roles.body.italic ? "good" : (itRule ? itRule : "warn"), C.italic[roles.body.italic ? 0 : (itRule ? 2 : 1)]);
    var boldOk = hasWeight(roles.body, 700);
    add("bold", boldOk ? "good" : "warn", C.bold[boldOk ? 0 : 1]);
    if (roles.head !== roles.body) {
      var dec = function (f) { return f.cls === "display" || f.cls === "script"; };
      var pairState = dec(roles.head) && dec(roles.body) ? 2 : (roles.head.sub === roles.body.sub ? 1 : 0);
      add("pair", pairState ? "warn" : "good", C.pair[pairState]);
    }
    if (cs.rules.mono) { var mOk = roles.accent && roles.accent.cls === "mono"; add("mono", mOk ? "good" : cs.rules.mono, C.mono[mOk ? 0 : 1]); }
    if (cs.rules.decorative) { var dOk = roles.head.cls !== "display" && roles.head.cls !== "script"; add("decor", dOk ? "good" : cs.rules.decorative, C.decor[dOk ? 0 : 1]); }
    if (fileInfo) {
      var fOk = fileInfo.kb ? fileInfo.kb <= 350 : fileInfo.n <= 8;
      add("files", fOk ? "good" : "warn", C.files(fileInfo.n, fileInfo.kb, fOk));
    }
    return out;
  }

  /* ---------- CSS export ---------- */
  function buildCss(st, absolute) {
    var roles = roleFonts(st), cs = caseOf(st.caseId)[App.lang], L = S[App.lang];
    var name = st.caseId === "custom" && st.customName ? st.customName : cs.name;
    var blocks = usedBlocks(st);
    var base = new URL("assets/css/", document.baseURI).href;
    var ff = blocks.map(function (b) {
      return b.text.replace(/url\(([^)]+)\)/, function (m, u) { return "url(" + (absolute ? new URL(u, base).href : u.replace("../fonts/", "fonts/")) + ")"; });
    }).join("\n\n");
    var main = blocks.filter(function (b) { return b.family === roles.body.family && !b.italic && /cyrillic/.test(b.url) && !/ext/.test(b.url); })[0];
    var lines = [];
    lines.push("/* " + L.cssHead + " · " + name + (st.author ? " · " + st.author : "") + (st.group ? ", " + st.group : "") + "\n   " + App.T("appName") + " (Cherdak) · " + new Date().toISOString().slice(0, 10) + " */", "");
    lines.push("/* " + L.cssFonts + " */", ff || "/* — */", "");
    if (main) lines.push("/* " + L.cssPreload + "\n   <link rel=\"preload\" href=\"fonts/" + main.url.replace("../fonts/", "") + "\" as=\"font\" type=\"font/woff2\" crossorigin> */", "");
    lines.push("/* " + L.cssTokens + " */", ":root {");
    lines.push("  --font-body: " + stack(roles.body) + ";");
    lines.push("  --font-head: " + stack(roles.head) + ";");
    lines.push("  --font-accent: " + (roles.accent ? stack(roles.accent) : "var(--font-body)") + ";");
    lines.push("", "  /* " + st.baseM + "–" + st.base + " px; " + st.ratioM + "–" + st.ratio + " */");
    [-1, 0, 1, 2, 3, 4].forEach(function (k) { lines.push("  --step-" + (k < 0 ? "-1" : k) + ": " + clampCss(st, k) + ";"); });
    lines.push("", "  --lh-body: " + st.lhBody + ";", "  --lh-head: " + st.lhHead + ";", "  --measure: " + st.measure + "ch;", "");
    lines.push("  --color-text: " + st.fg + ";", "  --color-bg: " + st.bg + ";", "  --color-link: " + st.link + ";", "}", "");
    lines.push("/* " + L.cssBase + " */");
    lines.push("html { -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }");
    lines.push("body {\n  margin: 0;\n  font-family: var(--font-body);\n  font-size: var(--step-0);\n  font-weight: " + st.bodyW + ";\n  line-height: var(--lh-body);\n  color: var(--color-text);\n  background: var(--color-bg);\n}");
    lines.push("h1, h2, h3 {\n  font-family: var(--font-head);\n  font-weight: " + st.headW + ";\n  line-height: var(--lh-head);\n  margin: 1.6em 0 0.5em;\n  text-wrap: balance;\n}");
    lines.push("h1 { font-size: var(--step-4); margin-top: 0; }\nh2 { font-size: var(--step-3); }\nh3 { font-size: var(--step-2); }");
    lines.push(".lead { font-size: var(--step-1); }");
    lines.push("p, li { max-width: var(--measure); text-wrap: pretty; }\np { margin: 0 0 1em; }");
    lines.push("small, .caption { font-size: var(--step--1); }");
    lines.push(st.underline
      ? "a { color: var(--color-link); text-decoration-thickness: 0.08em; text-underline-offset: 0.18em; }"
      : "a { color: var(--color-link); text-decoration: none; }\na:hover, a:focus-visible { text-decoration: underline; }");
    lines.push(".eyebrow {\n  font-family: var(--font-accent);\n  font-size: var(--step--1);\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n}");
    lines.push(".data { font-family: var(--font-accent); font-variant-numeric: lining-nums tabular-nums; }");
    lines.push("code { font-family: " + (roles.accent && roles.accent.cls === "mono" ? "var(--font-accent)" : "ui-monospace, monospace") + "; font-size: 0.9em; }");
    return lines.join("\n") + "\n";
  }

  /* ---------- preview markup ---------- */
  function previewHtml(st) {
    var c = caseOf(st.caseId)[App.lang];
    var brand = st.caseId === "custom" && st.customName ? st.customName : c.brand;
    return '<div class="pj-site">' +
      '<header class="pj-hd"><span class="pj-brand">' + esc(brand) + "</span><nav>" + c.nav.map(function (n) { return "<span>" + esc(n) + "</span>"; }).join("") + "</nav></header>" +
      '<div class="pj-body">' +
        '<p class="pj-eyebrow">' + esc(c.eyebrow) + "</p>" +
        "<h1>" + esc(c.h1) + "</h1>" +
        '<p class="pj-lead">' + inline(c.lead) + "</p>" +
        '<span class="pj-btn">' + esc(c.btn) + "</span>" +
        "<h2>" + esc(c.h2) + "</h2>" +
        "<p>" + inline(c.p1) + "</p><p>" + inline(c.p2) + "</p>" +
        '<div class="pj-data">' + c.data.map(function (d) { return '<div><span class="pj-num">' + esc(d[0]) + "</span><span>" + esc(d[1]) + "</span></div>"; }).join("") + "</div>" +
        "<h3>" + esc(c.h3) + "</h3>" +
        "<ul>" + c.list.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        '<p class="pj-cap">' + esc(c.caption) + "</p>" +
      "</div></div>";
  }
  function applyPreviewVars(el, st, w, pad) {
    var r = roleFonts(st);
    var v = {
      "--pw": w + "px", "--pad": pad + "px",
      "--fb": stack(r.body), "--fh": stack(r.head), "--fa": r.accent ? stack(r.accent) : stack(r.body),
      "--wb": st.bodyW, "--wh": st.headW, "--lhb": st.lhBody, "--lhh": st.lhHead, "--measure": st.measure + "ch",
      "--fg": st.fg, "--bg": st.bg, "--ln": st.link, "--ul": st.underline ? "underline" : "none",
      "--code": r.accent && r.accent.cls === "mono" ? stack(r.accent) : "ui-monospace, monospace"
    };
    [-1, 0, 1, 2, 3, 4].forEach(function (k) { v["--s" + (k < 0 ? "m1" : k)] = round(sizeAt(st, k, w), 2) + "px"; });
    Object.keys(v).forEach(function (k) { el.style.setProperty(k, v[k]); });
  }

  /* ---------- report ---------- */
  function buildReport(st, checks) {
    var L = S[App.lang], cs = caseOf(st.caseId)[App.lang], roles = roleFonts(st);
    var name = st.caseId === "custom" && st.customName ? st.customName : cs.name;
    var brief = st.caseId === "custom" ? esc(st.customBrief || L.rNoText).replace(/\n/g, "<br>")
      : "<b>" + esc(L.audience) + ":</b> " + esc(cs.audience) + "<br><b>" + esc(L.content) + ":</b> " + esc(cs.content) + "<br><b>" + esc(L.tone) + ":</b> " + esc(cs.tone) + "<br><b>" + esc(L.req) + ":</b> " + esc(cs.req);
    function frow(role, f, w) { return f ? "<tr><td>" + esc(role) + "</td><td>" + esc(f.family) + "</td><td>" + esc(App.T("fontSub")[f.sub]) + "</td><td>" + esc(w) + "</td></tr>" : ""; }
    var fonts = '<table><tr><th>' + esc(L.rRole) + "</th><th>" + esc(L.rFamily) + "</th><th>" + esc(L.rClass) + "</th><th>" + esc(L.rWeights) + "</th></tr>" +
      frow(L.body, roles.body, st.bodyW + (roles.body.italic ? ", italic" : "")) + frow(L.head, roles.head, String(st.headW)) + frow(L.accent, roles.accent, "400") + "</table>";
    var scale = "<table><tr><th>" + esc(L.lvl) + "</th><th>360 px</th><th>1280 px</th><th>" + esc(L.rFluid) + "</th></tr>" + [4, 3, 2, 1, 0, -1].map(function (k) {
      return "<tr><td>" + esc(L.lvlNames[k]) + "</td><td>" + round(sizeAt(st, k, 360), 1) + "</td><td>" + round(sizeAt(st, k, 1280), 1) + "</td><td><code>" + esc(clampCss(st, k)) + "</code></td></tr>";
    }).join("") + "</table>";
    var params = "<ul><li>" + esc(L.lhBody) + ": " + st.lhBody + "</li><li>" + esc(L.lhHead) + ": " + st.lhHead + "</li><li>" + esc(L.measure) + ": " + st.measure + "ch</li><li>" + esc(L.ratio) + ": " + st.ratio + "; " + esc(L.ratioM) + ": " + st.ratioM + "</li></ul>";
    var sw = function (c, label) { return '<span class="sw"><i style="background:' + c + '"></i>' + esc(label) + " " + c + "</span>"; };
    var colors = "<p>" + sw(st.fg, L.fg) + sw(st.bg, L.bg) + sw(st.link, L.link) + "</p>";
    var why = "<h3>" + esc(L.whyFonts) + "</h3><p>" + (st.whyFonts ? esc(st.whyFonts).replace(/\n/g, "<br>") : "<i>" + esc(L.rNoText) + "</i>") + "</p>" +
      "<h3>" + esc(L.whyParams) + "</h3><p>" + (st.whyParams ? esc(st.whyParams).replace(/\n/g, "<br>") : "<i>" + esc(L.rNoText) + "</i>") + "</p>";
    var mark = { good: "✓", warn: "!", bad: "✕" };
    var chk = "<h3>" + esc(L.auto) + "</h3><ul class=\"ck\">" + checks.map(function (c) { return '<li class="' + c.state + '"><b>' + mark[c.state] + "</b> " + esc(c.text) + "</li>"; }).join("") + "</ul>" +
      "<h3>" + esc(L.manual) + "</h3><ul class=\"ck\">" + L.m.map(function (m) { var ok = !!st.manual[m[0]]; return '<li class="' + (ok ? "good" : "warn") + '"><b>' + (ok ? "✓" : "—") + "</b> " + esc(m[1]) + " (" + esc(ok ? L.rOk : L.rNo) + ")</li>"; }).join("") + "</ul>";
    var spec = document.createElement("div");
    applyPreviewVars(spec, st, 1280, 0);
    var specimen = '<div class="specimen" style="' + spec.getAttribute("style").replace(/"/g, "&quot;") + '">' + previewHtml(st) + "</div>";
    var css = buildCss(st, true);
    var ffAbs = css.split("/* " + L.cssTokens)[0];
    var pvCss = PREVIEW_CSS;
    return "<!DOCTYPE html>\n<html lang=\"" + App.lang + "\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">" +
      "<title>" + esc(L.rTitle + " — " + name) + "</title><style>" + ffAbs +
      "body{font:16px/1.55 system-ui,sans-serif;color:#15223a;background:#f3f5f9;margin:0}main{max-width:1000px;margin:0 auto;padding:40px 24px}" +
      "h1{font-size:30px;margin:0 0 6px}h2{font-size:21px;margin:36px 0 12px;padding-top:16px;border-top:1px solid #dbe1eb}h3{font-size:16px;margin:18px 0 6px}" +
      ".meta{color:#5a6780}table{border-collapse:collapse;width:100%;font-size:14px}td,th{border:1px solid #dbe1eb;padding:6px 10px;text-align:left;vertical-align:top}th{background:#e6ecf5}" +
      "code,pre{font:13px/1.5 ui-monospace,Menlo,Consolas,monospace}pre{background:#0c1a33;color:#dfe7f5;padding:16px;border-radius:10px;white-space:pre-wrap;word-break:break-word}" +
      ".sw{display:inline-flex;align-items:center;gap:6px;margin-right:18px}.sw i{width:18px;height:18px;border:1px solid #ccd;border-radius:4px;display:inline-block}" +
      ".ck{list-style:none;padding:0}.ck li{padding:4px 0}.ck .good b{color:#1f8a70}.ck .warn b{color:#b8541f}.ck .bad b{color:#c0392b}" +
      ".specimen{border:1px solid #dbe1eb;border-radius:12px;overflow:hidden;width:100%}.specimen .pj-site{width:auto}" + pvCss +
      "@media print{body{background:#fff}main{padding:0}h2{break-after:avoid}.specimen{break-inside:avoid}}</style></head><body><main>" +
      "<h1>" + esc(L.rTitle) + ": " + esc(name) + "</h1><p class=\"meta\">" + esc(L.author) + ": " + esc(st.author || L.rNoText) + " · " + esc(L.group) + ": " + esc(st.group || L.rNoText) + " · " + esc(L.rDate) + ": " + new Date().toLocaleDateString(App.lang === "ru" ? "ru-RU" : "en-GB") + "</p>" +
      "<h2>" + esc(L.rBrief) + "</h2><p>" + brief + "</p>" +
      "<h2>" + esc(L.rFonts) + "</h2>" + fonts +
      "<h2>" + esc(L.rScale) + "</h2>" + scale +
      "<h2>" + esc(L.rParams) + "</h2>" + params +
      "<h2>" + esc(L.rColors) + "</h2>" + colors +
      "<h2>" + esc(L.rWhy) + "</h2>" + why +
      "<h2>" + esc(L.rChecks) + "</h2><p class=\"meta\">" + esc(L.summary(checks.filter(function (c) { return c.state === "good"; }).length, checks.length, L.m.filter(function (m) { return st.manual[m[0]]; }).length, L.m.length)) + "</p>" + chk +
      "<h2>" + esc(L.rSpecimen) + "</h2>" + specimen +
      "<h2>" + esc(L.rCss) + "</h2><pre>" + esc(buildCss(st, false)) + "</pre>" +
      "</main></body></html>";
  }

  /* preview styles, shared by the page and the report */
  var PREVIEW_CSS =
    ".pj-site{width:var(--pw);background:var(--bg);color:var(--fg);font-family:var(--fb);font-weight:var(--wb);font-size:var(--s0);line-height:var(--lhb);text-align:left;overflow-wrap:normal}" +
    ".pj-hd{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:6px 24px;padding:18px var(--pad);border-bottom:1px solid color-mix(in srgb,var(--fg) 15%,transparent)}" +
    ".pj-brand{font-family:var(--fh);font-weight:var(--wh);font-size:var(--s1);line-height:1.2}" +
    ".pj-hd nav{display:flex;flex-wrap:wrap;gap:4px 20px;font-size:var(--sm1)}" +
    ".pj-body{padding:calc(var(--pad)*.9) var(--pad) calc(var(--pad)*1.2)}" +
    ".pj-site h1,.pj-site h2,.pj-site h3{font-family:var(--fh);font-weight:var(--wh);line-height:var(--lhh);margin:1.6em 0 .5em;text-wrap:balance;max-width:28ch;letter-spacing:normal}" +
    ".pj-site h1{font-size:var(--s4);margin-top:.2em}.pj-site h2{font-size:var(--s3)}.pj-site h3{font-size:var(--s2)}" +
    ".pj-site p,.pj-site li{max-width:var(--measure);text-wrap:pretty}.pj-site p{margin:0 0 1em}" +
    ".pj-site ul{margin:0 0 1em;padding-left:1.2em}" +
    ".pj-lead{font-size:var(--s1)}" +
    ".pj-eyebrow{font-family:var(--fa);font-size:var(--sm1);letter-spacing:.08em;text-transform:uppercase;margin:0!important;opacity:.8}" +
    ".pj-site a{color:var(--ln);text-decoration:var(--ul);text-decoration-thickness:.08em;text-underline-offset:.18em}" +
    ".pj-site code{font-family:var(--code);font-size:.9em}" +
    ".pj-btn{display:inline-block;margin:.3em 0 .5em;padding:.6em 1.2em;border-radius:6px;background:var(--ln);color:var(--bg);font-size:var(--s0);line-height:1.3;font-weight:600}" +
    ".pj-data{display:flex;flex-wrap:wrap;gap:1em 2.5em;margin:1.4em 0}" +
    ".pj-data div{display:grid;font-size:var(--sm1);line-height:1.3}" +
    ".pj-num{font-family:var(--fa);font-size:var(--s2);font-variant-numeric:lining-nums tabular-nums;font-weight:600;line-height:1.2}" +
    ".pj-cap{font-size:var(--sm1);opacity:.85;margin-top:1.5em!important}" +
    ".pj-spacing .pj-site *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}.pj-spacing .pj-site p{margin-bottom:2em!important}";

  /* ---------- page ---------- */
  function render(view) {
    var T = App.T, L = S[App.lang];
    var st = Object.assign({}, DEFAULTS, Store.get("project") || {});
    st.manual = Object.assign({}, st.manual);
    var fileInfo = null;

    function ratioOpts(v) { return RATIOS.map(function (r) { return '<option value="' + r[0] + '"' + (r[0] === v ? " selected" : "") + ">" + r[1] + "</option>"; }).join(""); }
    function range(id, label, attrs) {
      return '<label class="ctl" for="' + id + '"><span class="ctl-head"><span>' + esc(label) + '</span><output id="' + id + 'Out"></output></span><input type="range" id="' + id + '" ' + attrs + "></label>";
    }
    function sec(n, title, inner) { return '<section class="pj-sec"><h2><span class="pj-n">' + n + "</span>" + esc(title) + "</h2>" + inner + "</section>"; }

    view.innerHTML =
      '<section class="page-head"><h1>' + esc(T("prjTitle")) + "</h1><p>" + esc(L.intro) + "</p></section>" +
      '<div class="pj">' +
        '<form class="pj-controls card" onsubmit="return false">' +
          sec(1, L.s1,
            '<label class="ctl"><span class="ctl-head"><span>' + esc(L.caseSel) + '</span></span><select id="pjCase">' +
              window.PROJECT_CASES.map(function (c) { return '<option value="' + c.id + '">' + esc(c[App.lang].name) + "</option>"; }).join("") + "</select></label>" +
            '<div id="pjBrief" class="pj-brief"></div>' +
            '<div id="pjCustom"><label class="ctl"><span class="ctl-head"><span>' + esc(L.customName) + '</span></span><input type="text" id="pjCName" class="pj-input"></label>' +
            '<label class="ctl"><span class="ctl-head"><span>' + esc(L.customBrief) + '</span></span><textarea id="pjCBrief" rows="4" class="pj-input"></textarea></label></div>') +
          sec(2, L.s2,
            '<label class="ctl"><span class="ctl-head"><span>' + esc(L.body) + '</span></span><select id="pjBody">' + fontOptions(st.body) + '</select><span class="ctl-note" id="pjBodyNote"></span></label>' +
            '<label class="ctl"><span class="ctl-head"><span>' + esc(L.weight) + '</span></span><select id="pjBodyW"></select></label>' +
            '<label class="ctl"><span class="ctl-head"><span>' + esc(L.head) + '</span></span><select id="pjHead">' + fontOptions(st.head, L.same) + '</select><span class="ctl-note" id="pjHeadNote"></span></label>' +
            '<label class="ctl"><span class="ctl-head"><span>' + esc(L.weight) + '</span></span><select id="pjHeadW"></select></label>' +
            '<label class="ctl"><span class="ctl-head"><span>' + esc(L.accent) + '</span></span><select id="pjAccent">' + fontOptions(st.accent, L.none) + '</select><span class="ctl-note" id="pjAccentNote"></span></label>' +
            '<p class="ctl-note" id="pjFiles"></p>') +
          sec(3, L.s3,
            range("pjBase", L.base, 'min="14" max="24" step="1"') +
            range("pjBaseM", L.baseM, 'min="14" max="20" step="1"') +
            '<div class="demo-row"><label class="ctl"><span class="ctl-head"><span>' + esc(L.ratio) + '</span></span><select id="pjRatio">' + ratioOpts(st.ratio) + "</select></label>" +
            '<label class="ctl"><span class="ctl-head"><span>' + esc(L.ratioM) + '</span></span><select id="pjRatioM">' + ratioOpts(st.ratioM) + "</select></label></div>" +
            '<table class="pj-scale" id="pjScale"></table>') +
          sec(4, L.s4,
            range("pjLhB", L.lhBody, 'min="1" max="2.2" step="0.05"') +
            range("pjLhH", L.lhHead, 'min="0.9" max="1.6" step="0.05"') +
            range("pjMeasure", L.measure, 'min="30" max="110" step="1"')) +
          sec(5, L.s5,
            '<fieldset class="ctl colors"><label><input type="color" id="pjFg"><span>' + esc(L.fg) + '</span></label><label><input type="color" id="pjBg"><span>' + esc(L.bg) + '</span></label><label><input type="color" id="pjLink"><span>' + esc(L.link) + "</span></label></fieldset>" +
            '<label class="toggles"><span><input type="checkbox" id="pjUl"> ' + esc(L.underline) + "</span></label>") +
          sec(6, L.s6,
            '<div class="demo-row"><label class="ctl"><span class="ctl-head"><span>' + esc(L.author) + '</span></span><input type="text" id="pjAuthor" class="pj-input" autocomplete="name"></label>' +
            '<label class="ctl"><span class="ctl-head"><span>' + esc(L.group) + '</span></span><input type="text" id="pjGroup" class="pj-input"></label></div>' +
            '<label class="ctl"><span class="ctl-head"><span>' + esc(L.whyFonts) + '</span></span><textarea id="pjWhyF" rows="5" class="pj-input" placeholder="' + esc(L.whyFontsPh) + '"></textarea></label>' +
            '<label class="ctl"><span class="ctl-head"><span>' + esc(L.whyParams) + '</span></span><textarea id="pjWhyP" rows="5" class="pj-input" placeholder="' + esc(L.whyParamsPh) + '"></textarea></label>') +
        "</form>" +
        '<div class="pj-main">' +
          '<section class="card pj-pv">' +
            '<div class="pj-pv-head"><h2>' + esc(L.preview) + '</h2><div class="pj-views" role="group">' +
              VIEWS.map(function (v) { return '<button type="button" class="btn btn-ghost btn-sm" data-view="' + v.id + '">' + esc(L["v" + v.id.toUpperCase()]) + "</button>"; }).join("") +
            '</div></div><p class="ctl-note" id="pjViewHint"></p>' +
            '<label class="toggles"><span><input type="checkbox" id="pjSpacing"> ' + esc(L.spacing) + "</span></label>" +
            '<div class="pj-frame" id="pjFrame"><div class="pj-sizer" id="pjSizer"><div class="pj-scaler" id="pjScaler"></div></div></div>' +
          "</section>" +
        "</div>" +
      "</div>" +
      '<section class="pj-bottom">' +
        '<div class="card pj-checks"><h2>' + esc(L.checks) + '</h2><p class="pj-sum" id="pjSum"></p>' +
          '<div class="pj-ck-grid"><div><h3>' + esc(L.auto) + '</h3><p class="ctl-note">' + esc(L.autoNote) + '</p><ul class="pj-ck" id="pjAuto"></ul></div>' +
          '<div><h3>' + esc(L.manual) + '</h3><p class="ctl-note">' + esc(L.manualNote) + '</p><ul class="pj-ck pj-manual" id="pjManual">' +
            L.m.map(function (m) { return '<li><label><input type="checkbox" data-m="' + m[0] + '"><span>' + esc(m[1]) + ' <span class="pj-mod">' + esc(m[2]) + "</span></span></label></li>"; }).join("") +
          "</ul></div></div></div>" +
        '<div class="card pj-export"><h2>' + esc(L.export) + '</h2><p class="ctl-note">' + esc(L.exportNote) + "</p>" +
          '<div class="pg-actions"><button type="button" class="btn btn-primary" id="pjDlCss">' + esc(L.dlCss) + '</button><button type="button" class="btn btn-primary" id="pjDlRep">' + esc(L.dlReport) + '</button><button type="button" class="btn btn-ghost" id="pjCopy">' + esc(L.copyCss) + '</button><button type="button" class="btn btn-danger" id="pjReset">' + esc(L.reset) + "</button></div>" +
          '<pre class="pj-code"><code id="pjCode"></code></pre></div>' +
      "</section>";

    var $ = function (id) { return view.querySelector("#" + id); };
    var frame = $("pjFrame"), scaler = $("pjScaler");

    if (!document.getElementById("pjPreviewCss")) {
      var styleEl = document.createElement("style"); styleEl.id = "pjPreviewCss"; styleEl.textContent = PREVIEW_CSS; document.head.appendChild(styleEl);
    }

    function weightOpts(sel, f, val) {
      var ws = weightsOf(f), v = nearest(ws, val);
      $(sel).innerHTML = ws.map(function (w) { return '<option value="' + w + '"' + (w === v ? " selected" : "") + ">" + w + "</option>"; }).join("");
      return v;
    }

    function sync() {
      $("pjCase").value = st.caseId; $("pjCName").value = st.customName; $("pjCBrief").value = st.customBrief;
      $("pjBody").value = st.body; $("pjHead").value = st.head; $("pjAccent").value = st.accent;
      $("pjBase").value = st.base; $("pjBaseM").value = st.baseM; $("pjRatio").value = String(st.ratio); $("pjRatioM").value = String(st.ratioM);
      $("pjLhB").value = st.lhBody; $("pjLhH").value = st.lhHead; $("pjMeasure").value = st.measure;
      $("pjFg").value = st.fg; $("pjBg").value = st.bg; $("pjLink").value = st.link; $("pjUl").checked = st.underline;
      $("pjAuthor").value = st.author; $("pjGroup").value = st.group; $("pjWhyF").value = st.whyFonts; $("pjWhyP").value = st.whyParams;
      $("pjSpacing").checked = st.spacing;
      view.querySelectorAll("[data-m]").forEach(function (c) { c.checked = !!st.manual[c.dataset.m]; });
    }

    function layoutFrame() {
      var v = VIEWS.filter(function (x) { return x.id === st.view; })[0];
      var avail = frame.clientWidth, k = Math.min(1, avail / v.w);
      scaler.style.transform = "scale(" + k + ")";
      scaler.style.marginLeft = k < 1 ? "0" : Math.max(0, (avail - v.w) / 2) + "px";
      $("pjSizer").style.height = Math.ceil(scaler.offsetHeight * k) + "px";
    }

    function refreshFiles() {
      loadCssBlocks().then(function () {
        var blocks = usedBlocks(st);
        if (!blocks.length) { fileInfo = null; $("pjFiles").textContent = ""; return; }
        return Promise.all(blocks.map(function (b) { return fileSize(b.url); })).then(function (sz) {
          var total = sz.reduce(function (a, b) { return a + b; }, 0);
          fileInfo = { n: blocks.length, kb: total ? Math.round(total / 1024) : 0 };
          $("pjFiles").textContent = L.files(fileInfo.n, fileInfo.kb);
          checksAndCode();
        });
      });
    }

    var lastChecks = [];
    function checksAndCode() {
      lastChecks = runChecks(st, fileInfo);
      $("pjAuto").innerHTML = lastChecks.map(function (c) {
        return '<li data-state="' + c.state + '"><span class="pj-ck-ic" aria-hidden="true">' + { good: "✓", warn: "!", bad: "✕" }[c.state] + "</span><span>" + esc(c.text) + ' <span class="pj-mod">' + (App.lang === "ru" ? "М" : "M") + c.mod + "</span></span></li>";
      }).join("");
      var good = lastChecks.filter(function (c) { return c.state === "good"; }).length;
      var man = L.m.filter(function (m) { return st.manual[m[0]]; }).length;
      $("pjSum").textContent = L.summary(good, lastChecks.length, man, L.m.length);
      $("pjCode").textContent = buildCss(st, false);
    }

    function update(opts) {
      opts = opts || {};
      var roles = roleFonts(st), cs = caseOf(st.caseId);
      var c = cs[App.lang];
      $("pjBrief").innerHTML = st.caseId === "custom" ? "" :
        "<dl><dt>" + esc(L.audience) + "</dt><dd>" + esc(c.audience) + "</dd><dt>" + esc(L.content) + "</dt><dd>" + esc(c.content) + "</dd><dt>" + esc(L.tone) + "</dt><dd>" + esc(c.tone) + "</dd><dt>" + esc(L.req) + "</dt><dd>" + esc(c.req) + "</dd></dl>";
      $("pjCustom").hidden = st.caseId !== "custom";
      st.bodyW = weightOpts("pjBodyW", roles.body, st.bodyW);
      st.headW = weightOpts("pjHeadW", roles.head, st.headW);
      $("pjBodyNote").textContent = fontNote(roles.body);
      $("pjHeadNote").textContent = st.head ? fontNote(roles.head) : "";
      $("pjAccentNote").textContent = roles.accent ? fontNote(roles.accent) : "";
      $("pjBaseOut").textContent = st.base + " px"; $("pjBaseMOut").textContent = st.baseM + " px";
      $("pjLhBOut").textContent = Number(st.lhBody).toFixed(2); $("pjLhHOut").textContent = Number(st.lhHead).toFixed(2);
      $("pjMeasureOut").textContent = st.measure + "ch";
      $("pjScale").innerHTML = "<tr><th>" + esc(L.lvl) + "</th><th>360 px</th><th>1280 px</th></tr>" + [4, 3, 2, 1, 0, -1].map(function (k) {
        return "<tr><td>" + esc(L.lvlNames[k]) + "</td><td>" + round(sizeAt(st, k, 360), 1) + "</td><td>" + round(sizeAt(st, k, 1280), 1) + "</td></tr>";
      }).join("");

      var v = VIEWS.filter(function (x) { return x.id === st.view; })[0];
      view.querySelectorAll("[data-view]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.view === st.view)); });
      $("pjViewHint").textContent = L.vHint[st.view];
      if (!opts.keepPreview || !scaler.firstChild) scaler.innerHTML = previewHtml(st);
      scaler.style.width = v.w + "px";
      applyPreviewVars(scaler.firstChild, st, v.w, v.pad);
      frame.classList.toggle("pj-spacing", st.spacing);
      layoutFrame();
      checksAndCode();
      Store.set("project", st);
      if (opts.fonts) refreshFiles();
      if (document.fonts) {
        [roles.body, roles.head, roles.accent].forEach(function (f) { if (f) document.fonts.load("400 16px \"" + f.family + "\"", "Аа"); });
      }
    }

    function bind(id, key, parse, opts) {
      var el = $(id);
      el.addEventListener(el.tagName === "SELECT" || el.type === "checkbox" ? "change" : "input", function () {
        st[key] = el.type === "checkbox" ? el.checked : (parse ? parse(el.value) : el.value);
        update(opts);
      });
    }
    bind("pjCase", "caseId", null, { fonts: false });
    bind("pjCName", "customName"); bind("pjCBrief", "customBrief", null, { keepPreview: true });
    bind("pjBody", "body", null, { fonts: true }); bind("pjHead", "head", null, { fonts: true }); bind("pjAccent", "accent", null, { fonts: true });
    bind("pjBodyW", "bodyW", Number, { fonts: true, keepPreview: true }); bind("pjHeadW", "headW", Number, { fonts: true, keepPreview: true });
    bind("pjBase", "base", Number, { keepPreview: true }); bind("pjBaseM", "baseM", Number, { keepPreview: true });
    bind("pjRatio", "ratio", Number, { keepPreview: true }); bind("pjRatioM", "ratioM", Number, { keepPreview: true });
    bind("pjLhB", "lhBody", Number, { keepPreview: true }); bind("pjLhH", "lhHead", Number, { keepPreview: true }); bind("pjMeasure", "measure", Number, { keepPreview: true });
    bind("pjFg", "fg", null, { keepPreview: true }); bind("pjBg", "bg", null, { keepPreview: true }); bind("pjLink", "link", null, { keepPreview: true });
    bind("pjUl", "underline", null, { keepPreview: true }); bind("pjSpacing", "spacing", null, { keepPreview: true });
    ["pjAuthor:author", "pjGroup:group", "pjWhyF:whyFonts", "pjWhyP:whyParams"].forEach(function (p) {
      var a = p.split(":");
      $(a[0]).addEventListener("input", function (e) { st[a[1]] = e.target.value; Store.set("project", st); if (a[1] === "author" || a[1] === "group") $("pjCode").textContent = buildCss(st, false); });
    });
    view.querySelectorAll("[data-m]").forEach(function (c) {
      c.addEventListener("change", function () { st.manual[c.dataset.m] = c.checked; Store.set("project", st); checksAndCode(); });
    });
    view.querySelectorAll("[data-view]").forEach(function (b) {
      b.addEventListener("click", function () { st.view = b.dataset.view; update(); });
    });

    function download(name, text, type) {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], { type: type }));
      a.download = name; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    }
    function slug() { return "type-system-" + (st.caseId === "custom" ? "custom" : st.caseId); }
    $("pjDlCss").addEventListener("click", function () { loadCssBlocks().then(function () { download(slug() + ".css", buildCss(st, false), "text/css"); }); });
    $("pjDlRep").addEventListener("click", function () { loadCssBlocks().then(function () { download(slug() + "-report.html", buildReport(st, runChecks(st, fileInfo)), "text/html"); }); });
    $("pjCopy").addEventListener("click", function () {
      var btn = $("pjCopy");
      if (navigator.clipboard) navigator.clipboard.writeText(buildCss(st, false)).then(function () { btn.textContent = L.copied; setTimeout(function () { btn.textContent = L.copyCss; }, 1500); }, function () {});
    });
    var armed = false;
    $("pjReset").addEventListener("click", function () {
      var btn = $("pjReset");
      if (!armed) { armed = true; btn.textContent = L.resetConfirm; return; }
      armed = false; btn.textContent = L.reset;
      st = Object.assign({}, DEFAULTS, { manual: {} }); sync(); update({ fonts: true });
    });

    if (window.ResizeObserver) new ResizeObserver(function () { if (document.body.contains(frame)) layoutFrame(); }).observe(frame);
    if (document.fonts) document.fonts.addEventListener("loadingdone", function h() {
      if (!document.body.contains(frame)) { document.fonts.removeEventListener("loadingdone", h); return; }
      layoutFrame(); checksAndCode();
    });

    sync();
    update({ fonts: true });
  }

  window.Project = { render: render, _buildCss: buildCss, _runChecks: runChecks, _clampCss: clampCss, _sizeAt: sizeAt };
})();
