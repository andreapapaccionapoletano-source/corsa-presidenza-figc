/* FIGC 2026 — La corsa alla presidenza · logica della pagina (nessuna dipendenza esterna) */
(function () {
  "use strict";
  var D = window.FIGC_DATA, G = window.FIGC_GEO;
  var SVGNS = "http://www.w3.org/2000/svg";
  var SIDES = ["galliani", "undecided", "malago"];
  var SIDE_LABEL = { galliani: "Galliani", malago: "Malagò", undecided: "Incerto" };
  var SIDE_LETTER = { galliani: "G", malago: "M", undecided: "?" };
  var COMP_ORDER = ["aic", "aiac", "seriea", "lnd", "legapro", "serieb"];

  var clubById = {}; D.clubs.forEach(function (c) { clubById[c.id] = c; });
  var compById = {}; D.components.forEach(function (c) { compById[c.id] = c; });


  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, attrs, parent) {
    var n = document.createElementNS(SVGNS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function h(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fmt(n, d) { return n.toLocaleString("it-IT", { minimumFractionDigits: d == null ? 1 : d, maximumFractionDigits: d == null ? 1 : d }); }
  var MESI = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
  function fdate(iso) { var p = iso.slice(0, 10).split("-"); return +p[2] + " " + MESI[+p[1] - 1] + " " + p[0]; }
  function lum(hex) {
    var v = parseInt(hex.slice(1), 16), r = (v >> 16) / 255, g = ((v >> 8) & 255) / 255, b = (v & 255) / 255;
    function f(x) { return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  }
  function compName(id) { return id === "seriea" ? "Serie A" : compById[id].short; }
  function compWeight(id) { return id === "seriea" ? D.seriea.weight : compById[id].weight; }
  function compDelegates(id) { return id === "seriea" ? D.seriea.delegates : compById[id].delegates; }

  /* ---------- stato del simulatore ---------- */
  // split[id] = { g, m }: delegati della componente che votano Galliani / Malagò; il resto vota scheda bianca.
  var state = { clubs: {}, split: {}, serieaBloc: false, rounds: { 2: {}, 3: {} }, rules: "vigente", preset: "known", filter: "all", sel: null, view: null };
  var PRESET_LABEL = { known: "29 ottobre", official: "solo ufficiali", snipers: "franchi tiratori", blank: "tutto da decidere" };
  var ACTIONS = [
    ["", "come prima"],
    ["bg", "le bianche vanno a Galliani"],
    ["bm", "le bianche vanno a Malagò"],
    ["allg", "tutti con Galliani"],
    ["allm", "tutti con Malagò"],
    ["allb", "tutti scheda bianca"],
  ];

  function applyPreset(name) {
    state.preset = name; state.rounds = { 2: {}, 3: {} }; state.serieaBloc = false; state.view = null;
    var known = name === "known" || name === "snipers";
    D.clubs.forEach(function (c) { state.clubs[c.id] = known ? c.side : "undecided"; });
    D.components.forEach(function (c) {
      var side = known ? c.side : (name === "official" && c.status === "ufficiale" ? c.side : "undecided");
      var n = c.delegates, sp = { g: 0, m: 0 };
      if (side !== "undecided") {
        var k = name === "snipers" ? Math.round(n * 0.85) : n;
        var a = side === "galliani" ? "g" : "m", b = a === "g" ? "m" : "g";
        sp[a] = k; sp[b] = n - k;
      }
      state.split[c.id] = sp;
    });
  }
  function signature() { return JSON.stringify([state.clubs, state.split, state.serieaBloc, state.rounds, state.rules]); }
  applyPreset("known");
  var KNOWN_SIG = signature();

  function clubCounts() {
    var n = { galliani: 0, malago: 0, undecided: 0 };
    D.clubs.forEach(function (c) { n[state.clubs[c.id]]++; });
    return n;
  }
  function perDel(id) { return id === "seriea" ? D.seriea.perDelegate : compById[id].perDelegate; }
  var TOTAL = COMP_ORDER.reduce(function (s, id) { return s + compDelegates(id) * perDel(id); }, 0);


  /* ---------- hero, countdown, candidati ---------- */
  function renderStatic() {
    $("#headline").textContent = D.headline;
    var now = Date.now();
    function days(iso) { return Math.max(0, Math.ceil((new Date(iso).getTime() - now) / 864e5)); }
    $("#cd-deadline").textContent = days(D.election.deadline);
    $("#cd-assembly").textContent = days(D.election.assembly + "T09:00:00Z");

    ["galliani", "malago"].forEach(function (k) {
      var c = D.candidates[k], box = $("#cand-" + k);
      box.innerHTML =
        '<div class="cand-top"><div class="avatar"><span>' + esc(c.initials) + '</span></div>' +
        '<div><h3>' + esc(c.name) + '</h3><div class="role">' + esc(c.role) + '</div>' +
        '<div class="pct" id="pct-' + k + '">–</div></div></div>' +
        "<ul><li>" + esc(c.route) + "</li><li>" + esc(c.tessera) + "</li><li>" + esc(c.backers) + "</li></ul>";
      var img = new Image();
      img.alt = c.name;
      img.onload = function () { $(".avatar", box).appendChild(img); };
      img.src = c.photo;
    });

    // tabella regole
    var tb = $("#rtable tbody"), tot = 0;
    COMP_ORDER.slice().sort(function (a, b) { return compWeight(b) - compWeight(a); }).forEach(function (id) {
      var c = id === "seriea" ? D.seriea : compById[id], nd = compDelegates(id);
      tot += nd;
      var tr = h("tr", null,
        '<td><span class="dot" style="background:var(--gold)"></span>' + esc(id === "seriea" ? "Serie A" : c.name) + "</td>" +
        '<td class="w">' + c.weight + "%</td><td>" + nd + "</td><td>" + fmt(c.perDelegate, 3) + "</td><td>" + (Math.floor(nd / 2) + 1) + " su " + nd + "</td>");
      tb.appendChild(tr);
    });
    $("#tot-del").textContent = tot;

    // notiziario
    var tl = $("#timeline");
    D.news.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).forEach(function (n) {
      var li = h("li", null, '<time datetime="' + n.date + '">' + fdate(n.date) + '</time><span class="outlet">' + esc(n.outlet) + "</span>" +
        '<a href="' + esc(n.url) + '" target="_blank" rel="noopener">' + esc(n.title) + "</a>");
      tl.appendChild(li);
    });

    var d = new Date(D.updated);
    $("#updated").textContent = "Dati aggiornati al " + d.toLocaleString("it-IT", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Rome" }) + " (ora di Roma).";
    $("#sources").innerHTML = D.sources.map(function (s) { return s.url ? '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + "</a>" : esc(s.label); }).join(" · ");
  }

  /* ---------- mappa ---------- */
  var mapSvg = $("#map"), clubNodes = {};
  /* Simbolo stilizzato: scudo originale con i colori sociali e la sigla (non è lo stemma ufficiale). */
  function shieldPath(r) {
    var w = 0.74 * r, t = -0.84 * r, m = 0.12 * r, b = 0.92 * r;
    return "M" + (-w) + "," + t + " Q0," + (t - 0.14 * r) + " " + w + "," + t + " L" + w + "," + m +
      " Q" + w + "," + (0.62 * r) + " 0," + b + " Q" + (-w) + "," + (0.62 * r) + " " + (-w) + "," + m + " Z";
  }
  function drawKit(g, k, r) {
    var x = -r, y = -r, s = 2 * r, c = k.colors;
    el("rect", { x: x, y: y, width: s, height: s, fill: c[0] }, g);
    if (k.type === "stripes") {
      var n = k.n || 5, sw = 1.48 * r / n;
      for (var i = 1; i < n; i += 2) el("rect", { x: -0.74 * r + i * sw, y: y, width: sw, height: s, fill: c[1] }, g);
    } else if (k.type === "halves") {
      el("rect", { x: 0, y: y, width: r, height: s, fill: c[1] }, g);
    } else if (k.type === "diag") {
      el("path", { d: "M" + r + "," + (-r) + " L" + r + "," + r + " L" + (-r) + "," + r + " Z", fill: c[1] }, g);
    } else if (k.type === "band") {
      el("rect", { x: x, y: -0.14 * r, width: s, height: 0.34 * r, fill: c[1] }, g);
    } else if (k.type === "sash") {
      el("path", { d: "M" + (-r) + "," + (-0.55 * r) + " L" + (-0.55 * r) + "," + (-r) + " L" + r + "," + (0.55 * r) + " L" + (0.55 * r) + "," + r + " Z", fill: c[1] }, g);
    } else if (k.type === "chevron") {
      el("path", { d: "M" + (-r) + "," + (-0.5 * r) + " L0," + (0.05 * r) + " L" + r + "," + (-0.5 * r) + " L" + r + "," + (-0.2 * r) + " L0," + (0.35 * r) + " L" + (-r) + "," + (-0.2 * r) + " Z", fill: c[1] }, g);
    } else if (k.type === "tricolor") {
      el("rect", { x: x, y: -0.3 * r, width: s, height: 0.5 * r, fill: c[1] }, g);
      el("rect", { x: x, y: 0.2 * r, width: s, height: r, fill: c[2] }, g);
    }
  }
  function monogram(parent, c, r, uid) {
    var g = el("g", {}, parent);
    var clipId = "clip-" + uid, shId = "sh-" + uid;
    var cp = el("clipPath", { id: clipId }, g);
    el("circle", { r: r }, cp);
    var sp = el("clipPath", { id: shId }, g);
    el("path", { d: shieldPath(r) }, sp);
    var inner = el("g", {}, g);
    el("circle", { r: r, fill: "#ffffff" }, inner);
    var kit = el("g", { "clip-path": "url(#" + shId + ")" }, inner);
    drawKit(kit, c.kit || { type: "halves", colors: [c.c1, c.c2] }, r);
    el("path", { d: shieldPath(r), fill: "none", stroke: "#b8860b", "stroke-width": Math.max(0.8, r * 0.07), "stroke-linejoin": "round" }, inner);
    var t = el("text", { class: "abbr", y: -0.05 * r, "text-anchor": "middle", "dominant-baseline": "central", "font-family": "Barlow Condensed, Inter, sans-serif", "font-weight": 800, fill: "#fff", stroke: "rgba(0,0,0,.75)", "stroke-width": Math.max(1.8, r * 0.16), "stroke-linejoin": "round", "paint-order": "stroke", "font-size": r * 0.62 }, inner);
    t.textContent = c.abbr;
    // stemma vero opzionale: img/stemmi/<id>.png (o .svg) prende il posto dello scudo
    var im = el("image", { x: -r * 0.86, y: -r * 0.86, width: 1.72 * r, height: 1.72 * r, preserveAspectRatio: "xMidYMid meet" }, g);
    var tries = ["img/stemmi/" + c.id + ".png", "img/stemmi/" + c.id + ".svg"], ti = 0;
    im.addEventListener("error", function () {
      ti++; if (ti < tries.length) im.setAttribute("href", tries[ti]); else im.remove();
    });
    im.addEventListener("load", function () { kit.style.display = "none"; t.style.display = "none"; inner.lastChild.previousSibling.style.display = "none"; });
    im.setAttribute("href", tries[0]);
    return g;
  }

  function renderMap() {
    var defs = el("defs", {}, mapSvg);
    var sg = el("linearGradient", { id: "seaGrad", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el("stop", { offset: "0", "stop-color": "#eaf3fc" }, sg);
    el("stop", { offset: "1", "stop-color": "#d3e4f6" }, sg);
    var lg = el("linearGradient", { id: "landGrad", x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
    el("stop", { offset: "0", "stop-color": "#1f7fe0" }, lg);
    el("stop", { offset: "1", "stop-color": "#0052a8" }, lg);
    el("rect", { class: "sea", x: 0, y: 0, width: G.W, height: G.H, rx: 12 }, mapSvg);
    var cpm = el("clipPath", { id: "mapclip" }, defs);
    el("rect", { x: 0, y: 0, width: G.W, height: G.H, rx: 12 }, cpm);
    var land = el("g", { "clip-path": "url(#mapclip)" }, mapSvg);
    el("path", { class: "neighbor", d: G.neighbors }, land);
    el("path", { class: "italy", d: G.italy }, land);

    var lines = el("g", {}, mapSvg), dots = el("g", {}, mapSvg), badges = el("g", {}, mapSvg);
    D.clubs.forEach(function (c, i) {
      var p = G.pos[c.id], l = D.labelPos[c.id] || p;
      if (Math.hypot(p[0] - l[0], p[1] - l[1]) > 4) el("line", { class: "leader", x1: p[0], y1: p[1], x2: l[0], y2: l[1] }, lines);
      el("circle", { class: "city-dot", cx: p[0], cy: p[1], r: 2.6 }, dots);
      var g = el("g", { class: "club", transform: "translate(" + l[0] + "," + l[1] + ")", tabindex: 0, role: "button", "aria-label": c.name }, badges);
      el("circle", { class: "halo", r: 21 }, g);
      el("circle", { class: "backing", r: 17.5 }, g);
      monogram(g, c, 15, "map-" + i);
      el("circle", { class: "ring", r: 16.6 }, g);
      el("circle", { class: "flag-bg", cx: 12, cy: -12, r: 6.2 }, g);
      var f = el("text", { class: "flag", x: 12, y: -11.6 }, g);
      clubNodes[c.id] = { g: g, flag: f };
      g.addEventListener("click", function () { select(c.id); });
      g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(c.id); } });
      g.addEventListener("mouseenter", function (e) { tip(c.name + " · " + SIDE_LABEL[state.clubs[c.id]], e); });
      g.addEventListener("mousemove", function (e) { tip(null, e); });
      g.addEventListener("mouseleave", untip);
    });

    $all(".chip").forEach(function (b) {
      b.addEventListener("click", function () {
        state.filter = b.getAttribute("data-filter");
        $all(".chip").forEach(function (x) { x.classList.toggle("on", x === b); });
        update();
      });
    });
  }

  /* ---------- tooltip ---------- */
  var tipEl = $("#tip");
  function tip(text, e) {
    if (text != null) tipEl.textContent = text;
    tipEl.hidden = false;
    var x = e.clientX + 14, y = e.clientY + 14, w = tipEl.offsetWidth;
    if (x + w > window.innerWidth - 8) x = e.clientX - w - 10;
    tipEl.style.left = x + "px"; tipEl.style.top = y + "px";
  }
  function untip() { tipEl.hidden = true; }

  /* ---------- controlli comuni ---------- */
  function segControl(current, onPick, label) {
    var s = h("div", "seg"); s.setAttribute("role", "radiogroup"); s.setAttribute("aria-label", label);
    SIDES.forEach(function (k) {
      var b = h("button", k + (current === k ? " on" : ""), SIDE_LABEL[k]);
      b.setAttribute("role", "radio"); b.setAttribute("aria-checked", current === k ? "true" : "false");
      b.addEventListener("click", function () { onPick(k); });
      s.appendChild(b);
    });
    return s;
  }

  /* ---------- scrutini ---------- */
  function baseSplits() {
    var out = {}, n = clubCounts();
    if (state.serieaBloc && n.galliani >= 11) out.seriea = { g: 20, m: 0 };
    else if (state.serieaBloc && n.malago >= 11) out.seriea = { g: 0, m: 20 };
    else out.seriea = { g: n.galliani, m: n.malago };
    D.components.forEach(function (c) { out[c.id] = { g: state.split[c.id].g, m: state.split[c.id].m }; });
    return out;
  }
  function splitsAt(r) {
    var sp = baseSplits();
    for (var k = 2; k <= r; k++) {
      COMP_ORDER.forEach(function (id) {
        var a = state.rounds[k][id], s = sp[id], n = compDelegates(id), b = n - s.g - s.m;
        if (a === "bg") s.g += b; else if (a === "bm") s.m += b;
        else if (a === "allg") { s.g = n; s.m = 0; } else if (a === "allm") { s.g = 0; s.m = n; }
        else if (a === "allb") { s.g = 0; s.m = 0; }
      });
    }
    return sp;
  }
  function votes(sp) {
    var g = 0, m = 0;
    COMP_ORDER.forEach(function (id) { g += sp[id].g * perDel(id); m += sp[id].m * perDel(id); });
    return { g: g / TOTAL * 100, m: m / TOTAL * 100, b: (TOTAL - g - m) / TOTAL * 100, gv: g, mv: m };
  }
  function threshold(r) {
    if (state.rules === "storiche") return r === 1 ? { pct: 75, strict: false, label: "75% (tre quarti)" } : r === 2 ? { pct: 200 / 3, strict: false, label: "66,7% (due terzi)" } : { pct: 50, strict: true, label: "50% + 1 voto" };
    return { pct: 50, strict: true, label: "50% + 1 voto" };
  }
  function passes(p, t) { return t.strict ? p > t.pct + 1e-9 : p >= t.pct - 1e-9; }
  function simulate() {
    var res = [], winner = null;
    for (var r = 1; r <= 3; r++) {
      var sp = splitsAt(r), v = votes(sp), t = threshold(r), w = null;
      if (passes(v.g, t)) w = "galliani"; else if (passes(v.m, t)) w = "malago";
      res.push({ r: r, sp: sp, v: v, t: t, w: w });
      if (w) { winner = { side: w, r: r, pct: w === "galliani" ? v.g : v.m }; break; }
    }
    return { rounds: res, winner: winner };
  }
  var NAME = { galliani: "Galliani", malago: "Malagò" };
  var ORD = { 1: "1°", 2: "2°", 3: "3°" };

  /* ---------- esito e scrutini ---------- */
  function renderEsito(sim) {
    var box = $("#esito");
    if (sim.winner) {
      box.className = "esito " + sim.winner.side;
      box.innerHTML = '<span class="esito-k">Eletto</span><b>' + NAME[sim.winner.side] + "</b><span>al " + ORD[sim.winner.r] + " scrutinio con il " + fmt(sim.winner.pct) + "% dei voti</span>";
    } else {
      box.className = "esito none";
      box.innerHTML = '<span class="esito-k">Nessun eletto</span><b>Fumata nera</b><span>Dopo tre scrutini nessuno raggiunge la soglia. Il regolamento non dice cosa succede: decide il presidente dell\'Assemblea (art. 4, c. 3).</span>';
    }
  }
  function miniBar(v, t) {
    return '<div class="rbar"><div class="rg" style="width:' + v.g + '%"></div><div class="rb" style="width:' + v.b + '%"></div><div class="rm" style="width:' + v.m + '%"></div><i style="left:' + t.pct + '%"></i></div>';
  }
  function renderRounds(sim) {
    var box = $("#rounds"); box.innerHTML = "";
    var last = sim.rounds[sim.rounds.length - 1].r;
    if (!state.view || state.view > last) state.view = last;
    for (var r = 1; r <= 3; r++) {
      var x = sim.rounds[r - 1];
      var card = h("div", "round" + (x ? "" : " off") + (x && state.view === r ? " on" : "") + (x && x.w ? " won " + x.w : ""));
      if (!x) {
        card.innerHTML = "<h3>" + ORD[r] + " scrutinio</h3><p class='muted'>Non serve: il presidente è già eletto.</p>";
        box.appendChild(card); continue;
      }
      var out = x.w ? '<div class="rout ' + x.w + '">Eletto ' + NAME[x.w] + "</div>" : '<div class="rout none">Nessuno raggiunge la soglia</div>';
      card.innerHTML = '<button class="rhead" aria-label="Mostra il ' + ORD[r] + ' scrutinio nell\'emiciclo"><h3>' + ORD[r] + " scrutinio</h3><span>soglia " + x.t.label + "</span></button>" +
        miniBar(x.v, x.t) +
        '<div class="rnums"><span class="g">G ' + fmt(x.v.g) + '%</span><span class="b">bianche ' + fmt(x.v.b) + '%</span><span class="m">M ' + fmt(x.v.m) + "%</span></div>" + out;
      (function (rr) { $(".rhead", card).addEventListener("click", function () { state.view = rr; update(true); }); })(r);
      if (r >= 2) {
        var ch = h("details", "rchg");
        if (Object.keys(state.rounds[r]).some(function (k) { return state.rounds[r][k]; })) ch.open = true;
        ch.innerHTML = "<summary>Cosa cambia rispetto al " + ORD[r - 1] + " scrutinio</summary>";
        var list = h("div", "rchg-list");
        COMP_ORDER.forEach(function (id) {
          var row = h("label", "rchg-row", "<span>" + esc(compName(id)) + "</span>");
          var sel = document.createElement("select");
          ACTIONS.forEach(function (a) { var o = document.createElement("option"); o.value = a[0]; o.textContent = a[1]; sel.appendChild(o); });
          sel.value = state.rounds[r][id] || "";
          (function (rr, cid) { sel.addEventListener("change", function () { state.rounds[rr][cid] = sel.value; state.view = null; update(); }); })(r, id);
          row.appendChild(sel); list.appendChild(row);
        });
        ch.appendChild(list); card.appendChild(ch);
      }
      box.appendChild(card);
    }
  }

  /* ---------- emiciclo ---------- */
  var seatLayout = null;
  function layoutSeats(N) {
    var rows = 8, rIn = 0.5, rOut = 1, radii = [], tot = 0;
    for (var i = 0; i < rows; i++) { var r = rIn + (rOut - rIn) * i / (rows - 1); radii.push(r); tot += r; }
    var counts = radii.map(function (r) { return Math.floor(N * r / tot); });
    var rest = N - counts.reduce(function (a, b) { return a + b; }, 0);
    for (var j = rows - 1; rest > 0; j = (j - 1 + rows) % rows, rest--) counts[j]++;
    var seats = [];
    radii.forEach(function (r, i) {
      var k = counts[i];
      for (var s = 0; s < k; s++) { var a = Math.PI * (1 - (k === 1 ? 0.5 : s / (k - 1))); seats.push({ a: a, r: r }); }
    });
    seats.sort(function (p, q) { return q.a - p.a || p.r - q.r; });
    return seats;
  }
  var SEAT_LABEL = { galliani: "vota Galliani", malago: "vota Malagò", undecided: "scheda bianca" };
  function renderHemi(x) {
    var svg = $("#hemi"), seats = [];
    COMP_ORDER.forEach(function (id) {
      var s = x.sp[id], n = compDelegates(id);
      for (var i = 0; i < s.g; i++) seats.push({ comp: id, side: "galliani" });
      for (i = 0; i < n - s.g - s.m; i++) seats.push({ comp: id, side: "undecided" });
      for (i = 0; i < s.m; i++) seats.push({ comp: id, side: "malago" });
    });
    var N = seats.length;
    if (!seatLayout || seatLayout.length !== N) {
      svg.innerHTML = ""; seatLayout = layoutSeats(N);
      var cx = 300, cy = 300, R = 285;
      seatLayout.forEach(function (p) {
        var c = el("circle", { class: "seat", cx: (cx + R * p.r * Math.cos(p.a)).toFixed(1), cy: (cy - R * p.r * Math.sin(p.a)).toFixed(1), r: 6.3 }, svg);
        c.addEventListener("mouseenter", function (e) { tip(c.getAttribute("data-tip"), e); });
        c.addEventListener("mousemove", function (e) { tip(null, e); });
        c.addEventListener("mouseleave", untip);
        p.node = c;
      });
      el("text", { class: "hemi-num", x: 300, y: 276, id: "hemi-num" }, svg);
      el("text", { class: "hemi-sub", x: 300, y: 300 }, svg).textContent = "delegati: Galliani · schede bianche · Malagò";
    }
    var ordered = [];
    SIDES.forEach(function (s) { COMP_ORDER.forEach(function (cid) { seats.forEach(function (q) { if (q.side === s && q.comp === cid) ordered.push(q); }); }); });
    var cnt = { galliani: 0, malago: 0, undecided: 0 };
    ordered.forEach(function (q, i) {
      var n = seatLayout[i].node; n.setAttribute("class", "seat " + q.side);
      n.setAttribute("data-tip", "Delegato " + compName(q.comp) + " · " + SEAT_LABEL[q.side]); cnt[q.side]++;
    });
    var num = $("#hemi-num"); num.innerHTML = "";
    [["galliani", "var(--g)"], ["undecided", "#8a96a8"], ["malago", "var(--m)"]].forEach(function (p, i) {
      if (i) { var sep = document.createElementNS(SVGNS, "tspan"); sep.setAttribute("fill", "#b5bfcc"); sep.textContent = " · "; num.appendChild(sep); }
      var ts = document.createElementNS(SVGNS, "tspan"); ts.setAttribute("fill", p[1]); ts.textContent = cnt[p[0]]; num.appendChild(ts);
    });
    $("#hemi-cap").innerHTML = "Emiciclo e barra dei voti: <b>" + ORD[x.r] + " scrutinio</b>" + (x.w ? " · eletto " + NAME[x.w] : "");
  }

  /* ---------- barra pesata ---------- */
  function renderWbar(x) {
    var bar = $("#wbar"); bar.innerHTML = '<i class="w50" aria-hidden="true" style="left:' + x.t.pct + '%"></i>';
    $("#wbar-mid").textContent = "soglia " + x.t.label;
    $("#wbar-mid").style.left = x.t.pct + "%";
    SIDES.forEach(function (s) {
      COMP_ORDER.forEach(function (cid) {
        var sp = x.sp[cid], n = compDelegates(cid);
        var d = s === "galliani" ? sp.g : s === "malago" ? sp.m : n - sp.g - sp.m;
        var pct = d * perDel(cid) / TOTAL * 100;
        if (pct < 1e-6) return;
        var seg = h("div", "wseg " + s, pct >= 4.5 ? esc(compName(cid)) + " " + fmt(pct, pct % 1 > 0.05 && pct % 1 < 0.95 ? 1 : 0) + "%" : "");
        seg.style.width = pct + "%";
        seg.addEventListener("mouseenter", function (e) { tip(compName(cid) + " · " + d + " delegati · " + SEAT_LABEL[s] + ": " + fmt(pct) + "%", e); });
        seg.addEventListener("mousemove", function (e) { tip(null, e); });
        seg.addEventListener("mouseleave", untip);
        bar.appendChild(seg);
      });
    });
    setTimeout(function () {
      $all(".wseg", bar).forEach(function (d) { if (d.scrollWidth > d.clientWidth + 1) d.textContent = ""; });
    }, 560);
  }

  /* ---------- controlli delle componenti (1° scrutinio) ---------- */
  var STATUS_LABEL = { ufficiale: "Ufficiale", presunta: "Presunta", nessuna: "Nessuna indicazione" };
  function compRowInfo(c) {
    var sp = state.split[c.id], n = c.delegates, b = n - sp.g - sp.m;
    return { g: sp.g, m: sp.m, b: b, gp: sp.g * c.perDelegate / TOTAL * 100, mp: sp.m * c.perDelegate / TOTAL * 100, bp: b * c.perDelegate / TOTAL * 100 };
  }
  function renderComps() {
    var box = $("#comps"); box.innerHTML = '<h3 class="comps-h">Il 1° scrutinio, componente per componente</h3>';
    var n = clubCounts();
    var sa = h("div", "comp");
    sa.innerHTML = '<div class="cname"><b>Serie A</b><span class="cw">18%</span><small>20 club · ' + n.galliani + " Galliani · " + n.undecided + " bianca · " + n.malago + " Malagò</small></div>" +
      '<span class="st presunta">Presunta</span>' +
      '<div class="cnote">Club per club: sposta i club dalla mappa qui sopra. Le posizioni sono quelle riportate dalle testate.</div>' +
      '<label class="tgl"><input type="checkbox" ' + (state.serieaBloc ? "checked" : "") + '> Serie A in blocco: chi ha 11 club prende tutti i 20 voti</label>';
    $("input", sa).addEventListener("change", function (e) { state.serieaBloc = e.target.checked; state.view = null; update(); });
    box.appendChild(sa);

    D.components.forEach(function (c) {
      var row = h("div", "comp");
      row.appendChild(h("div", "cname", "<b>" + esc(c.short) + '</b><span class="cw">' + c.weight + "%</span><small>" + c.delegates + " delegati · " + esc(c.leader) + "</small>"));
      row.appendChild(h("span", "st " + c.status, STATUS_LABEL[c.status] + (c.side !== "undecided" ? ": " + NAME[c.side] : "")));
      var quick = h("div", "quick");
      [["allg", "Tutti a Galliani", "galliani"], ["allb", "Scheda bianca", "undecided"], ["allm", "Tutti a Malagò", "malago"]].forEach(function (q) {
        var bt = h("button", "qb " + q[2], q[1]);
        bt.addEventListener("click", function () {
          var sp = state.split[c.id];
          sp.g = q[0] === "allg" ? c.delegates : 0; sp.m = q[0] === "allm" ? c.delegates : 0;
          state.view = null; update();
        });
        quick.appendChild(bt);
      });
      row.appendChild(quick);
      var sl = h("div", "sliders");
      sl.innerHTML =
        '<label class="sl g"><span>Galliani</span><input type="range" min="0" max="' + c.delegates + '" step="1" data-k="g" aria-label="Delegati ' + esc(c.short) + ' per Galliani"><output></output></label>' +
        '<label class="sl m"><span>Malagò</span><input type="range" min="0" max="' + c.delegates + '" step="1" data-k="m" aria-label="Delegati ' + esc(c.short) + ' per Malagò"><output></output></label>' +
        '<div class="cbar"><div class="cg"></div><div class="cb"></div><div class="cm"></div></div><div class="cbar-l"></div>';
      function paint() {
        var info = compRowInfo(c), w = c.delegates;
        $("input[data-k=g]", sl).value = info.g; $("input[data-k=m]", sl).value = info.m;
        $(".sl.g output", sl).textContent = info.g + " · " + fmt(info.gp) + "%";
        $(".sl.m output", sl).textContent = info.m + " · " + fmt(info.mp) + "%";
        $(".cg", sl).style.width = info.g / w * 100 + "%"; $(".cb", sl).style.width = info.b / w * 100 + "%"; $(".cm", sl).style.width = info.m / w * 100 + "%";
        $(".cbar-l", sl).textContent = info.b ? info.b + " delegati in bianca (" + fmt(info.bp) + "%)" : "nessuna scheda bianca";
      }
      $all("input", sl).forEach(function (inp) {
        inp.addEventListener("input", function () {
          var sp = state.split[c.id], k = inp.getAttribute("data-k"), o = k === "g" ? "m" : "g";
          sp[k] = +inp.value;
          if (sp.g + sp.m > c.delegates) sp[o] = c.delegates - sp[k];
          paint(); state.view = null; update(true);
        });
      });
      paint();
      row.appendChild(sl);
      row.appendChild(h("div", "cnote", esc(c.note) + ' <a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + esc(c.outlet) + ", " + fdate(c.date) + "</a>"));
      box.appendChild(row);
    });
  }

  /* ---------- coalizioni (1° scrutinio) ---------- */
  function winningSets(base, units) {
    var sets = [], N = units.length;
    for (var mask = 1; mask < (1 << N); mask++) {
      var w = 0, pick = [];
      for (var i = 0; i < N; i++) if (mask & (1 << i)) { w += units[i].w; pick.push(i); }
      if (base + w > 50 + 1e-9) sets.push({ mask: mask, w: w, pick: pick });
    }
    var min = sets.filter(function (s) { return !sets.some(function (o) { return o.mask !== s.mask && (o.mask & s.mask) === o.mask; }); });
    min.sort(function (a, b) { return a.pick.length - b.pick.length || b.w - a.w; });
    return min.map(function (s) { return { units: s.pick.map(function (i) { return units[i]; }), total: base + s.w }; });
  }
  function blankUnits(x) {
    var u = [];
    COMP_ORDER.forEach(function (id) {
      var s = x.sp[id], b = compDelegates(id) - s.g - s.m;
      if (b > 0) u.push({ id: id, label: id === "seriea" ? (b === 1 ? "il club in bianca" : "i " + b + " club in bianca") : compName(id) + (b < compDelegates(id) ? " (" + b + " in bianca)" : ""), w: b * perDel(id) / TOTAL * 100 });
    });
    return u;
  }
  function renderCoal(x) {
    var box = $("#coal"), units = blankUnits(x);
    var html = "<h3>Chi deve prendere cosa</h3><p>Partendo dal 1° scrutinio: le combinazioni minime di schede bianche che porterebbero ciascun candidato oltre il 50% + 1 voto.</p>";
    [["galliani", "g"], ["malago", "m"]].forEach(function (k) {
      var base = k[0] === "galliani" ? x.v.g : x.v.m;
      html += '<div class="who ' + k[1] + '">' + NAME[k[0]] + " · parte da " + fmt(base) + "%</div><ul>";
      if (base > 50) html += '<li class="won">Ha già la maggioranza assoluta<em>' + fmt(base) + "%</em></li>";
      else {
        var sets = winningSets(base, units);
        if (!sets.length) html += "<li>Anche con tutte le bianche non arriva al 50%: deve strappare voti all'avversario.</li>";
        sets.slice(0, 5).forEach(function (s) {
          html += "<li><span>" + s.units.map(function (u) { return esc(u.label); }).join(" + ") + "</span><em>→ " + fmt(s.total) + "%</em></li>";
        });
      }
      html += "</ul>";
    });
    box.innerHTML = html;
  }

  /* ---------- pannello di dettaglio ---------- */
  function renderDetail() {
    var box = $("#detail"); box.innerHTML = "";
    if (!state.sel) {
      box.innerHTML =
        '<div class="intro"><h3>Come leggere la mappa</h3>' +
        "<p>Il pallino d'oro è la città, lo scudo è il club. Il colore dell'anello dice da che parte lo danno le testate al 29 ottobre: nessun club ha ancora depositato la firma.</p>" +
        '<div class="legend"><span><i style="border-color:var(--g)"></i>Con Galliani (presunto)</span><span><i style="border-color:var(--m)"></i>Con Malagò (tra le 11 firme riportate)</span><span><i style="border-color:var(--u);border-style:dashed"></i>Incerto: nel simulatore vota scheda bianca</span></div>' +
        '<p class="muted" style="margin-top:14px">Tocca un club per vedere la fonte e spostarlo. Il simulatore qui sotto si aggiorna subito.</p></div>';
      return;
    }
    var c = clubById[state.sel], side = state.clubs[c.id];
    var top = h("div", "d-top");
    var crest = document.createElementNS(SVGNS, "svg");
    crest.setAttribute("viewBox", "-20 -20 40 40"); crest.setAttribute("class", "crest");
    monogram(crest, c, 18, "det-" + c.id);
    el("circle", { r: 18.8, fill: "none", stroke: "var(--" + (side === "galliani" ? "g" : side === "malago" ? "m" : "u") + ")", "stroke-width": 2.4 }, crest);
    top.appendChild(crest);
    top.appendChild(h("div", null, "<h3>" + esc(c.name) + '</h3><div class="city">' + esc(c.city) + ' · 1 delegato · 0,9% dei voti</div><span class="tag ' + side + '">' + SIDE_LABEL[side] + (side !== c.side ? " (proiezione)" : " · " + STATUS_LABEL[c.status].toLowerCase()) + "</span>"));
    box.appendChild(top);
    box.appendChild(h("p", "note", esc(c.note)));
    box.appendChild(h("div", "src", 'Fonte: <a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + esc(c.outlet) + "</a>, " + fdate(c.date) + (side !== c.side ? " · al 29 ottobre: " + SIDE_LABEL[c.side] : "")));
    box.appendChild(h("div", "sim-label", "Sposta nel simulatore"));
    box.appendChild(segControl(side, function (k) { state.clubs[c.id] = k; state.view = null; update(); }, "Schieramento di " + c.name));
  }
  function select(id) { state.sel = state.sel === id ? null : id; update(); }

  /* ---------- aggiornamento ---------- */
  function update(fromSlider) {
    var sim = simulate(), first = sim.rounds[0];
    // punteggio in alto: 1° scrutinio
    $("#score-cap").textContent = "1° scrutinio · scenario " + PRESET_LABEL[state.preset] + (signature() !== KNOWN_SIG && state.preset === "known" ? " (modificato)" : "");
    $("#score-g").textContent = fmt(first.v.g);
    $("#score-m").textContent = fmt(first.v.m);
    $("#score-u").textContent = "bianche " + fmt(first.v.b) + "%";
    $(".bar-g").style.width = first.v.g + "%";
    $(".bar-u").style.width = first.v.b + "%";
    $(".bar-m").style.width = first.v.m + "%";
    $(".bar-50").style.left = first.t.pct + "%";
    $("#pct-galliani").textContent = fmt(first.v.g) + "%";
    $("#pct-malago").textContent = fmt(first.v.m) + "%";
    $("#score-note").textContent = sim.winner
      ? "Proiezione: eletto " + NAME[sim.winner.side] + " al " + ORD[sim.winner.r] + " scrutinio (" + fmt(sim.winner.pct) + "%)."
      : "Proiezione: nessuno arriva alla soglia in tre scrutini.";
    // mappa
    var n = clubCounts();
    $("#n-g").textContent = n.galliani; $("#n-m").textContent = n.malago; $("#n-u").textContent = n.undecided;
    D.clubs.forEach(function (c) {
      var s = state.clubs[c.id], node = clubNodes[c.id];
      node.g.setAttribute("class", "club " + s + (s !== c.side ? " sim" : "") + (state.sel === c.id ? " sel" : "") +
        (state.filter !== "all" && state.filter !== s ? " dim" : ""));
      node.flag.textContent = SIDE_LETTER[s];
    });
    var pips = "", order = [];
    ["malago", "undecided", "galliani"].forEach(function (s) { for (var i = 0; i < n[s]; i++) order.push(s); });
    order.forEach(function (s, i) { pips += '<span class="pip ' + (s === "malago" ? "m" : s === "galliani" ? "g" : "") + (i === 10 ? " t" : "") + '"></span>'; });
    $("#quorum").innerHTML = '<div class="pips" aria-hidden="true">' + pips + "</div><span>" +
      (n.malago >= 11 ? "Malagò ha " + n.malago + " club: basta per l'accredito della Serie A (11 su 20)." :
        n.galliani >= 11 ? "Galliani ha " + n.galliani + " club: basta per l'accredito della Serie A." :
          "Nessuno ha 11 club: la Serie A non accredita nessuno.") + "</span>";
    // simulatore
    $all(".preset").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-preset") === state.preset); });
    $all(".seg-rules button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-rules") === state.rules); });
    renderEsito(sim);
    renderRounds(sim);
    var shown = sim.rounds[Math.min(state.view, sim.rounds.length) - 1];
    renderHemi(shown);
    renderWbar(shown);
    if (!fromSlider) { renderComps(); renderDetail(); }
    renderCoal(first);
    $("#simflag").hidden = signature() === KNOWN_SIG;
  }

  /* ---------- comandi ---------- */
  $all(".preset").forEach(function (b) {
    b.addEventListener("click", function () { applyPreset(b.getAttribute("data-preset")); update(); });
  });
  $all(".seg-rules button").forEach(function (b) {
    b.addEventListener("click", function () { state.rules = b.getAttribute("data-rules"); state.view = null; update(); });
  });
  $("#reset").addEventListener("click", function () { applyPreset("known"); state.rules = "vigente"; state.sel = null; update(); });

  renderStatic();
  renderMap();
  update();
})();
