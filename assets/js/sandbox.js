/* Sandbox: live typesetting with hints and CSS export. MIT License. */
(function () {
  "use strict";

  var DEFAULTS = { body: "pt-serif", head: "", weight: 400, size: 15, lh: 1.15, measure: 100, tracking: 0, fg: "#8b94a7", bg: "#ffffff" };
  var CLASS_ORDER = ["serif", "slab", "sans", "mono", "display", "script"];
  var FALLBACK = { serif: "Georgia, serif", slab: "Georgia, serif", sans: "system-ui, sans-serif", mono: "ui-monospace, monospace", display: "system-ui, sans-serif", script: "cursive" };

  function font(id) { return window.FONTS.find(function (f) { return f.id === id; }) || window.FONTS[0]; }
  function wRange(f) { return f.variable ? { min: f.wght[0], max: f.wght[1], step: 10 } : { min: f.weights[0], max: f.weights[f.weights.length - 1], step: Math.max(100, f.weights.length > 1 ? f.weights[1] - f.weights[0] : 100) }; }
  function stack(f) { return '"' + f.family + '", ' + FALLBACK[f.cls]; }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  function lum(hex) {
    var c = hex.replace("#", "");
    if (c.length === 3) c = c.replace(/./g, "$&$&");
    return [0, 2, 4].map(function (i) {
      var v = parseInt(c.substr(i, 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    }).reduce(function (s, v, i) { return s + v * [0.2126, 0.7152, 0.0722][i]; }, 0);
  }
  function contrast(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

  function fontOptions(selected, withSame) {
    var T = App.T, html = withSame ? '<option value="">' + App.esc(T("sbSameFont")) + "</option>" : "";
    CLASS_ORDER.forEach(function (cls) {
      var list = window.FONTS.filter(function (f) { return f.cls === cls; });
      if (!list.length) return;
      html += '<optgroup label="' + App.esc(T("fontClass")[cls]) + '">' +
        list.map(function (f) { return '<option value="' + f.id + '"' + (f.id === selected ? " selected" : "") + ">" + App.esc(f.family) + "</option>"; }).join("") +
        "</optgroup>";
    });
    return html;
  }

  function ctl(id, label, attrs) {
    return '<label class="ctl" for="' + id + '"><span class="ctl-head"><span>' + label + '</span><output id="' + id + 'Out"></output></span><input type="range" id="' + id + '" ' + attrs + "></label>";
  }

  function render(view) {
    var T = App.T, esc = App.esc;
    var st = Object.assign({}, DEFAULTS, Store.get("sandbox") || {});

    view.innerHTML =
      '<section class="page-head"><h1>' + esc(T("sbTitle")) + "</h1><p>" + esc(T("sbIntro")) + "</p></section>" +
      '<section class="sb">' +
        '<form class="sb-controls card" onsubmit="return false">' +
          '<label class="ctl"><span class="ctl-head"><span>' + esc(T("sbFont")) + '</span></span><select id="sbBody">' + fontOptions(st.body) + '</select><span class="ctl-note" id="sbBodyNote"></span></label>' +
          '<label class="ctl"><span class="ctl-head"><span>' + esc(T("sbHeadFont")) + '</span></span><select id="sbHead">' + fontOptions(st.head, true) + "</select></label>" +
          ctl("sbWeight", esc(T("sbWeight")), "") +
          ctl("sbSize", esc(T("sbSize")), 'min="10" max="32" step="1"') +
          ctl("sbLh", esc(T("sbLeading")), 'min="0.9" max="2.6" step="0.05"') +
          ctl("sbMeasure", esc(T("sbMeasure")), 'min="20" max="140" step="1"') +
          ctl("sbTrack", esc(T("sbTracking")), 'min="-0.08" max="0.2" step="0.01"') +
          '<fieldset class="ctl colors"><legend>' + esc(T("sbColors")) + "</legend>" +
            '<label><input type="color" id="sbFg"><span>' + esc(T("sbText")) + "</span></label>" +
            '<label><input type="color" id="sbBg"><span>' + esc(T("sbBg")) + "</span></label>" +
            '<output id="sbContrast" class="ctl-note"></output>' +
          "</fieldset>" +
          '<button type="button" class="btn btn-ghost" id="sbReset">' + esc(T("sbReset")) + "</button>" +
        "</form>" +
        '<div class="sb-main">' +
          '<article class="sb-preview card" id="sbPreview">' +
            '<h2 id="sbH">' + esc(T("sampleHeading")) + "</h2>" +
            T("sampleText").map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
            '<span class="sb-btn">' + esc(T("sampleButton")) + "</span>" +
          "</article>" +
          '<div class="sb-meta"><span id="sbChars"></span></div>' +
          '<section class="card sb-hints"><h2>' + esc(T("sbHints")) + '</h2><ul id="sbHintList"></ul></section>' +
          '<section class="card sb-css"><div class="sb-css-head"><h2>' + esc(T("sbCss")) + '</h2><button type="button" class="btn btn-ghost btn-sm" id="sbCopy">' + esc(T("sbCopy")) + '</button></div><pre><code id="sbCode"></code></pre></section>' +
        "</div>" +
      "</section>";

    var $ = function (id) { return view.querySelector("#" + id); };
    var preview = $("sbPreview"), firstP = preview.querySelector("p");

    function setWeightRange() {
      var r = wRange(font(st.body)), w = $("sbWeight");
      w.min = r.min; w.max = r.max; w.step = r.step;
      st.weight = clamp(st.weight, r.min, r.max);
      w.value = st.weight;
    }

    function sync() {
      $("sbBody").value = st.body; $("sbHead").value = st.head;
      setWeightRange();
      $("sbSize").value = st.size; $("sbLh").value = st.lh; $("sbMeasure").value = st.measure; $("sbTrack").value = st.tracking;
      $("sbFg").value = st.fg; $("sbBg").value = st.bg;
    }

    function update() {
      var bf = font(st.body), hf = st.head ? font(st.head) : bf;
      $("sbBodyNote").textContent = bf.family + " — " + T("fontSub")[bf.sub];
      $("sbWeightOut").textContent = st.weight;
      $("sbSizeOut").textContent = st.size + " px";
      $("sbLhOut").textContent = Number(st.lh).toFixed(2);
      $("sbMeasureOut").textContent = st.measure + "ch";
      $("sbTrackOut").textContent = Number(st.tracking).toFixed(2) + "em";

      preview.style.fontFamily = stack(bf);
      preview.style.fontWeight = st.weight;
      preview.style.fontSize = st.size + "px";
      preview.style.lineHeight = st.lh;
      preview.style.letterSpacing = st.tracking + "em";
      preview.style.color = st.fg;
      preview.style.background = st.bg;
      preview.style.setProperty("--measure", st.measure + "ch");
      var h = $("sbH");
      h.style.fontFamily = stack(hf);
      var hw = hf.variable ? clamp(700, hf.wght[0], hf.wght[1]) : hf.weights[hf.weights.length - 1];
      h.style.fontWeight = hw;

      var chars = window.TypeUtil.charsPerLine(firstP);
      var ratio = contrast(st.fg, st.bg);
      var r1 = (Math.floor(ratio * 10) / 10).toFixed(1);
      $("sbChars").textContent = T("sbChars", chars);
      $("sbContrast").textContent = T("sbContrast", r1);
      $("sbContrast").dataset.state = ratio < 4.5 ? "warn" : "good";

      var hints = [];
      if (st.size < 16) hints.push(T("hintSmall"));
      if (st.size > 22) hints.push(T("hintLarge"));
      if (st.lh < 1.3) hints.push(T("hintTight"));
      if (st.lh > 1.9) hints.push(T("hintLoose"));
      if (chars < 45) hints.push(T("hintShort", chars));
      if (chars > 75) hints.push(T("hintLong", chars));
      if (ratio < 4.5) hints.push(T("hintContrast", r1));
      if (st.tracking > 0.05) hints.push(T("hintTracking"));
      if (st.tracking < -0.01) hints.push(T("hintTrackingNeg"));
      if (st.weight < 350) hints.push(T("hintThin"));
      if (bf.cls === "display" || bf.cls === "script") hints.push(T("hintDisplay"));
      $("sbHintList").innerHTML = hints.length
        ? hints.map(function (x) { return '<li data-state="warn">' + esc(x) + "</li>"; }).join("")
        : '<li data-state="good">' + esc(T("sbOk")) + "</li>";

      var rem = +(st.size / 16).toFixed(4);
      $("sbCode").textContent =
        ":root {\n" +
        "  --font-body: " + stack(bf) + ";\n" +
        "  --font-head: " + stack(hf) + ";\n" +
        "}\n\n" +
        "body {\n" +
        "  font-family: var(--font-body);\n" +
        "  font-size: " + rem + "rem; /* " + st.size + "px */\n" +
        "  font-weight: " + st.weight + ";\n" +
        "  line-height: " + Number(st.lh).toFixed(2).replace(/0$/, "") + ";\n" +
        (Number(st.tracking) ? "  letter-spacing: " + Number(st.tracking).toFixed(2) + "em;\n" : "") +
        "  color: " + st.fg + ";\n" +
        "  background: " + st.bg + ";\n" +
        "}\n\n" +
        "p {\n  max-width: " + st.measure + "ch;\n}\n\n" +
        "h1, h2, h3 {\n  font-family: var(--font-head);\n  font-weight: " + hw + ";\n  line-height: 1.2;\n}\n";

      Store.set("sandbox", st);
    }

    function bind(id, key, parse) {
      $(id).addEventListener("input", function (e) { st[key] = parse ? parse(e.target.value) : e.target.value; update(); });
    }
    bind("sbBody", "body");
    $("sbBody").addEventListener("change", function () { setWeightRange(); update(); });
    bind("sbHead", "head");
    bind("sbWeight", "weight", Number);
    bind("sbSize", "size", Number);
    bind("sbLh", "lh", Number);
    bind("sbMeasure", "measure", Number);
    bind("sbTrack", "tracking", Number);
    bind("sbFg", "fg");
    bind("sbBg", "bg");
    $("sbReset").addEventListener("click", function () { st = Object.assign({}, DEFAULTS); sync(); update(); });
    $("sbCopy").addEventListener("click", function () {
      var btn = $("sbCopy");
      var done = function () { btn.textContent = T("sbCopied"); setTimeout(function () { btn.textContent = T("sbCopy"); }, 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText($("sbCode").textContent).then(done, function () {});
    });

    sync();
    update();
    // font files load lazily — re-measure once the chosen face is ready
    if (document.fonts) document.fonts.ready.then(function () { if (document.body.contains(preview)) update(); });
    if (document.fonts) document.fonts.addEventListener("loadingdone", function h() {
      if (!document.body.contains(preview)) { document.fonts.removeEventListener("loadingdone", h); return; }
      update();
    });
  }

  window.Sandbox = { render: render };
})();
