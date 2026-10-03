/* Demos for module 8 “Web fonts and Cyrillic”. MIT License. */
(function () {
  "use strict";

  var NB = " ";
  var S = {
    ru: {
      loaded: "Файлы шрифтов, загруженные этой страницей",
      file: "Файл", size: "Объём", cached: "из кэша",
      showEn: "Показать английский текст шрифтом Bitter", showRu: "Показать русский текст шрифтом Bitter",
      enText: "Typography for the web", ruText: "Типографика для веба",
      loadNote: "Каждый шрифт курса разделён на два подмножества с unicode-range. Браузер загружает файл только тогда, когда на странице есть знаки из его диапазона. Если Bitter уже использовался в этом сеансе (например, в тренажёре), его файлы будут в списке заранее.",
      newMark: "новый",
      fd: "Значение font-display", delay: "Время загрузки шрифта",
      run: "Запустить моделирование",
      st: { invisible: "Текст невидим (период блокировки)", fallback: "Резервный шрифт (период подмены)", web: "Веб-шрифт", failed: "Веб-шрифт загружен, но не применён: период подмены истёк" },
      seg: { block: "блокировка", swap: "подмена", fail: "отказ" },
      simNote: "Моделирование: длительности периодов соответствуют рекомендациям спецификации CSS Fonts (блокировка около 3 с для block и около 100 мс для остальных значений, подмена около 3 с для fallback).",
      fmToggle: function (v) { return "Применить к резервному шрифту size-adjust: " + v + "%"; },
      fmWeb: "Inter (веб-шрифт)", fmFb: "Резервный системный гротеск",
      fmText: "Пока веб-шрифт загружается, текст отображается резервным шрифтом. Если метрики шрифтов различаются, после загрузки строки перестраиваются и содержимое страницы смещается.",
      fmLines: function (a, b) { return "Строк: веб-шрифт — " + a + ", резервный — " + b; },
      fmNote: "Наложение показывает расхождение строк: синий — веб-шрифт, оранжевый — резервный шрифт.",
      typoIn: "Исходный текст", typoBtn: "Применить правила набора", typoOut: "Результат (неразрывные пробелы показаны знаком °)",
      typoSample: "Курс \"Типографика для веба\" рассчитан на 10-15 занятий - это около 3 месяцев. Как пишет А. С. Иванова, \"шрифт - это \"голос\" текста\". В аудитории 30 мест, занятия проходят с 9:00 до 18:00 и в субботу.",
      typoStat: function (n) { return "Выполнено замен: " + n + "."; }
    },
    en: {
      loaded: "Font files loaded by this page",
      file: "File", size: "Size", cached: "cached",
      showEn: "Show English text in Bitter", showRu: "Show Russian text in Bitter",
      enText: "Typography for the web", ruText: "Типографика для веба",
      loadNote: "Every course font is split into two subsets with unicode-range. The browser downloads a file only when the page contains characters from its range. If Bitter was already used in this session (e.g. in the trainer), its files will already be listed.",
      newMark: "new",
      fd: "font-display value", delay: "Font load time",
      run: "Run simulation",
      st: { invisible: "Text invisible (block period)", fallback: "Fallback font (swap period)", web: "Web font", failed: "Web font loaded but not applied: swap period expired" },
      seg: { block: "block", swap: "swap", fail: "failure" },
      simNote: "Simulation: period durations follow the CSS Fonts specification recommendations (about 3 s block for block and about 100 ms for other values, about 3 s swap for fallback).",
      fmToggle: function (v) { return "Apply size-adjust: " + v + "% to the fallback font"; },
      fmWeb: "Inter (web font)", fmFb: "System sans fallback",
      fmText: "While the web font loads, text is shown in a fallback font. If the fonts' metrics differ, lines reflow once the font arrives and page content shifts.",
      fmLines: function (a, b) { return "Lines: web font " + a + ", fallback " + b; },
      fmNote: "The overlay shows the line mismatch: blue is the web font, orange the fallback.",
      typoIn: "Source text", typoBtn: "Apply Russian typesetting rules", typoOut: "Result (non-breaking spaces shown as °)",
      typoSample: "Курс \"Типографика для веба\" рассчитан на 10-15 занятий - это около 3 месяцев. Как пишет А. С. Иванова, \"шрифт - это \"голос\" текста\". В аудитории 30 мест, занятия проходят с 9:00 до 18:00 и в субботу.",
      typoStat: function (n) { return "Replacements made: " + n + "."; }
    }
  };
  function s(k) { var v = S[App.lang][k]; return typeof v === "function" ? v.apply(null, Array.prototype.slice.call(arguments, 1)) : v; }
  var esc = function (x) { return App.esc(x); };
  function kb(n) { return n ? (n / 1024).toFixed(1) + " KB" : null; }

  function fontEntries() {
    return (performance.getEntriesByType ? performance.getEntriesByType("resource") : []).filter(function (e) { return /\.woff2(\?|$)/.test(e.name); })
      .map(function (e) { return { name: e.name.split("/").slice(-2).join("/"), size: e.encodedBodySize || e.transferSize || 0 }; });
  }

  /* simplified Russian typographer: quotes, dashes, ranges, non-breaking spaces */
  function typograf(src) {
    var n = 0, out = "", depth = 0;
    for (var i = 0; i < src.length; i++) {
      var ch = src[i];
      if (ch === '"') {
        var prev = i ? src[i - 1] : " ";
        var opening = /[\s( «„—-]/.test(prev) || i === 0;
        if (opening) { out += depth === 0 ? "«" : "„"; depth++; }
        else { depth = Math.max(0, depth - 1); out += depth === 0 ? "»" : "“"; }
        n++;
      } else out += ch;
    }
    var rules = [
      [/ - /g, NB + "— "],
      [/(\d)-(\d)/g, "$1–$2"],
      [/([А-ЯЁ]\.)\s([А-ЯЁ]\.)\s([А-ЯЁ][а-яё]+)/g, "$1" + NB + "$2" + NB + "$3"],
      [/(\d)\s(?=[A-Za-zА-Яа-яЁё])/g, "$1" + NB],
      [/(^|[\s(«„ ])([А-Яа-яЁё]{1,2})\s/g, "$1$2" + NB]
    ];
    rules.forEach(function (r, i) {
      var passes = i === rules.length - 1 ? 2 : 1;   /* short words can follow each other */
      for (var k = 0; k < passes; k++) {
        var m = out.match(r[0]); if (m) n += m.length;
        out = out.replace(r[0], r[1]);
      }
    });
    return { text: out, count: n };
  }
  window.TypeUtil = Object.assign(window.TypeUtil || {}, { typograf: typograf });

  Object.assign(window.Demos, {

    loadedfonts: function (root) {
      root.innerHTML = '<div class="lf-btns"><button type="button" class="btn btn-ghost btn-sm" id="lfEn">' + esc(s("showEn")) + '</button><button type="button" class="btn btn-ghost btn-sm" id="lfRu">' + esc(s("showRu")) + "</button></div>" +
        '<div class="demo-frame lf-sample" id="lfSample"></div>' +
        '<h3 class="lf-h">' + esc(s("loaded")) + '</h3><div class="lf-table" id="lfList"></div><p class="demo-note">' + esc(s("loadNote")) + "</p>";
      var known = {};
      function list(markNew) {
        var rows = fontEntries();
        root.querySelector("#lfList").innerHTML = '<div class="lf-row lf-head"><span>' + esc(s("file")) + "</span><span>" + esc(s("size")) + "</span></div>" +
          rows.map(function (r) {
            var isNew = markNew && !known[r.name];
            return '<div class="lf-row' + (isNew ? " is-new" : "") + '"><span>' + esc(r.name) + (isNew ? ' <b>' + esc(s("newMark")) + "</b>" : "") + "</span><span>" + (kb(r.size) || esc(s("cached"))) + "</span></div>";
          }).join("");
        rows.forEach(function (r) { known[r.name] = true; });
      }
      function show(txt) {
        var el = root.querySelector("#lfSample");
        el.insertAdjacentHTML("beforeend", '<p style="font-family:Bitter,serif">' + esc(txt) + "</p>");
        (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () { setTimeout(function () { list(true); }, 400); });
      }
      root.querySelector("#lfEn").addEventListener("click", function () { show(s("enText")); });
      root.querySelector("#lfRu").addEventListener("click", function () { show(s("ruText")); });
      list(false);
    },

    displaysim: function (root) {
      var P = { auto: [3000, Infinity], block: [3000, Infinity], swap: [100, Infinity], fallback: [100, 3000], optional: [100, 0] };
      root.innerHTML = '<div class="demo-row">' +
        '<label class="ctl"><span class="ctl-head"><span>' + esc(s("fd")) + '</span></span><select id="dsVal">' + ["swap", "block", "fallback", "optional"].map(function (v) { return "<option>" + v + "</option>"; }).join("") + "</select></label>" +
        '<label class="ctl"><span class="ctl-head"><span>' + esc(s("delay")) + '</span></span><select id="dsDelay">' + [0.05, 1, 2.5, 5].map(function (v) { return '<option value="' + v * 1000 + '"' + (v === 1 ? " selected" : "") + ">" + v + " s</option>"; }).join("") + "</select></label></div>" +
        '<button type="button" class="btn btn-primary btn-sm" id="dsRun">' + esc(s("run")) + "</button>" +
        '<div class="ds-track" id="dsTrack"></div>' +
        '<div class="demo-frame"><p class="ds-text" id="dsText">Типографика · Typography</p><p class="ds-state" id="dsState"></p></div>' +
        '<p class="demo-note">' + esc(s("simNote")) + "</p>";
      var val = root.querySelector("#dsVal"), del = root.querySelector("#dsDelay"), timer = null;
      var TOTAL = 6500;
      function track() {
        var p = P[val.value], b = p[0], sw = p[1];
        var swEnd = Math.min(TOTAL, b + sw);
        var html = '<span class="ds-seg ds-block" style="width:' + (b / TOTAL * 100) + '%">' + (b > 400 ? esc(s("seg").block) : "") + "</span>";
        if (swEnd > b) html += '<span class="ds-seg ds-swap" style="width:' + ((swEnd - b) / TOTAL * 100) + '%">' + esc(s("seg").swap) + "</span>";
        if (swEnd < TOTAL) html += '<span class="ds-seg ds-fail" style="width:' + ((TOTAL - swEnd) / TOTAL * 100) + '%">' + esc(s("seg").fail) + "</span>";
        html += '<span class="ds-load" style="left:' + (Number(del.value) / TOTAL * 100) + '%"></span><span class="ds-cursor" id="dsCur"></span>';
        root.querySelector("#dsTrack").innerHTML = html;
      }
      function state(t) {
        var p = P[val.value], b = p[0], sw = p[1], L = Number(del.value);
        var loaded = t >= L;
        if (loaded) {
          if (L < b + sw) return "web";
          return "failed";
        }
        if (t < b) return "invisible";
        if (t < b + sw) return "fallback";
        return "fallback";
      }
      function paint(t) {
        var st = state(t), el = root.querySelector("#dsText");
        el.style.color = st === "invisible" ? "transparent" : "";
        el.style.fontFamily = st === "web" ? "Unbounded, sans-serif" : "Georgia, 'Times New Roman', serif";
        root.querySelector("#dsState").textContent = (t / 1000).toFixed(1) + " s · " + s("st")[st];
        var cur = root.querySelector("#dsCur"); if (cur) cur.style.left = (t / TOTAL * 100) + "%";
      }
      function run() {
        clearInterval(timer); track();
        var t0 = performance.now();
        timer = setInterval(function () {
          if (!document.body.contains(root)) return clearInterval(timer);
          var t = performance.now() - t0;
          paint(Math.min(t, TOTAL));
          if (t >= TOTAL) clearInterval(timer);
        }, 50);
      }
      root.querySelector("#dsRun").addEventListener("click", run);
      val.addEventListener("change", function () { track(); paint(0); });
      del.addEventListener("change", function () { track(); paint(0); });
      if (document.fonts) document.fonts.load("400 20px Unbounded", "Типографика Typography");
      track(); paint(0);
    },

    fallbackmetrics: function (root) {
      var LOCALS = "local('Arial'), local('Helvetica'), local('Liberation Sans'), local('DejaVu Sans')";
      if (!document.getElementById("fbMetricFaces")) {
        var st = document.createElement("style"); st.id = "fbMetricFaces";
        st.textContent = "@font-face{font-family:'Raw Fallback';src:" + LOCALS + ";}";
        document.head.appendChild(st);
      }
      root.innerHTML = '<label class="toggles"><span><input type="checkbox" id="fmOn"> <code id="fmLabel"></code></span></label>' +
        '<div class="demo-frame fm-stack"><p class="fm-p fm-web">' + esc(s("fmText")) + '</p><p class="fm-p fm-fb" id="fmFb">' + esc(s("fmText")) + "</p></div>" +
        '<p class="demo-note" id="fmLines"></p><p class="demo-note">' + esc(s("fmNote")) + "</p>";
      var on = root.querySelector("#fmOn"), adj = 100;
      function lines(el) { return Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)); }
      function upd() {
        var fb = root.querySelector("#fmFb");
        fb.style.fontFamily = on.checked ? "'Adjusted Fallback'" : "'Raw Fallback'";
        requestAnimationFrame(function () {
          root.querySelector("#fmLines").textContent = s("fmLines", lines(root.querySelector(".fm-web")), lines(fb));
        });
      }
      var ctx = document.createElement("canvas").getContext("2d");
      Promise.all([document.fonts.load("400 18px Inter", "Aa"), document.fonts.load("400 18px 'Raw Fallback'", "Aa")]).catch(function () {}).then(function () {
        var txt = s("fmText");
        ctx.font = "400 100px Inter"; var w1 = ctx.measureText(txt).width;
        ctx.font = "400 100px 'Raw Fallback'"; var w2 = ctx.measureText(txt).width;
        adj = Math.round(w1 / w2 * 1000) / 10;
        var st2 = document.getElementById("fbMetricFacesAdj") || document.createElement("style"); st2.id = "fbMetricFacesAdj";
        st2.textContent = "@font-face{font-family:'Adjusted Fallback';src:" + LOCALS + ";size-adjust:" + adj + "%;}";
        document.head.appendChild(st2);
        root.querySelector("#fmLabel").textContent = s("fmToggle", adj);
        on.addEventListener("change", function () { document.fonts.load("400 18px 'Adjusted Fallback'", "Aa").then(upd, upd); });
        upd();
      });
    },

    typo: function (root) {
      root.innerHTML = '<label class="ctl" for="tyIn"><span class="ctl-head"><span>' + esc(s("typoIn")) + '</span></span><textarea id="tyIn" rows="4" class="txt ty-in"></textarea></label>' +
        '<button type="button" class="btn btn-primary btn-sm" id="tyBtn">' + esc(s("typoBtn")) + "</button>" +
        '<p class="ctl-head" style="margin-top:14px"><span>' + esc(s("typoOut")) + '</span></p><div class="demo-frame ty-out" id="tyOut"></div><p class="demo-note" id="tyStat"></p>';
      var inp = root.querySelector("#tyIn");
      inp.value = s("typoSample");
      root.querySelector("#tyBtn").addEventListener("click", function () {
        var r = typograf(inp.value);
        root.querySelector("#tyOut").innerHTML = esc(r.text).replace(/ /g, '<span class="ty-nb">°</span>').replace(/[«»„“—–]/g, '<mark>$&</mark>');
        root.querySelector("#tyStat").textContent = s("typoStat", r.count);
      });
    }
  });
})();
