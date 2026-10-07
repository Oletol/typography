/* Supporting infographics for theory cards. MIT License.
   Every figure is a function (root) that renders an SVG or HTML diagram with a caption.
   Colours come from CSS custom properties, so figures follow the light and dark themes. */
(function () {
  "use strict";

  var FALLBACK = { serif: "Georgia, serif", slab: "Georgia, serif", sans: "system-ui, sans-serif", mono: "ui-monospace, monospace", display: "system-ui, sans-serif", script: "cursive" };
  function font(id) { return window.FONTS.find(function (f) { return f.id === id; }); }
  function st(id) { var f = font(id); return '"' + f.family + '", ' + FALLBACK[f.cls]; }
  function ff(id) { return "font-family:" + App.esc(st(id)).replace(/&quot;/g, "'") + ";"; }
  function esc(x) { return App.esc(x); }
  function L(r, e) { return App.lang === "ru" ? r : e; }
  function cap(text) { return '<p class="fig-cap">' + esc(text) + "</p>"; }
  function scroll(svg, minw) { return '<div class="fig-scroll"><div style="min-width:' + minw + 'px">' + svg + '</div></div><p class="fig-swipe">' + esc(L("Схему можно прокрутить по горизонтали", "Scroll the diagram horizontally")) + "</p>"; }
  function ready(ids, cb) {
    if (!document.fonts) return cb();
    Promise.all(ids.map(function (id) { return document.fonts.load('400 40px "' + font(id).family + '"', "АаHxхое"); })).then(cb, cb);
  }
  var cv = document.createElement("canvas").getContext("2d");
  function m(id, size, txt, w) {
    cv.font = (w || 400) + " " + size + 'px "' + font(id).family + '"';
    var r = cv.measureText(txt);
    return { w: r.width, asc: r.actualBoundingBoxAscent, desc: r.actualBoundingBoxDescent, l: r.actualBoundingBoxLeft, r: r.actualBoundingBoxRight };
  }
  function label(x, y, text, cls, anchor) { return '<text x="' + x + '" y="' + y + '" class="ft ' + (cls || "t-ink") + '" text-anchor="' + (anchor || "start") + '">' + esc(text) + "</text>"; }
  function lead(x1, y1, x2, y2) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="s-acc" stroke-width="1.2"/><circle cx="' + x1 + '" cy="' + y1 + '" r="3.5" class="f-acc"/>'; }


  function classFig(root, o) {
    var signs = '<div class="cf-signs"><span class="cf-lbl">' + esc(L("Как узнать", "How to recognise")) + "</span>" + o.signs.map(function (x) { return '<span class="cf-sign">' + esc(x) + "</span>"; }).join("") + "</div>";
    var cmp = "";
    if (o.compare) cmp = '<div class="cf-cmp">' + o.compare.map(function (id) { return '<div><span style="' + ff(id) + 'font-size:96px;line-height:1">Нн</span><small>' + esc(font(id).family) + "</small></div>"; }).join("") + "</div>";
    if (o.grid) {
      var w = ["ilim", "шиш", "WWii"];
      cmp = '<div class="cf-cmp cf-grid">' + ["jetbrains-mono", "inter"].map(function (id) {
        return '<div><div class="cf-cells" style="' + ff(id) + '">' + "iiiiiiii<br>шшшшшшшш<br>mil1Ww0O".split("<br>").map(function (line) { return '<span class="cf-line">' + line + "</span>"; }).join("") + "</div><small>" + esc(font(id).family) + "</small></div>";
      }).join("") + "</div>"; void w;
    }
    var ex = '<div class="cf-ex">' + o.ex.map(function (e) {
      return '<div class="cf-tile"><span class="cf-big" style="' + ff(e[0]) + '">Аа Rr</span><span class="cf-line2" style="' + ff(e[0]) + '">' + esc(L("Съешь же ещё этих мягких французских булок", "Sphinx of black quartz, judge my vow")) + '</span><small><b>' + esc(font(e[0]).family) + "</b> · " + esc(e[1]) + "</small></div>";
    }).join("") + "</div>";
    root.innerHTML = signs + cmp + ex + cap(o.cap);
  }

  window.Figures = {

    /* ---------- anatomy ---------- */

    elements: function (root) {
      ready(["pt-serif"], function () {
        var id = "pt-serif", S = 190, base = 270, W = 760;
        var glyphs = [{ g: "н", x: 60 }, { g: "о", x: 300 }, { g: "е", x: 520 }];
        var xh = m(id, S, "х").asc, svg = "";
        glyphs.forEach(function (o) { o.m = m(id, S, o.g); o.l = o.x - o.m.l; o.w = o.m.l + o.m.r; svg += '<text x="' + o.x + '" y="' + base + '" style="' + ff(id) + "font-size:" + S + 'px" class="t-ink">' + o.g + "</text>"; });
        var n = glyphs[0], o = glyphs[1], e = glyphs[2], top = base - xh;
        svg += '<line x1="20" x2="740" y1="' + base + '" y2="' + base + '" class="s-line" stroke-dasharray="4 4"/><line x1="20" x2="740" y1="' + top + '" y2="' + top + '" class="s-line" stroke-dasharray="4 4"/>';
        svg += lead(n.l + n.w * 0.13, base - xh * 0.55, n.l + n.w * 0.13, 70) + label(n.l + n.w * 0.13, 62, L("основной штрих", "stem"), "t-ink", "middle");
        svg += lead(n.l + n.w * 0.5, base - xh * 0.5, n.l + n.w * 0.62, 100) + label(n.l + n.w * 0.62, 92, L("перекладина", "crossbar"), "t-ink", "start");
        svg += lead(n.l + n.w * 0.02, base - 4, n.l - 6, 320) + label(n.l - 6, 336, L("засечка", "serif"), "t-ink", "middle");
        svg += lead(o.l + o.w * 0.5, base - xh * 0.5, o.l + o.w * 0.5, 320) + label(o.l + o.w * 0.5, 336, L("внутрибуквенный просвет", "counter"), "t-ink", "middle");
        svg += lead(o.l + o.w * 0.08, base - xh * 0.5, o.l + o.w * 0.08 - 10, 70) + label(o.l + o.w * 0.08 - 10, 62, L("толстая часть", "thick stroke"), "t-ink", "middle");
        svg += lead(o.l + o.w * 0.5, top + xh * 0.035, o.l + o.w * 0.72, 100) + label(o.l + o.w * 0.72, 92, L("тонкая часть — контраст", "thin stroke — contrast"), "t-ink", "start");
        svg += lead(e.l + e.w * 0.86, base - xh * 0.27, e.l + e.w * 0.9, 320) + label(e.l + e.w * 0.9, 336, L("апертура", "aperture"), "t-ink", "middle");
        svg += label(745, top - 6, L("линия строчных", "x-height"), "t-mut", "end") + label(745, base - 6, L("базовая линия", "baseline"), "t-mut", "end");
        root.innerHTML = scroll('<svg viewBox="0 0 ' + W + ' 350" class="fig-svg" role="img" aria-label="' + esc(L("Элементы знака", "Parts of a letter")) + '">' + svg + "</svg>", 600) +
          cap(L("Элементы знака на примере антиквы PT Serif. Апертура — просвет полуоткрытой формы: чем он шире, тем легче различаются е, с, о в мелком кегле.", "Parts of a letter shown in PT Serif. The aperture is the opening of a semi-closed form: the wider it is, the easier e, c and o are told apart at small sizes."));
      });
    },

    xheight: function (root) {
      var ids = ["literata", "cormorant"];
      ready(ids, function () {
        var S = 70, base = 130, W = 760, svg = "";
        ids.forEach(function (id, i) {
          var x = 50 + i * 380, xh = m(id, S, "х").asc, cp = m(id, S, "Х").asc;
          svg += '<text x="' + x + '" y="' + base + '" style="' + ff(id) + "font-size:" + S + 'px" class="t-ink">' + esc(L("Хорошо", "Example")) + "</text>";
          svg += '<rect x="' + (x - 22) + '" y="' + (base - xh) + '" width="10" height="' + xh + '" class="f-acc" opacity=".85"/>';
          svg += '<line x1="' + (x - 26) + '" x2="' + (x + 300) + '" y1="' + (base - xh) + '" y2="' + (base - xh) + '" class="s-acc" stroke-dasharray="5 4"/>';
          svg += '<line x1="' + (x - 26) + '" x2="' + (x + 300) + '" y1="' + base + '" y2="' + base + '" class="s-line"/>';
          svg += label(x, 170, font(id).family + " · 70 px", "t-ink fw-b") + label(x, 190, L("высота строчных ≈ ", "x-height ≈ ") + (xh / S).toFixed(2) + " em", "t-mut") + label(x, 208, Math.round(xh / cp * 100) + L(" % от высоты прописных", "% of cap height"), "t-mut");
        });
        root.innerHTML = scroll('<svg viewBox="0 0 ' + W + ' 220" class="fig-svg">' + svg + "</svg>", 620) +
          cap(L("Одинаковый кегль, разный видимый размер: у Literata строчные знаки заметно выше, чем у Cormorant, поэтому при равном font-size она выглядит крупнее и лучше читается в мелком кегле.", "Same font size, different apparent size: Literata has much taller lowercase than Cormorant, so at equal font-size it looks larger and reads better at small sizes."));
      });
    },

    screen: function (root) {
      root.innerHTML = '<div class="fig-grid3">' +
        '<div class="fig-tile"><p class="fig-h">' + esc(L("Контраст", "Contrast")) + '</p><span style="' + ff("playfair-display") + 'font-size:46px;line-height:1">Ромб</span><span style="' + ff("playfair-display") + 'font-size:11px">' + esc(L("Тонкие штрихи в 11 px почти исчезают", "Hairlines nearly vanish at 11 px")) + '</span><p class="fig-note">' + esc(L("Высокий контраст — для заголовков", "High contrast suits headings")) + "</p></div>" +
        '<div class="fig-tile"><p class="fig-h">' + esc(L("Апертура", "Aperture")) + '</p><div class="fig-row"><span><span style="' + ff("arimo") + 'font-size:46px;line-height:1">се</span><small>' + esc(L("закрытая", "closed")) + '</small></span><span><span style="' + ff("pt-sans") + 'font-size:46px;line-height:1">се</span><small>' + esc(L("открытая", "open")) + '</small></span></div><p class="fig-note">Arimo · PT Sans</p></div>' +
        '<div class="fig-tile"><p class="fig-h">' + esc(L("Различимость", "Distinctness")) + '</p><div class="fig-row"><span><span style="' + ff("arimo") + 'font-size:28px;line-height:1.1;white-space:nowrap">Il1 O0</span><small>' + esc(L("неразличимы", "ambiguous")) + '</small></span><span><span style="' + ff("jetbrains-mono") + 'font-size:26px;line-height:1.1;white-space:nowrap">Il1 O0</span><small>' + esc(L("различимы", "distinct")) + '</small></span></div><p class="fig-note">Arimo · JetBrains Mono</p></div>' +
        "</div>" + cap(L("Три признака, которые определяют удобочитаемость шрифта на экране при малом кегле.", "Three features that determine on-screen legibility at small sizes."));
    },

    fontname: function (root) {
      var COLS = [
        ["maker", L("Проект, производитель", "Project, foundry"), ["PT", "ITC", "FF", "TT", "LL", "BT", "LT", "MT", "Dx", "IBM", "Noto"]],
        ["fam", L("Собственное имя", "Proper name"), ["Plex", "Roboto", "Source", "Garamond", "Helvetica", "Norms"]],
        ["cls", L("Класс", "Class"), ["Serif, Antiqua", "Sans, Grotesk, Gothic", "Slab", "Mono, Code", "Script, Hand", "Display"]],
        ["ver", L("Версия", "Version"), ["2, 3, 4", "Neue", "Next", "Nova"]],
        ["opsz", L("Оптический размер", "Optical size"), ["Caption", "Text", "Deck", "Subhead", "Headline", "Display", "Banner"]],
        ["width", L("Ширина", "Width"), ["Condensed", "Narrow", "Compressed", "Expanded", "Wide"]],
        ["wt", L("Насыщенность", "Weight"), ["Thin", "Light", "Regular", "Medium", "Bold", "Black"]],
        ["slope", L("Наклон", "Slope"), ["Italic", "Oblique"]],
        ["tech", L("Файл", "File"), ["Variable", "Pro, Std", "SC"]]
      ];
      var EX = [
        [["PT", "maker"], ["Sans", "cls"], ["Caption", "opsz"], ["Bold", "wt"]],
        [["Source", "fam"], ["Serif", "cls"], ["4", "ver"], ["Display", "opsz"], ["Semibold", "wt"], ["Italic", "slope"]],
        [["IBM", "maker"], ["Plex", "fam"], ["Sans", "cls"], ["Condensed", "width"], ["Medium", "wt"], ["Italic", "slope"]],
        [["Helvetica", "fam"], ["Neue", "ver"], ["LT", "maker"], ["Pro", "tech"]],
        [["Literata", "fam"], ["Variable", "tech"]]
      ];
      var cols = '<div class="fnc">' +
        '<div class="fnc-g fnc-g1">' + esc(L("Имя семейства — значение font-family", "Family name — the font-family value")) + "</div>" +
        '<div class="fnc-g fnc-g2">' + esc(L("Начертание — font-weight, font-style, font-stretch", "Style — font-weight, font-style, font-stretch")) + "</div>" +
        '<div class="fnc-g fnc-g3">' + esc(L("Файл", "File")) + "</div>" +
        COLS.map(function (c) { return '<div class="fnc-col"><p class="fnc-h fn-' + c[0] + '">' + esc(c[1]) + "</p>" + c[2].map(function (v) { return '<span class="fnc-v fn-' + c[0] + '">' + esc(v) + "</span>"; }).join("") + "</div>"; }).join("") + "</div>";
      var names = '<p class="fig-h" style="margin-top:16px">' + esc(L("Примеры разбора", "Parsed examples")) + '</p><div class="fig-names">' + EX.map(function (n) {
        return '<div class="fn-row">' + n.map(function (p) { var col = COLS.filter(function (c) { return c[0] === p[1]; })[0]; return '<span class="fn-part fn-' + p[1] + '"><b>' + esc(p[0]) + "</b><small>" + esc(col[1].toLowerCase()) + "</small></span>"; }).join("") + "</div>";
      }).join("") + "</div>";
      root.innerHTML = '<div class="fig-scroll"><div style="min-width:860px">' + cols + "</div></div>" + '<p class="fig-swipe">' + esc(L("Таблицу можно прокрутить по горизонтали", "Scroll the table horizontally")) + "</p>" + names +
        cap(L("Верхняя часть — конструктор: в каждом столбце собраны возможные слова одной группы, слева направо в том порядке, в каком они обычно стоят в названии. Нижняя часть — реальные названия, разобранные по этим группам. Сокращение производителя иногда ставят в конце (Helvetica Neue LT, Futura BT). Не указанный признак означает значение по умолчанию: Text, нормальная ширина, Regular, прямое начертание.", "Top: a constructor — each column lists the possible words of one group, left to right in the order they usually appear in a name. Bottom: real names parsed into these groups. A foundry abbreviation sometimes comes last (Helvetica Neue LT, Futura BT). An omitted feature means the default: Text, normal width, Regular, upright."));
    },

    fontterms: function (root) {
      var W = [[100, "Thin, Hairline"], [200, "ExtraLight, UltraLight"], [300, "Light"], [400, "Regular, Normal, Book*"], [500, "Medium"], [600, "SemiBold, DemiBold"], [700, "Bold"], [800, "ExtraBold, UltraBold"], [900, "Black, Heavy"]];
      var S = [["50%", "Ultra Condensed"], ["62.5%", "Extra Condensed"], ["75%", "Condensed, Narrow, Compressed"], ["87.5%", "Semi Condensed"], ["100%", "Normal"], ["112.5%", "Semi Expanded"], ["125%", "Expanded, Wide"], ["150%", "Extra Expanded"], ["200%", "Ultra Expanded"]];
      var O = [["Micro, Caption", L("сноски, подписи, мелкий кегль", "footnotes, captions, small sizes"), true], ["Text", L("основной текст; обычно не указывается", "body text; usually omitted"), true], ["Body", L("основной текст; термин макетов, в названиях почти не встречается", "body text; a layout term, rarely in names"), false], ["Deck", L("лиды и подзаголовки в журналах", "decks and subheads in magazines"), true], ["Subhead", L("подзаголовки", "subheads"), true], ["Headline", L("газетные заголовки", "newspaper headlines"), true], ["Display", L("заголовки, крупный кегль", "headings, large sizes"), true], ["Banner, Poster", L("очень крупный кегль, от 100 pt", "very large sizes, 100 pt and up"), true]];
      function group(title, dir, rows) { return '<div class="fv-group"><p class="fig-h">' + esc(title) + ' <span class="fv-dir">' + esc(dir) + '</span></p><ol class="fv-list">' + rows + "</ol></div>"; }
      function tags(title, sub, items) { return '<div class="fv-group"><p class="fig-h">' + esc(title) + (sub ? ' <span class="fv-dir">' + esc(sub) + "</span>" : "") + '</p><ul class="fv-tags">' + items.map(function (i) { return "<li><b>" + esc(i[0]) + "</b> — " + esc(i[1]) + "</li>"; }).join("") + "</ul></div>"; }
      root.innerHTML = '<div class="fig-vocab">' +
        group(L("Насыщенность", "Weight"), L("от светлого к сверхжирному · font-weight", "light to black · font-weight"), W.map(function (w) { return '<li><code>' + w[0] + '</code><span style="' + ff("inter") + "font-weight:" + w[0] + '">Аа</span><b>' + esc(w[1]) + "</b></li>"; }).join("")) +
        group(L("Ширина", "Width"), L("от узкого к широкому · font-stretch", "narrow to wide · font-stretch"), S.map(function (w) { return '<li><code>' + w[0] + '</code><span class="fv-box" style="width:' + (parseFloat(w[0]) * 0.26) + 'px"></span><b>' + esc(w[1]) + "</b></li>"; }).join("")) +
        group(L("Оптический размер", "Optical size"), L("от мелкого кегля к крупному", "small to large sizes"), O.map(function (o, i) { return '<li' + (o[2] ? "" : ' class="fv-rare"') + '><code>' + (i + 1) + '</code><span style="' + ff("literata") + "font-size:" + (11 + i * 3.5) + 'px;line-height:1">Аа</span><b>' + esc(o[0]) + "</b><small>" + esc(o[1]) + "</small></li>"; }).join("")) +
        tags(L("Класс", "Class"), "", [["Serif, Antiqua", L("антиква", "serif")], ["Sans, Sans Serif, Grotesk, Gothic", L("гротеск (Gothic — в американской традиции)", "sans serif (Gothic in American usage)")], ["Slab", L("брусковый", "slab serif")], ["Mono, Code", L("моноширинный", "monospace")], ["Script, Hand", L("рукописный", "script, handwritten")], ["Display", L("акцидентный; в названии чаще означает вариант для крупного кегля", "display; in a name it usually marks the large-size version")]]) +
        tags(L("Проект, производитель", "Project, foundry"), L("в начале или в конце названия", "at the start or end of a name"), [["PT", "ParaType (Public Types)"], ["ITC", "International Typeface Corporation"], ["FF", "FontFont"], ["TT", "TypeType"], ["LL", "Lineto"], ["BT", "Bitstream"], ["LT, MT", "Linotype, Monotype"], ["Dx", "DX Korea"]]) +
        tags(L("Наклон, версия, файл", "Slope, version, file"), "", [["Italic", L("курсив: собственные формы знаков", "italic: its own letterforms")], ["Oblique", L("наклонное: прямые знаки под углом", "oblique: upright letters slanted")], ["2, 3, 4, Neue, Next, Nova", L("новая версия семейства", "a new version of the family")], ["Variable, VF", L("вариативный файл", "variable file")], ["Pro, Std", L("расширенный и стандартный наборы знаков", "extended and standard character sets")], ["SC", L("капитель", "small caps")]]) +
        "</div>" + cap(L("Обозначения сгруппированы по признаку и упорядочены по шкале. Синонимы в одной строке взаимозаменяемы, конкретное слово выбирает производитель. Серым отмечены термины, которые почти не встречаются в названиях шрифтов. * Book у разных шрифтов соответствует 400 или чуть более светлому начертанию.", "Labels are grouped by feature and ordered along a scale. Synonyms on one line are interchangeable; the foundry chooses the exact word. Greyed terms rarely appear in font names. * Book is 400 or slightly lighter depending on the font."));
    },

    lines: function (root) {
      ready(["literata"], function () {
        var id = "literata", S = 120, base = 190, x0 = 170, W = 0, txt = "Hxbg бд";
        var mx = m(id, S, "x"), mh = m(id, S, "H"), mb = m(id, S, "b"), mg = m(id, S, "g"), me = m(id, S, txt);
        cv.font = S + 'px "' + font(id).family + '"';
        var fm = cv.measureText("Hx"), emTop = base - (fm.fontBoundingBoxAscent || S * 0.9), emBot = base + (fm.fontBoundingBoxDescent || S * 0.25);
        var Ls = [
          { y: base - mb.asc, n: L("линия верхних выносных", "ascender line"), c: "s-mut" },
          { y: base - mh.asc, n: L("линия прописных", "cap height"), c: "s-acc" },
          { y: base - mx.asc, n: L("линия строчных", "x-height line"), c: "s-good2" },
          { y: base, n: L("базовая линия", "baseline"), c: "s-warn" },
          { y: base + mg.desc, n: L("линия нижних выносных", "descender line"), c: "s-mut" }
        ];
        W = x0 + me.w + 260;
        var svg = '<svg viewBox="0 0 ' + W + ' 270" class="fig-svg">';
        Ls.forEach(function (l) { svg += '<line x1="' + (x0 - 10) + '" x2="' + (W - 10) + '" y1="' + l.y + '" y2="' + l.y + '" class="' + l.c + '" stroke-width="1.6"/>'; });
        svg += '<text x="' + x0 + '" y="' + base + '" style="' + ff(id) + "font-size:" + S + 'px" class="t-ink">' + esc(txt) + "</text>";
        Ls.forEach(function (l, i) { svg += label(x0 - 18, l.y + (i === 0 ? -3 : i === 1 ? 12 : 5), l.n, "t-ink fs-s", "end"); });
        function brace(x, y1, y2, text, cls) { return '<line x1="' + x + '" x2="' + x + '" y1="' + y1 + '" y2="' + y2 + '" class="' + cls + '" stroke-width="2.5"/><line x1="' + (x - 5) + '" x2="' + (x + 5) + '" y1="' + y1 + '" y2="' + y1 + '" class="' + cls + '" stroke-width="2"/><line x1="' + (x - 5) + '" x2="' + (x + 5) + '" y1="' + y2 + '" y2="' + y2 + '" class="' + cls + '" stroke-width="2"/>' + label(x + 10, (y1 + y2) / 2 + 4, text, "t-ink fs-s fw-b"); }
        var bx = x0 + me.w + 30;
        svg += brace(bx, base - mx.asc, base, L("высота строчных", "x-height"), "s-good2");
        svg += brace(bx, base - mb.asc, base - mx.asc, L("верхний выносной", "ascender"), "s-mut");
        svg += brace(bx, base, base + mg.desc, L("нижний выносной", "descender"), "s-mut");
        svg += brace(bx + 140, emTop, emBot, "font-size", "s-acc");
        root.innerHTML = scroll(svg + "</svg>", 680) + cap(L("Система линий на примере Literata. Прописные, как правило, ниже верхних выносных элементов; кегль (font-size) задаёт высоту кегельной площадки, которая включает выносные элементы и небольшой запас.", "The line system in Literata. Capitals are usually lower than ascenders; font-size sets the height of the em box, which includes ascenders, descenders and a little extra space."));
      });
    },

    cyrlower: function (root) {
      ready(["pt-serif"], function () {
        var CY = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя".split(""), LA = "abcdefghijklmnopqrstuvwxyz".split("");
        var cA = "бф", cD = "друфцщ", lA = "bdfhklt", lD = "gjpqy";
        function row(arr, A, D) {
          return '<div class="cy-row" style="' + ff("pt-serif") + '">' + arr.map(function (ch) {
            var a = A.indexOf(ch) > -1, d = D.indexOf(ch) > -1;
            return '<span class="cy-ch' + (a && d ? " cy-both" : a ? " cy-asc" : d ? " cy-desc" : "") + '">' + ch + "</span>";
          }).join("") + "</div>";
        }
        function stat(arr, A, D) {
          var a = arr.filter(function (c) { return A.indexOf(c) > -1; }).length, d = arr.filter(function (c) { return D.indexOf(c) > -1; }).length;
          return '<p class="cy-stat">' + L("верхние выносные: ", "ascenders: ") + "<b>" + a + "</b> · " + L("нижние выносные: ", "descenders: ") + "<b>" + d + "</b> · " + L("всего знаков: ", "letters: ") + arr.length + "</p>";
        }
        function shape(word, x, y) {
          var S = 64, out = "", cx = x;
          word.split("").forEach(function (ch) {
            var g = m("pt-serif", S, ch), w = m("pt-serif", S, ch).w;
            out += '<rect x="' + (cx + 1) + '" y="' + (y - g.asc) + '" width="' + (w - 2) + '" height="' + (g.asc + g.desc) + '" class="f-acc" opacity=".22"/>';
            cx += w;
          });
          return '<text x="' + x + '" y="' + y + '" style="' + ff("pt-serif") + 'font-size:64px" class="t-ink">' + esc(word) + "</text>" + out + '<line x1="' + x + '" x2="' + cx + '" y1="' + y + '" y2="' + y + '" class="s-line"/>';
        }
        var svg = '<svg viewBox="0 0 760 130" class="fig-svg">' + shape("шиншилла", 20, 90) + shape("highlight", 400, 90) + "</svg>";
        root.innerHTML = '<p class="fig-h">' + esc(L("Строчная кириллица", "Cyrillic lowercase")) + "</p>" + row(CY, cA, cD) + stat(CY, cA, cD) +
          '<p class="fig-h" style="margin-top:12px">' + esc(L("Строчная латиница", "Latin lowercase")) + "</p>" + row(LA, lA, lD) + stat(LA, lA, lD) +
          '<div class="fig-key"><span><i class="cy-k cy-asc"></i>' + esc(L("верхний выносной", "ascender")) + '</span><span><i class="cy-k cy-desc"></i>' + esc(L("нижний выносной", "descender")) + '</span><span><i class="cy-k cy-both"></i>' + esc(L("оба (ф)", "both (ф)")) + "</span></div>" +
          '<p class="fig-h" style="margin-top:16px">' + esc(L("Очертания слов", "Word shapes")) + "</p>" + scroll(svg, 600) +
          cap(L("В кириллице лишь два знака с верхними выносными (б, ф), поэтому очертания русских слов однороднее, чем английских: слово «шиншилла» — почти ровный прямоугольник из вертикальных штрихов («частокол»), а highlight имеет выразительный силуэт.", "Cyrillic has only two letters with ascenders (б, ф), so Russian words have more uniform shapes than English ones: «шиншилла» is an almost flat rectangle of vertical strokes (a “picket fence”), while highlight has a distinctive silhouette."));
      });
    },


    /* ---------- classes ---------- */

    classtree: function (root) {
      var C = [
        ["literata", L("Антиква", "Serif"), L("засечки, контраст", "serifs, contrast"), L("старого стиля · переходная · классицистическая · современная", "old-style · transitional · didone · contemporary")],
        ["roboto-slab", L("Брусковые", "Slab serif"), L("прямоугольные засечки, низкий контраст", "rectangular serifs, low contrast"), L("текстовые · плакатные", "text · poster")],
        ["inter", L("Гротески", "Sans serif"), L("без засечек, низкий контраст", "no serifs, low contrast"), L("старые · неогротески · гуманистические · геометрические", "grotesque · neo-grotesque · humanist · geometric")],
        ["jetbrains-mono", L("Моноширинные", "Monospace"), L("одинаковая ширина знаков", "equal character width"), L("код · таблицы · технические тексты", "code · tables · technical text")],
        ["unbounded", L("Акцидентные", "Display"), L("выразительность, крупный кегль", "expressive, large sizes"), L("заголовки · логотипы · афиши", "headings · logos · posters")],
        ["caveat", L("Рукописные", "Script"), L("имитация письма", "imitate handwriting"), L("короткие надписи · акценты", "short lines · accents")]
      ];
      root.innerHTML = '<div class="fig-tree"><div class="ft-root">' + esc(L("Шрифты", "Typefaces")) + '</div><div class="ft-kids">' + C.map(function (c) {
        return '<div class="ft-node"><span class="ft-spec" style="' + ff(c[0]) + '">Аа</span><b>' + esc(c[1]) + "</b><small>" + esc(c[2]) + '</small><span class="ft-sub">' + esc(c[3]) + "</span></div>";
      }).join("") + "</div></div>" + cap(L("Укрупнённая классификация, используемая в курсе: шесть классов и их подгруппы. Признаки разграничения — засечки, контраст, ось контраста, пропорции, апертура.", "The simplified classification used in the course: six classes and their subgroups. Distinguishing features: serifs, contrast, contrast axis, proportions, aperture."));
    },

    grotesques: function (root) {
      var G = [
        ["oswald", L("Старый гротеск", "Grotesque"), L("узкие пропорции, лёгкая неравномерность", "narrow proportions, slight irregularity")],
        ["roboto", L("Неогротеск", "Neo-grotesque"), L("закрытая апертура, нейтральность", "closed aperture, neutrality")],
        ["pt-sans", L("Гуманистический", "Humanist"), L("открытая апертура, пропорции антиквы", "open aperture, serif proportions")],
        ["montserrat", L("Геометрический", "Geometric"), L("окружность и прямоугольник", "circle and rectangle")]
      ];
      root.innerHTML = '<div class="fig-grid4">' + G.map(function (g) {
        return '<div class="fig-tile"><span style="' + ff(g[0]) + 'font-size:44px;line-height:1">Rсео</span><p class="fig-h">' + esc(g[1]) + '</p><p class="fig-note">' + esc(font(g[0]).family + " — " + g[2]) + "</p></div>";
      }).join("") + "</div>" + cap(L("Сравните форму букв с, е и о: апертура и овал — главные признаки подгруппы гротеска.", "Compare the letters c, e and o: aperture and the oval are the main signs of a sans subgroup."));
    },

    /* ---------- classes: one figure per class ---------- */

    cls_serif: function (root) { classFig(root, {
      signs: [L("есть засечки", "serifs present"), L("заметный контраст толстых и тонких штрихов", "visible thick–thin contrast"), L("засечки плавно переходят в штрих", "serifs blend into the stroke")],
      ex: [["eb-garamond", L("старого стиля", "old-style")], ["pt-serif", L("переходная", "transitional")], ["playfair-display", L("классицистическая", "didone")], ["literata", L("современная текстовая", "contemporary text")]],
      cap: L("Антиква: четыре исторические группы. Сравните засечки и контраст: от мягких наклонных засечек Garamond до тонких горизонтальных у Playfair Display.", "Serif: four historical groups. Compare serifs and contrast, from Garamond's soft angled serifs to Playfair Display's hairline horizontals.")
    }); },
    cls_slab: function (root) { classFig(root, {
      signs: [L("засечки прямоугольные, как бруски", "rectangular, block-like serifs"), L("засечки почти такой же толщины, как основной штрих", "serifs nearly as thick as the stems"), L("низкий контраст", "low contrast")],
      ex: [["roboto-slab", L("текстовый", "text")], ["bitter", L("для экранного чтения", "for screen reading")], ["podkova", L("плакатный характер", "poster character")]],
      compare: ["pt-serif", "roboto-slab"],
      cap: L("Брусковые шрифты. Вверху — сравнение засечек: у антиквы (PT Serif) засечка тонкая и переходит в штрих плавно, у брускового (Roboto Slab) — массивная и прямоугольная.", "Slab serifs. Top: serifs compared — thin and blended in a serif face (PT Serif), heavy and rectangular in a slab (Roboto Slab).")
    }); },
    cls_mono: function (root) {
      classFig(root, {
        signs: [L("все знаки одной ширины", "all characters share one width"), L("узкие знаки (i, l) получают широкие засечки", "narrow letters (i, l) get wide serifs"), L("широкие (m, w, ш) сжаты", "wide letters (m, w, ш) are squeezed")],
        ex: [["jetbrains-mono", L("для кода", "for code")], ["ibm-plex-mono", L("корпоративное семейство", "corporate family")], ["pt-mono", L("из суперсемейства PT", "PT superfamily")]],
        grid: true,
        cap: L("Моноширинные шрифты. В сетке видно, что в JetBrains Mono каждая буква занимает одинаковую ячейку, тогда как в Inter ширина знаков различается.", "Monospaced faces. The grid shows that every JetBrains Mono letter fills an equal cell, whereas Inter letters vary in width.")
      });
    },
    cls_display: function (root) { classFig(root, {
      signs: [L("рассчитан на крупный кегль", "designed for large sizes"), L("необычные пропорции, детали или декор", "unusual proportions, details or decoration"), L("часто одно начертание", "often a single style")],
      ex: [["unbounded", L("широкий геометрический", "wide geometric")], ["yeseva-one", L("контрастный, с засечками", "high-contrast serif")], ["poiret-one", L("тонкий, ар-деко", "thin, art deco")], ["russo-one", L("спортивный, технический", "sporty, technical")], ["ruslan-display", L("стилизация древнерусского письма", "early Russian script style")], ["press-start-2p", L("пиксельный", "pixel")]],
      cap: L("Акцидентные шрифты могут иметь засечки или не иметь их: класс определяется не формой засечек, а назначением — выразительностью в крупном кегле.", "Display faces may or may not have serifs: the class is defined by purpose — expressiveness at large sizes — not by serif shape.")
    }); },
    cls_script: function (root) { classFig(root, {
      signs: [L("имитирует письмо от руки", "imitates handwriting"), L("наклон, соединения между буквами, неровный ритм", "slant, joins, uneven rhythm"), L("штрих как от пера, кисти или фломастера", "strokes like a pen, brush or marker")],
      ex: [["great-vibes", L("каллиграфический, остроконечное перо", "calligraphic, pointed pen")], ["marck-script", L("каллиграфический, связный", "calligraphic, connected")], ["lobster", L("леттеринг, кисть", "lettering, brush")], ["caveat", L("неформальный почерк", "informal handwriting")], ["neucha", L("почерк фломастером", "felt-tip handwriting")], ["amatic-sc", L("узкий, от руки", "narrow, hand-drawn")]],
      cap: L("Рукописные шрифты делятся на каллиграфические (форма задана правилами письма пером) и собственно рукописные, передающие неформальный почерк.", "Script faces divide into calligraphic ones (form follows pen-writing rules) and handwritten ones that convey informal handwriting.")
    }); },

    classkey: function (root) {
      var Q = [
        [L("Знаки имитируют письмо от руки: наклон, соединения, неровный ритм?", "Do letters imitate handwriting: slant, joins, uneven rhythm?"), L("Рукописный", "Script"), "caveat"],
        [L("Форма рассчитана на крупный кегль: необычные пропорции, детали, декор?", "Is the form meant for large sizes: unusual proportions, details, decoration?"), L("Акцидентный", "Display"), "unbounded"],
        [L("Все знаки одной ширины: i занимает столько же места, сколько m?", "Are all letters one width: does i take as much room as m?"), L("Моноширинный", "Monospace"), "jetbrains-mono"],
        [L("Нет засечек?", "No serifs?"), L("Гротеск", "Sans serif"), "inter"],
        [L("Засечки прямоугольные, почти толщиной с основной штрих, контраст низкий?", "Are serifs rectangular, almost as thick as stems, with low contrast?"), L("Брусковый", "Slab serif"), "roboto-slab"]
      ];
      root.innerHTML = '<ol class="fig-key-tree">' + Q.map(function (q, i) {
        return '<li><span class="fkt-n">' + (i + 1) + '</span><span class="fkt-q">' + esc(q[0]) + '</span><span class="fkt-yes"><small>' + esc(L("да", "yes")) + '</small><b>' + esc(q[1]) + '</b><i style="' + ff(q[2]) + '">Аа</i></span><span class="fkt-no">' + esc(i < Q.length - 1 ? L("нет — следующий вопрос", "no — next question") : L("нет", "no")) + "</span></li>";
      }).join("") + '<li class="fkt-last"><span class="fkt-n">=</span><span class="fkt-q">' + esc(L("Засечки есть, контраст заметный, переходы плавные", "Serifs present, visible contrast, smooth transitions")) + '</span><span class="fkt-yes"><b>' + esc(L("Антиква", "Serif")) + '</b><i style="' + ff("literata") + '">Аа</i></span></li></ol>' +
        cap(L("Порядок вопросов важен: сначала исключаются классы, которые определяются назначением (рукописные, акцидентные) и конструкцией (моноширинные), и только затем рассматриваются засечки. Поэтому акцидентный шрифт с засечками не будет ошибочно отнесён к антикве.", "The order matters: first rule out classes defined by purpose (script, display) and construction (monospace), and only then look at serifs. That way a display face with serifs is not mistaken for a serif text face."));
    },

    generic: function (root) {
      var chain = [["\"PT Serif\"", L("веб-шрифт", "web font"), L("файл не загрузился", "file failed to load"), "no"], ["Georgia", L("системный шрифт", "system font"), L("нет на устройстве", "not on the device"), "no"], ["\"Times New Roman\"", L("системный шрифт", "system font"), L("найден — применяется", "found — used"), "yes"], ["serif", L("родовое семейство", "generic family"), L("запасной вариант всегда доступен", "always-available last resort"), "gen"]];
      var G = [["serif", L("антиква", "serif"), "Times New Roman · Times"], ["sans-serif", L("гротеск", "sans serif"), "Arial · Helvetica"], ["monospace", L("моноширинный", "monospace"), "Courier New · Courier"], ["cursive", L("рукописный", "script"), L("зависит от браузера", "browser-dependent")], ["fantasy", L("акцидентный", "display"), L("непредсказуем", "unpredictable")], ["system-ui", L("шрифт интерфейса ОС", "OS interface font"), "Segoe UI · San Francisco · Roboto"]];
      root.innerHTML = '<p class="fig-h">' + esc(L("Как браузер читает список font-family", "How the browser reads a font-family list")) + '</p><div class="gen-chain">' + chain.map(function (c, i) {
        return '<div class="gen-step gen-' + c[3] + '"><code>' + esc(c[0]) + "</code><small>" + esc(c[1]) + "</small><b>" + esc(c[2]) + "</b></div>";
      }).join('<span class="gen-link" aria-hidden="true"></span>') + "</div>" +
        '<p class="fig-h" style="margin-top:16px">' + esc(L("Родовые семейства и что за ними стоит", "Generic families and what they map to")) + '</p><table class="gen-table"><tr><th>' + esc(L("Ключевое слово", "Keyword")) + "</th><th>" + esc(L("Класс", "Class")) + "</th><th>" + esc(L("Как правило, Windows · macOS", "Typically Windows · macOS")) + "</th></tr>" +
        G.map(function (g) { return "<tr><td><code>" + g[0] + "</code></td><td>" + esc(g[1]) + "</td><td>" + esc(g[2]) + "</td></tr>"; }).join("") + "</table>" +
        cap(L("Браузер перебирает список слева направо и берёт первый доступный шрифт; если в нём нет нужного знака, этот знак ищется в следующих шрифтах. Родовое семейство в конце списка гарантирует, что текст будет показан шрифтом нужного класса, а не шрифтом браузера по умолчанию. Строка system-ui указывает шрифт интерфейса Windows, macOS и Android соответственно.", "The browser goes through the list left to right and uses the first available font; a missing glyph is looked up in the following fonts. A generic family at the end guarantees the text is shown in the right class rather than the browser default. The system-ui row lists the interface fonts of Windows, macOS and Android."));
    },

    systemfonts: function (root) {
      var R = [
        [L("Антиква", "Serif"), [["Georgia", "Windows, macOS"], ["Times New Roman", "Windows, macOS"], ["Cambria", "Windows"], ["Charter", "macOS"]]],
        [L("Гротеск", "Sans serif"), [["Arial", "Windows, macOS"], ["Segoe UI", "Windows"], ["Helvetica", "macOS"], ["Roboto", "Android"]]],
        [L("Моноширинный", "Monospace"), [["Consolas", "Windows"], ["Courier New", "Windows, macOS"], ["Menlo", "macOS"]]],
        [L("Рукописный", "Script"), [["Comic Sans MS", "Windows, macOS"]]]
      ];
      root.innerHTML = '<div class="sysf">' + R.map(function (r) {
        return '<div class="sysf-row"><b>' + esc(r[0]) + '</b><div class="sysf-list">' + r[1].map(function (f) { return '<span class="sysf-f"><span style="font-family:\'' + f[0] + '\',' + (r[0] === L("Антиква", "Serif") ? "serif" : r[0] === L("Моноширинный", "Monospace") ? "monospace" : "sans-serif") + '">' + esc(f[0]) + "</span><small>" + esc(f[1]) + "</small></span>"; }).join("") + "</div></div>";
      }).join("") + "</div>" + cap(L("Распространённые системные шрифты по классам и платформам. Если шрифт не установлен на вашем устройстве, образец показан родовым семейством того же класса.", "Common system fonts by class and platform. If a font is not installed on your device, the sample falls back to the generic family of the same class."));
    },


    /* ---------- character ---------- */

    neutrality: function (root) {
      var P = [["inter", 4], ["pt-serif", 22], ["playfair-display", 45], ["unbounded", 68], ["great-vibes", 92]];
      root.innerHTML = '<div class="fig-scale"><div class="fs-poles"><span>' + esc(L("Передача информации", "Conveying information")) + "</span><span>" + esc(L("Эмоциональный заряд", "Emotional charge")) + '</span></div><div class="fs-bar"></div><div class="fs-items">' +
        P.map(function (p) { return '<div class="fs-item" style="left:' + p[1] + '%"><span style="' + ff(p[0]) + 'font-size:30px;line-height:1">Аа</span><small>' + esc(font(p[0]).family) + "</small></div>"; }).join("") +
        '</div><div class="fs-poles fs-under"><span>' + esc(L("внимание — смыслу текста", "attention goes to meaning")) + "</span><span>" + esc(L("внимание — форме и эмоции", "attention goes to form and emotion")) + "</span></div></div>" +
        cap(L("Шкала нейтральности по А. Корольковой. Чем правее шрифт, тем большую долю внимания он забирает у содержания и тем короче должен быть текст.", "Neutrality scale after A. Korolkova. The further right a typeface sits, the more attention it takes from the content and the shorter the text should be."));
    },

    wheel: function (root) {
      var SEC = [["sans", -90, 214, L("Гротески", "Sans")], ["concept", -45, 262, L("Концептуально-логические", "Conceptual")], ["imit", 0, 318, L("Имитации", "Imitations")], ["hand", 45, 14, L("Рукописные", "Handwritten")], ["hist", 90, 44, L("Исторические почерки", "Historical scripts")], ["callig", 135, 84, L("Каллиграфические", "Calligraphic")], ["serif", 180, 140, L("Антиквы", "Serif")], ["slab", -135, 188, L("Брусковые", "Slab serif")]];
      var C = 300, R = 190, RINGS = [0.36, 0.66, 1];
      function pt(a, r) { a = a * Math.PI / 180; return [C + Math.cos(a) * r, C + Math.sin(a) * r]; }
      function arc(a0, a1, r0, r1) { var p0 = pt(a0, r1), p1 = pt(a1, r1), p2 = pt(a1, r0), p3 = pt(a0, r0); return "M" + p0 + " A" + r1 + "," + r1 + " 0 0 1 " + p1 + " L" + p2 + " A" + r0 + "," + r0 + " 0 0 0 " + p3 + " Z"; }
      var svg = '<svg viewBox="0 0 600 600" class="fig-svg fig-wheel" role="img" aria-label="' + esc(L("Круг шрифтов", "Type wheel")) + '">';
      SEC.forEach(function (s) {
        for (var i = 1; i < RINGS.length; i++) svg += '<path d="' + arc(s[1] - 22.5, s[1] + 22.5, RINGS[i - 1] * R, RINGS[i] * R) + '" style="fill:hsl(' + s[2] + ' 60% ' + (i === 1 ? 84 : 70) + '%)" class="s-card" stroke-width="1.5"/>';
        var lp = pt(s[1], R + 40), words = s[3].split(/[- ]/), lines = s[3].length > 13 && words.length > 1 ? [words[0] + (s[3].indexOf("-") > 0 ? "-" : ""), words.slice(1).join(" ")] : [s[3]];
        svg += '<text class="ft fw-b t-ink" text-anchor="middle" x="' + lp[0] + '" y="' + (lp[1] - (lines.length - 1) * 8 + 5) + '">' + lines.map(function (l, i) { return '<tspan x="' + lp[0] + '" dy="' + (i ? 17 : 0) + '">' + esc(l) + "</tspan>"; }).join("") + "</text>";
      });
      svg += '<circle cx="' + C + '" cy="' + C + '" r="' + RINGS[0] * R + '" fill="#fff" fill-opacity=".85"/>';
      svg += '<text class="ft fw-b" style="fill:#15223a" text-anchor="middle" x="' + C + '" y="' + (C + 5) + '">' + esc(L("ТЕКСТОВЫЕ", "TEXT")) + "</text>";
      svg += '<text class="ft fs-s" style="fill:#15223a" text-anchor="middle" x="' + C + '" y="' + (C + (RINGS[0] + RINGS[1]) / 2 * R + 4) + '">' + esc(L("РЕГУЛЯРНЫЕ", "REGULAR")) + "</text>";
      svg += '<text class="ft fs-s" style="fill:#15223a" text-anchor="middle" x="' + C + '" y="' + (C + (RINGS[1] + 1) / 2 * R + 4) + '">' + esc(L("АКЦИДЕНТНЫЕ", "DISPLAY")) + "</text>";
      svg += '<defs><marker id="fwArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="f-acc"/></marker></defs>';
      var a0 = pt(-62, RINGS[0] * R + 4), a1 = pt(-62, R - 4);
      svg += '<line x1="' + a0[0] + '" y1="' + a0[1] + '" x2="' + a1[0] + '" y2="' + a1[1] + '" class="s-acc" stroke-width="3" marker-end="url(#fwArr)"/>';
      svg += "</svg>";
      root.innerHTML = '<div class="fig-wheel-wrap">' + svg + '<div class="fig-legend"><p><b>' + esc(L("От центра к краю", "From centre to edge")) + "</b> — " + esc(L("растёт выразительность: от текстовых через регулярные к акцидентным. Чем дальше от центра, тем крупнее кегль и короче текст.", "expressiveness grows from text through regular to display. The further out, the larger the size and the shorter the text.")) + "</p><p><b>" + esc(L("По кругу", "Around the wheel")) + "</b> — " + esc(L("жанр шрифта: от книжных антикв до имитаций и исторических почерков.", "the genre: from book serifs to imitations and historical scripts.")) + "</p></div></div>" +
        cap(L("Схема по мотивам классификации А. Корольковой: положение шрифта задаётся двумя координатами — жанром и степенью выразительности.", "Diagram after A. Korolkova's classification: a typeface is placed by two coordinates — genre and degree of expressiveness."));
    },

    factors: function (root) {
      var optics = '<svg viewBox="0 0 220 120" class="fig-svg"><line x1="0" x2="220" y1="25" y2="25" class="s-warn" stroke-dasharray="5 4"/><line x1="0" x2="220" y1="95" y2="95" class="s-warn" stroke-dasharray="5 4"/><rect x="20" y="25" width="70" height="70" class="f-ink"/><circle cx="160" cy="60" r="38" class="f-ink"/></svg>';
      var logic = '<svg viewBox="0 0 220 120" class="fig-svg"><g transform="translate(110 60) rotate(-30)"><rect x="-26" y="-5" width="52" height="10" rx="2" class="f-acc"/></g><path d="M40 95 C 70 20, 110 20, 130 60 S 175 100, 190 30" class="s-ink f-none" stroke-width="3"/><text x="110" y="114" class="ft fs-s t-mut" text-anchor="middle">' + esc(L("перо под углом 30°", "pen at 30°")) + "</text></svg>";
      var trad = '<div style="' + ff("pt-serif") + 'font-size:44px;line-height:1.2;text-align:center">д л ф<br><span style="font-size:22px">' + esc(L("привычные формы", "familiar forms")) + "</span></div>";
      root.innerHTML = '<div class="fig-grid3">' +
        '<div class="fig-tile"><p class="fig-h">' + esc(L("Оптика", "Optics")) + "</p>" + optics + '<p class="fig-note">' + esc(L("Круг касается линий в одной точке и кажется меньше квадрата той же высоты", "A circle touches the guides at one point and looks smaller than a square of the same height")) + "</p></div>" +
        '<div class="fig-tile"><p class="fig-h">' + esc(L("Логика", "Logic")) + "</p>" + logic + '<p class="fig-note">' + esc(L("Все знаки подчинены одному принципу — следу инструмента или конструктивному правилу", "All letters follow one principle — the trace of a tool or a construction rule")) + "</p></div>" +
        '<div class="fig-tile"><p class="fig-h">' + esc(L("Традиция", "Tradition")) + "</p>" + trad + '<p class="fig-note">' + esc(L("Форма опирается на исторически сложившийся образ знаков и привычки читателя", "Form rests on the established image of letters and reading habits")) + "</p></div></div>" +
        cap(L("Три фактора, определяющие форму шрифтового знака.", "Three factors that shape a letter."));
    },

    tool: function (root) {
      function o(cx, rot, innerRx, innerRy, axis) {
        return '<ellipse cx="' + cx + '" cy="110" rx="62" ry="78" class="f-ink"/><ellipse cx="' + cx + '" cy="110" rx="' + innerRx + '" ry="' + innerRy + '" transform="rotate(' + rot + " " + cx + ' 110)" class="f-card"/>' +
          '<line x1="' + (cx + axis[0]) + '" y1="' + (110 + axis[1]) + '" x2="' + (cx - axis[0]) + '" y2="' + (110 - axis[1]) + '" class="s-warn" stroke-width="2" stroke-dasharray="6 4"/>';
      }
      var svg = '<svg viewBox="0 0 640 260" class="fig-svg">' +
        o(150, -30, 36, 66, [-48, -82]) + o(470, 0, 24, 66, [0, -96]) +
        '<g transform="translate(270 70) rotate(-30)"><rect x="-22" y="-6" width="44" height="12" rx="2" class="f-acc"/></g>' +
        '<path d="M580 40 l14 40 l-14 14 l-14 -14 z" class="f-acc"/>' +
        label(150, 222, L("Широконечное перо", "Broad-nib pen"), "t-ink fw-b", "middle") + label(150, 242, L("трансляция · наклонная ось", "translation · inclined axis"), "t-mut", "middle") +
        label(470, 222, L("Остроконечное перо", "Pointed pen"), "t-ink fw-b", "middle") + label(470, 242, L("экспансия · вертикальная ось", "expansion · vertical axis"), "t-mut", "middle") +
        "</svg>";
      root.innerHTML = scroll(svg, 480) + cap(L("Контраст как след инструмента (по Г. Нордзею): пунктир показывает ось контраста — линию, соединяющую самые тонкие участки овала.", "Contrast as the trace of the tool (after G. Noordzij): the dashed line is the contrast axis connecting the thinnest parts of the oval."));
    },

    uiroles: function (root) {
      root.innerHTML = '<div class="fig-ui"><div class="fu-phone"><p class="fu-hero" style="' + ff("unbounded") + '">' + esc(L("Лето в городе", "Summer in the city")) + '</p><div class="fu-ui" style="' + ff("golos-text") + '"><label>' + esc(L("Дата", "Date")) + '</label><span class="fu-input">12.07.2027</span><label>' + esc(L("Количество билетов", "Tickets")) + '</label><span class="fu-input">2</span><span class="fu-btn">' + esc(L("Купить билеты", "Buy tickets")) + '</span><small>' + esc(L("Возврат возможен за 24 часа до начала", "Refunds up to 24 hours before the start")) + "</small></div></div>" +
        '<div class="fu-notes"><p><span class="fu-tag fu-a">A</span><b>' + esc(L("Акцидентный шрифт", "Display face")) + "</b> — " + esc(L("один крупный заголовок, передающий характер продукта.", "one large heading that carries the product's character.")) + '</p><p><span class="fu-tag fu-b">B</span><b>' + esc(L("Нейтральный интерфейсный шрифт", "Neutral interface face")) + "</b> — " + esc(L("подписи, поля, кнопки, сообщения: всё, что пользователь читает, выполняя задачу.", "labels, fields, buttons, messages: everything users read while doing a task.")) + "</p></div></div>" +
        cap(L("Распределение ролей в интерфейсе: характер сосредоточен в одном элементе, основной набор остаётся нейтральным.", "Role distribution in an interface: character is concentrated in one element, the bulk of the text stays neutral."));
    },

    /* ---------- weights ---------- */

    family: function (root) {
      var faces = [["400", "normal", "Regular"], ["400", "italic", "Italic"], ["700", "normal", "Bold"], ["700", "italic", "Bold Italic"]];
      root.innerHTML = '<div class="fig-fam"><div class="ff-level"><span class="ff-tag">' + esc(L("Суперсемейство", "Superfamily")) + '</span><div class="ff-box ff-root">PT</div></div>' +
        '<div class="ff-level"><span class="ff-tag">' + esc(L("Семейство (гарнитура)", "Family (typeface)")) + '</span><div class="ff-row">' + ["pt-serif", "pt-sans", "pt-mono"].map(function (id) { return '<div class="ff-box' + (id === "pt-sans" ? " is-on" : "") + '" style="' + ff(id) + 'font-size:20px">' + font(id).family + "</div>"; }).join("") + "</div></div>" +
        '<div class="ff-level"><span class="ff-tag">' + esc(L("Начертания PT Sans", "PT Sans styles")) + '</span><div class="ff-row">' + faces.map(function (f) { return '<div class="ff-box ff-face"><span style="' + ff("pt-sans") + "font-size:22px;font-weight:" + f[0] + ";font-style:" + f[1] + '">' + f[2] + "</span><code>" + f[0] + " · " + f[1] + "</code></div>"; }).join("") + "</div></div></div>" +
        cap(L("Иерархия понятий: суперсемейство объединяет гарнитуры разных классов, гарнитура (семейство) — начертания, различающиеся насыщенностью и наклоном. В CSS семейство указывается в font-family, начертание — в font-weight и font-style.", "Hierarchy of terms: a superfamily unites typefaces of different classes; a typeface (family) unites styles that differ in weight and slope. In CSS the family goes in font-family, the style in font-weight and font-style."));
    },

    files: function (root) {
      function blocks(n, cls) { var h = ""; for (var i = 0; i < n; i++) h += '<span class="fl-b ' + cls + '"></span>'; return h; }
      root.innerHTML = '<div class="fig-files">' +
        '<div class="fl-row"><b>' + esc(L("Статичный шрифт, 4 начертания", "Static font, 4 styles")) + '</b><div class="fl-blocks">' + blocks(4, "fl-cyr") + blocks(4, "fl-lat") + '</div><small>' + esc(L("Regular, Italic, Bold, Bold Italic × кириллица и латиница = 8 файлов", "Regular, Italic, Bold, Bold Italic × Cyrillic and Latin = 8 files")) + "</small></div>" +
        '<div class="fl-row"><b>' + esc(L("Вариативный шрифт (прямой и курсив)", "Variable font (upright and italic)")) + '</b><div class="fl-blocks">' + blocks(2, "fl-cyr") + blocks(2, "fl-lat") + '</div><small>' + esc(L("весь диапазон насыщенности в одном файле на подмножество = 4 файла", "the whole weight range in one file per subset = 4 files")) + "</small></div>" +
        '<div class="fl-key"><span><i class="fl-b fl-cyr"></i>' + esc(L("кириллица", "Cyrillic")) + '</span><span><i class="fl-b fl-lat"></i>' + esc(L("латиница", "Latin")) + "</span></div></div>" +
        cap(L("Каждое начертание статического шрифта — отдельный запрос к серверу для каждого подмножества знаков. Вариативный файл тяжелее одного статического, но выгоднее, если нужны три и более насыщенности.", "Each static style is a separate request per character subset. A variable file is heavier than one static file but pays off when three or more weights are needed."));
    },

    emphasis: function (root) {
      var R = [
        ["ok", L("Термин <em>апертура</em> обозначает степень раскрытости знака.", "The term <em>aperture</em> denotes how open a letter is."), L("курсив — смысловое выделение", "italic — semantic emphasis")],
        ["ok", L("<strong>Важно:</strong> изменения вступают в силу с 1 марта.", "<strong>Important:</strong> changes take effect on 1 March."), L("полужирный — ключевое слово", "bold — a key word")],
        ["ok", '<span style="text-transform:uppercase;letter-spacing:.08em;font-size:.85em">' + L("Раздел 3", "Section 3") + "</span>", L("прописные с разрядкой — короткая надпись", "tracked caps — a short label")],
        ["bad", L("Это <u>очень важная</u> мысль.", "This is a <u>very important</u> idea."), L("подчёркивание путают со ссылкой", "underline is mistaken for a link")],
        ["bad", '<span style="text-transform:uppercase">' + L("Внимание: проверьте данные", "Attention: check your data") + "</span>", L("прописные без разрядки", "caps without tracking")],
        ["bad", '<strong><em style="text-transform:uppercase">' + L("Срочно прочитайте", "Read urgently") + "</em></strong>", L("три средства сразу", "three devices at once")]
      ];
      root.innerHTML = '<div class="fig-emph">' + R.map(function (r) {
        return '<div class="fe-row fe-' + r[0] + '"><span class="fe-mark">' + (r[0] === "ok" ? "✓" : "✕") + '</span><span class="fe-text" style="' + ff("pt-serif") + '">' + r[1] + '</span><small>' + esc(r[2]) + "</small></div>";
      }).join("") + "</div>" + cap(L("Одно средство выделения на один случай. Сочетание нескольких средств и подчёркивание вне ссылок нарушают ровность набора.", "One emphasis device per case. Combining devices or underlining outside links disrupts the evenness of the text."));
    },

    /* ---------- setting ---------- */

    measure: function (root) {
      function block(x, w, lines, title, sub, cls) {
        var h = "";
        for (var i = 0; i < lines; i++) h += '<rect x="' + x + '" y="' + (40 + i * 16) + '" width="' + (i === lines - 1 ? w * 0.6 : w) + '" height="6" rx="3" class="' + cls + '"/>';
        h += '<path d="M' + (x + w - 4) + " " + 43 + " C " + (x + w * 0.6) + " " + 52 + ", " + (x + w * 0.3) + " " + 50 + ", " + (x + 6) + " " + 57 + '" class="s-warn f-none" stroke-width="1.6" marker-end="url(#mArr)"/>';
        return h + label(x, 22, title, "t-ink fw-b") + label(x, 40 + lines * 16 + 14, sub, "t-mut fs-s");
      }
      var svg = '<svg viewBox="0 0 760 190" class="fig-svg"><defs><marker id="mArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="f-warn-s"/></marker></defs>' +
        block(10, 120, 7, L("< 45 знаков", "< 45 chars"), L("частые переводы строки", "frequent line breaks"), "f-mut") +
        block(170, 230, 5, "45–75", L("оптимальный диапазон", "optimal range"), "f-good-s") +
        block(440, 310, 4, L("> 75 знаков", "> 75 chars"), L("трудно найти начало строки", "hard to find the next line"), "f-mut") + "</svg>";
      root.innerHTML = scroll(svg, 600) + cap(L("Стрелка — возвратное движение глаз к началу следующей строки. В длинной строке оно становится трудным, в короткой — слишком частым.", "The arrow is the return sweep of the eyes to the next line. In a long line it is hard, in a short one too frequent."));
    },

    mobile: function (root) {
      root.innerHTML = '<div class="fig-mobile"><div class="fm-phone"><div class="fm-screen"><span class="fm-pad fm-l"></span><p style="' + ff("pt-serif") + '">' + esc(L("На экране шириной 375 px при кегле 17 px и полях по 16 px строка содержит около 40 знаков. Это нормальная длина для мобильного чтения.", "On a 375 px screen with 17 px text and 16 px margins a line holds about 40 characters. That is a normal length for mobile reading.")) + '</p><span class="fm-pad fm-r"></span></div></div>' +
        '<ul class="fm-notes"><li><b>375 px</b> — ' + esc(L("типичная ширина области просмотра", "a typical viewport width")) + "</li><li><b>16 px</b> — " + esc(L("боковые поля", "side margins")) + "</li><li><b>16–18 px</b> — " + esc(L("кегль основного текста", "body size")) + "</li><li><b>35–50</b> — " + esc(L("знаков в строке", "characters per line")) + "</li></ul></div>" +
        cap(L("На смартфоне длину строки задаёт ширина экрана: уменьшать кегль или поля, чтобы вместить больше знаков, не следует.", "On a phone the screen width sets the line length: do not shrink the size or margins to fit more characters."));
    },

    halfleading: function (root) {
      ready(["onest"], function () {
        var S = 64, LH = 1.6, lb = S * LH, top = 30, x = 150;
        var mm = m("onest", S, "Шрифт xg"), ca = S * 1.0, half = (lb - ca) / 2;
        var base = top + half + ca * 0.8;
        var svg = '<svg viewBox="0 0 760 ' + (lb + 70) + '" class="fig-svg">' +
          '<rect x="' + x + '" y="' + top + '" width="420" height="' + lb + '" class="f-soft s-line"/>' +
          '<rect x="' + x + '" y="' + top + '" width="420" height="' + half + '" class="f-warnbg"/>' +
          '<rect x="' + x + '" y="' + (top + lb - half) + '" width="420" height="' + half + '" class="f-warnbg"/>' +
          '<text x="' + (x + 20) + '" y="' + base + '" style="' + ff("onest") + "font-size:" + S + 'px" class="t-ink">' + esc(L("Шрифт", "Type")) + "</text>" +
          '<line x1="' + x + '" x2="' + (x + 420) + '" y1="' + base + '" y2="' + base + '" class="s-acc" stroke-dasharray="4 3"/>' +
          label(x - 10, top + half / 2 + 5, L("полуинтерлиньяж", "half-leading"), "t-warn fs-s", "end") + label(x - 10, top + lb - half / 2 + 5, L("полуинтерлиньяж", "half-leading"), "t-warn fs-s", "end") +
          label(x - 10, top + lb / 2 + 5, "font-size: " + S + "px", "t-ink fs-s", "end") +
          '<line x1="' + (x + 440) + '" x2="' + (x + 440) + '" y1="' + top + '" y2="' + (top + lb) + '" class="s-ink"/><line x1="' + (x + 434) + '" x2="' + (x + 446) + '" y1="' + top + '" y2="' + top + '" class="s-ink"/><line x1="' + (x + 434) + '" x2="' + (x + 446) + '" y1="' + (top + lb) + '" y2="' + (top + lb) + '" class="s-ink"/>' +
          label(x + 456, top + lb / 2 - 4, "line-height: " + LH, "t-ink fw-b") + label(x + 456, top + lb / 2 + 16, "= " + Math.round(lb) + " px", "t-mut") +
          label(x, top + lb + 30, L("(" + Math.round(lb) + " − " + S + ") / 2 = " + String(Math.round(half * 10) / 10).replace(".", ",") + " px сверху и снизу строки", "(" + Math.round(lb) + " − " + S + ") / 2 = " + Math.round(half * 10) / 10 + " px above and below the line"), "t-mut") + "</svg>";
        root.innerHTML = scroll(svg, 600) + cap(L("Строка в CSS: разница между line-height и кеглем делится поровну над строкой и под ней. Поэтому первая строка блока начинается ниже верхней границы контейнера.", "A CSS line box: the difference between line-height and font size is split equally above and below. That is why the first line starts below the top of its container."));
        void mm;
      });
    },

    vwchart: function (root) {
      var X0 = 60, X1 = 720, Y0 = 230, Y1 = 20, vmin = 320, vmax = 1440, smin = 10, smax = 64;
      function X(v) { return X0 + (v - vmin) / (vmax - vmin) * (X1 - X0); }
      function Y(s) { return Y0 - (s - smin) / (smax - smin) * (Y0 - Y1); }
      function path(fn) { var d = ""; for (var v = vmin; v <= vmax; v += 20) d += (d ? " L" : "M") + X(v).toFixed(1) + " " + Y(fn(v)).toFixed(1); return d; }
      var vw = function (v) { return v * 0.04; }, cl = function (v) { return Math.min(48, Math.max(24, 16 + v * 0.025)); };
      var svg = '<svg viewBox="0 0 760 290" class="fig-svg">';
      [16, 32, 48, 64].forEach(function (s) { svg += '<line x1="' + X0 + '" x2="' + X1 + '" y1="' + Y(s) + '" y2="' + Y(s) + '" class="s-line"/>' + label(X0 - 8, Y(s) + 4, s + " px", "t-mut fs-s", "end"); });
      [320, 768, 1024, 1440].forEach(function (v) { svg += label(X(v), Y0 + 20, v + " px", "t-mut fs-s", "middle"); });
      svg += '<rect x="' + X0 + '" y="' + Y(16) + '" width="' + (X1 - X0) + '" height="' + (Y0 - Y(16)) + '" class="f-warnbg" opacity=".6"/>';
      svg += '<path d="' + path(vw) + '" class="s-warn f-none" stroke-width="3"/><path d="' + path(cl) + '" class="s-acc f-none" stroke-width="3"/>';
      svg += label(X(1400), Y(vw(1400)) - 12, "font-size: 4vw", "t-warn fw-b", "end") + label(X(700), Y(cl(700)) - 12, "clamp(1.5rem, 1rem + 2.5vw, 3rem)", "t-acc fw-b", "middle");
      svg += label(X0 + 6, Y(16) + 20, L("зона нечитаемого кегля", "unreadably small"), "t-warn fs-s") + label((X0 + X1) / 2, Y0 + 44, L("ширина области просмотра", "viewport width"), "t-mut", "middle") + "</svg>";
      root.innerHTML = scroll(svg, 600) + cap(L("Кегль в vw растёт без ограничений и не реагирует на масштабирование страницы. clamp() задаёт нижнюю и верхнюю границы в rem, поэтому учитывает настройки пользователя.", "A vw size grows without limits and ignores page zoom. clamp() sets lower and upper bounds in rem, so it respects user settings."));
    },

    ptpx: function (root) {
      var rows = [[9, 12], [12, 16], [14, 18.67], [18, 24], [24, 32]];
      root.innerHTML = '<div class="fig-ptpx"><div class="pp-scale">' + rows.map(function (r) {
        return '<div class="pp-row"><span class="pp-pt">' + r[0] + ' pt</span><span class="pp-track"><span class="pp-bar" style="width:' + (r[1] / 32 * 100).toFixed(1) + '%"></span></span><span class="pp-px">' + String(r[1]).replace(".", App.lang === "ru" ? "," : ".") + ' px</span><span class="pp-sample" style="font-size:' + r[1] + 'px">Аа</span></div>';
      }).join("") + '</div><div class="pp-dpr"><div class="pp-grid1"><span></span></div><span>1 CSS px · DPR 1</span><div class="pp-grid2">' + "<span></span>".repeat(4) + '</div><span>1 CSS px · DPR 2</span><div class="pp-grid3">' + "<span></span>".repeat(9) + "</div><span>1 CSS px · DPR 3</span></div></div>" +
        cap(L("1 pt = 1/72 дюйма, 1 CSS px = 1/96 дюйма, поэтому 1 pt = 4/3 px. CSS-пиксель — условная единица: на экранах высокой плотности он отображается несколькими физическими пикселями (device pixel ratio).", "1 pt = 1/72 inch and 1 CSS px = 1/96 inch, so 1 pt = 4/3 px. A CSS pixel is a reference unit: on high-density screens it is drawn with several physical pixels (device pixel ratio)."));
    },

    /* ---------- scale ---------- */

    modscale: function (root) {
      var steps = [-1, 0, 1, 2, 3, 4], r = 1.25;
      root.innerHTML = '<div class="fig-steps">' + steps.map(function (k) {
        var px = 16 * Math.pow(r, k);
        return '<div class="fst"><span style="' + ff("onest") + "font-size:" + px.toFixed(1) + 'px;line-height:1">Аа</span><b>' + (k > 0 ? "+" : "") + k + "</b><small>" + px.toFixed(1).replace(".0", "").replace(".", App.lang === "ru" ? "," : ".") + " px</small></div>";
      }).join('<span class="fst-x">× 1,25</span>'.replace(",", App.lang === "ru" ? "," : ".")) + "</div>" +
        cap(L("Модульная шкала с отношением 1,25 от базового кегля 16 px: каждая ступень в 1,25 раза больше предыдущей.", "A modular scale with ratio 1.25 from a 16 px base: each step is 1.25 times the previous one."));
    },

    ratios: function (root) {
      var R = [1.125, 1.25, 1.5];
      root.innerHTML = '<div class="fig-grid3">' + R.map(function (r) {
        var lv = [3, 2, 1, 0].map(function (k) { return 11.5 * Math.pow(r, k); });
        return '<div class="fig-tile"><p class="fig-h">' + String(r).replace(".", App.lang === "ru" ? "," : ".") + '</p><div style="' + ff("onest") + '">' +
          '<div style="font-size:' + lv[0] + 'px;font-weight:700;line-height:1.1">' + esc(L("Заголовок", "Heading")) + '</div><div style="font-size:' + lv[1] + 'px;font-weight:700;line-height:1.2;margin-top:4px">' + esc(L("Подзаголовок", "Subheading")) + '</div><div style="font-size:' + lv[2] + 'px;font-weight:600;margin-top:4px">' + esc(L("Раздел", "Section")) + '</div><div style="font-size:' + lv[3] + 'px;color:var(--muted);margin-top:2px">' + esc(L("Основной текст абзаца", "Body text of a paragraph")) + "</div></div>" +
          '<p class="fig-note">' + esc(r === 1.125 ? L("сдержанная, плотная иерархия: интерфейсы, документация", "restrained, dense: interfaces, docs") : r === 1.25 ? L("умеренная: большинство сайтов", "moderate: most websites") : L("выразительная: промостраницы, лонгриды", "expressive: landing pages, long reads")) + "</p></div>";
      }).join("") + "</div>" + cap(L("Одна и та же структура при разных коэффициентах шкалы.", "The same structure at different scale ratios."));
    },

    headspace: function (root) {
      function lines(y, n) { var h = ""; for (var i = 0; i < n; i++) h += '<rect x="20" y="' + (y + i * 14) + '" width="' + (i === n - 1 ? 260 : 420) + '" height="6" rx="3" class="f-mut"/>'; return h; }
      var svg = '<svg viewBox="0 0 760 250" class="fig-svg">' + lines(20, 4) +
        '<rect x="20" y="' + 128 + '" width="300" height="20" rx="3" class="f-ink"/>' + lines(178, 4) +
        '<rect x="460" y="76" width="14" height="52" class="f-acc" opacity=".35"/><line x1="450" x2="484" y1="76" y2="76" class="s-acc"/><line x1="450" x2="484" y1="128" y2="128" class="s-acc"/>' + label(494, 107, L("отбивка над заголовком — 2 строки", "space above — 2 lines"), "t-acc fw-b") +
        '<rect x="460" y="148" width="14" height="26" class="f-acc" opacity=".35"/><line x1="450" x2="484" y1="148" y2="148" class="s-acc"/><line x1="450" x2="484" y1="174" y2="174" class="s-acc"/>' + label(494, 166, L("под заголовком — 1 строка", "below — 1 line"), "t-acc fw-b") +
        label(330, 143, L("Заголовок", "Heading"), "t-mut fs-s") + "</svg>";
      root.innerHTML = scroll(svg, 560) + cap(L("Закон близости: заголовок ближе к тексту, который он вводит, чем к предыдущему разделу. Отступы удобно выражать в долях базового интерлиньяжа.", "The law of proximity: a heading sits closer to the text it introduces than to the previous section. Express spacing in multiples of the base line height."));
    },

    /* ---------- pairing ---------- */

    roles: function (root) {
      root.innerHTML = '<div class="fig-roles"><div class="fr-page"><p class="fr-h" style="' + ff("playfair-display") + '">' + esc(L("Как читать шрифт", "How to read a typeface")) + '</p><p class="fr-t" style="' + ff("source-sans-3") + '">' + esc(L("Основной текст набран гуманистическим гротеском: он нейтрален и хорошо читается на экране. Чтобы подключить шрифт, вызовите", "Body text is set in a humanist sans: neutral and legible on screen. To load the font, call")) + ' <code style="' + ff("jetbrains-mono") + '">loadFont()</code>.</p><span class="fr-btn" style="' + ff("source-sans-3") + '">' + esc(L("Подписаться", "Subscribe")) + "</span></div>" +
        '<ul class="fr-key"><li><b style="' + ff("playfair-display") + '">Playfair Display</b> — ' + esc(L("заголовки", "headings")) + '</li><li><b style="' + ff("source-sans-3") + '">Source Sans 3</b> — ' + esc(L("основной текст и интерфейс", "body text and interface")) + '</li><li><b style="' + ff("jetbrains-mono") + '">JetBrains Mono</b> — ' + esc(L("программный код", "code")) + "</li></ul></div>" +
        cap(L("У каждой гарнитуры — постоянная роль. Три гарнитуры оправданы только при трёх разных функциях текста.", "Each typeface has a fixed role. Three typefaces are justified only by three different text functions."));
    },

    contrastcommon: function (root) {
      var rows = [[L("Засечки", "Serifs"), "≠", "="], [L("Пропорции", "Proportions"), "=", "="], [L("Высота строчных", "x-height"), "=", "="], [L("Апертура", "Aperture"), "=", "≈"], [L("Форма овалов", "Oval shape"), "=", "≈"]];
      root.innerHTML = '<div class="fig-cc"><div class="fc-pairs"><div class="fig-tile is-good"><span style="' + ff("pt-serif") + 'font-size:26px;font-weight:700">' + esc(L("Заголовок", "Heading")) + '</span><span style="' + ff("pt-sans") + 'font-size:16px">' + esc(L("Основной текст абзаца", "Body paragraph text")) + '</span><p class="fig-note">PT Serif + PT Sans — ' + esc(L("контраст и общность", "contrast and unity")) + '</p></div><div class="fig-tile is-bad"><span style="' + ff("roboto") + 'font-size:26px;font-weight:700">' + esc(L("Заголовок", "Heading")) + '</span><span style="' + ff("arimo") + 'font-size:16px">' + esc(L("Основной текст абзаца", "Body paragraph text")) + '</span><p class="fig-note">Roboto + Arimo — ' + esc(L("различие незаметно: конфликт", "difference unnoticeable: conflict")) + "</p></div></div>" +
        '<table class="fc-table"><tr><th></th><th>PT Serif + PT Sans</th><th>Roboto + Arimo</th></tr>' + rows.map(function (r) { return "<tr><td>" + esc(r[0]) + '</td><td class="' + (r[1] === "≠" ? "fc-diff" : "") + '">' + r[1] + "</td><td>" + r[2] + "</td></tr>"; }).join("") + "</table></div>" +
        cap(L("Удачная пара: различие по одному явному признаку (≠) при общности остальных (=). Неудачная: различий нет, но гарнитуры не идентичны (≈).", "A good pair differs in one clear feature (≠) and shares the rest (=). A poor pair has no clear difference, yet the faces are not identical (≈)."));
    },

    /* ---------- accessibility ---------- */

    contrastscale: function (root) {
      var M = [[3, "#949494", L("AA для крупного текста", "AA large text")], [4.5, "#767676", L("AA для обычного текста · AAA для крупного", "AA normal text · AAA large text")], [7, "#595959", L("AAA для обычного текста", "AAA normal text")], [21, "#000000", L("максимум: чёрный на белом", "maximum: black on white")]];
      function X(r) { return 4 + Math.log(r) / Math.log(21) * 92; }
      root.innerHTML = '<div class="fig-cs"><div class="cs-bar"><span style="left:0">1:1</span><span style="right:0">21:1</span></div><div class="cs-marks">' + M.map(function (mk) {
        return '<div class="cs-mark" style="left:' + X(mk[0]) + '%"><i></i><b>' + String(mk[0]).replace(".", App.lang === "ru" ? "," : ".") + ":1</b></div>";
      }).join("") + '</div><div class="cs-samples">' + M.map(function (mk) {
        return '<div class="cs-sample"><span style="color:' + mk[1] + '">' + esc(L("Образец текста", "Sample text")) + " " + mk[1] + "</span><small>" + String(mk[0]).replace(".", App.lang === "ru" ? "," : ".") + ":1 — " + esc(mk[2]) + "</small></div>";
      }).join("") + "</div></div>" + cap(L("Пороговые значения контраста WCAG и соответствующие им оттенки серого на белом фоне. Шкала логарифмическая.", "WCAG contrast thresholds and the matching greys on white. The scale is logarithmic."));
    },

    /* ---------- web fonts ---------- */

    fontface: function (root) {
      var F = [["400", "normal", "onest-400.woff2"], ["400", "italic", "onest-400-italic.woff2"], ["700", "normal", "onest-700.woff2"], ["700", "italic", "onest-700-italic.woff2"]];
      root.innerHTML = '<div class="fig-ff"><div class="ffc-css"><code>h2 {<br>&nbsp;&nbsp;font-family: "Onest";<br>&nbsp;&nbsp;<b>font-weight: 700;</b><br>}</code></div><div class="ffc-arrow" aria-hidden="true"></div><div class="ffc-faces">' + F.map(function (f) {
        var on = f[0] === "700" && f[1] === "normal";
        return '<div class="ffc-face' + (on ? " is-on" : "") + '"><code>@font-face · "Onest" · ' + f[0] + " · " + f[1] + '</code><span>' + f[2] + "</span></div>";
      }).join("") + "</div></div>" + cap(L("Браузер сопоставляет font-family, font-weight и font-style элемента с описаниями @font-face и загружает только подходящий файл — и только тогда, когда он действительно нужен на странице.", "The browser matches the element's font-family, font-weight and font-style against the @font-face rules and downloads only the matching file, and only when the page actually needs it."));
    },

    subsets: function (root) {
      var S = [["cyrillic", "U+0400–045F …", L("кириллица", "Cyrillic"), true], ["latin", "U+0000–00FF …", L("латиница, цифры, знаки", "Latin, digits, punctuation"), true], ["cyrillic-ext", "U+0460–052F …", L("расширенная кириллица", "extended Cyrillic"), false], ["greek", "U+0370–03FF", L("греческий", "Greek"), false], ["vietnamese", "U+0102–0103 …", L("вьетнамский", "Vietnamese"), false]];
      root.innerHTML = '<div class="fig-sub"><div class="fsb-page"><small>' + esc(L("Текст страницы", "Page text")) + '</small><p style="' + ff("onest") + '">' + esc(L("Привет! Курс 2027 года — 9 модулей.", "Hello! The 2027 course has 9 modules.")) + '</p></div><div class="fsb-files">' + S.map(function (s) {
        return '<div class="fsb-file' + (s[3] ? " is-on" : "") + '"><b>' + s[0] + ".woff2</b><code>" + s[1] + "</code><small>" + esc(s[2]) + " · " + esc(s[3] ? L("загружается", "downloaded") : L("не загружается", "not downloaded")) + "</small></div>";
      }).join("") + "</div></div>" + cap(L("Шрифт разделён на подмножества с собственным unicode-range. Браузер загружает только те файлы, знаки которых встречаются на странице: для русского текста — кириллицу и латиницу (в ней цифры и знаки препинания).", "The font is split into subsets with their own unicode-range. The browser downloads only files whose characters appear on the page: for Russian text, Cyrillic and Latin (which holds digits and punctuation)."));
    },

    fdtimeline: function (root) {
      var X0 = 210, X1 = 740, T = 4000;
      function X(t) { return X0 + Math.min(t, T) / T * (X1 - X0); }
      var rows = [["block", 3000, Infinity], ["swap", 100, Infinity], ["fallback", 100, 3000], ["optional", 100, 0]];
      var svg = '<svg viewBox="0 0 760 ' + (rows.length * 46 + 40) + '" class="fig-svg">';
      rows.forEach(function (r, i) {
        var y = 20 + i * 46, b = r[1], sw = r[2] === Infinity ? T : b + r[2];
        svg += label(X0 - 14, y + 20, "font-display: " + r[0], "t-ink fw-b fs-s", "end");
        svg += '<rect x="' + X(0) + '" y="' + y + '" width="' + (X(b) - X(0)) + '" height="28" class="f-ink" opacity=".8"/>';
        if (sw > b) svg += '<rect x="' + X(b) + '" y="' + y + '" width="' + (X(sw) - X(b)) + '" height="28" class="f-acc" opacity=".55"/>';
        if (sw < T) svg += '<rect x="' + X(sw) + '" y="' + y + '" width="' + (X(T) - X(sw)) + '" height="28" class="f-mut" opacity=".35"/>';
      });
      var yl = 20 + rows.length * 46 + 6;
      [0, 1000, 2000, 3000].forEach(function (t) { svg += label(X(t), yl + 4, t / 1000 + (App.lang === "ru" ? " с" : " s"), "t-mut fs-s", "middle"); });
      root.innerHTML = scroll(svg + "</svg>", 600) + '<div class="fig-key"><span><i style="background:var(--ink);opacity:.8"></i>' + esc(L("блокировка: текст невидим", "block: text invisible")) + '</span><span><i style="background:var(--accent);opacity:.55"></i>' + esc(L("подмена: резервный шрифт, затем веб-шрифт", "swap: fallback, then web font")) + '</span><span><i style="background:var(--muted);opacity:.35"></i>' + esc(L("отказ: остаётся резервный шрифт", "failure: fallback stays")) + "</span></div>" + cap(L("Периоды отображения текста для разных значений font-display (длительности соответствуют рекомендациям спецификации CSS Fonts).", "Text rendering periods for each font-display value (durations follow the CSS Fonts specification's recommendations)."));
    },

    preload: function (root) {
      function row(y, x, w, cls, text) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="20" rx="3" class="' + cls + '"/>' + label(x + w + 8, y + 15, text, "t-mut fs-s"); }
      var svg = '<svg viewBox="0 0 760 250" class="fig-svg">' +
        label(10, 22, L("Без preload", "Without preload"), "t-ink fw-b") + row(32, 10, 120, "f-mut", "HTML") + row(58, 120, 150, "f-mut", "CSS") + row(84, 270, 190, "f-warn-s", L("шрифт: запрос после разбора CSS", "font: requested after CSS is parsed")) +
        label(10, 142, L("С preload", "With preload"), "t-ink fw-b") + row(152, 10, 120, "f-mut", "HTML") + row(178, 120, 150, "f-mut", "CSS") + row(204, 120, 190, "f-good-s", L("шрифт: загружается параллельно с CSS", "font: loads in parallel with CSS")) +
        '<line x1="460" x2="460" y1="30" y2="110" class="s-warn" stroke-dasharray="4 3"/><line x1="310" x2="310" y1="150" y2="230" class="s-acc" stroke-dasharray="4 3"/>' + "</svg>";
      root.innerHTML = scroll(svg, 600) + cap(L("Подсказка <link rel=\"preload\"> сообщает браузеру о шрифте до разбора CSS. Применяется только к одному-двум файлам, которые нужны на первом экране.", "A <link rel=\"preload\"> hint tells the browser about the font before CSS is parsed. Use it only for the one or two files needed on the first screen."));
    },

    rumarks: function (root) {
      var R = [["« »", L("кавычки-«ёлочки»", "guillemets"), L("основные кавычки", "primary quotes"), "«шрифт»"], ["„ “", L("кавычки-„лапки“", "low-high quotes"), L("вложенные кавычки", "nested quotes"), "«о „Шрифте“»"], ["—", L("тире", "em dash"), L("между частями предложения, с пробелами", "between clauses, with spaces"), "кегль — размер"], ["–", L("короткое тире", "en dash"), L("числовые диапазоны, без пробелов", "number ranges, no spaces"), "10–15"], ["-", L("дефис", "hyphen"), L("внутри слова", "inside words"), "веб-шрифт"], ["−", L("минус", "minus"), L("в математических выражениях", "in maths"), "7 − 3 = 4"], ["°", L("неразрывный пробел", "non-breaking space"), L("после предлогов, перед тире, между числом и единицей", "after prepositions, before dashes, between number and unit"), "25°км"], ["№", L("знак номера", "numero sign"), L("с неразрывным пробелом", "with a non-breaking space"), "№°5"]];
      root.innerHTML = '<div class="fig-marks">' + R.map(function (r) {
        return '<div class="fmk"><span class="fmk-g" style="' + ff("pt-serif") + '">' + esc(r[0]) + '</span><b>' + esc(r[1]) + "</b><small>" + esc(r[2]) + '</small><span class="fmk-ex" style="' + ff("pt-serif") + '">' + esc(r[3]).replace(/°/g, '<span class="tk-nb">°</span>') + "</span></div>";
      }).join("") + "</div>" + cap(L("Знаки русского набора. Знаком ° в примерах обозначен неразрывный пробел.", "Russian typesetting marks. The ° sign in the examples marks a non-breaking space."));
    }
  };
})();
