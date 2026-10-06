/* App shell: language, theme, hash router and views. MIT License. */
(function () {
  "use strict";

  var COURSE = window.COURSE;
  var MODS = COURSE.modules;
  var view = document.getElementById("view");
  var lang = Store.get("lang") || (/^ru\b/i.test(navigator.language || "") ? "ru" : (navigator.language ? "en" : "ru"));

  /* ---------- helpers ---------- */

  function T(key) {
    var v = I18N[lang][key];
    if (typeof v === "function") return v.apply(null, Array.prototype.slice.call(arguments, 1));
    return v;
  }
  function L(obj) { return obj == null ? "" : (typeof obj === "string" ? obj : (obj[lang] || obj.ru || "")); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function icon(name) {
    var p = {
      arrowL: '<path d="M15 18l-6-6 6-6"/>',
      arrowR: '<path d="M9 18l6-6-6-6"/>',
      check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
      sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
      moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
      book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/>',
      link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'
    }[name];
    return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + p + "</svg>";
  }
  function moduleIndex(id) { for (var i = 0; i < MODS.length; i++) if (MODS[i].id === id) return i; return -1; }
  function stepsOf(m) { return m.draft || !m.cards || !m.cards.length ? 1 : m.cards.length; }
  function status(m) {
    var p = Store.peekModule(m.id);
    if (!p) return { key: "new", text: T("statusNew") };
    if (p.done) return { key: "done", text: T("statusDone") };
    return { key: "progress", text: T("statusProgress", Math.min(p.step + 1, stepsOf(m)), stepsOf(m)) };
  }
  function doneCount() { return MODS.filter(function (m) { var p = Store.peekModule(m.id); return p && p.done; }).length; }

  window.App = { T: T, L: L, esc: esc, get lang() { return lang; }, quizOrder: function (q, k) { return quizOrder(q, k); } };

  /* ---------- language & theme ---------- */

  function applyLang() {
    document.documentElement.lang = lang;
    document.title = T("htmlTitle");
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = T(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", T(el.getAttribute("data-i18n-aria"))); });
    document.querySelectorAll(".lang-btn").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
  }
  document.querySelectorAll(".lang-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      if (lang === b.dataset.lang) return;
      lang = b.dataset.lang; Store.set("lang", lang); applyLang(); route();
    });
  });

  var themeBtn = document.getElementById("themeBtn");
  function currentTheme() {
    return document.documentElement.dataset.theme ||
      (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  }
  function paintThemeBtn() { themeBtn.innerHTML = icon(currentTheme() === "dark" ? "sun" : "moon"); }
  if (Store.get("theme")) document.documentElement.dataset.theme = Store.get("theme");
  themeBtn.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next; Store.set("theme", next); paintThemeBtn();
  });
  paintThemeBtn();

  /* ---------- views ---------- */

  function renderHome() {
    var next = MODS.find(function (m) { var p = Store.peekModule(m.id); return !p || !p.done; });
    var nextStarted = next && Store.peekModule(next.id);
    var cta = next
      ? '<a class="btn btn-primary" href="#/m/' + next.id + '">' + esc(nextStarted || doneCount() ? T("continueModule", moduleIndex(next.id) + 1) : T("start")) + icon("arrowR") + "</a>"
      : '<a class="btn btn-primary" href="#/project">' + esc(T("allDone")) + icon("arrowR") + "</a>";
    var pct = Math.round(doneCount() / MODS.length * 100);

    var cards = MODS.map(function (m, i) {
      var st = status(m);
      return '<a class="mod-card" href="#/m/' + m.id + '" data-status="' + st.key + '">' +
        '<span class="mod-num">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<span class="mod-title">' + esc(L(m.title)) + "</span>" +
        '<span class="mod-goal">' + esc(L(m.goal)) + "</span>" +
        '<span class="mod-meta"><span class="pill pill-' + st.key + '">' + (st.key === "done" ? icon("check") : "") + esc(st.text) + "</span>" +
        '<span class="muted">' + esc(T("minutes", m.minutes)) + "</span></span></a>";
    }).join("");

    view.innerHTML =
      '<section class="hero">' +
        '<h1>' + esc(T("appName")) + "</h1>" +
        "<p>" + esc(T("tagline")) + "</p>" +
        '<div class="hero-actions">' + cta +
          '<a class="btn btn-ghost-light" href="#/sandbox">' + esc(T("navSandbox")) + "</a></div>" +
        '<a class="hero-progress" href="#/progress"><span class="bar"><span style="width:' + pct + '%"></span></span>' +
          '<span>' + esc(T("progressOverall", doneCount(), MODS.length)) + "</span></a>" +
      "</section>" +
      '<section class="sheet">' +
        '<div class="section-head"><h2>' + esc(T("courseMap")) + "</h2></div>" +
        '<div class="mod-grid">' + cards + "</div>" +
        '<div class="extra-grid">' +
          '<a class="extra-card" href="#/sandbox"><span class="extra-title">' + esc(T("sandboxCardTitle")) + "</span><span>" + esc(T("sandboxCardText")) + '</span><span class="extra-link">' + esc(T("open")) + icon("arrowR") + "</span></a>" +
          '<a class="extra-card" href="#/project"><span class="extra-title">' + esc(T("projectCardTitle")) + "</span><span>" + esc(T("projectCardText")) + '</span><span class="extra-link">' + esc(T("open")) + icon("arrowR") + "</span></a>" +
        "</div>" +
      "</section>";
  }

  function readingItem(r) {
    var meta = [r.author, r.site, L(r.note), r.type === "book" ? T("rdBook") : T("rdOnline"), r.lang ? r.lang.toUpperCase() : ""]
      .filter(Boolean).map(esc).join(" · ");
    var title = esc(L(r.title));
    var inner = '<span class="rd-ic">' + icon(r.type === "book" ? "book" : "link") + '</span><span class="rd-body"><span class="rd-title">' + title + '</span><span class="rd-meta">' + meta + "</span></span>";
    return r.url
      ? '<li><a class="rd" href="' + esc(r.url) + '" target="_blank" rel="noopener">' + inner + "</a></li>"
      : '<li><span class="rd">' + inner + "</span></li>";
  }

  function renderModule(id, stepParam) {
    var idx = moduleIndex(id);
    if (idx < 0) return renderNotFound();
    var m = MODS[idx];
    var total = stepsOf(m);
    var prog = Store.module(id);
    var step;
    if (stepParam === "summary") step = total;
    else if (stepParam) step = Math.max(0, Math.min(total, parseInt(stepParam, 10) - 1 || 0));
    else step = prog.done ? 0 : Math.min(prog.step, total);
    Store.updateModule(id, { step: step, maxStep: Math.max(prog.maxStep || 0, step) });

    var dots = "";
    for (var i = 0; i <= total; i++) {
      var cls = i === step ? "dot is-current" : (i <= (prog.maxStep || 0) ? "dot is-seen" : "dot");
      var href = "#/m/" + id + "/" + (i === total ? "summary" : i + 1);
      var label = i === total ? T("toSummary") : T("stepOf", i + 1, total);
      dots += '<a class="' + cls + (i === total ? " dot-summary" : "") + '" href="' + href + '" aria-label="' + esc(label) + '"' + (i === step ? ' aria-current="step"' : "") + "></a>";
    }

    var body = step < total ? renderCard(m, step) : renderSummary(m, idx);
    var prevHref = step > 0 ? "#/m/" + id + "/" + step : null;
    var nextHref = step < total ? "#/m/" + id + "/" + (step + 1 === total ? "summary" : step + 2) : null;

    view.innerHTML =
      '<section class="mod-head">' +
        '<a class="crumb" href="#/">' + icon("arrowL") + esc(T("backToMap")) + "</a>" +
        '<p class="eyebrow">' + esc(T("moduleN", idx + 1)) + (m.draft ? ' · <span class="tag-draft">' + esc(T("draft")) + "</span>" : "") + "</p>" +
        "<h1>" + esc(L(m.title)) + "</h1>" +
        '<p class="mod-goal-lg">' + esc(L(m.goal)) + "</p>" +
        '<nav class="dots" aria-label="steps">' + dots + "</nav>" +
      "</section>" +
      '<section class="stage" tabindex="-1">' + body +
        (step < total ? '<div class="stage-nav">' +
          (prevHref ? '<a class="btn btn-ghost" href="' + prevHref + '">' + icon("arrowL") + esc(T("back")) + "</a>" : "<span></span>") +
          '<span class="muted small">' + esc(T("stepOf", step + 1, total)) + "</span>" +
          '<a class="btn btn-primary" href="' + nextHref + '">' + esc(step + 1 === total ? T("toSummary") : T("next")) + icon("arrowR") + "</a>" +
        "</div>" : "") +
      "</section>";

    App.task = {
      done: function () {
        var p = Store.module(id); p.tasks = p.tasks || {};
        if (!p.tasks[step]) { p.tasks[step] = true; Store.updateModule(id, { tasks: p.tasks }); }
        var b = view.querySelector(".task-badge"); if (b) b.hidden = false;
      }
    };
    var demoEl = view.querySelector("[data-demo]");
    if (demoEl && window.Demos[demoEl.dataset.demo]) window.Demos[demoEl.dataset.demo](demoEl);
    var quizEl = view.querySelector(".quiz");
    if (quizEl) (quizEl.classList.contains("match") ? bindMatch : bindQuiz)(quizEl, m, step);
    var doneBtn = view.querySelector("[data-done]");
    if (doneBtn) doneBtn.addEventListener("click", function () {
      Store.updateModule(id, { done: true });
      route();
    });
    view.querySelector(".stage").focus({ preventScroll: true });
  }

  function renderCard(m, step) {
    if (m.draft || !m.cards || !m.cards.length) {
      return '<article class="lesson lesson-draft">' +
        '<p class="kind kind-idea">' + esc(T("plannedTopics")) + "</p>" +
        '<ul class="topics">' + m.topics.map(function (tp) { return "<li>" + esc(L(tp)) + "</li>"; }).join("") + "</ul>" +
        "</article>";
    }
    var c = m.cards[step];
    var kindKey = { "try": "kindTry", idea: "kindIdea", web: "kindWeb", check: "kindCheck", task: "kindTask" }[c.kind];
    var tp = Store.peekModule(m.id), taskDone = c.kind === "task" && tp && tp.tasks && tp.tasks[step];
    var html = '<article class="lesson lesson-' + c.kind + '">' +
      '<p class="kind kind-' + c.kind + '">' + esc(T(kindKey)) + (c.kind === "task" ? '<span class="task-badge"' + (taskDone ? "" : " hidden") + ">" + icon("check") + esc(T("taskDoneBadge")) + "</span>" : "") + "</p>" +
      "<h2>" + esc(L(c.title)) + "</h2>";
    if (c.body) html += '<p class="lesson-body">' + esc(L(c.body)) + "</p>";
    if (c.points) html += '<ul class="points">' + c.points.map(function (pt) { return "<li>" + esc(L(pt)) + "</li>"; }).join("") + "</ul>";
    if (c.code) html += '<pre class="code"><code>' + esc(L(c.code)) + "</code></pre>";
    if (c.demo) html += '<div class="demo" data-demo="' + esc(c.demo) + '"></div>';
    if (c.quiz) {
      html += '<form class="quiz"><fieldset><legend>' + esc(L(c.quiz.q)) + "</legend>" +
        quizOrder(c.quiz, "q25:" + m.id + ":" + step).map(function (i) {
          return '<label class="opt"><input type="radio" name="q" value="' + i + '"><span>' + esc(L(c.quiz.options[i])) + "</span></label>";
        }).join("") +
        '</fieldset><div class="quiz-foot"><button type="submit" class="btn btn-primary">' + esc(T("checkAnswer")) + '</button><p class="quiz-result" role="status"></p></div></form>';
    }
    if (c.match) {
      var terms = c.match.pairs.map(function (pr, i) { return { i: i, t: L(pr.term) }; })
        .sort(function (a, b) { return a.t.localeCompare(b.t, lang); });
      html += '<form class="quiz match"><p class="match-q">' + esc(L(c.match.q)) + '</p><ol class="match-list">' +
        c.match.pairs.map(function (pr, i) {
          return '<li class="match-row" data-i="' + i + '"><span class="match-def">' + esc(L(pr.def)) + '</span>' +
            '<select aria-label="' + esc(L(pr.def)) + '"><option value="">—</option>' +
            terms.map(function (tm) { return '<option value="' + tm.i + '">' + esc(tm.t) + "</option>"; }).join("") +
            "</select></li>";
        }).join("") +
        '</ol><div class="quiz-foot"><button type="submit" class="btn btn-primary">' + esc(T("checkAnswer")) + '</button><p class="quiz-result" role="status"></p></div></form>';
    }
    var src = c.sources || c.deeper;
    if (src && src.length) {
      html += '<section class="sources"><h3>' + esc(T("deeper")) + '</h3><ul class="rd-list">' + src.map(readingItem).join("") + "</ul></section>";
    }
    return html + "</article>";
  }

  /* Display order of quiz options: the correct answer is placed at a position derived
     from a hash of the card id, so its position varies between questions but stays
     stable for each question. quiz.fixedOrder keeps the authored order. */
  function quizOrder(q, key) {
    var n = q.options.length, idx = [];
    for (var i = 0; i < n; i++) idx.push(i);
    if (q.fixedOrder) return idx;
    var h = 0;
    for (var k = 0; k < key.length; k++) h = (h * 31 + key.charCodeAt(k)) >>> 0;
    var target = h % n;
    var rest = idx.filter(function (x) { return x !== q.answer; });
    rest.splice(target, 0, q.answer);
    return rest;
  }

  function bindQuiz(form, m, step) {
    var q = m.cards[step].quiz;
    var out = form.querySelector(".quiz-result");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var picked = form.querySelector("input:checked");
      if (!picked) return;
      var ok = Number(picked.value) === q.answer;
      form.querySelectorAll(".opt").forEach(function (o, i) {
        o.classList.toggle("is-right", ok && Number(o.querySelector("input").value) === q.answer);
        o.classList.toggle("is-wrong", !ok && o.contains(picked));
      });
      out.className = "quiz-result " + (ok ? "ok" : "bad");
      out.textContent = (ok ? T("correct") : T("wrong")) + " " + L(q.explain);
      var p = Store.module(m.id); p.quiz[step] = ok; Store.updateModule(m.id, { quiz: p.quiz });
    });
  }

  function bindMatch(form, m, step) {
    var out = form.querySelector(".quiz-result");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var rows = form.querySelectorAll(".match-row"), ok = 0;
      rows.forEach(function (r) {
        var v = r.querySelector("select").value;
        var right = v !== "" && Number(v) === Number(r.dataset.i);
        if (right) ok++;
        r.classList.toggle("is-right", right);
        r.classList.toggle("is-wrong", v !== "" && !right);
      });
      var all = ok === rows.length;
      out.className = "quiz-result " + (all ? "ok" : "bad");
      out.textContent = T("matchScore", ok, rows.length);
      var p = Store.module(m.id); p.quiz[step] = all; Store.updateModule(m.id, { quiz: p.quiz });
    });
  }

  function renderSummary(m, idx) {
    var prog = Store.module(m.id);
    var isLast = idx === MODS.length - 1;
    var nextHref = isLast ? "#/project" : "#/m/" + MODS[idx + 1].id;
    var sheet = m.cheatsheet && m.cheatsheet.length
      ? '<div class="summary-block"><h2>' + esc(T("cheatsheet")) + '</h2><ul class="cheats">' + m.cheatsheet.map(function (r) { return "<li>" + icon("check") + "<span>" + esc(L(r)) + "</span></li>"; }).join("") + "</ul></div>"
      : "";
    var reads = m.readings && m.readings.length
      ? '<div class="summary-block"><h2>' + esc(T("readings")) + '</h2><ul class="rd-list">' + m.readings.map(readingItem).join("") + "</ul></div>"
      : "";
    var action = prog.done
      ? '<p class="done-note">' + icon("check") + esc(T("moduleDone")) + '</p><a class="btn btn-primary" href="' + nextHref + '">' + esc(isLast ? T("doneLastModule") : T("doneNextModule")) + icon("arrowR") + "</a>"
      : '<button type="button" class="btn btn-primary" data-done>' + icon("check") + esc(T("markDone")) + "</button>";
    var tasks = [];
    (m.cards || []).forEach(function (c, i) { if (c.kind === "task") tasks.push({ c: c, i: i }); });
    var tDone = tasks.filter(function (x) { return prog.tasks && prog.tasks[x.i]; }).length;
    var tasksHtml = tasks.length
      ? '<div class="summary-block"><h2>' + esc(T("tasksTitle")) + ' <span class="muted small">' + esc(T("tasksCount", tDone, tasks.length)) + '</span></h2><ul class="task-list">' + tasks.map(function (x) {
          var ok = prog.tasks && prog.tasks[x.i];
          return '<li class="' + (ok ? "is-done" : "") + '"><a href="#/m/' + m.id + "/" + (x.i + 1) + '">' + (ok ? icon("check") : '<span class="task-dot"></span>') + "<span>" + esc(L(x.c.title)) + "</span></a></li>";
        }).join("") + "</ul></div>"
      : "";
    return '<article class="lesson lesson-summary">' + tasksHtml + sheet + reads +
      '<div class="summary-actions"><a class="btn btn-ghost" href="#/m/' + m.id + "/" + stepsOf(m) + '">' + icon("arrowL") + esc(T("back")) + "</a>" + action + "</div></article>";
  }

  function renderReading() {
    var html = '<div class="rd-group"><h2>' + esc(T("rdGeneral")) + '</h2><ul class="rd-list">' + COURSE.general.map(readingItem).join("") + "</ul></div>";
    MODS.forEach(function (m, i) {
      if (!m.readings || !m.readings.length) return;
      html += '<div class="rd-group"><h2><span class="muted">' + String(i + 1).padStart(2, "0") + "</span> " + esc(L(m.title)) + '</h2><ul class="rd-list">' + m.readings.map(readingItem).join("") + "</ul></div>";
    });
    view.innerHTML = '<section class="page-head"><h1>' + esc(T("rdTitle")) + "</h1><p>" + esc(T("rdIntro")) + "</p></section>" +
      '<section class="sheet narrow">' + html + "</section>";
  }

  function renderProgress() {
    var rows = MODS.map(function (m, i) {
      var st = status(m);
      var tn = (m.cards || []).map(function (c, k) { return c.kind === "task" ? k : -1; }).filter(function (k) { return k >= 0; });
      var pr = Store.peekModule(m.id), td = tn.filter(function (k) { return pr && pr.tasks && pr.tasks[k]; }).length;
      return '<li><a href="#/m/' + m.id + '"><span class="muted">' + String(i + 1).padStart(2, "0") + "</span><span>" + esc(L(m.title)) + (tn.length ? '<span class="pg-tasks">' + esc(T("tasksCount", td, tn.length)) + "</span>" : "") + '</span><span class="pill pill-' + st.key + '">' + esc(st.text) + "</span></a></li>";
    }).join("");
    view.innerHTML = '<section class="page-head"><h1>' + esc(T("pgTitle")) + "</h1><p>" + esc(T("pgIntro")) + "</p></section>" +
      '<section class="sheet narrow">' +
        (Store.available ? "" : '<p class="notice notice-warn">' + esc(T("pgStorageOff")) + "</p>") +
        '<ul class="pg-list">' + rows + "</ul>" +
        '<div class="pg-actions">' +
          '<button type="button" class="btn btn-primary" id="pgExport">' + esc(T("pgExport")) + "</button>" +
          '<label class="btn btn-ghost">' + esc(T("pgImport")) + '<input type="file" id="pgImport" accept="application/json,.json" hidden></label>' +
          '<button type="button" class="btn btn-danger" id="pgReset">' + esc(T("pgReset")) + "</button>" +
        '</div><p class="pg-msg" role="status"></p></section>';

    var msg = view.querySelector(".pg-msg");
    view.querySelector("#pgExport").addEventListener("click", function () {
      var blob = new Blob([Store.exportJSON()], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "typography-progress.json";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    });
    view.querySelector("#pgImport").addEventListener("change", function (e) {
      var f = e.target.files[0]; if (!f) return;
      f.text().then(function (txt) {
        try { Store.importJSON(txt); lang = Store.get("lang") || lang; applyLang(); renderProgress(); view.querySelector(".pg-msg").textContent = T("pgImported"); }
        catch (err) { msg.textContent = T("pgImportError"); }
      });
    });
    var armed = false;
    var resetBtn = view.querySelector("#pgReset");
    resetBtn.addEventListener("click", function () {
      if (!armed) { armed = true; resetBtn.textContent = T("pgResetConfirm"); return; }
      Store.reset(); renderProgress();
    });
  }

  function renderNotFound() {
    view.innerHTML = '<section class="page-head"><h1>404</h1><p>' + esc(T("notFound")) + '</p><p><a class="btn btn-ghost-light" href="#/">' + esc(T("backToMap")) + "</a></p></section>";
  }

  /* ---------- router ---------- */

  function setNav(name) {
    document.querySelectorAll(".nav a").forEach(function (a) {
      if (a.dataset.nav === name) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }

  function route() {
    var parts = (location.hash.replace(/^#\/?/, "") || "").split("/").filter(Boolean);
    var page = parts[0] || "";
    document.body.dataset.page = page || "home";
    if (page === "") { setNav("course"); renderHome(); }
    else if (page === "m") { setNav("course"); renderModule(parts[1], parts[2]); }
    else if (page === "sandbox") { setNav("sandbox"); window.Sandbox.render(view); }
    else if (page === "project") { setNav("project"); window.Project.render(view); }
    else if (page === "reading") { setNav("reading"); renderReading(); }
    else if (page === "progress") { setNav("progress"); renderProgress(); }
    else { setNav(""); renderNotFound(); }
  }

  var lastPage = null;
  window.addEventListener("hashchange", function () {
    var page = (location.hash.replace(/^#\/?/, "").split("/")[0]) || "";
    route();
    // keep scroll inside a module when stepping between cards
    if (!(page === "m" && lastPage === "m")) window.scrollTo(0, 0);
    lastPage = page;
  });

  applyLang();
  route();
  lastPage = (location.hash.replace(/^#\/?/, "").split("/")[0]) || "";
})();
