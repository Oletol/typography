/* Auto-checked exercises for all modules. MIT License.
   Each exercise calls App.task.done() when it is passed; completion is stored with module progress. */
(function () {
  "use strict";

  var FALLBACK = { serif: "Georgia, serif", slab: "Georgia, serif", sans: "system-ui, sans-serif", mono: "ui-monospace, monospace", display: "system-ui, sans-serif", script: "cursive" };
  function font(id) { return window.FONTS.find(function (f) { return f.id === id; }); }
  function stack(id) { var f = font(id); return '"' + f.family + '", ' + FALLBACK[f.cls]; }
  function esc(x) { return App.esc(x); }
  function ru() { return App.lang === "ru"; }
  function L(r, e) { return ru() ? r : e; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function num(x, d) { var v = Math.round(x * Math.pow(10, d)) / Math.pow(10, d); return ru() ? String(v).replace(".", ",") : String(v); }
  function ready(ids, cb) {
    if (!document.fonts) return cb();
    Promise.all(ids.map(function (id) { return document.fonts.load('400 40px "' + font(id).family + '"', "АаHxх"); })).then(cb, cb);
  }
  var canvas = document.createElement("canvas").getContext("2d");
  function xRatio(id, weight) {
    canvas.font = (weight || 400) + ' 100px "' + font(id).family + '"';
    return canvas.measureText("x").actualBoundingBoxAscent / 100;
  }
  function lum(hex) {
    var c = hex.replace("#", "");
    return [0, 2, 4].map(function (i) { var v = parseInt(c.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); })
      .reduce(function (s, v, i) { return s + v * [0.2126, 0.7152, 0.0722][i]; }, 0);
  }
  function contrast(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function hsl(h, s, l) {
    s /= 100; l /= 100;
    var k = function (n) { return (n + h / 30) % 12; }, a = s * Math.min(l, 1 - l);
    var f = function (n) { return l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); };
    return "#" + [f(0), f(8), f(4)].map(function (x) { return ("0" + Math.round(x * 255).toString(16)).slice(-2); }).join("");
  }
  function nb(str) { return esc(str).replace(/°/g, '<span class="tk-nb">°</span>'); }

  var K = {
    ru: {
      round: function (i, n) { return "Задание " + i + " из " + n; }, score: function (k) { return "Верных ответов: " + k; },
      check: "Проверить", next: "Следующее задание", finish: "Показать результат", again: "Новый набор заданий",
      right: "Верно.", wrong: "Неверно.", answer: function (v) { return "Правильный ответ: " + v + "."; },
      result: function (k, n, p) { return "Результат: " + k + " из " + n + ". " + (k >= p ? "Задание выполнено." : "Для зачёта необходимо не менее " + p + " верных ответов. Попробуйте новый набор."); },
      done: "Задание выполнено. Результат сохранён в прогрессе модуля.", step: function (i, n) { return "Этап " + i + " из " + n; }, nextStep: "Следующий этап", other: "Другой вариант",
      nan: "Введите числовое значение."
    },
    en: {
      round: function (i, n) { return "Question " + i + " of " + n; }, score: function (k) { return "Correct: " + k; },
      check: "Check", next: "Next question", finish: "Show result", again: "New set",
      right: "Correct.", wrong: "Incorrect.", answer: function (v) { return "Correct answer: " + v + "."; },
      result: function (k, n, p) { return "Result: " + k + " of " + n + ". " + (k >= p ? "Exercise completed." : "At least " + p + " correct answers are required. Try a new set."); },
      done: "Exercise completed. The result is saved in the module progress.", step: function (i, n) { return "Stage " + i + " of " + n; }, nextStep: "Next stage", other: "Another variant",
      nan: "Enter a number."
    }
  };
  function k(key) { var v = K[App.lang][key]; return typeof v === "function" ? v.apply(null, Array.prototype.slice.call(arguments, 1)) : v; }

  function doneBox() { return '<div class="tk-done" hidden>✓ ' + esc(k("done")) + "</div>"; }
  function complete(root) {
    var b = root.querySelector(".tk-done"); if (b) b.hidden = false;
    if (App.task) App.task.done();
  }
  function btn(text, cls) { var b = document.createElement("button"); b.type = "button"; b.className = "btn btn-sm " + (cls || "btn-primary"); b.textContent = text; return b; }
  function checklist(ul, items) {
    ul.innerHTML = items.map(function (it) { return '<li data-ok="' + (it.ok ? 1 : 0) + '">' + esc(it.text) + "</li>"; }).join("");
    return items.every(function (it) { return it.ok; });
  }

  /* ---------- generic drill: a series of generated questions ---------- */
  function drill(root, o) {
    var items, i, score;
    function start() { items = []; for (var n = 0; n < o.rounds; n++) items.push(o.gen(n)); i = 0; score = 0; show(); }
    function show() {
      var it = items[i], answered = false;
      var body = it.choices
        ? '<div class="tk-opts">' + it.choices.map(function (c, ci) { return '<button type="button" class="pair-opt" data-i="' + ci + '">' + c + "</button>"; }).join("") + "</div>"
        : '<div class="tk-num"><input type="text" inputmode="decimal" autocomplete="off" aria-label="' + esc(it.unit || "") + '"><span>' + esc(it.unit || "") + '</span><button type="button" class="btn btn-primary btn-sm tk-go">' + esc(k("check")) + "</button></div>";
      root.innerHTML = '<div class="tk-head"><span>' + esc(k("round", i + 1, o.rounds)) + "</span><span>" + esc(k("score", score)) + "</span></div>" +
        '<div class="tk-q">' + it.q + "</div>" + body + '<p class="quiz-result" role="status"></p><div class="tk-nav"></div>' + doneBox();
      var res = root.querySelector(".quiz-result"), nav = root.querySelector(".tk-nav");
      function finish(ok) {
        answered = true; if (ok) score++;
        root.querySelector(".tk-head span:last-child").textContent = k("score", score);
        res.className = "quiz-result " + (ok ? "ok" : "bad");
        res.textContent = (ok ? k("right") : k("wrong") + " " + k("answer", it.show != null ? it.show : (it.choices ? "" : num(it.answer, 3)))) + (it.ex ? " " + it.ex : "");
        if (it.choices && !ok) res.textContent = k("wrong") + (it.ex ? " " + it.ex : "");
        if (i + 1 < o.rounds) { var n = btn(k("next")); n.addEventListener("click", function () { i++; show(); }); nav.appendChild(n); n.focus(); }
        else {
          var p = o.pass;
          res.textContent += " " + k("result", score, o.rounds, p);
          if (score >= p) complete(root);
          var a = btn(k("again"), "btn-ghost"); a.addEventListener("click", start); nav.appendChild(a);
        }
      }
      if (it.choices) {
        root.querySelectorAll(".tk-opts .pair-opt").forEach(function (b) {
          b.addEventListener("click", function () {
            if (answered) return;
            var ok = Number(b.dataset.i) === it.answer;
            b.classList.add(ok ? "is-right" : "is-wrong");
            root.querySelector('.tk-opts [data-i="' + it.answer + '"]').classList.add("is-right");
            finish(ok);
          });
        });
      } else {
        var inp = root.querySelector(".tk-num input");
        var go = function () {
          if (answered) return;
          var v = parseFloat(inp.value.replace(",", ".").replace(/\s/g, ""));
          if (isNaN(v)) { res.className = "quiz-result bad"; res.textContent = k("nan"); return; }
          inp.disabled = true;
          finish(Math.abs(v - it.answer) <= (it.tol || 0));
        };
        root.querySelector(".tk-go").addEventListener("click", go);
        inp.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
      }
    }
    start();
  }

  /* ---------- generic staged challenge ---------- */
  function stages(root, list, renderStage) {
    var idx = 0;
    function show() {
      root.innerHTML = '<div class="tk-head"><span>' + esc(k("step", idx + 1, list.length)) + '</span></div><div class="tk-stage"></div><div class="tk-nav"></div>' + doneBox();
      renderStage(root.querySelector(".tk-stage"), list[idx], function passed() {
        var nav = root.querySelector(".tk-nav"); nav.innerHTML = "";
        if (idx + 1 < list.length) { var n = btn(k("nextStep")); n.addEventListener("click", function () { idx++; show(); }); nav.appendChild(n); }
        else complete(root);
      });
    }
    show();
  }

  /* ====================================================================== */

  Object.assign(window.Demos, {

    /* ---------- Module 1: anatomy ---------- */

    tLines: function (root) {
      var fonts = ["literata", "onest", "pt-serif", "montserrat", "playfair-display", "roboto-slab"];
      var W = 640, H = 300, SIZE = 170, BASE = 222, TOL = 4;
      var LINES = [
        { k: "cap", c: "#2f6fbd", n: L("Линия прописных", "Cap height") },
        { k: "x", c: "#1f8a70", n: L("Линия строчных (x-height)", "x-height") },
        { k: "base", c: "#d9480f", n: L("Базовая линия", "Baseline") }
      ];
      var id, ys, target, tries = 0, active = "base";
      function newFont() {
        id = pick(fonts.filter(function (f) { return f !== id; })); ys = { cap: null, x: null, base: null }; tries = 0;
        root.innerHTML = '<p class="tk-q">' + esc(L("Выберите линию и щёлкните по образцу, чтобы установить её. Затем нажмите «Проверить». Допуск — 4 пикселя.", "Select a line and click the specimen to place it. Then press “Check”. Tolerance: 4 pixels.")) + "</p>" +
          '<div class="tk-radios">' + LINES.map(function (l) { return '<label><input type="radio" name="tkl" value="' + l.k + '"' + (l.k === active ? " checked" : "") + '><i style="background:' + l.c + '"></i>' + esc(l.n) + "</label>"; }).join("") + "</div>" +
          '<canvas class="tk-canvas" width="' + W + '" height="' + H + '"></canvas>' +
          '<ul class="tk-checks"></ul><div class="tk-nav"></div>' + doneBox();
        var cv = root.querySelector("canvas"), nav = root.querySelector(".tk-nav");
        root.querySelectorAll('[name="tkl"]').forEach(function (r) { r.addEventListener("change", function () { active = r.value; }); });
        cv.addEventListener("click", function (e) {
          var rc = cv.getBoundingClientRect();
          ys[active] = Math.round((e.clientY - rc.top) * H / rc.height);
          var nextIdx = (LINES.findIndex(function (l) { return l.k === active; }) + 1) % LINES.length;
          if (ys[LINES[nextIdx].k] == null) { active = LINES[nextIdx].k; root.querySelector('[name="tkl"][value="' + active + '"]').checked = true; }
          draw(false);
        });
        var c = btn(k("check")); c.addEventListener("click", check); nav.appendChild(c);
        var o = btn(k("other"), "btn-ghost"); o.addEventListener("click", newFont); nav.appendChild(o);
        ready([id], function () {
          var ctx = cv.getContext("2d"); ctx.font = SIZE + 'px "' + font(id).family + '"';
          target = { base: BASE, x: BASE - ctx.measureText("x").actualBoundingBoxAscent, cap: BASE - ctx.measureText("H").actualBoundingBoxAscent };
          draw(false);
        });
      }
      function draw(showTarget) {
        var cv = root.querySelector("canvas"); if (!cv) return;
        var ctx = cv.getContext("2d");
        ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#1b2233"; ctx.font = SIZE + 'px "' + font(id).family + '"'; ctx.fillText("Hxpg", 40, BASE);
        LINES.forEach(function (l) {
          if (showTarget && target) { ctx.setLineDash([6, 5]); ctx.strokeStyle = l.c; ctx.globalAlpha = 0.55; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, target[l.k]); ctx.lineTo(W, target[l.k]); ctx.stroke(); ctx.globalAlpha = 1; }
          if (ys[l.k] != null) { ctx.setLineDash([]); ctx.strokeStyle = l.c; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(0, ys[l.k]); ctx.lineTo(W, ys[l.k]); ctx.stroke(); }
        });
        ctx.setLineDash([]);
      }
      function check() {
        if (!target) return;
        tries++;
        var items = LINES.map(function (l) {
          var d = ys[l.k] == null ? null : ys[l.k] - target[l.k], ad = d == null ? null : Math.abs(d);
          var dir = d > 0 ? L("ниже нужной", "too low") : L("выше нужной", "too high");
          return { ok: ad != null && ad <= TOL, text: l.n + ": " + (d == null ? L("не установлена", "not placed") : (ad <= TOL ? L("верно", "correct") : dir + L(" на " + Math.round(ad) + " px", " by " + Math.round(ad) + " px"))) };
        });
        var all = checklist(root.querySelector(".tk-checks"), items);
        if (!all && tries >= 3) items.push({ ok: false, text: L("Пунктиром показано верное положение линий. Выберите другой вариант шрифта и выполните задание снова.", "Dashed lines show the correct positions. Choose another typeface and try again.") });
        checklist(root.querySelector(".tk-checks"), items);
        draw(all || tries >= 3);
        if (all) complete(root);
      }
      newFont();
    },

    tXMatch: function (root) {
      var pairs = [["literata", "cormorant"], ["onest", "eb-garamond"], ["pt-sans", "playfair-display"], ["inter", "old-standard-tt"], ["golos-text", "raleway"]];
      var pr;
      function setup() {
        pr = pick(pairs.filter(function (p) { return p !== pr; }));
        root.innerHTML = '<p class="tk-q">' + esc(L("Подберите кегль второго шрифта так, чтобы высота строчных знаков совпала с эталоном (допуск 3 %). Такое согласование нужно, когда два шрифта стоят в одной строке.", "Adjust the size of the second typeface so that its x-height matches the reference (3% tolerance). This matching is needed when two typefaces share a line.")) + "</p>" +
          '<div class="tk-pair"><figure class="tk-cell"><figcaption class="pair-name">' + esc(font(pr[0]).family) + " · 40 px</figcaption><span class=\"tk-spec\" style=\"font-size:40px;font-family:" + esc(stack(pr[0])) + "\">" + esc(L("хорошо", "summer")) + "</span></figure>" +
          '<figure class="tk-cell"><figcaption class="pair-name">' + esc(font(pr[1]).family) + ' · <output id="txOut">40 px</output></figcaption><span class="tk-spec" id="txB" style="font-size:40px;font-family:' + esc(stack(pr[1])) + '">' + esc(L("хорошо", "summer")) + "</span></figure></div>" +
          '<label class="ctl"><span class="ctl-head"><span>' + esc(L("Кегль второго шрифта", "Second typeface size")) + '</span></span><input type="range" id="txS" min="28" max="72" step="0.5" value="40"></label>' +
          '<ul class="tk-checks"></ul><div class="tk-nav"></div>' + doneBox();
        var s = root.querySelector("#txS"), nav = root.querySelector(".tk-nav");
        s.addEventListener("input", function () { root.querySelector("#txB").style.fontSize = s.value + "px"; root.querySelector("#txOut").textContent = s.value + " px"; });
        var c = btn(k("check")); nav.appendChild(c);
        var o = btn(k("other"), "btn-ghost"); o.addEventListener("click", setup); nav.appendChild(o);
        c.addEventListener("click", function () {
          ready(pr, function () {
            var a = xRatio(pr[0]) * 40, b = xRatio(pr[1]) * Number(s.value), d = Math.abs(b - a) / a * 100;
            var ok = d <= 3;
            var items = [{ ok: ok, text: L("Высота строчных: эталон " + num(a, 1) + " px, второй шрифт " + num(b, 1) + " px; расхождение " + num(d, 1) + " %", "x-height: reference " + num(a, 1) + " px, second " + num(b, 1) + " px; difference " + num(d, 1) + "%") }];
            if (ok) items.push({ ok: true, text: L("Соответствующее значение для CSS: font-size-adjust: " + num(xRatio(pr[0]), 3), "Equivalent CSS: font-size-adjust: " + num(xRatio(pr[0]), 3)) });
            if (checklist(root.querySelector(".tk-checks"), items)) complete(root);
          });
        });
      }
      setup();
    },

    /* ---------- Module 2: classes ---------- */

    tStack: function (root) {
      var FB = shuffle([["Georgia", "serif", "Windows, macOS"], ['"Times New Roman"', "serif", "Windows, macOS"], ["Cambria", "serif", "Windows"], ["Arial", "sans", "Windows, macOS"], ['"Segoe UI"', "sans", "Windows"], ["Helvetica", "sans", "macOS"], ["Roboto", "sans", "Android"], ["Menlo", "mono", "macOS"], ["Consolas", "mono", "Windows"], ['"Courier New"', "mono", "Windows, macOS"], ['"Comic Sans MS"', "script", "Windows, macOS"]]);
      var GEN = ["serif", "sans-serif", "monospace", "cursive", "system-ui", "fantasy"];
      var OKGEN = { serif: ["serif"], sans: ["sans-serif", "system-ui"], mono: ["monospace"] };
      var list = [{ f: "PT Serif", c: "serif", ru: "основной текст лонгрида", en: "long-read body text" }, { f: "Inter", c: "sans", ru: "интерфейс веб-приложения", en: "web app interface" }, { f: "JetBrains Mono", c: "mono", ru: "фрагменты кода в документации", en: "code snippets in documentation" }];
      stages(root, list, function (el, sc, passed) {
        function sel(id, opts) { return '<select id="' + id + '"><option value="">—</option>' + opts.map(function (o, i) { return '<option value="' + i + '">' + esc(o) + "</option>"; }).join("") + "</select>"; }
        el.innerHTML = '<p class="tk-q">' + esc(L("Составьте значение font-family для задачи «" + sc.ru + "». Основной шрифт — " + sc.f + ". Добавьте один-два системных резервных шрифта того же класса (см. карточку «Системные шрифты») и завершите список родовым семейством.", "Compose a font-family value for “" + sc.en + "”. The main typeface is " + sc.f + ". Add one or two fallbacks and end the list with a generic family.")) + "</p>" +
          '<div class="demo-row three"><label class="ctl"><span class="ctl-head"><span>' + esc(L("Резервный 1", "Fallback 1")) + "</span></span>" + sel("tsA", FB.map(function (x) { return x[0].replace(/"/g, "") + " (" + x[2] + ")"; })) + "</label>" +
          '<label class="ctl"><span class="ctl-head"><span>' + esc(L("Резервный 2 (необязательно)", "Fallback 2 (optional)")) + "</span></span>" + sel("tsB", FB.map(function (x) { return x[0].replace(/"/g, "") + " (" + x[2] + ")"; })) + "</label>" +
          '<label class="ctl"><span class="ctl-head"><span>' + esc(L("Родовое семейство", "Generic family")) + "</span></span>" + sel("tsG", GEN) + "</label></div>" +
          '<pre class="tk-code" id="tsCode"></pre><ul class="tk-checks"></ul><div class="tk-nav0"></div>';
        var a = el.querySelector("#tsA"), b = el.querySelector("#tsB"), g = el.querySelector("#tsG");
        function code() {
          var parts = ['"' + sc.f + '"'];
          [a, b].forEach(function (s) { if (s.value !== "") parts.push(FB[s.value][0]); });
          if (g.value !== "") parts.push(GEN[g.value]);
          el.querySelector("#tsCode").textContent = "font-family: " + parts.join(", ") + ";";
        }
        [a, b, g].forEach(function (s) { s.addEventListener("change", code); }); code();
        var c = btn(k("check")); el.querySelector(".tk-nav0").appendChild(c);
        c.addEventListener("click", function () {
          var fb = [a, b].filter(function (s) { return s.value !== ""; }).map(function (s) { return FB[s.value]; });
          var items = [
            { ok: fb.length > 0, text: L("Указан хотя бы один резервный шрифт", "At least one fallback is listed") },
            (function () {
              var CN = { serif: L("антиква", "serif"), sans: L("гротеск", "sans serif"), mono: L("моноширинный", "monospace"), script: L("рукописный", "script") };
              var wrong = fb.filter(function (x) { return x[1] !== sc.c; });
              return { ok: fb.length > 0 && !wrong.length, text: wrong.length
                ? L("Не того класса: ", "Wrong class: ") + wrong.map(function (x) { return x[0].replace(/"/g, "") + " — " + CN[x[1]]; }).join(", ") + L(". Основной шрифт — ", ". The main typeface is ") + CN[sc.c] + "."
                : L("Резервные шрифты относятся к тому же классу, что и основной (" + CN[sc.c] + ")", "Fallbacks belong to the same class as the main typeface (" + CN[sc.c] + ")") };
            })(),
            { ok: !(a.value !== "" && a.value === b.value), text: L("Резервные шрифты не повторяются", "Fallbacks are not repeated") },
            { ok: g.value !== "" && OKGEN[sc.c].indexOf(GEN[g.value]) > -1, text: L("Список завершается родовым семейством того же класса", "The list ends with a generic family of the same class") }
          ];
          if (checklist(el.querySelector(".tk-checks"), items)) passed();
        });
      });
    },

    tSubclass: function (root) {
      var POOL = { oldstyle: ["eb-garamond", "alegreya", "vollkorn", "cormorant"], transitional: ["pt-serif", "source-serif-4", "noto-serif"], didone: ["playfair-display", "prata", "old-standard-tt"], slab: ["roboto-slab", "bitter"], neo: ["inter", "roboto", "arimo", "onest"], humanist: ["pt-sans", "open-sans", "fira-sans", "source-sans-3"], geometric: ["montserrat", "jost", "raleway", "manrope"] };
      var SUBS = Object.keys(POOL);
      function setup() {
        var chosen = shuffle(SUBS).slice(0, 6).map(function (sb) { return { sub: sb, id: pick(POOL[sb]) }; });
        root.innerHTML = '<p class="tk-q">' + esc(L("Определите подгруппу каждого шрифта по признакам: засечки, контраст и его ось, апертура, пропорции. Для зачёта необходимо не менее 5 верных ответов из 6.", "Identify the subgroup of each typeface from its features: serifs, contrast and its axis, aperture, proportions. At least 5 of 6 correct answers are required.")) + "</p>" +
          '<div class="tk-grid">' + chosen.map(function (c, i) {
            return '<div class="tk-cell" data-i="' + i + '"><span class="tk-spec" style="font-size:34px;font-family:' + esc(stack(c.id)) + '">Аа Ее Rr Gg 3</span><span style="font-family:' + esc(stack(c.id)) + ';font-size:17px">' + esc(L("Съешь же ещё этих мягких булок", "Sphinx of black quartz")) + '</span><select aria-label="' + (i + 1) + '"><option value="">—</option>' +
              SUBS.map(function (sb) { return '<option value="' + sb + '">' + esc(App.T("fontSub")[sb]) + "</option>"; }).join("") + '</select><span class="pair-name tk-name" hidden></span></div>';
          }).join("") + '</div><p class="quiz-result" role="status"></p><div class="tk-nav"></div>' + doneBox();
        var nav = root.querySelector(".tk-nav"), c = btn(k("check")), o = btn(k("again"), "btn-ghost");
        nav.appendChild(c); nav.appendChild(o); o.addEventListener("click", setup);
        c.addEventListener("click", function () {
          var score = 0;
          root.querySelectorAll(".tk-cell").forEach(function (cell) {
            var ch = chosen[cell.dataset.i], v = cell.querySelector("select").value, ok = v === ch.sub;
            if (ok) score++;
            cell.classList.toggle("is-right", ok); cell.classList.toggle("is-wrong", !ok);
            var nm = cell.querySelector(".tk-name"); nm.hidden = false;
            nm.textContent = font(ch.id).family + " — " + App.T("fontSub")[ch.sub];
          });
          var r = root.querySelector(".quiz-result");
          r.className = "quiz-result " + (score >= 5 ? "ok" : "bad"); r.textContent = k("result", score, 6, 5);
          if (score >= 5) complete(root);
        });
      }
      setup();
    },

    /* ---------- Module 3: character ---------- */

    tZones: function (root) {
      var Z = { text: ["literata", "pt-serif", "inter", "pt-sans", "golos-text", "source-serif-4"], regular: ["playfair-display", "oswald", "montserrat", "cormorant", "old-standard-tt", "comfortaa"], display: ["unbounded", "press-start-2p", "great-vibes", "amatic-sc", "ruslan-display", "rubik-mono-one", "pacifico"] };
      var NAMES = { text: L("Текстовый", "Text"), regular: L("Регулярный", "Regular"), display: L("Акцидентный", "Display") };
      function setup() {
        var chosen = shuffle([].concat.apply([], Object.keys(Z).map(function (z) { return shuffle(Z[z]).slice(0, 2).map(function (id) { return { z: z, id: id }; }); })));
        root.innerHTML = '<p class="tk-q">' + esc(L("Определите зону круга для каждого шрифта: текстовый (для сплошного чтения), регулярный (заголовки и короткие тексты) или акцидентный (крупный кегль, короткие надписи). Для зачёта — не менее 5 из 6.", "Assign each typeface to a zone of the wheel: text (continuous reading), regular (headings and short texts) or display (large sizes, short lines). At least 5 of 6 are required.")) + "</p>" +
          '<div class="tk-grid">' + chosen.map(function (c, i) {
            return '<div class="tk-cell" data-i="' + i + '"><span style="font-family:' + esc(stack(c.id)) + ';font-size:' + (c.id === "press-start-2p" ? 13 : 19) + 'px;line-height:1.45">' + esc(L("Город, который строили для пешеходов, снова возвращается в генеральные планы.", "The city built for walking is returning to master plans.")) + '</span><select aria-label="' + (i + 1) + '"><option value="">—</option>' +
              Object.keys(Z).map(function (z) { return '<option value="' + z + '">' + esc(NAMES[z]) + "</option>"; }).join("") + '</select><span class="pair-name tk-name" hidden></span></div>';
          }).join("") + '</div><p class="quiz-result" role="status"></p><div class="tk-nav"></div>' + doneBox();
        var nav = root.querySelector(".tk-nav"), c = btn(k("check")), o = btn(k("again"), "btn-ghost");
        nav.appendChild(c); nav.appendChild(o); o.addEventListener("click", setup);
        c.addEventListener("click", function () {
          var score = 0;
          root.querySelectorAll(".tk-cell").forEach(function (cell) {
            var ch = chosen[cell.dataset.i], ok = cell.querySelector("select").value === ch.z;
            if (ok) score++;
            cell.classList.toggle("is-right", ok); cell.classList.toggle("is-wrong", !ok);
            var nm = cell.querySelector(".tk-name"); nm.hidden = false; nm.textContent = font(ch.id).family + " — " + NAMES[ch.z];
          });
          var r = root.querySelector(".quiz-result");
          r.className = "quiz-result " + (score >= 5 ? "ok" : "bad"); r.textContent = k("result", score, 6, 5);
          if (score >= 5) complete(root);
        });
      }
      setup();
    },

    /* ---------- Module 4: weights ---------- */

    tWeightMatch: function (root) {
      function match(t, a) {
        a = a.slice().sort(function (x, y) { return x - y; });
        if (a.indexOf(t) > -1) return t;
        var up = function (f, to) { return a.filter(function (w) { return w > f && (to == null || w <= to); })[0]; };
        var dn = function (f) { var d = a.filter(function (w) { return w < f; }); return d[d.length - 1]; };
        if (t >= 400 && t <= 500) return up(t, 500) || dn(t) || a.filter(function (w) { return w > 500; })[0];
        if (t < 400) return dn(t) || up(t);
        return up(t) || dn(t);
      }
      var SETS = [[300, 400, 700], [400, 700], [400, 600, 800], [100, 300, 500, 900], [200, 500, 700], [300, 500], [400, 900], [200, 400, 800]];
      drill(root, {
        rounds: 6, pass: 5,
        gen: function () {
          var set = pick(SETS), t;
          do { t = pick([100, 200, 300, 400, 500, 600, 700, 800, 900]); } while (set.indexOf(t) > -1);
          var a = match(t, set);
          var rule = t < 400 ? L("Для значений меньше 400 сначала ищется ближайшее более светлое начертание, затем более насыщенное.", "Below 400, the nearest lighter weight is tried first, then heavier ones.")
            : t <= 500 ? L("Для 400–500 сначала проверяются более насыщенные начертания до 500, затем более светлые, затем насыщеннее 500.", "For 400–500, heavier weights up to 500 are tried first, then lighter ones, then those above 500.")
            : L("Для значений больше 500 сначала ищется ближайшее более насыщенное начертание, затем более светлое.", "Above 500, the nearest heavier weight is tried first, then lighter ones.");
          return {
            q: L("Доступные начертания: <code>" + set.join(", ") + "</code>. В стилях указано <code>font-weight: " + t + "</code>. Какое начертание применит браузер?", "Available weights: <code>" + set.join(", ") + "</code>. The style sets <code>font-weight: " + t + "</code>. Which weight will the browser use?"),
            choices: set.map(String), answer: set.indexOf(a), ex: rule
          };
        }
      });
    },

    tFaux: function (root) {
      var R_IT = ["pt-serif", "inter", "pt-sans", "literata", "montserrat"], F_IT = ["onest", "roboto", "golos-text"];
      var R_BD = ["pt-serif", "pt-sans", "roboto", "source-sans-3", "literata"], F_BD = ["prata", "pt-mono", "poiret-one"];
      var word = L("Типографика", "Typography");
      drill(root, {
        rounds: 4, pass: 3,
        gen: function (n) {
          var italic = n % 2 === 0, reals = shuffle(italic ? R_IT : R_BD).slice(0, 2), fake = pick(italic ? F_IT : F_BD);
          var opts = shuffle(reals.concat([fake]));
          var style = italic ? "font-style:italic;font-weight:400" : "font-weight:700";
          return {
            q: L(italic ? "Какой из образцов набран синтезированным курсивом?" : "Какой из образцов набран синтезированным полужирным начертанием?", italic ? "Which sample uses a synthesised italic?" : "Which sample uses a synthesised bold?"),
            choices: opts.map(function (id) { return '<span class="tk-spec" style="font-size:30px;' + style + ";font-family:" + esc(stack(id)) + '">' + esc(word) + "</span>"; }),
            answer: opts.indexOf(fake),
            ex: (italic ? L("Синтезированный курсив — механически наклонённое прямое начертание: формы знаков не меняются. ", "A synthesised italic is the upright mechanically slanted: letterforms do not change. ")
              : L("Синтезированный полужирный получен утолщением контура: просветы сужаются, контраст искажается. ", "A synthesised bold is made by thickening the outline: counters close up and contrast is distorted. ")) +
              L("Образцы: ", "Samples: ") + opts.map(function (id) { return font(id).family; }).join(", ") + "."
          };
        }
      });
    },

    /* ---------- Module 5: setting ---------- */

    tParagraph: function (root) {
      var id = pick(["pt-serif", "literata", "inter", "golos-text", "source-serif-4"]);
      var st = { size: 14, lh: 1.15, measure: 100, sizeM: 13 };
      var txt = L("Длина строки, кегль и интерлиньяж взаимосвязаны: при увеличении длины строки требуется больший интерлиньяж, а при уменьшении кегля строка становится длиннее в знаках. Поэтому параметры набора подбираются совместно, с проверкой на реальной ширине экрана.", "Line length, size and line height are interdependent: a longer line needs more line height, and a smaller size makes the line longer in characters. Setting parameters are therefore chosen together and checked at real screen widths.");
      function rng(id2, label, attrs) { return '<label class="ctl"><span class="ctl-head"><span>' + esc(label) + '</span><output id="' + id2 + 'O"></output></span><input type="range" id="' + id2 + '" ' + attrs + "></label>"; }
      root.innerHTML = '<p class="tk-q">' + esc(L("Абзац набран с ошибками. Настройте параметры так, чтобы все требования выполнялись одновременно на десктопе и на смартфоне (375 px). Гарнитура: ", "The paragraph is badly set. Adjust the parameters so that all requirements are met on desktop and on a smartphone (375 px) at once. Typeface: ") + font(id).family) + ".</p>" +
        '<div class="demo-row">' + rng("tpS", L("Кегль, десктоп", "Size, desktop"), 'min="12" max="24" step="1"') + rng("tpSM", L("Кегль, смартфон", "Size, smartphone"), 'min="12" max="22" step="1"') + "</div>" +
        '<div class="demo-row">' + rng("tpL", L("Интерлиньяж", "Line height"), 'min="1" max="2.2" step="0.05"') + rng("tpM", L("max-width абзаца", "Paragraph max-width"), 'min="30" max="110" step="1"') + "</div>" +
        '<div class="demo-frame"><p id="tpD" style="margin:0">' + esc(txt) + "</p></div>" +
        '<div class="demo-frame" style="max-width:375px;padding:16px"><p id="tpMob" style="margin:0">' + esc(txt) + "</p></div>" +
        '<ul class="tk-checks"></ul>' + doneBox();
      var $ = function (x) { return root.querySelector("#" + x); };
      $("tpS").value = st.size; $("tpSM").value = st.sizeM; $("tpL").value = st.lh; $("tpM").value = st.measure;
      var finished = false;
      function upd() {
        st.size = Number($("tpS").value); st.sizeM = Number($("tpSM").value); st.lh = Number($("tpL").value); st.measure = Number($("tpM").value);
        $("tpSO").textContent = st.size + " px"; $("tpSMO").textContent = st.sizeM + " px"; $("tpLO").textContent = st.lh.toFixed(2); $("tpMO").textContent = st.measure + "ch";
        [["tpD", st.size, st.measure], ["tpMob", st.sizeM, 200]].forEach(function (p) {
          var e = $(p[0]); e.style.fontFamily = stack(id); e.style.fontSize = p[1] + "px"; e.style.lineHeight = st.lh; e.style.maxWidth = p[2] + "ch";
        });
        var cd = window.TypeUtil.charsPerLine($("tpD")), cm = window.TypeUtil.charsPerLine($("tpMob"));
        var items = [
          { ok: st.size >= 16, text: L("Кегль на десктопе не менее 16 px (сейчас " + st.size + ")", "Desktop size at least 16 px (now " + st.size + ")") },
          { ok: st.sizeM >= 16, text: L("Кегль на смартфоне не менее 16 px (сейчас " + st.sizeM + ")", "Smartphone size at least 16 px (now " + st.sizeM + ")") },
          { ok: st.lh >= 1.4 && st.lh <= 1.7, text: L("Интерлиньяж 1.4–1.7 (сейчас " + st.lh.toFixed(2) + ")", "Line height 1.4–1.7 (now " + st.lh.toFixed(2) + ")") },
          { ok: cd >= 45 && cd <= 75, text: L("Длина строки на десктопе 45–75 знаков (сейчас ≈ " + cd + ")", "Desktop line length 45–75 characters (now ≈ " + cd + ")") },
          { ok: cm >= 30, text: L("Длина строки на смартфоне не менее 30 знаков (сейчас ≈ " + cm + ")", "Smartphone line length at least 30 characters (now ≈ " + cm + ")") }
        ];
        if (checklist(root.querySelector(".tk-checks"), items) && !finished) { finished = true; complete(root); }
      }
      ["tpS", "tpSM", "tpL", "tpM"].forEach(function (x) { $(x).addEventListener("input", upd); });
      ready([id], upd);
    },

    tUnits: function (root) {
      var gens = [
        function () { var x = pick([12, 14, 18, 20, 24, 28, 32, 40]); return { q: L("Корневой кегль браузера — 16 px. Сколько rem составляет кегль <code>" + x + "px</code>?", "The browser root size is 16 px. How many rem is <code>" + x + "px</code>?"), answer: x / 16, tol: 0.01, unit: "rem", ex: L("1 rem = корневой кегль, поэтому " + x + " / 16.", "1 rem equals the root size, so " + x + " / 16.") }; },
        function () { var r = pick([18, 20, 24]), v = pick([0.875, 1.125, 1.25, 1.5, 2]); return { q: L("Пользователь установил в браузере базовый кегль " + r + " px. Каков в пикселях кегль <code>font-size: " + v + "rem</code>?", "The user set a default size of " + r + " px. What is <code>font-size: " + v + "rem</code> in pixels?"), answer: r * v, tol: 0.1, unit: "px", ex: L("Значение в rem умножается на пользовательский базовый кегль — так макет учитывает настройки пользователя.", "A rem value is multiplied by the user's default size, so the layout respects user settings.") }; },
        function () { var f = pick([16, 17, 18, 20]), l = pick([1.4, 1.5, 1.6]); return { q: L("<code>font-size: " + f + "px; line-height: " + l + "</code>. Каково расстояние между базовыми линиями соседних строк в пикселях?", "<code>font-size: " + f + "px; line-height: " + l + "</code>. What is the distance between baselines in pixels?"), answer: f * l, tol: 0.1, unit: "px", ex: L("Безразмерный интерлиньяж умножается на кегль элемента.", "A unitless line height is multiplied by the element's font size.") }; },
        function () { var p = pick([16, 18]), c = pick([28, 32, 36]); return { q: L("У родителя <code>font-size: " + p + "px; line-height: 1.5em</code>. У заголовка внутри — <code>font-size: " + c + "px</code>, line-height не задан. Каков интерлиньяж заголовка в пикселях?", "The parent has <code>font-size: " + p + "px; line-height: 1.5em</code>. A heading inside has <code>font-size: " + c + "px</code> and no line-height. What is the heading's line height in pixels?"), answer: p * 1.5, tol: 0.1, unit: "px", ex: L("Значение в em вычисляется у родителя и наследуется как готовая длина (" + p * 1.5 + " px) — строки заголовка налезают друг на друга. Поэтому line-height задают без единиц.", "An em value is computed on the parent and inherited as a fixed length (" + p * 1.5 + " px), so heading lines overlap. That is why line-height is set unitless.") }; },
        function () { var p = pick([16, 18]), c = pick([28, 32, 36]); return { q: L("У родителя <code>font-size: " + p + "px; line-height: 1.5</code>. У заголовка внутри — <code>font-size: " + c + "px</code>. Каков интерлиньяж заголовка в пикселях?", "The parent has <code>font-size: " + p + "px; line-height: 1.5</code>. A heading inside has <code>font-size: " + c + "px</code>. What is the heading's line height in pixels?"), answer: c * 1.5, tol: 0.1, unit: "px", ex: L("Безразмерное значение наследуется как множитель и пересчитывается для кегля заголовка.", "A unitless value is inherited as a factor and recomputed for the heading size.") }; },
        function () { var f = pick([16, 18, 20]), l = pick([24, 27, 30, 32]); return { q: L("<code>font-size: " + f + "px; line-height: " + l + "px</code>. Какова величина полуинтерлиньяжа — пространства над и под знаками в строке?", "<code>font-size: " + f + "px; line-height: " + l + "px</code>. What is the half-leading — the space above and below the glyphs?"), answer: (l - f) / 2, tol: 0.1, unit: "px", ex: L("Полуинтерлиньяж = (line-height − font-size) / 2.", "Half-leading = (line-height − font-size) / 2.") }; },
        function () { var m = pick([60, 65, 70]), z = pick([0.5, 0.55, 0.6]), f = pick([16, 18]); return { q: L("<code>max-width: " + m + "ch</code>, ширина цифры «0» в шрифте — " + String(z).replace(".", ",") + " em, кегль " + f + " px. Какова максимальная ширина абзаца в пикселях?", "<code>max-width: " + m + "ch</code>, the “0” glyph is " + z + " em wide, size " + f + " px. What is the maximum paragraph width in pixels?"), answer: m * z * f, tol: 1, unit: "px", ex: L("1ch равен ширине цифры «0» в текущем шрифте.", "1ch equals the width of the “0” glyph in the current font.") }; }
      ];
      var order;
      drill(root, { rounds: 6, pass: 5, gen: function (n) { if (n === 0) order = shuffle(gens); return order[n](); } });
    },

    /* ---------- Module 6: scale ---------- */

    tScaleCalc: function (root) {
      var gens = [
        function () { var b = pick([16, 18]), r = pick([1.2, 1.25, 1.333]), n = pick([2, 3, 4]); return { q: L("Базовый кегль " + b + " px, модульное отношение " + r + ". Каков кегль на ступени +" + n + "?", "Base size " + b + " px, ratio " + r + ". What is the size at step +" + n + "?"), answer: b * Math.pow(r, n), tol: 0.5, unit: "px", ex: L("Кегль ступени n = база × отношение^n.", "Size at step n = base × ratio^n.") }; },
        function () { var r = pick([1.125, 1.2, 1.25, 1.333, 1.5]), h = Math.round(16 * r * r * 10) / 10; return { q: L("Основной текст — 16 px, заголовок H3 на ступени +2 — " + num(h, 1) + " px. Каково модульное отношение?", "Body text is 16 px, the H3 at step +2 is " + h + " px. What is the ratio?"), answer: r, tol: 0.01, unit: "", ex: L("Отношение = √(" + num(h, 1) + " / 16).", "Ratio = √(" + h + " / 16).") }; },
        function () { var b = pick([16, 18]), r = pick([1.2, 1.25]); return { q: L("Базовый кегль " + b + " px, отношение " + r + ". Каков кегль подписи на ступени −1?", "Base " + b + " px, ratio " + r + ". What is the caption size at step −1?"), answer: b / r, tol: 0.2, unit: "px", ex: L("Ступень вниз — деление на отношение.", "A step down divides by the ratio.") }; },
        function () { var mn = pick([16, 18, 20, 24]), mx = mn + pick([6, 8, 12, 16]); return { q: L("Кегль должен плавно расти от " + mn + " px при ширине 360 px до " + mx + " px при ширине 1280 px. Каков коэффициент при vw в выражении clamp()?", "The size should grow from " + mn + " px at 360 px to " + mx + " px at 1280 px. What is the vw coefficient in clamp()?"), answer: (mx - mn) / 920 * 100, tol: 0.02, unit: "vw", ex: L("Наклон = (" + mx + " − " + mn + ") / (1280 − 360) × 100.", "Slope = (" + mx + " − " + mn + ") / (1280 − 360) × 100.") }; },
        function () { var mn = pick([16, 18, 20]), mx = mn + pick([8, 12, 16]), sl = (mx - mn) / 920; return { q: L("Для перехода от " + mn + " до " + mx + " px между шириной 360 и 1280 px наклон равен " + num(sl * 100, 3) + "vw. Каково постоянное слагаемое в rem (при 1rem = 16 px)?", "For " + mn + " to " + mx + " px between 360 and 1280 px the slope is " + num(sl * 100, 3) + "vw. What is the constant term in rem (1rem = 16 px)?"), answer: (mn - sl * 360) / 16, tol: 0.02, unit: "rem", ex: L("Слагаемое = (" + mn + " − наклон × 360) / 16.", "Constant = (" + mn + " − slope × 360) / 16.") }; },
        function () { var r = pick([1.2, 1.25, 1.333]), n = pick([3, 4, 5]), h = Math.round(16 * Math.pow(r, n)); return { q: L("Основной текст — 16 px, отношение " + r + ". На какой ступени шкалы кегль ближе всего к " + h + " px?", "Body 16 px, ratio " + r + ". At which step is the size closest to " + h + " px?"), answer: n, tol: 0, unit: "", ex: L("16 × " + r + "^" + n + " ≈ " + num(16 * Math.pow(r, n), 1) + " px.", "16 × " + r + "^" + n + " ≈ " + (16 * Math.pow(r, n)).toFixed(1) + " px.") }; }
      ];
      drill(root, { rounds: 6, pass: 5, gen: function (n) { return gens[n](); } });
    },

    tHierarchy: function (root) {
      var st = { h1: 22, h2: 24, h3: 17, mt: 0.3, mb: 1.5 };
      function rng(id, label, attrs) { return '<label class="ctl"><span class="ctl-head"><span>' + esc(label) + '</span><output id="' + id + 'O"></output></span><input type="range" id="' + id + '" ' + attrs + "></label>"; }
      root.innerHTML = '<p class="tk-q">' + esc(L("Иерархия страницы нарушена: H2 крупнее H1, H3 почти не отличается от текста, а отбивка над H2 меньше, чем под ним. Исправьте параметры (основной текст — 16 px).", "The page hierarchy is broken: H2 is larger than H1, H3 barely differs from body text, and the space above H2 is smaller than below it. Fix the parameters (body text is 16 px).")) + "</p>" +
        '<div class="demo-row">' + rng("thA", "H1", 'min="16" max="56" step="1"') + rng("thB", "H2", 'min="14" max="44" step="1"') + "</div>" +
        '<div class="demo-row">' + rng("thC", "H3", 'min="14" max="32" step="1"') + rng("thT", L("Отбивка над H2, em", "Space above H2, em"), 'min="0" max="3" step="0.1"') + "</div>" +
        rng("thM", L("Отбивка под H2, em", "Space below H2, em"), 'min="0" max="3" step="0.1"') +
        '<div class="tk-article"><h1 id="thH1">' + esc(L("Город для пешеходов", "A city for walking")) + '</h1><p>' + esc(L("Градостроители 1920-х годов рассматривали квартал как самостоятельный организм со школой и библиотекой.", "Planners of the 1920s saw the block as a self-contained organism with a school and a library.")) + '</p><h2 id="thH2">' + esc(L("Квартал как единица города", "The block as a unit of the city")) + '</h2><p>' + esc(L("Многие решения так и остались на бумаге, однако принцип пешей доступности вновь стал ключевым.", "Many plans never left the drawing board, yet walkability has become central again.")) + '</p><h3 id="thH3">' + esc(L("Что почитать", "Further reading")) + "</h3><p>" + esc(L("Список литературы приведён в конце статьи.", "The reading list is at the end of the article.")) + "</p></div>" +
        '<ul class="tk-checks"></ul>' + doneBox();
      var $ = function (x) { return root.querySelector("#" + x); }, finished = false;
      $("thA").value = st.h1; $("thB").value = st.h2; $("thC").value = st.h3; $("thT").value = st.mt; $("thM").value = st.mb;
      function upd() {
        st.h1 = +$("thA").value; st.h2 = +$("thB").value; st.h3 = +$("thC").value; st.mt = +$("thT").value; st.mb = +$("thM").value;
        $("thAO").textContent = st.h1 + " px"; $("thBO").textContent = st.h2 + " px"; $("thCO").textContent = st.h3 + " px"; $("thTO").textContent = st.mt.toFixed(1); $("thMO").textContent = st.mb.toFixed(1);
        $("thH1").style.fontSize = st.h1 + "px"; $("thH1").style.margin = "0 0 0.5em";
        $("thH2").style.fontSize = st.h2 + "px"; $("thH2").style.margin = st.mt + "em 0 " + st.mb + "em";
        $("thH3").style.fontSize = st.h3 + "px"; $("thH3").style.margin = "1.4em 0 0.4em";
        var items = [
          { ok: st.h1 > st.h2 && st.h2 > st.h3 && st.h3 > 16, text: L("Кегли убывают: H1 > H2 > H3 > текст", "Sizes decrease: H1 > H2 > H3 > body") },
          { ok: st.h1 / st.h2 >= 1.15 && st.h2 / st.h3 >= 1.15 && st.h3 / 16 >= 1.15, text: L("Соседние уровни различаются не менее чем в 1,15 раза", "Adjacent levels differ by a factor of at least 1.15") },
          { ok: st.h1 >= 32, text: L("H1 не менее чем вдвое крупнее основного текста", "H1 is at least twice the body size") },
          { ok: st.mt >= st.mb * 1.5 && st.mb > 0, text: L("Отбивка над H2 не менее чем в 1,5 раза больше, чем под ним", "Space above H2 is at least 1.5 times the space below") }
        ];
        if (checklist(root.querySelector(".tk-checks"), items) && !finished) { finished = true; complete(root); }
      }
      ["thA", "thB", "thC", "thT", "thM"].forEach(function (x) { $(x).addEventListener("input", upd); });
      upd();
    },

    /* ---------- Module 7: pairing ---------- */

    tConflict: function (root) {
      var BAD = [["roboto", "arimo"], ["inter", "onest"], ["pt-serif", "source-serif-4"], ["montserrat", "jost"], ["open-sans", "fira-sans"], ["eb-garamond", "vollkorn"], ["playfair-display", "prata"]];
      var GOOD = [["playfair-display", "source-sans-3"], ["unbounded", "inter"], ["literata", "onest"], ["pt-serif", "pt-sans"], ["oswald", "pt-serif"], ["roboto-slab", "roboto"], ["montserrat", "merriweather"], ["cormorant", "open-sans"]];
      var b = shuffle(BAD);
      function spec(p) {
        return '<span style="display:block;font-family:' + esc(stack(p[0])) + ';font-weight:700;font-size:21px;line-height:1.2;margin-bottom:6px">' + esc(L("Заголовок раздела", "Section heading")) + '</span><span style="display:block;font-family:' + esc(stack(p[1])) + ';font-size:15px;line-height:1.45">' + esc(L("Основной текст набран второй гарнитурой пары.", "Body text is set in the second typeface.")) + "</span>";
      }
      drill(root, {
        rounds: 5, pass: 4,
        gen: function (n) {
          var bad = b[n % b.length], opts = shuffle(shuffle(GOOD).slice(0, 2).concat([bad]));
          return {
            q: L("Какая пара составлена ошибочно: гарнитуры слишком похожи, и различие воспринимается как ошибка?", "Which pair is a mistake: the typefaces are so similar that the difference looks like an error?"),
            choices: opts.map(spec), answer: opts.indexOf(bad),
            ex: L(font(bad[0]).family + " и " + font(bad[1]).family + " относятся к одной подгруппе (" + App.T("fontSub")[font(bad[0]).sub] + "): пара не даёт ни контраста, ни единства.", font(bad[0]).family + " and " + font(bad[1]).family + " belong to the same subgroup (" + App.T("fontSub")[font(bad[0]).sub] + "): the pair offers neither contrast nor unity.")
          };
        }
      });
    },

    tHeadPick: function (root) {
      var list = [
        { body: "literata", ru: "Новостной портал: заголовки статей до 12 слов. Основной текст — Literata.", en: "News portal: article headlines of up to 12 words. Body text is Literata.", mode: "news" },
        { body: "source-sans-3", ru: "Документация для разработчиков: выберите гарнитуру для фрагментов кода. Основной текст — Source Sans 3.", en: "Developer documentation: choose a typeface for code snippets. Body text is Source Sans 3.", mode: "code" }
      ];
      stages(root, list, function (el, sc, passed) {
        var opts = window.FONTS.filter(function (f) { return f.id !== sc.body; });
        el.innerHTML = '<p class="tk-q">' + esc(L(sc.ru, sc.en)) + "</p>" +
          '<div class="demo-row"><label class="ctl"><span class="ctl-head"><span>' + esc(L("Гарнитура", "Typeface")) + '</span></span><select id="hpF">' + opts.map(function (f) { return '<option value="' + f.id + '">' + esc(f.family) + "</option>"; }).join("") + '</select></label>' +
          '<label class="ctl"><span class="ctl-head"><span>' + esc(L("Насыщенность", "Weight")) + '</span></span><select id="hpW"></select></label></div>' +
          '<div class="demo-frame" id="hpPrev"></div><ul class="tk-checks"></ul><div class="tk-nav0"></div>';
        var fs = el.querySelector("#hpF"), ws = el.querySelector("#hpW"), pv = el.querySelector("#hpPrev");
        fs.value = sc.mode === "news" ? "pt-serif" : "roboto";
        function weights() {
          var f = font(fs.value), list2 = f.variable ? [] : f.weights.slice();
          if (f.variable) for (var w = Math.ceil(f.wght[0] / 100) * 100; w <= f.wght[1]; w += 100) list2.push(w);
          ws.innerHTML = list2.map(function (w) { return '<option value="' + w + '"' + (w === 400 ? " selected" : "") + ">" + w + "</option>"; }).join("");
        }
        function prev() {
          var head = sc.mode === "news" ? '<span style="display:block;font-family:' + esc(stack(fs.value)) + ";font-weight:" + ws.value + ';font-size:26px;line-height:1.2;margin-bottom:8px">' + esc(L("Городские библиотеки становятся общественными центрами", "City libraries are becoming community hubs")) + "</span>" : "";
          var body = '<span style="font-family:' + esc(stack(sc.body)) + ';font-size:17px;line-height:1.5">' + esc(L("Вызовите метод ", "Call the method ")) + (sc.mode === "code" ? '<code style="font-family:' + esc(stack(fs.value)) + ";font-weight:" + ws.value + '">track("signup")</code>' : "") + esc(L(" после регистрации пользователя.", " after the user signs up.")) + "</span>";
          pv.innerHTML = sc.mode === "news" ? head + '<span style="font-family:' + esc(stack(sc.body)) + ';font-size:17px;line-height:1.5">' + esc(L("Посещаемость библиотек выросла, хотя выдача бумажных книг сокращается.", "Attendance has grown even as book loans decline.")) + "</span>" : body;
        }
        fs.addEventListener("change", function () { weights(); prev(); }); ws.addEventListener("change", prev);
        weights(); prev();
        var c = btn(k("check")); el.querySelector(".tk-nav0").appendChild(c);
        c.addEventListener("click", function () { ready([fs.value, sc.body], verify); });
        function verify() {
          var f = font(fs.value), b = font(sc.body), w = Number(ws.value), items;
          if (sc.mode === "news") {
            items = [
              { ok: f.cls !== "display" && f.cls !== "script", text: L("Гарнитура пригодна для заголовков из нескольких слов (не акцидентная и не рукописная)", "Suitable for multi-word headlines (not display or script)") },
              { ok: f.cls !== b.cls, text: L("Гарнитура заголовков контрастна основному тексту: другой класс (две разные антиквы спорят друг с другом)", "The heading face contrasts with the body: a different class (two different serifs compete)") },
              { ok: w >= 600, text: L("Насыщенность заголовков не менее 600", "Heading weight at least 600") }
            ];
          } else {
            var ratio = xRatio(f.id) / xRatio(b.id);
            items = [
              { ok: f.cls === "mono", text: L("Выбрана моноширинная гарнитура", "A monospaced face is chosen") },
              { ok: w >= 400 && w <= 500, text: L("Насыщенность кода 400–500, как у основного текста", "Code weight 400–500, like the body text") },
              { ok: ratio >= 0.9 && ratio <= 1.1, text: L("Высота строчных отличается от основного текста не более чем на 10 % (сейчас " + num((ratio - 1) * 100, 0) + " %)", "x-height differs from the body by at most 10% (now " + Math.round((ratio - 1) * 100) + "%)") }
            ];
          }
          if (checklist(el.querySelector(".tk-checks"), items)) passed();
        }
      });
    },

    /* ---------- Module 8: accessibility ---------- */

    tFixContrast: function (root) {
      var list = [
        { bg: "#ffffff", h: 220, s: 10, l: 72, need: 4.5, ru: "Основной текст 16 px на белом фоне", en: "16 px body text on white" },
        { bg: "#f4f1ea", h: 24, s: 85, l: 60, need: 4.5, ru: "Ссылка в тексте на светлом фоне", en: "Inline link on a light background" },
        { bg: "#16181d", h: 220, s: 14, l: 34, need: 4.5, ru: "Текст в тёмной теме", en: "Text in dark mode" },
        { bg: "#ffffff", h: 145, s: 55, l: 62, need: 3, ru: "Крупный заголовок 28 px", en: "Large 28 px heading" }
      ];
      stages(root, list, function (el, sc, passed) {
        var max = sc.need + 2;
        el.innerHTML = '<p class="tk-q">' + esc(L(sc.ru + ": доведите контраст до " + num(sc.need, 1) + ":1, изменяя только светлоту цвета. Не делайте цвет контрастнее " + num(max, 1) + ":1 — оттенок должен сохраниться.", sc.en + ": raise contrast to " + sc.need + ":1 by changing lightness only. Do not exceed " + max + ":1 — keep the hue.")) + "</p>" +
          '<div class="tk-swatch" id="fcS" style="background:' + sc.bg + '"><span style="font-size:' + (sc.need === 3 ? 28 : 17) + "px;font-weight:" + (sc.need === 3 ? 700 : 400) + '">' + esc(L("Удобочитаемость зависит от контраста", "Readability depends on contrast")) + "</span></div>" +
          '<label class="ctl" style="margin-top:12px"><span class="ctl-head"><span>' + esc(L("Светлота (HSL L)", "Lightness (HSL L)")) + '</span><output id="fcO"></output></span><input type="range" id="fcL" min="0" max="100" step="1" value="' + sc.l + '"></label>' +
          '<ul class="tk-checks"></ul>';
        var sl = el.querySelector("#fcL"), ok = false;
        function upd() {
          var c = hsl(sc.h, sc.s, Number(sl.value)), r = contrast(c, sc.bg);
          el.querySelector("#fcS span").style.color = c;
          el.querySelector("#fcO").textContent = c + " · " + num(Math.floor(r * 100) / 100, 2) + ":1";
          var items = [{ ok: r >= sc.need, text: L("Контраст не ниже " + num(sc.need, 1) + ":1", "Contrast at least " + sc.need + ":1") }, { ok: r <= max, text: L("Контраст не выше " + num(max, 1) + ":1 — исходный характер цвета сохранён", "Contrast no higher than " + max + ":1 — the colour keeps its character") }];
          if (checklist(el.querySelector(".tk-checks"), items) && !ok) { ok = true; passed(); }
        }
        sl.addEventListener("input", upd); upd();
      });
    },

    tWcagJudge: function (root) {
      function gen() {
        var dark = Math.random() < 0.3, bg = dark ? pick(["#111827", "#1e293b", "#16181d"]) : pick(["#ffffff", "#f7f5f0", "#eef2f7"]);
        var size = pick([14, 16, 18.66, 20, 24, 28]), bold = Math.random() < 0.5;
        var large = size >= 24 || (bold && size >= 18.66), need = large ? 3 : 4.5, fg, r, tries = 0;
        do { fg = hsl(Math.floor(Math.random() * 360), Math.floor(Math.random() * 60), dark ? 35 + Math.random() * 60 : 15 + Math.random() * 55); r = contrast(fg, bg); tries++; }
        while ((Math.abs(r - need) < 0.25 || r < 1.8 || r > 9) && tries < 200);
        return { bg: bg, fg: fg, size: size, bold: bold, large: large, need: need, r: r, pass: r >= need };
      }
      drill(root, {
        rounds: 6, pass: 5,
        gen: function () {
          var g = gen();
          var pt = g.size === 18.66 ? "18,66 px (14 pt)" : g.size + " px";
          return {
            q: '<div class="tk-swatch" style="background:' + g.bg + ";color:" + g.fg + ";font-size:" + g.size + "px;font-weight:" + (g.bold ? 700 : 400) + '">' + esc(L("Образец текста интерфейса", "Interface text sample")) + "</div>" +
              '<p style="margin-top:10px">' + esc(L("Кегль " + pt + (g.bold ? ", полужирный" : ", обычный") + ". Соответствует ли сочетание уровню WCAG AA?", "Size " + pt + (g.bold ? ", bold" : ", regular") + ". Does this combination meet WCAG AA?")) + "</p>",
            choices: [esc(L("Соответствует", "Passes")), esc(L("Не соответствует", "Fails"))], answer: g.pass ? 0 : 1,
            ex: L("Контраст " + num(Math.floor(g.r * 100) / 100, 2) + ":1; для " + (g.large ? "крупного" : "обычного") + " текста требуется " + num(g.need, 1) + ":1.", "Contrast " + (Math.floor(g.r * 100) / 100).toFixed(2) + ":1; " + (g.large ? "large" : "normal") + " text requires " + g.need + ":1.")
          };
        }
      });
    },

    /* ---------- Module 9: web fonts ---------- */

    tFontFace: function (root) {
      var list = [
        { ru: "Вариативный шрифт Onest (насыщенность 100–900), файл с кириллицей. Текст должен появиться сразу и затем обязательно смениться веб-шрифтом. Файл предзагружается.", en: "Variable Onest (weights 100–900), Cyrillic file. Text must appear immediately and then always switch to the web font. The file is preloaded.",
          fam: "Onest", file: "onest-cyrillic-wght.woff2", ans: { fam: 0, fmt: 0, w: 1, disp: 1, ur: 0, co: 0 } },
        { ru: "Статичный полужирный PT Serif (700), файл с латиницей для акцентов. Макет не должен сдвигаться; на медленном соединении допустимо обойтись без веб-шрифта. Файл предзагружается.", en: "Static PT Serif Bold (700), Latin file for accents. The layout must not shift; on a slow connection it is acceptable to skip the web font. The file is preloaded.",
          fam: "PT Serif", file: "pt-serif-latin-700.woff2", ans: { fam: 0, fmt: 0, w: 0, disp: 2, ur: 1, co: 0 } }
      ];
      stages(root, list, function (el, sc, passed) {
        var O = {
          fam: ['"' + sc.fam + '"', '"' + sc.file.replace(".woff2", "") + '"', '"' + sc.fam + ' Web"'],
          fmt: ['"woff2"', '"woff"', '"truetype"'],
          w: sc.fam === "Onest" ? ["400", "100 900", "normal"] : ["700", "400", "100 900"],
          disp: ["block", "swap", "optional", "auto"],
          ur: ["U+0400-045F, U+0490-0491, U+2116", "U+0000-00FF, U+2000-206F"],
          co: ["crossorigin", L("(без атрибута)", "(no attribute)")]
        };
        if (sc.fam !== "Onest") O.ur = ["U+0400-045F, U+0490-0491, U+2116", "U+0000-00FF, U+2000-206F"];
        function s(key) { return '<select data-k="' + key + '"><option value="">…</option>' + O[key].map(function (o, i) { return '<option value="' + i + '">' + esc(o) + "</option>"; }).join("") + "</select>"; }
        el.innerHTML = '<p class="tk-q">' + esc(L(sc.ru, sc.en)) + "</p>" +
          '<pre class="tk-code">@font-face {\n  font-family: ' + s("fam") + ";\n  src: url(\"fonts/" + esc(sc.file) + '") format(' + s("fmt") + ");\n  font-weight: " + s("w") + ";\n  font-style: normal;\n  font-display: " + s("disp") + ";\n  unicode-range: " + s("ur") + ';\n}\n\nbody { font-family: "' + esc(sc.fam) + '", ' + (sc.fam === "Onest" ? "system-ui, sans-serif" : "Georgia, serif") + ';' + " }\n\n&lt;link rel=\"preload\" href=\"fonts/" + esc(sc.file) + '" as="font"\n      type="font/woff2" ' + s("co") + "&gt;</pre>" +
          '<ul class="tk-checks"></ul><div class="tk-nav0"></div>';
        var NAMES = { fam: L("Имя семейства совпадает с использованием в font-family", "Family name matches its use in font-family"), fmt: L("Формат файла указан верно", "File format is correct"), w: L("Диапазон насыщенности соответствует файлу", "Weight range matches the file"), disp: L("Стратегия font-display соответствует условию", "font-display strategy fits the requirement"), ur: L("unicode-range соответствует набору знаков файла", "unicode-range matches the file's character set"), co: L("Предзагрузка шрифта с атрибутом crossorigin", "Font preload has the crossorigin attribute") };
        var c = btn(k("check")); el.querySelector(".tk-nav0").appendChild(c);
        c.addEventListener("click", function () {
          var items = Object.keys(sc.ans).map(function (key) {
            var se = el.querySelector('[data-k="' + key + '"]'), ok = se.value !== "" && Number(se.value) === sc.ans[key];
            se.classList.toggle("is-right", ok); se.classList.toggle("is-wrong", !ok);
            return { ok: ok, text: NAMES[key] };
          });
          if (checklist(el.querySelector(".tk-checks"), items)) passed();
        });
      });
    },

    tTypoDrill: function (root) {
      var BANK = ru() ? [
        ["«Он назвал книгу „Шрифт и смысл“ лучшей»", '"Он назвал книгу "Шрифт и смысл" лучшей"', "«Он назвал книгу «Шрифт и смысл» лучшей»", "Внешние кавычки — «ёлочки», вложенные — „лапки“."],
        ["Типографика°— искусство", "Типографика - искусство", "Типографика –°искусство", "Тире (—) отделяется пробелами; пробел перед тире неразрывный."],
        ["в°1990–2000-х годах", "в 1990-2000-х годах", "в°1990 — 2000-х годах", "Диапазон чисел обозначается коротким тире (–) без пробелов."],
        ["А.°С.°Пушкин", "А.С. Пушкин", "А. С. Пушкин", "Инициалы отделяются друг от друга и от фамилии неразрывными пробелами."],
        ["25°км", "25км", "25 км", "Число и единица измерения разделяются неразрывным пробелом."],
        ["т.°е.", "т.е.", "т. е.", "В сокращении «т. е.» пробел неразрывный."],
        ["1°200°000°₽", "1,200,000 ₽", "1200000₽", "Разряды отделяются неразрывными пробелами; знак валюты — через неразрывный пробел."],
        ["№°5", "№5", "N 5", "Знак номера отделяется от числа неразрывным пробелом."]
      ] : [
        ["“Typography is what language looks like”", '"Typography is what language looks like"', "''Typography is what language looks like''", "Use curly quotation marks, not straight ones."],
        ["typography—an art", "typography - an art", "typography -- an art", "An em dash (—) marks a break in a sentence."],
        ["pages 10–24", "pages 10-24", "pages 10 — 24", "Ranges take an en dash (–) without spaces."],
        ["Fig.°5", "Fig. 5", "Fig.5", "A non-breaking space keeps an abbreviation with its number."],
        ["25°km", "25km", "25 km", "A non-breaking space separates a number and its unit."],
        ["it’s", "it's", "it`s", "The apostrophe is a curly ’, not a straight quote or backtick."],
        ["1920×1080", "1920x1080", "1920*1080", "Dimensions use the multiplication sign ×."],
        ["wait…", "wait...", "wait. . .", "Use the ellipsis character …."]
      ];
      var order;
      drill(root, {
        rounds: 8, pass: 6,
        gen: function (n) {
          if (n === 0) order = shuffle(BANK);
          var it = order[n], opts = shuffle([0, 1, 2]);
          return {
            q: esc(L("Какой вариант набран по нормам? Знак ° обозначает неразрывный пробел.", "Which variant is set correctly? The ° sign marks a non-breaking space.")),
            choices: opts.map(function (o) { return '<span style="font-size:19px">' + nb(it[o]) + "</span>"; }), answer: opts.indexOf(0), ex: it[3]
          };
        }
      });
    },

    /* ---------- added: font names, points and pixels ---------- */

    tFontName: function (root) {
      var R = { maker: L("проект, производитель", "project, foundry"), fam: L("собственное имя", "proper name"), cls: L("класс", "class"), ver: L("версия", "version"), opsz: L("оптический размер", "optical size"), width: L("ширина", "width"), wt: L("насыщенность", "weight"), slope: L("наклон", "slope"), tech: L("тип файла", "file type") };
      var ROLES = ["maker", "fam", "cls", "ver", "opsz", "width", "wt", "slope", "tech"];
      var BANK = [
        [["PT", "maker"], ["Sans", "cls"], ["Caption", "opsz"], ["Bold", "wt"]],
        [["Source", "fam"], ["Serif", "cls"], ["4", "ver"], ["Display", "opsz"], ["Semibold", "wt"], ["Italic", "slope"]],
        [["Roboto", "fam"], ["Condensed", "width"], ["Light", "wt"]],
        [["IBM", "maker"], ["Plex", "fam"], ["Sans", "cls"], ["Condensed", "width"], ["Medium", "wt"], ["Italic", "slope"]],
        [["Noto", "maker"], ["Serif", "cls"], ["Display", "opsz"], ["Black", "wt"]],
        [["Fira", "fam"], ["Sans", "cls"], ["Extra Condensed", "width"], ["Thin", "wt"]],
        [["PT", "maker"], ["Serif", "cls"], ["Caption", "opsz"], ["Italic", "slope"]],
        [["Literata", "fam"], ["Variable", "tech"]],
        [["Roboto", "fam"], ["Mono", "cls"], ["Bold", "wt"], ["Italic", "slope"]],
        [["Source", "fam"], ["Sans", "cls"], ["3", "ver"], ["ExtraBold", "wt"]],
        [["Roboto", "fam"], ["Slab", "cls"], ["Black", "wt"]],
        [["Open", "fam"], ["Sans", "cls"], ["Semi Condensed", "width"], ["Light", "wt"]],
        [["IBM", "maker"], ["Plex", "fam"], ["Mono", "cls"], ["Light", "wt"], ["Italic", "slope"]],
        [["Noto", "maker"], ["Sans", "cls"], ["Mono", "cls"], ["Condensed", "width"], ["Bold", "wt"]],
        [["PT", "maker"], ["Sans", "cls"], ["Narrow", "width"], ["Bold", "wt"]],
        [["Fira", "fam"], ["Sans", "cls"], ["Book", "wt"], ["Italic", "slope"]],
        [["Source", "fam"], ["Serif", "cls"], ["4", "ver"], ["Subhead", "opsz"], ["Light", "wt"]],
        [["Inter", "fam"], ["Variable", "tech"], ["Italic", "slope"]],
        [["Helvetica", "fam"], ["Neue", "ver"], ["LT", "maker"], ["Pro", "tech"]],
        [["TT", "maker"], ["Norms", "fam"], ["Pro", "tech"], ["Bold", "wt"]],
        [["ITC", "maker"], ["Franklin", "fam"], ["Gothic", "cls"], ["Condensed", "width"]]
      ];
      var ROUNDS = 12, PASS = 10, set, i, score;
      function start() { set = shuffle(BANK).slice(0, ROUNDS); i = 0; score = 0; show(); }
      function show() {
        var name = set[i], answered = false;
        root.innerHTML = '<div class="tk-head"><span>' + esc(k("round", i + 1, ROUNDS)) + "</span><span>" + esc(k("score", score)) + "</span></div>" +
          '<p class="tk-q">' + esc(L("Определите, что обозначает каждое слово в названии:", "Identify what each word in the name denotes:")) + ' <b style="font-size:19px">' + esc(name.map(function (p) { return p[0]; }).join(" ")) + "</b></p>" +
          '<div class="tk-parse">' + name.map(function (p, j) {
            return '<label class="tk-word"><b>' + esc(p[0]) + '</b><select data-j="' + j + '"><option value="">—</option>' + ROLES.map(function (r) { return '<option value="' + r + '">' + esc(R[r]) + "</option>"; }).join("") + "</select></label>";
          }).join("") + '</div><p class="quiz-result" role="status"></p><div class="tk-nav"></div>' + doneBox();
        var nav = root.querySelector(".tk-nav"), res = root.querySelector(".quiz-result"), c = btn(k("check"));
        nav.appendChild(c);
        c.addEventListener("click", function () {
          if (answered) return;
          var sels = root.querySelectorAll(".tk-word select");
          if ([].some.call(sels, function (x) { return !x.value; })) { res.className = "quiz-result bad"; res.textContent = L("Укажите значение для каждого слова.", "Choose a role for every word."); return; }
          answered = true; var ok = true;
          sels.forEach(function (x) { var right = x.value === name[x.dataset.j][1]; if (!right) ok = false; x.parentNode.classList.add(right ? "is-right" : "is-wrong"); x.disabled = true; });
          if (ok) score++;
          root.querySelector(".tk-head span:last-child").textContent = k("score", score);
          res.className = "quiz-result " + (ok ? "ok" : "bad");
          res.textContent = (ok ? k("right") : k("wrong")) + " " + name.map(function (p) { return p[0] + " — " + R[p[1]]; }).join("; ") + ".";
          c.remove();
          if (i + 1 < ROUNDS) { var n = btn(k("next")); n.addEventListener("click", function () { i++; show(); }); nav.appendChild(n); }
          else { res.textContent += " " + k("result", score, ROUNDS, PASS); if (score >= PASS) complete(root); var a = btn(k("again"), "btn-ghost"); a.addEventListener("click", start); nav.appendChild(a); }
        });
      }
      start();
    },

    tPtPx: function (root) {
      var gens = [
        function () { var p = pick([9, 10.5, 12, 14, 18, 24, 36]); return { q: L("Кегль в текстовом редакторе — " + num(p, 1) + " pt. Какому значению в CSS-пикселях он соответствует?", "A word processor uses " + p + " pt. What is it in CSS pixels?"), answer: p * 4 / 3, tol: 0.1, unit: "px", ex: L("1 pt = 4/3 px, так как 1 pt = 1/72 дюйма, а 1 px = 1/96 дюйма.", "1 pt = 4/3 px because 1 pt = 1/72 inch and 1 px = 1/96 inch.") }; },
        function () { var x = pick([16, 20, 24, 32]); return { q: L("Кегль на сайте — " + x + " px. Сколько это пунктов?", "The site uses " + x + " px. How many points is that?"), answer: x * 0.75, tol: 0.1, unit: "pt", ex: L("1 px = 0,75 pt.", "1 px = 0.75 pt.") }; },
        function () { var w = pick([360, 375, 390, 414]), d = pick([2, 3]); return { q: L("Ширина области просмотра смартфона — " + w + " CSS px, device pixel ratio — " + d + ". Сколько физических пикселей экрана приходится на эту ширину?", "A phone viewport is " + w + " CSS px wide with a device pixel ratio of " + d + ". How many physical pixels is that?"), answer: w * d, tol: 0, unit: L("пикс.", "px"), ex: L("CSS-пиксель отображается DPR × DPR физическими пикселями; по ширине — DPR пикселями.", "A CSS pixel is drawn with DPR × DPR physical pixels; DPR pixels across.") }; },
        function () { return { q: L("WCAG считает крупным обычный текст от 18 pt. Каков этот порог в CSS-пикселях?", "WCAG treats regular text from 18 pt as large. What is that threshold in CSS pixels?"), answer: 24, tol: 0.1, unit: "px", ex: L("18 × 4/3 = 24 px.", "18 × 4/3 = 24 px.") }; },
        function () { return { q: L("Полужирный текст считается крупным по WCAG от 14 pt. Каков этот порог в CSS-пикселях?", "Bold text counts as large in WCAG from 14 pt. What is that threshold in CSS pixels?"), answer: 14 * 4 / 3, tol: 0.1, unit: "px", ex: L("14 × 4/3 ≈ 18,67 px.", "14 × 4/3 ≈ 18.67 px.") }; },
        function () { var x = pick([12, 16, 18]); return { q: L("Кегль задан как " + num(x / 16, 3) + " rem, корневой кегль — 16 px. Сколько это пунктов?", "The size is " + (x / 16) + " rem with a 16 px root. How many points is that?"), answer: x * 0.75, tol: 0.1, unit: "pt", ex: L(num(x / 16, 3) + " rem = " + x + " px = " + num(x * 0.75, 2) + " pt.", (x / 16) + " rem = " + x + " px = " + x * 0.75 + " pt.") }; }
      ];
      var order;
      drill(root, { rounds: 6, pass: 5, gen: function (n) { if (n === 0) order = shuffle(gens); return order[n](); } });
    }
  });

  window.TaskKit = { complete: complete };
})();
