/* Interactive demos used inside lesson cards. Each takes its container element. MIT License. */
(function () {
  "use strict";

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");

  /* Estimate characters per line of a text element from its real font metrics. */
  function charsPerLine(el) {
    var cs = getComputedStyle(el);
    ctx.font = cs.fontStyle + " " + cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
    var text = el.textContent.replace(/\s+/g, " ").trim();
    if (!text) return 0;
    var ls = parseFloat(cs.letterSpacing) || 0;
    var avg = ctx.measureText(text).width / text.length + ls;
    return Math.max(1, Math.round(el.clientWidth / avg));
  }
  window.TypeUtil = { charsPerLine: charsPerLine };

  var S = {
    ru: {
      width: "Ширина строки", leading: "Интерлиньяж",
      chars: function (n) { return "≈ " + n + " знаков в строке"; },
      short: "Строка слишком коротка: частые переводы строки прерывают чтение.",
      long: "Строка слишком длинна: затрудняется переход к началу следующей строки.",
      ok: function (a, b) { return "Длина строки в пределах рекомендуемого диапазона " + a + "–" + b + " знаков" + (a < 45 ? " (норма для мобильных устройств)." : "."); },
      tight: "Интерлиньяж недостаточен: строки визуально сливаются.",
      loose: "Интерлиньяж избыточен: текстовый блок утрачивает целостность.",
      fine: "Интерлиньяж обеспечивает целостное восприятие текстового блока.",
      text: "Типографика определяет условия восприятия письменной информации. Удобочитаемость текста зависит от совокупности параметров набора: кегля, интерлиньяжа и длины строки. Эти параметры взаимосвязаны, поэтому изменение одного из них, как правило, требует пересмотра остальных. Хорошо организованный набор остаётся незаметным для читателя, тогда как ошибки ведут к быстрой утомляемости и снижению понимания."
    },
    en: {
      width: "Line width", leading: "Line height",
      chars: function (n) { return "≈ " + n + " characters per line"; },
      short: "The line is too short: frequent line breaks interrupt reading.",
      long: "The line is too long: the return to the next line becomes harder.",
      ok: function (a, b) { return "Line length is within the recommended range of " + a + "–" + b + " characters" + (a < 45 ? " (the norm for mobile devices)." : "."); },
      tight: "Line height is insufficient: lines merge visually.",
      loose: "Line height is excessive: the text block loses coherence.",
      fine: "Line height supports a coherent text block.",
      text: "Typography defines the conditions under which written information is perceived. Readability depends on a set of typesetting parameters: font size, line height and line length. These parameters are interdependent, so changing one usually requires reconsidering the others. Well-organised typesetting remains unnoticed by the reader, whereas errors lead to rapid fatigue and reduced comprehension."
    }
  };
  function s(k) { var v = S[App.lang][k]; return typeof v === "function" ? v.apply(null, Array.prototype.slice.call(arguments, 1)) : v; }

  function slider(id, label, min, max, step, value, unit) {
    return '<label class="ctl" for="' + id + '"><span class="ctl-head"><span>' + label + '</span><output id="' + id + 'Out"></output></span>' +
      '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '" data-unit="' + (unit || "") + '"></label>';
  }

  window.Demos = {
    measure: function (root) {
      root.innerHTML = slider("dmW", s("width"), 18, 130, 1, 110, "ch") +
        '<div class="demo-frame"><p class="demo-text" id="dmText">' + App.esc(s("text")) + "</p></div>" +
        '<p class="demo-verdict" id="dmVerdict" role="status"></p>';
      var input = root.querySelector("#dmW"), out = root.querySelector("#dmWOut");
      var p = root.querySelector("#dmText"), verdict = root.querySelector("#dmVerdict");
      function upd() {
        p.style.maxWidth = input.value + "ch";
        var n = charsPerLine(p);
        out.textContent = s("chars", n);
        var narrow = root.clientWidth < 520, lo = narrow ? 35 : 45, hi = narrow ? 50 : 75;
        var state = n < lo ? "short" : n > hi ? "long" : "ok";
        verdict.textContent = s(state, lo, hi);
        verdict.dataset.state = state === "ok" ? "good" : "warn";
      }
      input.addEventListener("input", upd);
      window.addEventListener("resize", upd);
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(upd);
      upd();
    },

    leading: function (root) {
      root.innerHTML = slider("dmL", s("leading"), 0.9, 2.6, 0.05, 1.0) +
        '<div class="demo-frame"><p class="demo-text" id="dmLText" style="max-width:62ch">' + App.esc(s("text")) + "</p></div>" +
        '<p class="demo-verdict" id="dmLVerdict" role="status"></p>';
      var input = root.querySelector("#dmL"), out = root.querySelector("#dmLOut");
      var p = root.querySelector("#dmLText"), verdict = root.querySelector("#dmLVerdict");
      function upd() {
        var v = parseFloat(input.value);
        p.style.lineHeight = v;
        out.textContent = v.toFixed(2);
        var state = v < 1.35 ? "tight" : v > 1.85 ? "loose" : "fine";
        verdict.textContent = s(state);
        verdict.dataset.state = state === "fine" ? "good" : "warn";
      }
      input.addEventListener("input", upd);
      upd();
    }
  };
})();
