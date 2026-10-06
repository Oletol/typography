/* Demos for module 6 “Font pairing”. MIT License. */
(function () {
  "use strict";

  var S = {
    ru: {
      head: "Гарнитура заголовков", body: "Гарнитура основного текста",
      h: "Музей городской истории открывает новую экспозицию",
      p: "Экспозиция посвящена развитию городской среды в XX веке: от первых трамвайных линий до современных общественных пространств. Посетители увидят архивные фотографии, планы застройки и личные документы жителей.",
      cap: "Вход по билетам · ежедневно с 10:00 до 20:00",
      obs: "Наблюдения",
      xh: function (a, b) { return "Высота строчных: заголовки ≈ " + a + " em, текст ≈ " + b + " em."; },
      same: "Одна гарнитура: иерархия строится кеглем и насыщенностью — надёжное решение.",
      similar: "Гарнитуры одного подкласса со сходным рисунком: различие воспринимается как ошибка, а не как контраст.",
      sameCls: "Гарнитуры одного класса, но разных подклассов: контраст есть, но невелик; проверьте, достаточно ли он заметен.",
      diffCls: "Классы различаются: сочетание основано на контрасте. Проверьте общность пропорций и характера.",
      display: "Акцидентный или рукописный шрифт допустим только в заголовках крупного кегля.",
      xhDiff: "Высота строчных заметно различается: при совместном использовании в одной строке потребуется коррекция кегля.",
      supers: "Суперсемейства из каталога курса",
      inline: "Параметр font-size-adjust выравнивает высоту строчных у шрифтов, используемых в одной строке, а свойство text-wrap: balance распределяет текст заголовка по строкам.",
      inlineToggle: function (v) { return "Применить к коду font-size-adjust: ex-height " + v; },
      inlineNote: function (a, b) { return "Высота строчных: PT Serif ≈ " + a + " em, JetBrains Mono ≈ " + b + " em."; },
      choose: "Выберите сочетание", right: "Верно.", wrong: "Неверно.",
      variant: "Вариант"
    },
    en: {
      head: "Heading typeface", body: "Body typeface",
      h: "The city history museum opens a new exhibition",
      p: "The exhibition traces the development of the urban environment in the 20th century, from the first tram lines to contemporary public spaces. Visitors will see archive photographs, development plans and residents' personal documents.",
      cap: "Admission by ticket · daily 10:00–20:00",
      obs: "Observations",
      xh: function (a, b) { return "x-height: headings ≈ " + a + " em, body ≈ " + b + " em."; },
      same: "One typeface: hierarchy is built with size and weight, a reliable solution.",
      similar: "Typefaces of the same subclass with similar designs: the difference reads as an error rather than contrast.",
      sameCls: "Same class, different subclasses: there is contrast, but it is modest; check that it is noticeable enough.",
      diffCls: "The classes differ: the pairing relies on contrast. Check for shared proportions and character.",
      display: "Display and script faces are acceptable only in large headings.",
      xhDiff: "The x-heights differ noticeably: when used on the same line, size correction will be needed.",
      supers: "Superfamilies from the course catalogue",
      inline: "font-size-adjust aligns the x-height of fonts used on the same line, while text-wrap: balance distributes heading text across lines.",
      inlineToggle: function (v) { return "Apply font-size-adjust: ex-height " + v + " to code"; },
      inlineNote: function (a, b) { return "x-height: PT Serif ≈ " + a + " em, JetBrains Mono ≈ " + b + " em."; },
      choose: "Choose a pairing", right: "Correct.", wrong: "Incorrect.",
      variant: "Option"
    }
  };
  function s(k) { var v = S[App.lang][k]; return typeof v === "function" ? v.apply(null, Array.prototype.slice.call(arguments, 1)) : v; }
  var esc = function (x) { return App.esc(x); };
  var T = function (k) { return App.T(k); };
  function font(id) { return window.FONTS.find(function (f) { return f.id === id; }); }
  var ctx = document.createElement("canvas").getContext("2d");
  function xh(family) { ctx.font = "400 200px '" + family + "'"; return ctx.measureText("x").actualBoundingBoxAscent / 200; }
  function load(fams) { return document.fonts ? Promise.all(fams.map(function (f) { return document.fonts.load("400 20px '" + f + "'", "xхAa"); })).catch(function () {}) : Promise.resolve(); }
  function weightFor(f, w) { return f.variable ? Math.max(f.wght[0], Math.min(f.wght[1], w)) : (f.weights.indexOf(w) > -1 ? w : f.weights[f.weights.length - 1]); }

  function options(filter, sel) {
    var order = ["serif", "slab", "sans", "mono", "display", "script"];
    return order.map(function (c) {
      var list = window.FONTS.filter(function (f) { return f.cls === c && filter(f); });
      if (!list.length) return "";
      return '<optgroup label="' + esc(T("fontClass")[c]) + '">' + list.map(function (f) {
        return '<option value="' + f.id + '"' + (f.id === sel ? " selected" : "") + ">" + f.family + "</option>";
      }).join("") + "</optgroup>";
    }).join("");
  }

  function preview(hf, bf, small) {
    return '<div class="pr' + (small ? " pr-sm" : "") + '"><h4 style="font-family:\'' + hf.family + '\';font-weight:' + weightFor(hf, 700) + '">' + esc(s("h")) + '</h4>' +
      '<p style="font-family:\'' + bf.family + '\'">' + esc(s("p")) + '</p>' + (small ? "" : '<p class="pr-cap" style="font-family:\'' + bf.family + '\'">' + esc(s("cap")) + "</p>") + "</div>";
  }

  Object.assign(window.Demos, {

    pairbuilder: function (root) {
      root.innerHTML = '<div class="demo-row">' +
        '<label class="ctl"><span class="ctl-head"><span>' + esc(s("head")) + '</span></span><select id="pbH">' + options(function () { return true; }, "playfair-display") + "</select></label>" +
        '<label class="ctl"><span class="ctl-head"><span>' + esc(s("body")) + '</span></span><select id="pbB">' + options(function (f) { return ["serif", "slab", "sans"].indexOf(f.cls) > -1; }, "source-sans-3") + "</select></label>" +
        '</div><div class="demo-frame" id="pbPrev"></div><div class="pb-obs"><h3>' + esc(s("obs")) + '</h3><ul id="pbObs"></ul></div>';
      var hs = root.querySelector("#pbH"), bs = root.querySelector("#pbB");
      function upd() {
        var hf = font(hs.value), bf = font(bs.value);
        root.querySelector("#pbPrev").innerHTML = preview(hf, bf);
        load([hf.family, bf.family]).then(function () {
          var a = xh(hf.family), b = xh(bf.family), obs = [];
          if (hf.id === bf.id) obs.push(["good", s("same")]);
          else if (hf.cls === bf.cls && hf.sub === bf.sub) obs.push(["warn", s("similar")]);
          else if (hf.cls === bf.cls) obs.push(["warn", s("sameCls")]);
          else obs.push(["good", s("diffCls")]);
          if (hf.cls === "display" || hf.cls === "script") obs.push(["warn", s("display")]);
          if (Math.abs(a - b) > 0.05) obs.push(["warn", s("xhDiff")]);
          obs.push(["info", s("xh", a.toFixed(2), b.toFixed(2))]);
          root.querySelector("#pbObs").innerHTML = obs.map(function (o) { return '<li data-state="' + o[0] + '">' + esc(o[1]) + "</li>"; }).join("");
        });
      }
      hs.addEventListener("change", upd); bs.addEventListener("change", upd); upd();
    },

    pairsamples: function (root) {
      var pairs = [["unbounded", "caveat"], ["roboto", "inter"], ["playfair-display", "source-sans-3"]];
      root.innerHTML = '<div class="pair-grid">' + pairs.map(function (p, i) {
        return '<figure class="demo-cell"><figcaption>' + esc(s("variant")) + " " + "АБВ"[i] + "</figcaption>" + preview(font(p[0]), font(p[1]), true) + "</figure>";
      }).join("") + "</div>";
    },

    superfamily: function (root) {
      var groups = [["pt-sans", "pt-serif", "pt-mono"], ["source-sans-3", "source-serif-4", "source-code-pro"], ["roboto", "roboto-slab", "roboto-mono"], ["ibm-plex-sans", "ibm-plex-mono"], ["noto-sans", "noto-serif"]];
      root.innerHTML = '<div class="demo-frame sf-list">' + groups.map(function (g) {
        return '<div class="sf-row">' + g.map(function (id) {
          var f = font(id);
          return '<span class="sf-item"><span class="xh-name">' + f.family + '</span><span class="sf-sample" style="font-family:\'' + f.family + '\'">Шрифт Hxgp</span></span>';
        }).join("") + "</div>";
      }).join("") + "</div>";
    },

    inlinemix: function (root) {
      root.innerHTML = '<label class="toggles"><span><input type="checkbox" id="imOn"> <code id="imLabel"></code></span></label>' +
        '<div class="demo-frame"><p class="im-p">' + esc(s("inline")).replace("font-size-adjust", "<code>font-size-adjust</code>").replace("text-wrap: balance", "<code>text-wrap: balance</code>") + '</p></div><p class="demo-note" id="imNote"></p>';
      var on = root.querySelector("#imOn");
      load(["PT Serif", "JetBrains Mono"]).then(function () {
        var a = xh("PT Serif"), b = xh("JetBrains Mono"), v = a.toFixed(2);
        root.querySelector("#imLabel").textContent = s("inlineToggle", v);
        root.querySelector("#imNote").textContent = s("inlineNote", a.toFixed(2), b.toFixed(2));
        on.addEventListener("change", function () {
          root.querySelectorAll(".im-p code").forEach(function (c) { c.style.fontSizeAdjust = on.checked ? "ex-height " + v : "none"; });
        });
      });
    },

    brief: function (root) {
      var cases = App.lang === "ru" ? [
        { q: "Онлайн-банк: интерфейс и страницы тарифов", opts: [["golos-text", "golos-text"], ["playfair-display", "caveat"], ["oswald", "comfortaa"]], a: 0, ex: "Одна нейтральная гарнитура интерфейсного характера с несколькими насыщенностями обеспечивает строгость, удобочитаемость цифр и экономию загрузки." },
        { q: "Кофейня-обжарщик: сайт с меню и историей заведения", opts: [["roboto", "arimo"], ["cormorant", "source-sans-3"], ["press-start-2p", "ubuntu"]], a: 1, ex: "Выразительная антиква старого стиля в заголовках создаёт характер, гуманистический гротеск обеспечивает удобочитаемость меню. Roboto и Arimo — два близких неогротеска, их сочетание выглядит как ошибка." },
        { q: "Сайт университета: новости, расписание, документы", opts: [["lobster", "open-sans"], ["unbounded", "rubik-mono-one"], ["pt-serif", "pt-sans"]], a: 2, ex: "Суперсемейство PT, разработанное для российского контекста, даёт согласованную пару с качественной кириллицей и сдержанной тональностью." },
        { q: "Детская художественная студия", opts: [["old-standard-tt", "ibm-plex-mono"], ["comfortaa", "nunito"], ["neucha", "neucha"]], a: 1, ex: "Округлые геометрические гротески передают дружелюбную тональность и сохраняют удобочитаемость; рукописный шрифт в основном тексте затрудняет чтение." }
      ] : [
        { q: "Online bank: interface and pricing pages", opts: [["golos-text", "golos-text"], ["playfair-display", "caveat"], ["oswald", "comfortaa"]], a: 0, ex: "A single neutral interface typeface in several weights ensures rigour, legible figures and a small payload." },
        { q: "Coffee roaster: menu and story pages", opts: [["roboto", "arimo"], ["cormorant", "source-sans-3"], ["press-start-2p", "ubuntu"]], a: 1, ex: "An expressive old-style serif in headings creates character; a humanist sans keeps the menu legible. Roboto and Arimo are two similar neo-grotesques, and pairing them looks like an error." },
        { q: "University website: news, timetables, documents", opts: [["lobster", "open-sans"], ["unbounded", "rubik-mono-one"], ["pt-serif", "pt-sans"]], a: 2, ex: "The PT superfamily, designed for the Russian context, gives a coherent pair with high-quality Cyrillic and a restrained tone." },
        { q: "Children's art studio", opts: [["old-standard-tt", "ibm-plex-mono"], ["comfortaa", "nunito"], ["neucha", "neucha"]], a: 1, ex: "Rounded geometric sans convey a friendly tone while staying legible; a script face in body text hinders reading." }
      ];
      root.innerHTML = cases.map(function (c, ci) {
        return '<section class="brief" data-c="' + ci + '"><h3>' + (ci + 1) + ". " + esc(c.q) + '</h3><div class="pair-grid">' + c.opts.map(function (o, oi) {
          var hf = font(o[0]), bf = font(o[1]);
          return '<button type="button" class="pair-opt" data-o="' + oi + '"><span class="pair-name">' + hf.family + (o[0] === o[1] ? "" : " + " + bf.family) + "</span>" + preview(hf, bf, true) + "</button>";
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
