/* Demos for module 7 “Responsive and accessible type”. MIT License. */
(function () {
  "use strict";

  function lum(hex) {
    var c = hex.replace("#", ""); if (c.length === 3) c = c.replace(/./g, "$&$&");
    return [0, 2, 4].map(function (i) { var v = parseInt(c.substr(i, 2), 16) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); })
      .reduce(function (s, v, i) { return s + v * [0.2126, 0.7152, 0.0722][i]; }, 0);
  }
  function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function fmt(r) { return (Math.floor(r * 100) / 100).toFixed(2); }
  window.TypeUtil = Object.assign(window.TypeUtil || {}, { contrast: ratio });

  var S = {
    ru: {
      fg: "Цвет текста", bg: "Цвет фона", size: "Кегль", bold: "Полужирное начертание (700)",
      sample: "Удобочитаемость зависит от контраста текста и фона",
      ratio: function (r) { return "Контраст " + r + ":1"; },
      large: "крупный текст по WCAG", normal: "обычный текст по WCAG",
      aa: "AA", aaa: "AAA", pass: "соответствует", fail: "не соответствует",
      presets: "Типичные сочетания",
      p: [["#999999", "#ffffff", "Серый текст на белом"], ["#767676", "#ffffff", "Минимальный серый для AA"], ["#ffffff", "#3d9be9", "Белый на голубом"], ["#a8b0bd", "#ffffff", "Текст-заполнитель"]],
      pure: "Чисто белый на чёрном", soft: "Смягчённая пара",
      darkText: "В тёмной теме максимальный контраст не всегда означает наилучшую удобочитаемость: часть пользователей отмечает эффект ореола вокруг ярких знаков на чёрном фоне.",
      fixed: "Фиксированная ширина 600 px", fluid: "Гибкая колонка, max-width: 65ch",
      reflowText: "При ширине области просмотра 320 CSS px текст должен читаться без горизонтальной прокрутки.",
      gray: "Имитация восприятия без цветового зрения (оттенки серого)",
      linkColor: "Ссылка выделена только цветом", linkLine: "Ссылка выделена цветом и подчёркиванием",
      linkText: function (cls) { return 'Подробные требования приведены в <a class="' + cls + '" href="#" onclick="return false">руководстве по доступности</a>, а примеры — в <a class="' + cls + '" href="#" onclick="return false">библиотеке компонентов</a>.'; },
      linkRatio: function (r) { return "Контраст цвета ссылки с окружающим текстом: " + r + ":1 (рекомендуется не менее 3:1)"; },
      rdDefault: "Исходная вёрстка", rdBda: "По рекомендациям British Dyslexia Association",
      rdText: "Информационные материалы следует оформлять так, чтобы их было удобно читать всем пользователям. Выключка по формату создаёт неравномерные пробелы между словами, а курсив и набор прописными затрудняют распознавание слов. Достаточный интерлиньяж и выравнивание по левому краю облегчают переход от строки к строке."
    },
    en: {
      fg: "Text colour", bg: "Background", size: "Font size", bold: "Bold (700)",
      sample: "Readability depends on text–background contrast",
      ratio: function (r) { return "Contrast " + r + ":1"; },
      large: "large text per WCAG", normal: "normal text per WCAG",
      aa: "AA", aaa: "AAA", pass: "passes", fail: "fails",
      presets: "Typical combinations",
      p: [["#999999", "#ffffff", "Grey on white"], ["#767676", "#ffffff", "Minimum AA grey"], ["#ffffff", "#3d9be9", "White on light blue"], ["#a8b0bd", "#ffffff", "Placeholder text"]],
      pure: "Pure white on black", soft: "Softened pair",
      darkText: "In dark mode maximum contrast is not always best for reading: some users report a halo effect around bright letters on pure black.",
      fixed: "Fixed width 600 px", fluid: "Fluid column, max-width: 65ch",
      reflowText: "At a 320 CSS px viewport, text must be readable without horizontal scrolling.",
      gray: "Simulate perception without colour vision (greyscale)",
      linkColor: "Link distinguished by colour only", linkLine: "Link distinguished by colour and underline",
      linkText: function (cls) { return 'Detailed requirements are given in the <a class="' + cls + '" href="#" onclick="return false">accessibility guide</a>, and examples in the <a class="' + cls + '" href="#" onclick="return false">component library</a>.'; },
      linkRatio: function (r) { return "Contrast between link colour and surrounding text: " + r + ":1 (3:1 or more recommended)"; },
      rdDefault: "Original layout", rdBda: "Following British Dyslexia Association guidance",
      rdText: "Information materials should be designed so that everyone can read them comfortably. Justified text creates uneven word spacing, while italics and all capitals make word recognition harder. Sufficient line spacing and left alignment make it easier to move from line to line."
    }
  };
  function s(k) { var v = S[App.lang][k]; return typeof v === "function" ? v.apply(null, Array.prototype.slice.call(arguments, 1)) : v; }
  var esc = function (x) { return App.esc(x); };

  Object.assign(window.Demos, {

    contrastcheck: function (root) {
      root.innerHTML =
        '<div class="demo-row">' +
          '<label class="ctl"><span class="ctl-head"><span>' + esc(s("fg")) + '</span></span><input type="color" id="ccFg" value="#999999" class="cc-color"></label>' +
          '<label class="ctl"><span class="ctl-head"><span>' + esc(s("bg")) + '</span></span><input type="color" id="ccBg" value="#ffffff" class="cc-color"></label>' +
        "</div>" +
        '<label class="ctl" for="ccSize"><span class="ctl-head"><span>' + esc(s("size")) + '</span><output id="ccSizeOut"></output></span><input type="range" id="ccSize" min="12" max="40" step="1" value="16"></label>' +
        '<label class="toggles"><span><input type="checkbox" id="ccBold"> ' + esc(s("bold")) + "</span></label>" +
        '<p class="ctl-head" style="margin-top:8px"><span>' + esc(s("presets")) + '</span></p><div class="cc-presets">' + s("p").map(function (p, i) {
          return '<button type="button" class="btn btn-ghost btn-sm" data-i="' + i + '"><span class="cc-sw" style="background:' + p[1] + ';color:' + p[0] + '">Aa</span>' + esc(p[2]) + "</button>";
        }).join("") + "</div>" +
        '<div class="cc-sample" id="ccSample"><p>' + esc(s("sample")) + '</p></div>' +
        '<div class="cc-res" id="ccRes"></div>';
      var fg = root.querySelector("#ccFg"), bg = root.querySelector("#ccBg"), sz = root.querySelector("#ccSize"), bd = root.querySelector("#ccBold");
      function upd() {
        var r = ratio(fg.value, bg.value), px = Number(sz.value), bold = bd.checked;
        var large = px >= 24 || (bold && px >= 18.66);
        var aa = large ? 3 : 4.5, aaa = large ? 4.5 : 7;
        root.querySelector("#ccSizeOut").textContent = px + " px";
        var smp = root.querySelector("#ccSample");
        smp.style.color = fg.value; smp.style.background = bg.value; smp.style.fontSize = px + "px"; smp.style.fontWeight = bold ? 700 : 400;
        function row(level, need) {
          var ok = r >= need;
          return '<li data-state="' + (ok ? "good" : "warn") + '">' + level + " · " + (large ? s("large") : s("normal")) + " · ≥ " + need + ":1 — " + (ok ? s("pass") : s("fail")) + "</li>";
        }
        root.querySelector("#ccRes").innerHTML = '<p class="cc-ratio">' + esc(s("ratio", fmt(r))) + "</p><ul>" + row(s("aa"), aa) + row(s("aaa"), aaa) + "</ul>";
      }
      [fg, bg, sz, bd].forEach(function (e) { e.addEventListener("input", upd); });
      root.querySelectorAll(".cc-presets button").forEach(function (b) {
        b.addEventListener("click", function () { var p = s("p")[b.dataset.i]; fg.value = p[0]; bg.value = p[1]; upd(); });
      });
      upd();
    },

    darkpair: function (root) {
      var pairs = [["#ffffff", "#000000", s("pure")], ["#e3e6eb", "#16181d", s("soft")]];
      root.innerHTML = '<div class="dw-grid">' + pairs.map(function (p) {
        return '<figure class="dw" style="background:' + p[1] + ';color:' + p[0] + '"><figcaption>' + esc(p[2]) + " · " + p[0] + " / " + p[1] + " · " + fmt(ratio(p[0], p[1])) + ":1</figcaption><p>" + esc(s("rdText")) + "</p></figure>";
      }).join("") + '</div><p class="demo-note">' + esc(s("darkText")) + "</p>";
    },

    reflow: function (root) {
      root.innerHTML = '<div class="rf-grid">' +
        '<figure><figcaption><code>' + esc(s("fixed")) + '</code></figcaption><div class="rf-vp"><p style="width:600px">' + esc(s("rdText")) + "</p></div></figure>" +
        '<figure><figcaption><code>' + esc(s("fluid")) + '</code></figcaption><div class="rf-vp"><p style="max-width:65ch">' + esc(s("rdText")) + "</p></div></figure>" +
        '</div><p class="demo-note">' + esc(s("reflowText")) + "</p>";
    },

    links: function (root) {
      root.innerHTML = '<label class="toggles"><span><input type="checkbox" id="lkGray"> ' + esc(s("gray")) + "</span></label>" +
        '<div class="demo-grid demo-grid-2 lk-wrap">' +
          '<figure class="demo-cell"><figcaption>' + esc(s("linkColor")) + '</figcaption><p class="lk-p">' + s("linkText", "lk-color") + "</p></figure>" +
          '<figure class="demo-cell"><figcaption>' + esc(s("linkLine")) + '</figcaption><p class="lk-p">' + s("linkText", "lk-line") + "</p></figure>" +
        '</div><p class="demo-note">' + esc(s("linkRatio", fmt(ratio("#1b2233", "#c0392b")))) + "</p>";
      root.querySelector("#lkGray").addEventListener("change", function (e) {
        root.querySelector(".lk-wrap").style.filter = e.target.checked ? "grayscale(1)" : "none";
      });
    },

    readability: function (root) {
      root.innerHTML = '<div class="demo-grid demo-grid-2">' +
        '<figure class="demo-cell"><figcaption>' + esc(s("rdDefault")) + '</figcaption><p class="rd-bad">' + esc(s("rdText")) + "</p></figure>" +
        '<figure class="demo-cell rd-bda-cell"><figcaption>' + esc(s("rdBda")) + '</figcaption><p class="rd-bda">' + esc(s("rdText")) + "</p></figure>" +
        "</div>";
    }
  });
})();
