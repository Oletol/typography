/* Demos for module 3 “Styles and weights”. MIT License. */
(function () {
  "use strict";

  var NAMES = { 100: "Thin", 200: "Extra Light", 300: "Light", 400: "Regular", 500: "Medium", 600: "Semi Bold", 700: "Bold", 800: "Extra Bold", 900: "Black" };
  var S = {
    ru: {
      font: "Гарнитура",
      sample: "Начертание задаёт иерархию",
      outRange: "вне диапазона файла",
      requested: "запрошено", actual: "отображается",
      fbNote: "PT Sans подключён в двух насыщенностях: 400 и 700. Для остальных значений браузер подбирает ближайшее доступное начертание по алгоритму спецификации CSS.",
      synthOff: "font-synthesis: none",
      synthBold: "Prata: в семействе есть только начертание 400; полужирное синтезировано браузером",
      synthItalic: "Onest: курсивного начертания нет; наклон синтезирован браузером",
      synthSample: "Полужирное выделение",
      synthSample2: "Курсивное выделение",
      italicTrue: "PT Serif Italic — самостоятельный рисунок курсива",
      italicFake: "PT Serif — прямое начертание, механически наклонённое браузером",
      italicSample: "дитпгз — курсив в кириллице",
      vfValue: "font-weight",
      vfSample: "Вариативный шрифт: насыщенность",
      lightLabel: "Светлая тема · 400", darkLabel: function (w) { return "Тёмная тема · " + w; },
      darkText: "Светлый текст на тёмном фоне визуально кажется насыщеннее, чем тёмный текст той же насыщенности на светлом.",
      darkSlider: "Насыщенность текста в тёмной теме"
    },
    en: {
      font: "Typeface",
      sample: "Styles build hierarchy",
      outRange: "outside the file's range",
      requested: "requested", actual: "rendered",
      fbNote: "PT Sans is loaded in two weights only: 400 and 700. For other values the browser selects the nearest available weight using the algorithm from the CSS specification.",
      synthOff: "font-synthesis: none",
      synthBold: "Prata: the family has only weight 400; bold is synthesised by the browser",
      synthItalic: "Onest: there is no italic style; the slant is synthesised by the browser",
      synthSample: "Bold emphasis",
      synthSample2: "Italic emphasis",
      italicTrue: "PT Serif Italic — a separately designed italic",
      italicFake: "PT Serif — the upright style mechanically slanted by the browser",
      italicSample: "дитпгз — italic in Cyrillic",
      vfValue: "font-weight",
      vfSample: "Variable font: weight",
      lightLabel: "Light theme · 400", darkLabel: function (w) { return "Dark theme · " + w; },
      darkText: "Light text on a dark background appears heavier than dark text of the same weight on a light background.",
      darkSlider: "Text weight in dark theme"
    }
  };
  function s(k) { var v = S[App.lang][k]; return typeof v === "function" ? v.apply(null, Array.prototype.slice.call(arguments, 1)) : v; }
  var esc = function (x) { return App.esc(x); };
  function font(id) { return window.FONTS.find(function (f) { return f.id === id; }); }
  function range(id, label, min, max, step, val) {
    return '<label class="ctl" for="' + id + '"><span class="ctl-head"><span>' + esc(label) + '</span><output id="' + id + 'Out"></output></span>' +
      '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></label>';
  }

  /* CSS weight matching algorithm (CSS Fonts Level 4, as described on MDN) */
  function matchWeight(target, available) {
    var a = available.slice().sort(function (x, y) { return x - y; });
    if (a.indexOf(target) > -1) return target;
    var up = function (from, to) { return a.filter(function (w) { return w > from && (to == null || w <= to); })[0]; };
    var down = function (from) { var d = a.filter(function (w) { return w < from; }); return d[d.length - 1]; };
    if (target >= 400 && target <= 500) {
      return up(target, 500) || down(target) || a.filter(function (w) { return w > 500; })[0];
    }
    if (target < 400) return down(target) || up(target);
    return up(target) || down(target);
  }

  Object.assign(window.Demos, {

    weightscale: function (root) {
      var ids = ["inter", "montserrat", "roboto", "raleway", "source-serif-4", "literata", "roboto-slab", "nunito"];
      root.innerHTML = '<label class="ctl" for="wsFont"><span class="ctl-head"><span>' + esc(s("font")) + '</span></span><select id="wsFont">' +
        ids.map(function (id) { var f = font(id); return '<option value="' + id + '">' + f.family + " (" + f.wght[0] + "–" + f.wght[1] + ")</option>"; }).join("") +
        '</select></label><div class="demo-frame ws-list"></div>';
      var sel = root.querySelector("#wsFont"), list = root.querySelector(".ws-list");
      function upd() {
        var f = font(sel.value);
        list.innerHTML = [100, 200, 300, 400, 500, 600, 700, 800, 900].map(function (w) {
          var inR = w >= f.wght[0] && w <= f.wght[1];
          return '<div class="ws-row' + (inR ? "" : " is-out") + '"><span class="ws-num">' + w + '</span><span class="ws-name">' + NAMES[w] + (inR ? "" : " · " + esc(s("outRange"))) +
            '</span><span class="ws-sample" style="font-family:\'' + f.family + '\';font-weight:' + w + '">' + esc(s("sample")) + "</span></div>";
        }).join("");
      }
      sel.addEventListener("change", upd); upd();
    },

    weightfallback: function (root) {
      var avail = [400, 700];
      root.innerHTML = '<div class="demo-frame ws-list">' + [100, 200, 300, 400, 500, 600, 700, 800, 900].map(function (w) {
        var m = matchWeight(w, avail);
        return '<div class="ws-row"><span class="ws-num">' + w + '</span><span class="ws-name">' + esc(s("actual")) + ": <b>" + m + "</b>" +
          '</span><span class="ws-sample" style="font-family:\'PT Sans\';font-weight:' + w + ';font-synthesis:none">' + esc(s("sample")) + "</span></div>";
      }).join("") + '</div><p class="demo-note">' + esc(s("fbNote")) + "</p>";
    },

    synth: function (root) {
      root.innerHTML = '<label class="toggles"><span><input type="checkbox" id="syOff"> <code>' + esc(s("synthOff")) + "</code></span></label>" +
        '<div class="demo-frame sy">' +
          '<figure><figcaption>' + esc(s("synthBold")) + '</figcaption><p class="sy-p" style="font-family:Prata,serif;font-weight:700">' + esc(s("synthSample")) + "</p></figure>" +
          '<figure><figcaption>' + esc(s("synthItalic")) + '</figcaption><p class="sy-p" style="font-family:Onest,sans-serif;font-style:italic">' + esc(s("synthSample2")) + "</p></figure>" +
        "</div>";
      var on = root.querySelector("#syOff");
      on.addEventListener("change", function () {
        root.querySelectorAll(".sy-p").forEach(function (p) { p.style.fontSynthesis = on.checked ? "none" : ""; });
      });
    },

    italic: function (root) {
      if (!document.getElementById("ptSerifUprightFace")) {
        var st = document.createElement("style"); st.id = "ptSerifUprightFace";
        st.textContent = "@font-face{font-family:'PT Serif Upright';font-weight:400;font-style:normal;src:url(assets/fonts/pt-serif/pt-serif-cyrillic-400-normal.woff2) format('woff2');unicode-range:U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;}" +
          "@font-face{font-family:'PT Serif Upright';font-weight:400;font-style:normal;src:url(assets/fonts/pt-serif/pt-serif-latin-400-normal.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}";
        document.head.appendChild(st);
      }
      root.innerHTML = '<div class="demo-frame sy">' +
        '<figure><figcaption>' + esc(s("italicTrue")) + '</figcaption><p class="it-p" style="font-family:\'PT Serif\';font-style:italic">' + esc(s("italicSample")) + "</p></figure>" +
        '<figure><figcaption>' + esc(s("italicFake")) + '</figcaption><p class="it-p" style="font-family:\'PT Serif Upright\';font-style:italic">' + esc(s("italicSample")) + "</p></figure>" +
        "</div>";
    },

    variable: function (root) {
      var ids = ["inter", "montserrat", "literata", "roboto-slab"];
      root.innerHTML = range("vfW", s("vfValue"), 100, 900, 1, 437) +
        '<div class="demo-frame vf-list">' + ids.map(function (id) {
          var f = font(id);
          return '<div class="vf-row"><span class="xh-name">' + f.family + " · " + f.wght[0] + "–" + f.wght[1] + '</span><span class="vf-sample" style="font-family:\'' + f.family + '\'">' + esc(s("vfSample")) + "</span></div>";
        }).join("") + "</div>";
      var w = root.querySelector("#vfW");
      function upd() {
        root.querySelector("#vfWOut").textContent = w.value;
        root.querySelectorAll(".vf-sample").forEach(function (e) { e.style.fontWeight = w.value; });
      }
      w.addEventListener("input", upd); upd();
    },

    darkweight: function (root) {
      root.innerHTML = range("dwW", s("darkSlider"), 300, 500, 10, 400) +
        '<div class="dw-grid">' +
          '<figure class="dw dw-light"><figcaption>' + esc(s("lightLabel")) + '</figcaption><p>' + esc(s("darkText")) + "</p></figure>" +
          '<figure class="dw dw-dark"><figcaption id="dwLab"></figcaption><p id="dwText">' + esc(s("darkText")) + "</p></figure>" +
        "</div>";
      var w = root.querySelector("#dwW");
      function upd() {
        root.querySelector("#dwWOut").textContent = w.value;
        root.querySelector("#dwLab").textContent = s("darkLabel", w.value);
        root.querySelector("#dwText").style.fontWeight = w.value;
      }
      w.addEventListener("input", upd); upd();
    }
  });

  window.TypeUtil = Object.assign(window.TypeUtil || {}, { matchWeight: matchWeight });
})();
