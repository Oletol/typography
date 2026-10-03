/* Web-specific demos for lesson cards (CSS units, inheritance, wrapping, WCAG spacing). MIT License. */
(function () {
  "use strict";

  var S = {
    ru: {
      chNote: "Все четыре абзаца ограничены одинаковой шириной: max-width: 32ch, кегль 16 px.",
      chars: function (n) { return "≈ " + n + " знаков в строке"; },
      inhBad: "line-height: 1.2em у родителя",
      inhGood: "line-height: 1.2 у родителя",
      inhHead: "Заголовок в две строки",
      inhText: "Основной текст 16 px: интерлиньяж в обоих случаях одинаков.",
      xhSize: "Кегль у всех шрифтов",
      xhNote: function (n) { return "высота строчных ≈ " + n + " px"; },
      xhText: "Съешь ещё этих мягких булок",
      remSetting: "Размер шрифта в настройках браузера",
      remPx: "font-size: 16px — не меняется",
      remRem: "font-size: 1rem — масштабируется вместе с настройкой",
      remNote: "Моделирование: в пределах рамки изменяется базовый размер шрифта так же, как при изменении соответствующей настройки браузера.",
      wrapWidth: "Ширина колонки",
      wrapBalance: "text-wrap: balance для заголовка",
      wrapPretty: "text-wrap: pretty для абзаца",
      wrapHyph: "hyphens: auto (lang=\"ru\")",
      wrapNote: "Если переносы не отображаются, браузер не располагает словарём переносов для данного языка; это ограничение также следует учитывать.",
      wrapHead: "Как выбрать шрифт для интернет-магазина детских книг",
      wrapText: "Типографические предпочтения пользователей интернет-магазинов формируются постепенно: покупатели привыкают к определённой интонации интерфейса и ожидают предсказуемости.",
      spApply: "Применить интервалы WCAG 1.4.12",
      spRemove: "Вернуть исходные интервалы",
      spFixed: "height: 7.5rem",
      spMin: "min-height: 7.5rem",
      spText: ["Бесплатная доставка от 2000 ₽ по всей России.", "Возврат в течение 30 дней без объяснения причин."]
    },
    en: {
      chNote: "All four paragraphs share the same width: max-width: 32ch, 16 px font size.",
      chars: function (n) { return "≈ " + n + " characters per line"; },
      inhBad: "line-height: 1.2em on the parent",
      inhGood: "line-height: 1.2 on the parent",
      inhHead: "A heading that wraps onto two lines",
      inhText: "Body text at 16 px: its line height is identical in both cases.",
      xhSize: "Font size for every typeface",
      xhNote: function (n) { return "x-height ≈ " + n + " px"; },
      xhText: "Pack my box with five dozen jugs",
      remSetting: "Font size in browser settings",
      remPx: "font-size: 16px — stays the same",
      remRem: "font-size: 1rem — scales with the setting",
      remNote: "Simulation: within the frame the base font size changes as it would when the corresponding browser setting is changed.",
      wrapWidth: "Column width",
      wrapBalance: "text-wrap: balance on the heading",
      wrapPretty: "text-wrap: pretty on the paragraph",
      wrapHyph: "hyphens: auto (lang=\"en\")",
      wrapNote: "If no hyphens appear, the browser lacks a hyphenation dictionary for this language; this limitation should also be taken into account.",
      wrapHead: "How to choose a typeface for an online children's bookshop",
      wrapText: "Typographic expectations of online shoppers develop gradually: customers get used to a particular interface voice and anticipate predictability throughout their experience.",
      spApply: "Apply WCAG 1.4.12 spacing",
      spRemove: "Restore original spacing",
      spFixed: "height: 7.5rem",
      spMin: "min-height: 7.5rem",
      spText: ["Free delivery on orders over £20.", "Returns within 30 days, no questions asked."]
    }
  };
  function s(k) { var v = S[App.lang][k]; return typeof v === "function" ? v.apply(null, Array.prototype.slice.call(arguments, 1)) : v; }
  var esc = function (x) { return App.esc(x); };
  var ready = document.fonts ? document.fonts.ready : Promise.resolve();

  var RU = "Типографика помогает читателю: хорошо набранный текст не утомляет глаза и позволяет сосредоточиться на смысле, а не на поиске следующей строки.";
  var EN = "Typography serves the reader: well-set text does not tire the eyes and lets attention stay on the meaning rather than on hunting for the next line.";

  var canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");

  Object.assign(window.Demos, {

    /* same max-width in ch, different fonts and languages */
    chcompare: function (root) {
      var cells = [["Inter", "RU", RU], ["Inter", "EN", EN], ["PT Serif", "RU", RU], ["PT Serif", "EN", EN]];
      root.innerHTML = '<p class="demo-note">' + esc(s("chNote")) + '</p><div class="demo-grid demo-grid-2">' +
        cells.map(function (c) {
          return '<figure class="demo-cell"><figcaption>' + c[0] + " · " + c[1] + ' · <output></output></figcaption>' +
            '<p lang="' + c[1].toLowerCase() + '" style="font-family:\'' + c[0] + '\';font-size:16px;line-height:1.5;max-width:32ch;margin:0">' + esc(c[2]) + "</p></figure>";
        }).join("") + "</div>";
      function upd() {
        root.querySelectorAll(".demo-cell").forEach(function (f) {
          f.querySelector("output").textContent = s("chars", window.TypeUtil.charsPerLine(f.querySelector("p")));
        });
      }
      ready.then(upd); upd();
    },

    /* inherited line-height: em vs unitless */
    lhinherit: function (root) {
      function box(lh, label, bad) {
        return '<figure class="demo-cell ' + (bad ? "is-bad" : "is-good") + '"><figcaption><code>' + esc(label) + "</code></figcaption>" +
          '<div style="font-size:16px;line-height:' + lh + '">' +
            '<h3 style="font-size:28px;line-height:inherit;margin:0 0 8px;max-width:11em;font-family:var(--ui)">' + esc(s("inhHead")) + "</h3>" +
            '<p style="margin:0">' + esc(s("inhText")) + "</p></div></figure>";
      }
      root.innerHTML = '<div class="demo-grid">' + box("1.2em", s("inhBad"), true) + box("1.2", s("inhGood"), false) + "</div>";
    },

    /* same font-size, different x-heights */
    xheight: function (root) {
      var fonts = ["Inter", "PT Serif", "Montserrat", "Literata", "Caveat"];
      root.innerHTML = '<label class="ctl" for="xhSize"><span class="ctl-head"><span>' + esc(s("xhSize")) + '</span><output id="xhSizeOut"></output></span>' +
        '<input type="range" id="xhSize" min="14" max="32" step="1" value="20"></label>' +
        '<div class="demo-frame xh-list">' + fonts.map(function (f) {
          return '<div class="xh-row"><span class="xh-name">' + f + '</span><span class="xh-sample" style="font-family:\'' + f + '\'">' + esc(s("xhText")) + '</span><output class="xh-out"></output></div>';
        }).join("") + "</div>";
      var input = root.querySelector("#xhSize");
      function upd() {
        var px = Number(input.value);
        root.querySelector("#xhSizeOut").textContent = px + " px";
        root.querySelectorAll(".xh-row").forEach(function (r) {
          var sample = r.querySelector(".xh-sample");
          sample.style.fontSize = px + "px";
          // measure at a large size to avoid pixel hinting, then scale down
          ctx.font = "400 200px '" + r.querySelector(".xh-name").textContent + "'";
          var m = ctx.measureText("x");
          r.querySelector(".xh-out").textContent = s("xhNote", ((m.actualBoundingBoxAscent || 0) * px / 200).toFixed(1));
        });
      }
      input.addEventListener("input", upd);
      ready.then(function () {
        var names = ["Inter", "PT Serif", "Montserrat", "Literata", "Caveat"];
        return Promise.all(names.map(function (n) { return document.fonts.load("400 20px '" + n + "'", "xх"); }));
      }).then(upd);
      upd();
    },

    /* simulated browser font-size setting: px vs rem */
    remsim: function (root) {
      var sizes = [16, 20, 24];
      root.innerHTML = '<p class="ctl-head" style="margin-bottom:8px"><span>' + esc(s("remSetting")) + '</span></p>' +
        '<div class="seg" role="radiogroup">' + sizes.map(function (v, i) {
          return '<button type="button" role="radio" aria-checked="' + (i === 0) + '" data-v="' + v + '">' + v + " px</button>";
        }).join("") + "</div>" +
        '<div class="demo-frame rem-frame" style="font-size:16px">' +
          '<p style="font-size:16px;margin:0 0 10px"><code>' + esc(s("remPx")) + "</code></p>" +
          '<p style="font-size:1em;margin:0"><code>' + esc(s("remRem")) + "</code></p></div>" +
        '<p class="demo-note">' + esc(s("remNote")) + "</p>";
      var frame = root.querySelector(".rem-frame");
      root.querySelectorAll(".seg button").forEach(function (b) {
        b.addEventListener("click", function () {
          root.querySelectorAll(".seg button").forEach(function (x) { x.setAttribute("aria-checked", String(x === b)); });
          frame.style.fontSize = b.dataset.v + "px";
        });
      });
    },

    /* text-wrap balance / pretty and hyphens in a narrow column */
    wrap: function (root) {
      var lang = App.lang;
      root.innerHTML =
        '<label class="ctl" for="wrW"><span class="ctl-head"><span>' + esc(s("wrapWidth")) + '</span><output id="wrWOut"></output></span>' +
        '<input type="range" id="wrW" min="14" max="40" step="1" value="22"></label>' +
        '<div class="toggles">' +
          '<label><input type="checkbox" id="wrB"> <code>' + esc(s("wrapBalance")) + "</code></label>" +
          '<label><input type="checkbox" id="wrP"> <code>' + esc(s("wrapPretty")) + "</code></label>" +
          '<label><input type="checkbox" id="wrH"> <code>' + esc(s("wrapHyph")) + "</code></label>" +
        "</div>" +
        '<div class="demo-frame"><div class="wrap-col" lang="' + lang + '">' +
          '<h3 class="wrap-h">' + esc(s("wrapHead")) + "</h3>" +
          '<p class="wrap-p">' + esc(s("wrapText")) + "</p></div></div>" +
        '<p class="demo-note">' + esc(s("wrapNote")) + "</p>";
      var col = root.querySelector(".wrap-col"), h = root.querySelector(".wrap-h"), p = root.querySelector(".wrap-p");
      var w = root.querySelector("#wrW");
      function upd() {
        col.style.maxWidth = w.value + "ch";
        root.querySelector("#wrWOut").textContent = w.value + "ch";
        h.style.textWrap = root.querySelector("#wrB").checked ? "balance" : "wrap";
        p.style.textWrap = root.querySelector("#wrP").checked ? "pretty" : "wrap";
        p.style.hyphens = root.querySelector("#wrH").checked ? "auto" : "manual";
        p.style.webkitHyphens = p.style.hyphens;
      }
      root.querySelectorAll("input").forEach(function (i) { i.addEventListener("input", upd); });
      upd();
    },

    /* WCAG 1.4.12 text spacing: fixed height vs min-height */
    spacing: function (root) {
      function card(cls, label) {
        return '<figure class="demo-cell"><figcaption><code>' + esc(label) + '</code></figcaption><div class="sp-card ' + cls + '">' +
          s("spText").map(function (x) { return "<p>" + esc(x) + "</p>"; }).join("") + "</div></figure>";
      }
      root.innerHTML = '<button type="button" class="btn btn-ghost btn-sm" id="spBtn">' + esc(s("spApply")) + "</button>" +
        '<div class="demo-grid sp-grid">' + card("sp-fixed", s("spFixed")) + card("sp-min", s("spMin")) + "</div>";
      var on = false, btn = root.querySelector("#spBtn");
      btn.addEventListener("click", function () {
        on = !on;
        root.querySelector(".sp-grid").classList.toggle("wcag-spacing", on);
        btn.textContent = on ? s("spRemove") : s("spApply");
      });
    }
  });
})();
