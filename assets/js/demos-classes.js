/* Demos for module 2 “Type classification”: specimens, contrast axis, class trainer, generic families, tabular figures. MIT License. */
(function () {
  "use strict";

  var S = {
    ru: {
      pangram: "Съешь же ещё этих мягких французских булок да выпей чаю",
      reveal: "Показать классификацию", hide: "Скрыть классификацию",
      specNote: "Оцените стилистическую тональность каждого образца до того, как откроете классификацию.",
      axisNote: "Ось контраста — воображаемая линия, проходящая через наиболее тонкие участки овала. У антиквы старого стиля она наклонена, у классицистической антиквы вертикальна; у брусковых шрифтов контраст минимален.",
      round: function (a, b) { return "Образец " + a + " из " + b; },
      score: function (a) { return "Верных ответов: " + a; },
      right: "Верно.", wrong: "Неверно.",
      thisIs: function (f, c, sub) { return "Это " + f + " — " + c.toLowerCase() + (sub && sub !== c.toLowerCase() ? " (" + sub + ")" : "") + "."; },
      next: "Следующий образец", restart: "Начать заново",
      final: function (a, b) { return "Результат: " + a + " из " + b + ". " + (a >= b * 0.8 ? "Классы шрифтов различаются уверенно." : "Рекомендуется повторить карточки об антикве и гротесках и пройти тренажёр ещё раз."); },
      trainerSample: "Типографика · Typography 2026",
      stackNote: "Фактическое отображение зависит от операционной системы и настроек браузера. Если ключевое слово не поддерживается, браузер использует шрифт по умолчанию.",
      tabCaption: ["Пропорциональные цифры", "font-variant-numeric: tabular-nums", "Моноширинный шрифт"]
    },
    en: {
      pangram: "Sphinx of black quartz, judge my vow; the five boxing wizards jump quickly",
      reveal: "Show classification", hide: "Hide classification",
      specNote: "Assess the stylistic tone of each sample before revealing the classification.",
      axisNote: "The axis of contrast is an imaginary line through the thinnest parts of the oval. In old-style serifs it is inclined, in didones vertical; slab serifs show minimal contrast.",
      round: function (a, b) { return "Sample " + a + " of " + b; },
      score: function (a) { return "Correct answers: " + a; },
      right: "Correct.", wrong: "Incorrect.",
      thisIs: function (f, c, sub) { return "This is " + f + " — " + c.toLowerCase() + (sub && sub !== c.toLowerCase() ? " (" + sub + ")" : "") + "."; },
      next: "Next sample", restart: "Start again",
      final: function (a, b) { return "Result: " + a + " of " + b + ". " + (a >= b * 0.8 ? "You distinguish type classes confidently." : "Review the cards on serifs and sans and take the trainer again."); },
      trainerSample: "Typography · Типографика 2026",
      stackNote: "The actual rendering depends on the operating system and browser settings. If a keyword is not supported, the browser falls back to its default font.",
      tabCaption: ["Proportional figures", "font-variant-numeric: tabular-nums", "Monospaced font"]
    }
  };
  function s(k) { var v = S[App.lang][k]; return typeof v === "function" ? v.apply(null, Array.prototype.slice.call(arguments, 1)) : v; }
  var esc = function (x) { return App.esc(x); };
  var T = function (k) { return App.T(k); };
  var CLASSES = ["serif", "slab", "sans", "mono", "display", "script"];

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function byId(id) { return window.FONTS.find(function (f) { return f.id === id; }); }

  Object.assign(window.Demos, {

    /* one sentence, representatives of each subclass; labels hidden until revealed */
    specimen: function (root) {
      var ids = ["eb-garamond", "pt-serif", "playfair-display", "literata", "roboto-slab", "oswald", "inter", "pt-sans", "montserrat", "jetbrains-mono", "unbounded", "caveat"];
      root.innerHTML = '<button type="button" class="btn btn-ghost btn-sm" id="spcBtn">' + esc(s("reveal")) + "</button>" +
        '<div class="spec-grid">' + ids.map(function (id) {
          var f = byId(id);
          return '<figure class="spec-cell"><p style="font-family:\'' + f.family + '\'">' + esc(s("pangram")) + '</p><figcaption hidden>' +
            esc(f.family) + " · " + esc(T("fontClass")[f.cls]) + (f.cls === "serif" || f.cls === "sans" ? " · " + esc(T("fontSub")[f.sub]) : "") + "</figcaption></figure>";
        }).join("") + '</div><p class="demo-note">' + esc(s("specNote")) + "</p>";
      var btn = root.querySelector("#spcBtn"), shown = false;
      btn.addEventListener("click", function () {
        shown = !shown;
        root.querySelectorAll(".spec-cell figcaption").forEach(function (c) { c.hidden = !shown; });
        btn.textContent = shown ? s("hide") : s("reveal");
      });
    },

    /* large glyphs to compare axis of contrast and serifs */
    contrastaxis: function (root) {
      var ids = ["eb-garamond", "pt-serif", "playfair-display", "roboto-slab"];
      root.innerHTML = '<div class="axis-grid">' + ids.map(function (id) {
        var f = byId(id);
        return '<figure class="demo-cell axis-cell"><figcaption>' + esc(f.family) + " · " + esc(T("fontSub")[f.sub]) + '</figcaption><span style="font-family:\'' + f.family + '\'">oe</span></figure>';
      }).join("") + '</div><p class="demo-note">' + esc(s("axisNote")) + "</p>";
    },

    /* class trainer on random fonts */
    guess: function (root) {
      var ROUNDS = 10, order, i, score, answered;
      function start() { order = shuffle(window.FONTS).slice(0, ROUNDS); i = 0; score = 0; show(); }
      function show() {
        answered = false;
        var f = order[i];
        root.innerHTML = '<div class="guess-head"><span>' + esc(s("round", i + 1, ROUNDS)) + "</span><span>" + esc(s("score", score)) + "</span></div>" +
          '<div class="demo-frame guess-frame"><p class="guess-big" style="font-family:\'' + f.family + '\'">' + esc(s("trainerSample")) + '</p><p class="guess-small" style="font-family:\'' + f.family + '\'">' + esc(s("pangram")) + "</p></div>" +
          '<div class="guess-opts">' + CLASSES.map(function (c) { return '<button type="button" class="btn btn-ghost btn-sm" data-c="' + c + '">' + esc(T("fontClass")[c]) + "</button>"; }).join("") + "</div>" +
          '<p class="quiz-result guess-res" role="status"></p><div class="guess-next"></div>';
        root.querySelectorAll(".guess-opts button").forEach(function (b) {
          b.addEventListener("click", function () {
            if (answered) return; answered = true;
            var ok = b.dataset.c === f.cls; if (ok) score++;
            b.classList.add(ok ? "is-right" : "is-wrong");
            root.querySelector('.guess-opts [data-c="' + f.cls + '"]').classList.add("is-right");
            var res = root.querySelector(".guess-res");
            res.className = "quiz-result guess-res " + (ok ? "ok" : "bad");
            res.textContent = (ok ? s("right") : s("wrong")) + " " + s("thisIs", f.family, T("fontClass")[f.cls], (f.cls === "serif" || f.cls === "sans") ? T("fontSub")[f.sub] : "");
            root.querySelector(".guess-head span:last-child").textContent = s("score", score);
            var nx = document.createElement("button");
            nx.type = "button"; nx.className = "btn btn-primary btn-sm";
            if (i + 1 < ROUNDS) { nx.textContent = s("next"); nx.addEventListener("click", function () { i++; show(); }); }
            else {
              res.textContent += " " + s("final", score, ROUNDS);
              nx.textContent = s("restart"); nx.addEventListener("click", start);
            }
            root.querySelector(".guess-next").appendChild(nx);
          });
        });
      }
      start();
    },

    /* CSS generic font families rendered by the current system */
    stacks: function (root) {
      var gens = ["system-ui", "ui-serif", "ui-sans-serif", "ui-monospace", "ui-rounded", "serif", "sans-serif", "monospace", "cursive", "fantasy"];
      root.innerHTML = '<div class="demo-frame stack-list">' + gens.map(function (g) {
        return '<div class="stack-row"><code>' + g + '</code><span style="font-family:' + g + '">Съешь ещё этих мягких булок · Typography 0123</span></div>';
      }).join("") + '</div><p class="demo-note">' + esc(s("stackNote")) + "</p>";
    },

    /* proportional vs tabular figures */
    tabular: function (root) {
      var nums = ["1 111,11", "98 765,40", "7 410,00", "41 101,19", "500,05"];
      var cols = [["font-family:Inter", 0], ["font-family:Inter;font-variant-numeric:tabular-nums", 1], ["font-family:'JetBrains Mono'", 2]];
      root.innerHTML = '<div class="demo-grid tab-grid">' + cols.map(function (c) {
        return '<figure class="demo-cell"><figcaption><code>' + esc(s("tabCaption")[c[1]]) + '</code></figcaption><div class="tab-col" style="' + c[0] + '">' +
          nums.map(function (n) { return "<div>" + n.replace(/ /g, "&nbsp;") + " ₽</div>"; }).join("") + "</div></figure>";
      }).join("") + "</div>";
    }
  });
})();
