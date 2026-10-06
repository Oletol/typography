/* Demos for the module “Typeface character”. MIT License. */
(function () {
  "use strict";

  var FALLBACK = { serif: "Georgia, serif", slab: "Georgia, serif", sans: "system-ui, sans-serif", mono: "ui-monospace, monospace", display: "system-ui, sans-serif", script: "cursive" };
  function font(id) { return window.FONTS.find(function (f) { return f.id === id; }); }
  function stack(id) { var f = font(id); return '"' + f.family + '", ' + FALLBACK[f.cls]; }
  var esc = function (x) { return App.esc(x); };

  /* sectors clockwise from the top; angle of the sector centre in degrees (0 = right) */
  var SECTORS = [
    { k: "sans", a: -90, h: 214 }, { k: "concept", a: -45, h: 262 }, { k: "imit", a: 0, h: 318 }, { k: "hand", a: 45, h: 14 },
    { k: "hist", a: 90, h: 44 }, { k: "callig", a: 135, h: 84 }, { k: "serif", a: 180, h: 140 }, { k: "slab", a: -135, h: 188 }
  ];
  /* [font id, sector key, radius 0–1, offset within sector −1…1] — a teaching interpretation */
  var PLACED = [
    ["literata", "serif", 0.14, -0.4], ["pt-serif", "serif", 0.23, 0.35], ["source-serif-4", "serif", 0.3, -0.5],
    ["inter", "sans", 0.12, -0.5], ["pt-sans", "sans", 0.22, 0.45], ["golos-text", "sans", 0.27, -0.3], ["onest", "sans", 0.17, 0.7],
    ["roboto-slab", "slab", 0.24, -0.2], ["bitter", "slab", 0.3, 0.5], ["alegreya", "callig", 0.27, 0.5],
    ["eb-garamond", "serif", 0.38, 0.6], ["old-standard-tt", "serif", 0.46, -0.45], ["playfair-display", "serif", 0.56, 0.15], ["cormorant", "serif", 0.48, 0.7],
    ["podkova", "slab", 0.47, 0], ["montserrat", "sans", 0.42, 0.45], ["oswald", "sans", 0.53, -0.4],
    ["jost", "concept", 0.4, -0.35], ["comfortaa", "concept", 0.56, 0.45], ["jetbrains-mono", "concept", 0.38, 0.65], ["ibm-plex-mono", "imit", 0.42, -0.2],
    ["unbounded", "concept", 0.7, -0.1], ["rubik-mono-one", "concept", 0.86, -0.45], ["poiret-one", "concept", 0.8, 0.5],
    ["russo-one", "sans", 0.76, 0.2], ["press-start-2p", "imit", 0.88, 0.1], ["yeseva-one", "serif", 0.78, -0.2], ["ruslan-display", "hist", 0.82, 0],
    ["caveat", "hand", 0.5, 0.1], ["neucha", "hand", 0.68, -0.45], ["amatic-sc", "hand", 0.86, 0.35], ["pacifico", "hand", 0.76, 0.75], ["bad-script", "hand", 0.62, -0.8],
    ["marck-script", "callig", 0.68, -0.2], ["great-vibes", "callig", 0.88, 0.25], ["lobster", "callig", 0.78, -0.65]
  ];

  var S = {
    ru: {
      sec: {
        sans: ["Гротески", "Шрифты без засечек: от нейтральных интерфейсных гарнитур до узких и сверхжирных акцидентных."],
        concept: ["Концептуально-логические", "Форма подчинена правилу или конструкции: геометрическому модулю, сетке, единой ширине знаков."],
        imit: ["Имитации", "Подражают материалу или технологии: пишущей машинке, трафарету, пиксельному растру, неону."],
        hand: ["Рукописные", "Передают неформальный почерк: фломастер, маркер, кисть; ритм неровный, форма свободная."],
        hist: ["Исторические почерки", "Стилизации исторических форм письма: устава, полуустава, вязи, готического письма."],
        callig: ["Каллиграфические", "Форма задана широконечным или остроконечным пером и ритмом движения руки."],
        serif: ["Антиквы", "Шрифты с засечками книжной традиции: от текстовых гарнитур до контрастных заголовочных."],
        slab: ["Брусковые", "Прямоугольные засечки и низкий контраст: от текстовых гарнитур до плакатных."]
      },
      ring: ["Текстовые шрифты: характер приглушён, внимание читателя сосредоточено на содержании.", "Регулярные шрифты: характер различим; подходят для заголовков и коротких текстов.", "Акцидентные шрифты: характер доминирует; применяются в крупном кегле и в коротких надписях."],
      ringShort: ["текстовые", "регулярные", "акцидентные"],
      textC: "Текстовые", regC: "Регулярные",
      pick: "Выберите точку на круге, чтобы увидеть образец шрифта.",
      sample: "Съешь же ещё этих мягких французских булок",
      note: "Схема построена по мотивам классификации А. Корольковой: направление от центра задаёт жанр, удалённость от центра — степень выразительности. Размещение шрифтов из каталога курса — учебная интерпретация и может обсуждаться.",
      voice: {
        "pt-serif": ["книжный, сдержанный, академичный", "характер приглушён"],
        "inter": ["нейтральный, деловой, технологичный", "характер приглушён"],
        "playfair-display": ["торжественный, элегантный, контрастный", "характер выражен"],
        "unbounded": ["современный, технологичный, броский", "характер ярко выражен"],
        "press-start-2p": ["игровой, ретро, цифровой", "характер ярко выражен"],
        "caveat": ["неформальный, дружелюбный, личный", "характер выражен"],
        "ruslan-display": ["архаичный, сказочный, исторический", "характер ярко выражен"],
        "great-vibes": ["праздничный, изысканный, церемониальный", "характер ярко выражен"]
      },
      phrase: "Текст образца", phraseDef: "Приглашаем на открытие сезона",
      reveal: "Показать характеристику шрифта",
      fam: "Гарнитура",
      fStart: "Начать чтение", fDone: "Прочитано", fAgain: "Повторить",
      fFont: "Непривычная гарнитура для текста Б",
      fIntro: "Прочитайте два текста сопоставимого объёма. Текст А набран привычной текстовой антиквой, текст Б — выбранной акцидентной гарнитурой. Время фиксируется от нажатия «Начать чтение» до «Прочитано».",
      fA: "Текст А", fB: "Текст Б",
      tA: "Городские библиотеки давно перестали быть только книгохранилищами. В них проводят лекции, мастер-классы и встречи читательских клубов, а залы с удобными столами заменяют многим студентам коворкинг. Посещаемость таких библиотек растёт, хотя выдача бумажных книг сокращается.",
      tB: "Ботанические сады выполняют не только просветительскую, но и научную функцию. В их коллекциях сохраняются редкие виды растений, а сотрудники ведут наблюдения за сроками цветения и созревания семян. Эти данные помогают оценить влияние изменения климата на экосистемы региона.",
      fRes: function (a, b, p) { return "Скорость чтения: текст А — " + a + " знаков в секунду, текст Б — " + b + " знаков в секунду. " + (p > 0 ? "Непривычная гарнитура замедлила чтение примерно на " + p + " %." : "Заметного замедления не зафиксировано."); },
      fNote: "Упражнение не является экспериментом: на результат влияют порядок чтения, содержание и длина текстов. Оно позволяет лишь ощутить усилие, которого требует непривычная форма знаков.",
      guides: "Показать направляющие",
      oPlain: "Без компенсации: фигуры имеют одинаковую высоту", oComp: "С компенсацией: круг и треугольник выходят за направляющие",
      oQ: "В каком варианте фигуры выглядят одинаковыми по высоте?",
      oNote: "Круг и острая вершина касаются направляющей в одной точке, поэтому при равной геометрической высоте воспринимаются меньше прямоугольника. В шрифте округлые знаки (О, С) и острые вершины (А, V) выходят за линию прописных и базовую линию — это называется нависанием (overshoot).",
      sChar: "Характер", sFont: "Гарнитура",
      sNote: "Тонкие штрихи контрастных и светлых шрифтов в мелком кегле приближаются к размеру пикселя: изображение теряет детали, и характер шрифта, заметный в заголовке, в мелком тексте не воспринимается.",
      right: "Верно.", wrong: "Неверно."
    },
    en: {
      sec: {
        sans: ["Sans serif", "Typefaces without serifs: from neutral interface faces to condensed and ultra-bold display designs."],
        concept: ["Conceptual and logical", "Form follows a rule or construction: a geometric module, a grid, a uniform character width."],
        imit: ["Imitations", "Imitate a material or technology: typewriter, stencil, pixel grid, neon."],
        hand: ["Handwritten", "Informal handwriting: felt-tip, marker, brush; uneven rhythm and free form."],
        hist: ["Historical scripts", "Stylisations of historical scripts: ustav, poluustav, vyaz, blackletter."],
        callig: ["Calligraphic", "Form shaped by a broad-nib or pointed pen and the rhythm of the hand."],
        serif: ["Serif", "Serif faces of the book tradition: from text faces to high-contrast display designs."],
        slab: ["Slab serif", "Rectangular serifs and low contrast: from text faces to poster designs."]
      },
      ring: ["Text faces: character is muted, the reader's attention stays on the content.", "Regular faces: character is noticeable; suitable for headings and short texts.", "Display faces: character dominates; used at large sizes and in short lines."],
      ringShort: ["text", "regular", "display"],
      textC: "Text", regC: "Regular",
      pick: "Select a point on the wheel to see a specimen.",
      sample: "Sphinx of black quartz, judge my vow",
      note: "The diagram follows Alexandra Korolkova's classification: the direction from the centre sets the genre, the distance from the centre sets the degree of expressiveness. Placing the course's typefaces is a teaching interpretation open to discussion.",
      voice: {
        "pt-serif": ["bookish, restrained, academic", "muted character"],
        "inter": ["neutral, businesslike, technical", "muted character"],
        "playfair-display": ["ceremonial, elegant, high-contrast", "noticeable character"],
        "unbounded": ["contemporary, technical, bold", "strong character"],
        "press-start-2p": ["playful, retro, digital", "strong character"],
        "caveat": ["informal, friendly, personal", "noticeable character"],
        "ruslan-display": ["archaic, fairy-tale, historical", "strong character"],
        "great-vibes": ["festive, refined, ceremonial", "strong character"]
      },
      phrase: "Sample text", phraseDef: "Join us for the season opening",
      reveal: "Show the typeface character",
      fam: "Typeface",
      fStart: "Start reading", fDone: "Done", fAgain: "Repeat",
      fFont: "Unfamiliar typeface for text B",
      fIntro: "Read two texts of similar length. Text A is set in a familiar text serif, text B in the display face you choose. Time runs from “Start reading” to “Done”.",
      fA: "Text A", fB: "Text B",
      tA: "City libraries have long ceased to be mere book depositories. They host lectures, workshops and reading-club meetings, and their reading rooms with comfortable desks serve many students as co-working spaces. Attendance keeps growing even as loans of printed books decline.",
      tB: "Botanical gardens serve a research purpose as well as an educational one. Their collections preserve rare plant species, and staff record the timing of flowering and seed ripening. These records help assess how climate change affects the ecosystems of the region.",
      fRes: function (a, b, p) { return "Reading speed: text A — " + a + " characters per second, text B — " + b + " characters per second. " + (p > 0 ? "The unfamiliar typeface slowed reading by about " + p + "%." : "No noticeable slowdown was recorded."); },
      fNote: "This is not an experiment: reading order, content and length affect the result. It only lets you feel the effort that unfamiliar letterforms demand.",
      guides: "Show guides",
      oPlain: "No compensation: the shapes have equal height", oComp: "Compensated: circle and triangle extend past the guides",
      oQ: "In which version do the shapes look equal in height?",
      oNote: "A circle and a sharp apex touch the guide at a single point, so at equal geometric height they look smaller than a rectangle. In type, round letters (O, C) and pointed apexes (A, V) extend beyond the cap height and baseline — this is called overshoot.",
      sChar: "Character", sFont: "Typeface",
      sNote: "At small sizes the hairlines of high-contrast and light faces approach the size of a pixel: detail is lost, and the character visible in a heading disappears in small text.",
      right: "Correct.", wrong: "Incorrect."
    }
  };
  function s(k) { var v = S[App.lang][k]; return typeof v === "function" ? v.apply(null, Array.prototype.slice.call(arguments, 1)) : v; }
  function ringOf(r) { return r < 0.34 ? 0 : (r < 0.62 ? 1 : 2); }
  function sectorOf(k) { return SECTORS.filter(function (x) { return x.k === k; })[0]; }

  /* ---------- wheel geometry ---------- */
  var C = 280, R = 196, RINGS = [0.34, 0.62, 0.81, 1];
  function pt(angleDeg, r) { var a = angleDeg * Math.PI / 180; return [C + Math.cos(a) * r, C + Math.sin(a) * r]; }
  function arcPath(a0, a1, r0, r1) {
    var p0 = pt(a0, r1), p1 = pt(a1, r1), p2 = pt(a1, r0), p3 = pt(a0, r0);
    return "M" + p0 + " A" + r1 + "," + r1 + " 0 0 1 " + p1 + " L" + p2 + " A" + r0 + "," + r0 + " 0 0 0 " + p3 + " Z";
  }
  function dotPos(p) {
    var sec = sectorOf(p[1]);
    return pt(sec.a + p[3] * (p[2] < 0.34 ? 34 : 19), p[2] * R);
  }

  function wheelSvg() {
    var html = '<svg class="cw-svg" viewBox="0 0 560 560" role="img" aria-label="' + esc(s("note")) + '">';
    SECTORS.forEach(function (sec) {
      for (var i = 1; i < RINGS.length; i++) {
        var light = [0, 86, 78, 68][i];
        html += '<path class="cw-cell" d="' + arcPath(sec.a - 22.5, sec.a + 22.5, RINGS[i - 1] * R, RINGS[i] * R) + '" style="fill:hsl(' + sec.h + ' 60% ' + light + '%)"/>';
      }
      var lp = pt(sec.a, R + 36), name = s("sec")[sec.k][0], words = name.split(/[- ]/);
      var lines = name.length > 14 && words.length > 1 ? [words[0] + (name.indexOf("-") > 0 ? "-" : ""), words.slice(1).join(" ")] : [name];
      html += '<text class="cw-label" x="' + lp[0] + '" y="' + (lp[1] - (lines.length - 1) * 8) + '" text-anchor="middle" dominant-baseline="middle">' +
        lines.map(function (l, i) { return '<tspan x="' + lp[0] + '" dy="' + (i ? 17 : 0) + '">' + esc(l) + "</tspan>"; }).join("") + "</text>";
    });
    html += '<circle class="cw-core" cx="' + C + '" cy="' + C + '" r="' + RINGS[0] * R + '"/>';
    html += '<circle class="cw-reg" cx="' + C + '" cy="' + C + '" r="' + RINGS[1] * R + '" fill="none"/>';
    html += '<text class="cw-ring" x="' + C + '" y="' + (C + RINGS[0] * R * 0.82) + '" text-anchor="middle">' + esc(s("textC")) + "</text>";
    html += '<text class="cw-ring" x="' + C + '" y="' + (C + (RINGS[0] + RINGS[1]) / 2 * R + 4) + '" text-anchor="middle">' + esc(s("regC")) + "</text>";
    PLACED.forEach(function (p, i) {
      var q = dotPos(p);
      html += '<circle class="cw-dot" data-i="' + i + '" tabindex="0" role="button" aria-label="' + esc(font(p[0]).family) + '" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="9"/>';
    });
    return html + "</svg>";
  }

  function describe(p) {
    var f = font(p[0]), sec = s("sec")[p[1]], ring = ringOf(p[2]);
    return '<p class="cw-name">' + esc(f.family) + ' <span class="muted">· ' + esc(sec[0]) + " · " + esc(s("ringShort")[ring]) + "</span></p>" +
      '<p class="cw-spec" style="font-family:' + esc(stack(p[0])) + '">' + esc(s("sample")) + "</p>" +
      '<p class="demo-note">' + esc(sec[1]) + " " + esc(s("ring")[ring]) + "</p>";
  }

  Object.assign(window.Demos, {

    voices: function (root) {
      var ids = ["pt-serif", "inter", "playfair-display", "unbounded", "press-start-2p", "caveat", "ruslan-display", "great-vibes"];
      root.innerHTML = '<label class="ctl"><span class="ctl-head"><span>' + esc(s("phrase")) + '</span></span><input type="text" class="pj-input" id="vcIn" maxlength="60" value="' + esc(s("phraseDef")) + '"></label>' +
        '<label class="toggles"><span><input type="checkbox" id="vcShow"> ' + esc(s("reveal")) + "</span></label>" +
        '<div class="vc-grid">' + ids.map(function (id) {
          var d = s("voice")[id];
          return '<figure class="vc-cell"><p class="vc-text" style="font-family:' + esc(stack(id)) + (id === "press-start-2p" ? ";font-size:13px;line-height:1.7" : "") + '"></p><figcaption><span>' + esc(font(id).family) + '</span><span class="vc-pos" hidden>' + esc(d[0]) + '<br><span class="vc-lvl">' + esc(d[1]) + "</span></span></figcaption></figure>";
        }).join("") + "</div>";
      var inp = root.querySelector("#vcIn");
      function upd() { root.querySelectorAll(".vc-text").forEach(function (e) { e.textContent = inp.value; }); }
      inp.addEventListener("input", upd);
      root.querySelector("#vcShow").addEventListener("change", function (e) {
        root.querySelectorAll(".vc-pos").forEach(function (x) { x.hidden = !e.target.checked; });
      });
      upd();
    },

    charwheel: function (root) {
      var opts = SECTORS.map(function (sec) {
        return '<optgroup label="' + esc(s("sec")[sec.k][0]) + '">' + PLACED.map(function (p, i) { return p[1] === sec.k ? '<option value="' + i + '">' + esc(font(p[0]).family) + "</option>" : ""; }).join("") + "</optgroup>";
      }).join("");
      root.innerHTML = '<div class="cw">' + wheelSvg() + '<div class="cw-side"><label class="ctl"><span class="ctl-head"><span>' + esc(s("fam")) + '</span></span><select id="cwSel">' + opts + '</select></label><div class="cw-panel" id="cwPanel" aria-live="polite"></div></div></div>' +
        '<p class="demo-note">' + esc(s("note")) + "</p>";
      var panel = root.querySelector("#cwPanel");
      var sel = root.querySelector("#cwSel");
      function select(dot) {
        root.querySelectorAll(".cw-dot").forEach(function (d) { d.classList.toggle("is-on", d === dot); });
        panel.innerHTML = describe(PLACED[dot.dataset.i]);
        sel.value = dot.dataset.i;
      }
      sel.addEventListener("change", function () { select(root.querySelector('.cw-dot[data-i="' + sel.value + '"]')); });
      root.querySelectorAll(".cw-dot").forEach(function (d) {
        d.addEventListener("click", function () { select(d); });
        d.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(d); } });
      });
      select(root.querySelector('.cw-dot[data-i="0"]'));
    },

    familiar: function (root) {
      var opts = ["ruslan-display", "amatic-sc", "rubik-mono-one", "great-vibes", "press-start-2p"];
      root.innerHTML = '<p class="demo-note">' + esc(s("fIntro")) + "</p>" +
        '<label class="ctl"><span class="ctl-head"><span>' + esc(s("fFont")) + '</span></span><select id="fmFont">' + opts.map(function (id) { return '<option value="' + id + '">' + esc(font(id).family) + "</option>"; }).join("") + "</select></label>" +
        ["A", "B"].map(function (k) {
          return '<div class="fr-block" data-k="' + k + '"><div class="fr-head"><strong>' + esc(s("f" + k)) + '</strong><button type="button" class="btn btn-primary btn-sm" data-act="start">' + esc(s("fStart")) + '</button><button type="button" class="btn btn-ghost btn-sm" data-act="done" hidden>' + esc(s("fDone")) + '</button><span class="fr-time muted"></span></div><p class="fr-text" hidden></p></div>';
        }).join("") +
        '<p class="quiz-result" id="frRes" role="status"></p><p class="demo-note">' + esc(s("fNote")) + "</p>";
      var res = {}, t0 = 0, sel = root.querySelector("#fmFont");
      function setFonts() {
        root.querySelector('[data-k="A"] .fr-text').style.fontFamily = stack("pt-serif");
        var b = root.querySelector('[data-k="B"] .fr-text');
        b.style.fontFamily = stack(sel.value);
        b.style.fontSize = sel.value === "press-start-2p" ? "14px" : "";
      }
      sel.addEventListener("change", function () { setFonts(); delete res.B; root.querySelector('[data-k="B"] .fr-time').textContent = ""; show(); });
      function show() {
        var out = root.querySelector("#frRes");
        if (res.A && res.B) {
          var a = s("tA").length / res.A, b = s("tB").length / res.B, p = Math.round((1 - b / a) * 100);
          out.className = "quiz-result ok";
          out.textContent = s("fRes", a.toFixed(1), b.toFixed(1), p);
        } else { out.textContent = ""; }
      }
      root.querySelectorAll(".fr-block").forEach(function (blk) {
        var k = blk.dataset.k, txt = blk.querySelector(".fr-text"), st = blk.querySelector('[data-act="start"]'), dn = blk.querySelector('[data-act="done"]');
        txt.textContent = s("t" + k);
        st.addEventListener("click", function () {
          txt.hidden = false; st.hidden = true; dn.hidden = false; t0 = performance.now();
          blk.querySelector(".fr-time").textContent = "";
        });
        dn.addEventListener("click", function () {
          var sec = (performance.now() - t0) / 1000;
          res[k] = sec; txt.hidden = true; dn.hidden = true; st.hidden = false; st.textContent = s("fAgain");
          blk.querySelector(".fr-time").textContent = sec.toFixed(1) + (App.lang === "ru" ? " с" : " s");
          show();
        });
      });
      setFonts();
    },

    optics: function (root) {
      function row(comp) {
        var top = 30, bot = 130, h = bot - top, o = comp ? 4 : 0, ot = comp ? 9 : 0;
        return '<svg viewBox="0 0 420 160" class="op-svg" aria-hidden="true">' +
          '<g class="op-guides"><line x1="0" x2="420" y1="' + top + '" y2="' + top + '"/><line x1="0" x2="420" y1="' + bot + '" y2="' + bot + '"/></g>' +
          '<rect x="30" y="' + top + '" width="' + h + '" height="' + h + '"/>' +
          '<circle cx="215" cy="' + (top + h / 2) + '" r="' + (h / 2 + o) + '"/>' +
          '<polygon points="350,' + (top - ot) + ' ' + (400 + o) + ',' + bot + ' ' + (300 - o) + ',' + bot + '"/>' +
          "</svg>";
      }
      root.innerHTML = '<p class="ctl-head" style="margin-bottom:8px"><span>' + esc(s("oQ")) + "</span></p>" +
        '<div class="op-grid"><figure class="demo-cell">' + row(false) + '<figcaption class="op-cap" hidden>' + esc(s("oPlain")) + '</figcaption></figure><figure class="demo-cell">' + row(true) + '<figcaption class="op-cap" hidden>' + esc(s("oComp")) + "</figcaption></figure></div>" +
        '<label class="toggles"><span><input type="checkbox" id="opG"> ' + esc(s("guides")) + "</span></label>" +
        '<p class="demo-note">' + esc(s("oNote")) + "</p>";
      root.querySelector("#opG").addEventListener("change", function (e) {
        root.classList.toggle("op-show", e.target.checked);
        root.querySelectorAll(".op-cap").forEach(function (c) { c.hidden = !e.target.checked; });
      });
    },

    sizechar: function (root) {
      var opts = ["playfair-display", "cormorant", "poiret-one", "great-vibes", "amatic-sc", "unbounded"];
      root.innerHTML = '<label class="ctl"><span class="ctl-head"><span>' + esc(s("sFont")) + '</span></span><select id="scF">' + opts.map(function (id) { return '<option value="' + id + '">' + esc(font(id).family) + "</option>"; }).join("") + "</select></label>" +
        '<div class="sc-rows">' + [12, 16, 24, 48, 88].map(function (px) {
          return '<div class="sc-row"><span class="sc-px">' + px + ' px</span><span class="sc-w" style="font-size:' + px + 'px">' + esc(s("sChar")) + "</span></div>";
        }).join("") + '</div><p class="demo-note">' + esc(s("sNote")) + "</p>";
      var sel = root.querySelector("#scF");
      function upd() { root.querySelectorAll(".sc-w").forEach(function (w) { w.style.fontFamily = stack(sel.value); }); }
      sel.addEventListener("change", upd); upd();
    },

    brandvoice: function (root) {
      var cases = App.lang === "ru" ? [
        { q: "Приложение для записи к врачу: экран выбора времени приёма", opts: ["golos-text", "playfair-display", "amatic-sc"], a: 0, ex: "Интерфейсный текст должен оставаться прозрачным: нейтральный гротеск из центра круга не отвлекает от задачи и хорошо различим в мелком кегле." },
        { q: "Фестиваль уличной еды: заголовок главного экрана", opts: ["source-serif-4", "pacifico", "roboto"], a: 1, ex: "Короткий заголовок промостраницы допускает выразительный шрифт с периферии круга; нейтральные гарнитуры не передают нужной эмоции. В основном тексте такой шрифт неуместен." },
        { q: "Исторический музей: название выставки о древнерусской книжности", opts: ["press-start-2p", "comfortaa", "ruslan-display"], a: 2, ex: "Стилизация исторического почерка поддерживает тему выставки в крупном заголовке. Пиксельный и округлый геометрический шрифты вступают в противоречие с содержанием." },
        { q: "Онлайн-журнал: основной текст лонгрида", opts: ["poiret-one", "oswald", "literata"], a: 2, ex: "Для протяжённого чтения нужен текстовый шрифт из центра круга: привычная форма знаков и умеренный характер обеспечивают беглое чтение." }
      ] : [
        { q: "Doctor booking app: appointment time screen", opts: ["golos-text", "playfair-display", "amatic-sc"], a: 0, ex: "Interface text must stay transparent: a neutral sans from the centre of the wheel does not distract from the task and stays legible at small sizes." },
        { q: "Street food festival: hero headline", opts: ["source-serif-4", "pacifico", "roboto"], a: 1, ex: "A short promotional headline can take an expressive face from the edge of the wheel; neutral faces do not convey the emotion. Such a face is out of place in body text." },
        { q: "History museum: title of an exhibition on early Russian manuscripts", opts: ["press-start-2p", "comfortaa", "ruslan-display"], a: 2, ex: "A historical-script stylisation supports the exhibition theme in a large title. Pixel and rounded geometric faces contradict the content." },
        { q: "Online magazine: long-read body text", opts: ["poiret-one", "oswald", "literata"], a: 2, ex: "Extended reading needs a text face from the centre of the wheel: familiar letterforms and a moderate character support fluent reading." }
      ];
      var sample = App.lang === "ru" ? ["Выберите удобное время", "Вкус большого города", "Книжное наследие Руси", "Город, который строили для пешеходов"] : ["Choose a convenient time", "Taste of the big city", "The book heritage of Rus", "The city that was built for walking"];
      root.innerHTML = cases.map(function (c, ci) {
        return '<section class="brief" data-c="' + ci + '"><h3>' + (ci + 1) + ". " + esc(c.q) + '</h3><div class="pair-grid">' + c.opts.map(function (id, oi) {
          return '<button type="button" class="pair-opt" data-o="' + oi + '"><span class="pair-name">' + esc(font(id).family) + '</span><span class="bv-sample" style="font-family:' + esc(stack(id)) + '">' + esc(sample[ci]) + "</span></button>";
        }).join("") + '</div><p class="quiz-result" role="status"></p></section>';
      }).join("");
      root.querySelectorAll(".brief").forEach(function (sec) {
        var c = cases[sec.dataset.c], done = false;
        sec.querySelectorAll(".pair-opt").forEach(function (b) {
          b.addEventListener("click", function () {
            if (done) return; done = true;
            var ok = Number(b.dataset.o) === c.a;
            b.classList.add(ok ? "is-right" : "is-wrong");
            sec.querySelector('.pair-opt[data-o="' + c.a + '"]').classList.add("is-right");
            var r = sec.querySelector(".quiz-result");
            r.className = "quiz-result " + (ok ? "ok" : "bad");
            r.textContent = (ok ? s("right") : s("wrong")) + " " + c.ex;
            root.dataset.right = Number(root.dataset.right || 0) + (ok ? 1 : 0);
            root.dataset.answered = Number(root.dataset.answered || 0) + 1;
            if (Number(root.dataset.answered) === cases.length && Number(root.dataset.right) >= cases.length - 1 && App.task) App.task.done();
          });
        });
      });
    }
  });
})();
