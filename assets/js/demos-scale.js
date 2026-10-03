/* Demos for module 5 “Type scale and hierarchy”. MIT License. */
(function () {
  "use strict";

  var RATIOS = [
    [1.067, { ru: "малая секунда", en: "minor second" }],
    [1.125, { ru: "большая секунда", en: "major second" }],
    [1.2, { ru: "малая терция", en: "minor third" }],
    [1.25, { ru: "большая терция", en: "major third" }],
    [1.333, { ru: "чистая кварта", en: "perfect fourth" }],
    [1.414, { ru: "увеличенная кварта", en: "augmented fourth" }],
    [1.5, { ru: "чистая квинта", en: "perfect fifth" }],
    [1.618, { ru: "золотое сечение", en: "golden ratio" }]
  ];
  var STEPS = [[-2, "caption"], [-1, "small"], [0, "body"], [1, "h4"], [2, "h3"], [3, "h2"], [4, "h1"], [5, "display"]];

  var S = {
    ru: {
      modes: ["Без иерархии", "Только кегль", "Кегль, насыщенность, цвет и отступы"],
      kicker: "Исследование", h1: "Как типографика влияет на скорость чтения",
      lead: "Параметры набора определяют, насколько быстро читатель находит нужную информацию и насколько долго сохраняет внимание.",
      h2: "Методика",
      body: "Участникам предлагали прочитать один и тот же текст в нескольких вариантах вёрстки и ответить на вопросы по содержанию.",
      caption: "Таблица 1. Средняя скорость чтения, слов в минуту",
      base: "Базовый кегль", ratio: "Коэффициент", font: "Гарнитура", sample: "Типографическая шкала",
      vw: "Ширина окна (моделирование)",
      fluidNote: "Минимум: 320 px, кегль 16 px, коэффициент 1.2. Максимум: 1440 px, кегль 18 px, коэффициент 1.333. Между этими значениями каждая ступень изменяется линейно.",
      eq: "Равные отступы над и под заголовком", asym: "Отступ над заголовком больше, чем под ним",
      auditNote: "Образец содержит типичные ошибки построения иерархии."
    },
    en: {
      modes: ["No hierarchy", "Size only", "Size, weight, colour and spacing"],
      kicker: "Research", h1: "How typography affects reading speed",
      lead: "Typesetting parameters determine how quickly readers find information and how long they stay attentive.",
      h2: "Method",
      body: "Participants read the same text in several layout variants and answered questions about its content.",
      caption: "Table 1. Mean reading speed, words per minute",
      base: "Base size", ratio: "Ratio", font: "Typeface", sample: "Typographic scale",
      vw: "Viewport width (simulated)",
      fluidNote: "Minimum: 320 px viewport, 16 px base, ratio 1.2. Maximum: 1440 px, 18 px base, ratio 1.333. Between them each step changes linearly.",
      eq: "Equal space above and below the heading", asym: "More space above the heading than below",
      auditNote: "The sample contains typical hierarchy errors."
    }
  };
  function s(k) { return S[App.lang][k]; }
  var esc = function (x) { return App.esc(x); };
  function r2(x) { return Math.round(x * 100) / 100; }
  function r4(x) { return +x.toFixed(4); }

  function article(cls) {
    return '<article class="hz ' + cls + '">' +
      '<p class="hz-kicker">' + esc(s("kicker")) + '</p><h3 class="hz-h1">' + esc(s("h1")) + '</h3>' +
      '<p class="hz-lead">' + esc(s("lead")) + '</p><h4 class="hz-h2">' + esc(s("h2")) + '</h4>' +
      '<p class="hz-body">' + esc(s("body")) + '</p><p class="hz-caption">' + esc(s("caption")) + "</p></article>";
  }

  Object.assign(window.Demos, {

    hierarchy: function (root) {
      var modes = ["hz-flat", "hz-size", "hz-full"];
      root.innerHTML = '<div class="seg" role="radiogroup">' + s("modes").map(function (m, i) {
        return '<button type="button" role="radio" aria-checked="' + (i === 0) + '" data-i="' + i + '">' + esc(m) + "</button>";
      }).join("") + '</div><div class="demo-frame hz-frame">' + article("hz-flat") + "</div>";
      var art = root.querySelector(".hz");
      root.querySelectorAll(".seg button").forEach(function (b) {
        b.addEventListener("click", function () {
          root.querySelectorAll(".seg button").forEach(function (x) { x.setAttribute("aria-checked", String(x === b)); });
          art.className = "hz " + modes[b.dataset.i];
        });
      });
    },

    scalegen: function (root) {
      var fonts = ["Inter", "PT Serif", "Montserrat", "Literata", "Golos Text", "Playfair Display"];
      root.innerHTML = '<div class="demo-row three">' +
        '<label class="ctl"><span class="ctl-head"><span>' + esc(s("base")) + '</span></span><select id="sgBase">' + [16, 17, 18, 20].map(function (v) { return "<option" + (v === 16 ? " selected" : "") + ">" + v + "</option>"; }).join("") + "</select></label>" +
        '<label class="ctl"><span class="ctl-head"><span>' + esc(s("ratio")) + '</span></span><select id="sgRatio">' + RATIOS.map(function (r) { return '<option value="' + r[0] + '"' + (r[0] === 1.25 ? " selected" : "") + ">" + r[0] + " — " + r[1][App.lang] + "</option>"; }).join("") + "</select></label>" +
        '<label class="ctl"><span class="ctl-head"><span>' + esc(s("font")) + '</span></span><select id="sgFont">' + fonts.map(function (f) { return "<option>" + f + "</option>"; }).join("") + "</select></label>" +
        '</div><div class="demo-frame sg-list"></div><pre class="code"><code id="sgCode"></code></pre>';
      var base = root.querySelector("#sgBase"), ratio = root.querySelector("#sgRatio"), fnt = root.querySelector("#sgFont");
      function upd() {
        var b = Number(base.value), r = Number(ratio.value);
        var rows = STEPS.slice().reverse().map(function (st) {
          var px = b * Math.pow(r, st[0]);
          return { n: st[0], name: st[1], px: px, rem: px / 16 };
        });
        root.querySelector(".sg-list").innerHTML = rows.map(function (x) {
          return '<div class="sg-row"><span class="sg-meta"><b>' + x.name + "</b> · step " + x.n + "<br>" + r2(x.px) + " px · " + r4(x.rem) + ' rem</span><span class="sg-sample" style="font-family:\'' + fnt.value + '\';font-size:' + x.px + 'px;font-weight:' + (x.n > 0 ? 700 : 400) + '">' + esc(s("sample")) + "</span></div>";
        }).join("");
        root.querySelector("#sgCode").textContent = ":root {\n" + rows.slice().reverse().map(function (x) {
          return "  --step-" + (x.n < 0 ? "n" + (-x.n) : x.n) + ": " + r4(x.rem) + "rem;  /* " + r2(x.px) + "px · " + x.name + " */";
        }).join("\n") + "\n}";
      }
      [base, ratio, fnt].forEach(function (e) { e.addEventListener("change", upd); });
      upd();
    },

    fluidscale: function (root) {
      var MIN = { w: 320, b: 16, r: 1.2 }, MAX = { w: 1440, b: 18, r: 1.333 };
      root.innerHTML = '<label class="ctl" for="fsVw"><span class="ctl-head"><span>' + esc(s("vw")) + '</span><output id="fsVwOut"></output></span><input type="range" id="fsVw" min="320" max="1440" step="10" value="390"></label>' +
        '<div class="demo-frame sg-list" id="fsList"></div><p class="demo-note">' + esc(s("fluidNote")) + '</p><pre class="code"><code id="fsCode"></code></pre>';
      var vw = root.querySelector("#fsVw");
      var steps = STEPS.filter(function (x) { return x[0] >= 0 && x[0] <= 4; }).reverse();
      function calc(n) {
        var a = MIN.b * Math.pow(MIN.r, n), z = MAX.b * Math.pow(MAX.r, n);
        var slope = (z - a) / (MAX.w - MIN.w), icpt = a - slope * MIN.w;
        return { min: a, max: z, slope: slope, icpt: icpt };
      }
      function upd() {
        var w = Number(vw.value);
        root.querySelector("#fsVwOut").textContent = w + " px";
        root.querySelector("#fsList").innerHTML = steps.map(function (st) {
          var c = calc(st[0]), px = Math.min(c.max, Math.max(c.min, c.icpt + c.slope * w));
          return '<div class="sg-row"><span class="sg-meta"><b>' + st[1] + "</b><br>" + r2(px) + ' px</span><span class="sg-sample" style="font-family:Inter;font-size:' + px + 'px;font-weight:' + (st[0] > 0 ? 700 : 400) + '">' + esc(s("sample")) + "</span></div>";
        }).join("");
        root.querySelector("#fsCode").textContent = ":root {\n" + steps.slice().reverse().map(function (st) {
          var c = calc(st[0]);
          return "  --step-" + st[0] + ": clamp(" + r4(c.min / 16) + "rem, " + r4(c.icpt / 16) + "rem + " + r4(c.slope * 100) + "vw, " + r4(c.max / 16) + "rem);";
        }).join("\n") + "\n}";
      }
      vw.addEventListener("input", upd); upd();
    },

    proximity: function (root) {
      function block(cls, label) {
        return '<figure class="demo-cell"><figcaption>' + esc(label) + '</figcaption><div class="px ' + cls + '"><p>' + esc(s("lead")) + "</p><h4>" + esc(s("h2")) + "</h4><p>" + esc(s("body")) + "</p></div></figure>";
      }
      root.innerHTML = '<div class="demo-grid demo-grid-2">' + block("px-eq", s("eq")) + block("px-asym", s("asym")) + "</div>";
    },

    audit: function (root) {
      root.innerHTML = '<div class="demo-frame">' + article("hz-bad") + '</div><p class="demo-note">' + esc(s("auditNote")) + "</p>";
    }
  });
})();
