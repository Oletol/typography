/* Demos for module 1 “Anatomy of type”: font metrics, x-height, legibility, optical size, Cyrillic. MIT License. */
(function () {
  "use strict";

  var S = {
    ru: {
      font: "Гарнитура", sample: "Образец",
      lAsc: "линия верхних выносных", lCap: "линия прописных", lX: "линия строчных", lBase: "базовая линия", lDesc: "линия нижних выносных",
      lContent: "область содержимого (content area)",
      ratio: function (v) { return v.toFixed(2) + " em"; },
      metricsNote: "Значения измерены по фактическим очертаниям знаков (H, x, d, p) и выражены в долях кегля (em). Затенённая область — область содержимого, которую браузер использует при line-height: normal.",
      fsaPrimary: "Montserrat — основной веб-шрифт",
      fsaFallback: "Резервный системный шрифт (Georgia / Times)",
      fsaToggle: function (v) { return "Применить font-size-adjust: ex-height " + v; },
      fsaRatio: function (v) { return "x-height / кегль ≈ " + v; },
      fsaText: "Удобочитаемость набора",
      legSize: "Кегль", legBlur: "Имитация низкой плотности пикселей (размытие)",
      legNote: "Сравните различимость пар I / l / 1, O / 0, rn / m, cl / d при уменьшении кегля и снижении чёткости.",
      opszSize: "Кегль",
      opszAuto: "font-optical-sizing: auto (оптический размер = кеглю)",
      opszNone: "font-optical-sizing: none (оптический размер по умолчанию)",
      opszText: "Типографика",
      cyrNote: "Выделены строчные знаки с верхними (синий) и нижними (оранжевый) выносными элементами; фиолетовым — ф, имеющая оба. Учитываются только строчные; форма знаков зависит от гарнитуры.",
      cyrStat: function (a, d, n) { return "с верхними выносными: " + a + " %, с нижними: " + d + " % (из " + n + " строчных знаков)"; },
      clipLh: "line-height при overflow: hidden",
      fbToggle: "Шрифт содержит кириллическое подмножество",
      fbNote: "Если в файле шрифта отсутствуют кириллические знаки, браузер подставляет их из следующего шрифта в списке font-family.",
      fbText: "Каталог товаров — Product catalogue"
    },
    en: {
      font: "Typeface", sample: "Sample",
      lAsc: "ascender line", lCap: "cap height", lX: "x-height", lBase: "baseline", lDesc: "descender line",
      lContent: "content area",
      ratio: function (v) { return v.toFixed(2) + " em"; },
      metricsNote: "Values are measured from the actual glyph outlines (H, x, d, p) and expressed as fractions of the font size (em). The shaded band is the content area the browser uses for line-height: normal.",
      fsaPrimary: "Montserrat — primary web font",
      fsaFallback: "System fallback font (Georgia / Times)",
      fsaToggle: function (v) { return "Apply font-size-adjust: ex-height " + v; },
      fsaRatio: function (v) { return "x-height / font size ≈ " + v; },
      fsaText: "Readability of the setting",
      legSize: "Font size", legBlur: "Simulated low pixel density (blur)",
      legNote: "Compare how distinguishable the pairs I / l / 1, O / 0, rn / m, cl / d remain as the size decreases and sharpness drops.",
      opszSize: "Font size",
      opszAuto: "font-optical-sizing: auto (optical size = font size)",
      opszNone: "font-optical-sizing: none (default optical size)",
      opszText: "Typography",
      cyrNote: "Lowercase letters with ascenders (blue) and descenders (orange) are highlighted; purple marks letters with both. Only lowercase letters are counted; actual shapes depend on the typeface.",
      cyrStat: function (a, d, n) { return "with ascenders: " + a + "%, with descenders: " + d + "% (of " + n + " lowercase letters)"; },
      clipLh: "line-height with overflow: hidden",
      fbToggle: "The font includes the Cyrillic subset",
      fbNote: "If the font file lacks Cyrillic glyphs, the browser substitutes them from the next font in the font-family list.",
      fbText: "Каталог товаров — Product catalogue"
    }
  };
  function s(k) { var v = S[App.lang][k]; return typeof v === "function" ? v.apply(null, Array.prototype.slice.call(arguments, 1)) : v; }
  var esc = function (x) { return App.esc(x); };
  var ready = document.fonts ? document.fonts.ready : Promise.resolve();
  function loadFonts(list) {
    if (!document.fonts) return Promise.resolve();
    return Promise.all(list.map(function (f) { return document.fonts.load("400 40px '" + f + "'", "HxdpБжру"); })).catch(function () {});
  }
  function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

  var mctx = document.createElement("canvas").getContext("2d");
  /* glyph metrics as fractions of the font size */
  function metrics(family) {
    var size = 200;
    mctx.font = "400 " + size + "px '" + family + "'";
    var x = mctx.measureText("x"), H = mctx.measureText("H"), d = mctx.measureText("d"), p = mctx.measureText("p");
    return {
      x: x.actualBoundingBoxAscent / size,
      cap: H.actualBoundingBoxAscent / size,
      asc: d.actualBoundingBoxAscent / size,
      desc: p.actualBoundingBoxDescent / size,
      cAsc: (x.fontBoundingBoxAscent || 0) / size,
      cDesc: (x.fontBoundingBoxDescent || 0) / size
    };
  }

  function fontSelect(id, list, sel) {
    return '<label class="ctl" for="' + id + '"><span class="ctl-head"><span>' + esc(s("font")) + '</span></span><select id="' + id + '">' +
      list.map(function (f) { return '<option' + (f === sel ? " selected" : "") + ">" + f + "</option>"; }).join("") + "</select></label>";
  }
  function range(id, label, min, max, step, val) {
    return '<label class="ctl" for="' + id + '"><span class="ctl-head"><span>' + esc(label) + '</span><output id="' + id + 'Out"></output></span>' +
      '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '"></label>';
  }

  Object.assign(window.Demos, {

    /* metric lines drawn on canvas */
    metrics: function (root) {
      var fonts = ["Literata", "PT Serif", "Inter", "PT Sans", "Montserrat", "Unbounded", "Caveat"];
      root.innerHTML = '<div class="demo-row">' + fontSelect("mtFont", fonts, "PT Serif") +
        '<label class="ctl" for="mtText"><span class="ctl-head"><span>' + esc(s("sample")) + '</span></span><input type="text" id="mtText" class="txt" value="Hxdp Бжру" maxlength="16"></label></div>' +
        '<div class="demo-frame canvas-frame"><canvas id="mtCanvas" aria-hidden="true"></canvas></div>' +
        '<p class="demo-note">' + esc(s("metricsNote")) + "</p>";
      var cv = root.querySelector("#mtCanvas"), sel = root.querySelector("#mtFont"), txt = root.querySelector("#mtText");
      function draw() {
        var fam = sel.value, m = metrics(fam);
        var W = cv.parentElement.clientWidth - 2, dpr = window.devicePixelRatio || 1;
        var labelW = W < 520 ? 0 : 190;
        var x0 = labelW + 16, x1 = W - 64;
        var c = cv.getContext("2d");
        var size = 140;
        c.font = "400 " + size + "px '" + fam + "'";
        var tw = c.measureText(txt.value || "Hx").width;
        if (tw > x1 - x0 - 24) size *= (x1 - x0 - 24) / tw;
        var H = Math.ceil((m.cAsc + m.cDesc) * size + 48);
        cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px";
        c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, W, H);
        var base = 24 + m.cAsc * size;
        var ink = css("--ink"), muted = css("--muted"), accent = css("--accent"), soft = css("--soft"), warn = css("--warn"), good = css("--good");
        c.fillStyle = soft; c.fillRect(x0, base - m.cAsc * size, x1 - x0, (m.cAsc + m.cDesc) * size);
        var lines = [
          [m.asc, s("lAsc"), muted, m.asc], [m.cap, s("lCap"), accent, m.cap], [m.x, s("lX"), good, m.x],
          [0, s("lBase"), warn, 0], [-m.desc, s("lDesc"), muted, m.desc]
        ];
        c.font = "500 12px " + css("--ui");
        lines.forEach(function (l, i) {
          var y = Math.round(base - l[0] * size) + 0.5;
          c.strokeStyle = l[2]; c.lineWidth = l[0] === 0 ? 2 : 1; c.setLineDash(l[0] === 0 ? [] : [5, 4]);
          c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
          c.fillStyle = l[2];
          if (labelW) { c.textAlign = "right"; c.fillText(l[1], x0 - 8, y + 4 + (i === 0 ? -6 : i === 1 ? 6 : 0)); }
          c.textAlign = "left"; c.fillText(l[0] === 0 ? "0" : s("ratio", l[3]), x1 + 6, y + 4 + (i === 0 ? -6 : i === 1 ? 6 : 0));
        });
        c.setLineDash([]);
        c.fillStyle = ink; c.font = "400 " + size + "px '" + fam + "'"; c.textAlign = "left";
        c.fillText(txt.value, x0 + 12, base);
        c.font = "500 11px " + css("--ui"); c.fillStyle = muted;
        c.fillText(s("lContent") + " · " + s("ratio", m.cAsc + m.cDesc), x0 + 4, base - m.cAsc * size + 13);
      }
      sel.addEventListener("change", function () { loadFonts([sel.value]).then(draw); });
      txt.addEventListener("input", draw);
      window.addEventListener("resize", function h() { if (!document.body.contains(cv)) return window.removeEventListener("resize", h); draw(); });
      loadFonts(fonts).then(draw);
    },

    /* font-size-adjust between a web font and a system fallback */
    fsadjust: function (root) {
      var fallback = "Georgia, 'Times New Roman', Times, serif";
      root.innerHTML = '<label class="toggles"><span><input type="checkbox" id="fsaOn"> <code id="fsaLabel"></code></span></label>' +
        '<div class="demo-frame fsa">' +
          '<figure class="fsa-row"><figcaption>' + esc(s("fsaPrimary")) + ' · <output id="fsaR1"></output></figcaption><p style="font-family:Montserrat">' + esc(s("fsaText")) + "</p></figure>" +
          '<figure class="fsa-row"><figcaption>' + esc(s("fsaFallback")) + ' · <output id="fsaR2"></output></figcaption><p style="font-family:' + fallback.replace(/'/g, "&#39;") + '">' + esc(s("fsaText")) + "</p></figure>" +
        "</div>";
      var on = root.querySelector("#fsaOn");
      function upd() {
        var r1 = metrics("Montserrat").x;
        mctx.font = "400 200px " + fallback;
        var r2 = mctx.measureText("x").actualBoundingBoxAscent / 200;
        var v = r1.toFixed(2);
        root.querySelector("#fsaLabel").textContent = s("fsaToggle", v);
        root.querySelector("#fsaR1").textContent = s("fsaRatio", r1.toFixed(2));
        root.querySelector("#fsaR2").textContent = s("fsaRatio", r2.toFixed(2));
        root.querySelectorAll(".fsa-row p").forEach(function (p) { p.style.fontSizeAdjust = on.checked ? "ex-height " + v : "none"; });
      }
      on.addEventListener("change", upd);
      loadFonts(["Montserrat"]).then(upd); upd();
    },

    /* distinguishability of similar glyphs at small sizes */
    legibility: function (root) {
      var fonts = ["Inter", "PT Sans", "Montserrat", "JetBrains Mono", "PT Serif"];
      root.innerHTML = range("lgSize", s("legSize"), 9, 24, 1, 13) + range("lgBlur", s("legBlur"), 0, 1.4, 0.1, 0) +
        '<div class="demo-frame lg-list">' + fonts.map(function (f) {
          return '<div class="lg-row"><span class="xh-name">' + f + '</span><span class="lg-sample" style="font-family:\'' + f + '\'">Il1 O0 rn m cl d 8B 5S шщ</span></div>';
        }).join("") + '</div><p class="demo-note">' + esc(s("legNote")) + "</p>";
      var sz = root.querySelector("#lgSize"), bl = root.querySelector("#lgBlur");
      function upd() {
        root.querySelector("#lgSizeOut").textContent = sz.value + " px";
        root.querySelector("#lgBlurOut").textContent = Number(bl.value).toFixed(1) + " px";
        root.querySelectorAll(".lg-sample").forEach(function (e) { e.style.fontSize = sz.value + "px"; e.style.filter = Number(bl.value) ? "blur(" + bl.value + "px)" : "none"; });
      }
      sz.addEventListener("input", upd); bl.addEventListener("input", upd); upd();
    },

    /* optical size axis of Literata */
    opsz: function (root) {
      root.innerHTML = range("ozSize", s("opszSize"), 10, 80, 1, 56) +
        '<div class="demo-frame oz">' +
          '<figure><figcaption><code>' + esc(s("opszAuto")) + '</code></figcaption><p class="oz-text" style="font-optical-sizing:auto">' + esc(s("opszText")) + "</p></figure>" +
          '<figure><figcaption><code>' + esc(s("opszNone")) + '</code></figcaption><p class="oz-text" style="font-optical-sizing:none">' + esc(s("opszText")) + "</p></figure>" +
        "</div>";
      var sz = root.querySelector("#ozSize");
      function upd() {
        root.querySelector("#ozSizeOut").textContent = sz.value + " px";
        root.querySelectorAll(".oz-text").forEach(function (e) { e.style.fontSize = sz.value + "px"; });
      }
      sz.addEventListener("input", upd); upd();
    },

    /* ascenders and descenders in Cyrillic vs Latin lowercase */
    cyrillic: function (root) {
      var texts = {
        ru: "Типографика определяет условия восприятия письменной информации и влияет на скорость чтения.",
        en: "Typography defines the conditions under which written information is perceived and affects reading speed."
      };
      var ASC = "bdfhkltбф", DESC = "gjpqyдрцщуф";
      function mark(str) {
        var a = 0, d = 0, n = 0;
        var html = str.split("").map(function (ch) {
          if (!/[a-zа-яё]/.test(ch)) return esc(ch);
          n++;
          var isA = ASC.indexOf(ch) > -1, isD = DESC.indexOf(ch) > -1;
          if (isA) a++; if (isD) d++;
          return isA || isD ? '<span class="' + (isA && isD ? "cy-both" : isA ? "cy-asc" : "cy-desc") + '">' + ch + "</span>" : ch;
        }).join("");
        return { html: html, a: Math.round(a / n * 100), d: Math.round(d / n * 100), n: n };
      }
      var ru = mark(texts.ru), en = mark(texts.en);
      root.innerHTML = '<div class="demo-grid demo-grid-2">' +
        [["RU", ru, "ru"], ["EN", en, "en"]].map(function (r) {
          return '<figure class="demo-cell"><figcaption>' + r[0] + " · " + esc(s("cyrStat", r[1].a, r[1].d, r[1].n)) + '</figcaption><p class="cy-text" lang="' + r[2] + '">' + r[1].html + "</p></figure>";
        }).join("") + '</div><p class="demo-note">' + esc(s("cyrNote")) + "</p>";
    },

    /* clipping of diacritics and descenders */
    clip: function (root) {
      root.innerHTML = range("clLh", s("clipLh"), 0.7, 1.5, 0.05, 0.85) +
        '<div class="demo-frame"><div class="clip-line">ЁЖИК ИЗ ЙОШКАР-ОЛЫ</div><div class="clip-line">щука, дрожь, рукоять</div></div>';
      var lh = root.querySelector("#clLh");
      function upd() {
        root.querySelector("#clLhOut").textContent = Number(lh.value).toFixed(2);
        root.querySelectorAll(".clip-line").forEach(function (e) { e.style.lineHeight = lh.value; });
      }
      lh.addEventListener("input", upd); upd();
    },

    /* font without Cyrillic: per-glyph fallback */
    fallbackmix: function (root) {
      if (!document.getElementById("latinOnlyFace")) {
        var st = document.createElement("style"); st.id = "latinOnlyFace";
        st.textContent = "@font-face{font-family:'Unbounded Latin Only';font-weight:200 900;src:url(assets/fonts/unbounded/unbounded-latin-wght-normal.woff2) format('woff2-variations');}";
        document.head.appendChild(st);
      }
      root.innerHTML = '<label class="toggles"><span><input type="checkbox" id="fbOn"> ' + esc(s("fbToggle")) + "</span></label>" +
        '<div class="demo-frame"><p class="fb-text" id="fbText">' + esc(s("fbText")) + '</p><pre class="code fb-code"><code id="fbCode"></code></pre></div>' +
        '<p class="demo-note">' + esc(s("fbNote")) + "</p>";
      var on = root.querySelector("#fbOn"), p = root.querySelector("#fbText");
      function upd() {
        var fam = on.checked ? "'Unbounded', Georgia, serif" : "'Unbounded Latin Only', Georgia, serif";
        p.style.fontFamily = fam;
        root.querySelector("#fbCode").textContent = "font-family: " + (on.checked ? "\"Unbounded\"" : "\"Unbounded\" /* latin only */") + ", Georgia, serif;";
      }
      on.addEventListener("change", upd); upd();
    }
  });
})();
