/* Tennessee Explorer, Phase 5: Nashville (Davidson) and Memphis (Shelby) homes by mega-block (TN-only page, not shared with KY).
   Data: city/<city>.json from scripts/tn_city_build.py. Block stats are computed here from the current criteria.
   Criteria are kept per main-app profile (P1..P4, names read from the main map's kyx_prof_* keys) under tnx_city_<slot>;
   "All" (no profile) uses tnx_city_all. Hash routes: #nashville, #memphis, #<city>/b=<block>, #<city>/l=<zpid>. */
(function () {
  "use strict";
  const $ = s => document.querySelector(s);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = v => v == null ? "–" : v >= 1e6 ? "$" + (v / 1e6).toFixed(2) + "M" : "$" + Math.round(v / 1000) + "k";
  const fmt = v => v == null ? "–" : Math.round(v).toLocaleString("en-US");
  const med = a => { a = a.filter(v => v != null).sort((x, y) => x - y); if (!a.length) return null; const m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; };
  const DEF = { types: ["house", "condo", "townhome"], pmax: 600000, pmin: 0, bd: 2, ba: 2, sf: 1000, ac: 0, er: null };
  const TCOL = { house: "#2b6cb0", condo: "#8e44ad", townhome: "#e67e22" }, TNAME = { house: "House", condo: "Condo", townhome: "Townhome" };
  const MET = { n: ["Homes that match", v => fmt(v), 1], mp: ["Median price", money, 0], ppsf: ["Median $ / sq ft", v => v == null ? "–" : "$" + Math.round(v), 0], er: ["Median ER drive", v => v == null ? "–" : Math.round(v) + " min", 0], cs: ["Condo + townhome share", v => v == null ? "–" : Math.round(v * 100) + "%", 1] };
  const RAMP = ["#f7fbff", "#c6dbef", "#6baed6", "#2171b5", "#08306b"];
  const SLOTS = ["P1", "P2", "P3", "P4"];
  const IMG = r => r.img ? (/^https?:/.test(r.img) ? r.img : "https://photos.zillowstatic.com/fp/" + r.img) : null, ZURL = r => `https://www.zillow.com/homedetails/${r.id}_zpid/`;
  const pGet = k => { try { return JSON.parse(localStorage.getItem("kyx_prof_" + k) || "null"); } catch (e) { return null; } };
  const pName = k => (pGet(k) || {}).name || (k === "P1" ? "Bill" : "");
  let slot = localStorage.getItem("kyx_prof_active") || "all";
  const critKey = () => "tnx_city_" + slot;
  const loadCrit = () => { try { return Object.assign({}, DEF, JSON.parse(localStorage.getItem(critKey()) || "null") || {}); } catch (e) { return Object.assign({}, DEF); } };
  let C = loadCrit();
  const D = {}; let city = null, map, blockLayer, pinLayer, labels, legend, metric = "n", stats = {}, hosp = {};

  map = L.map("cmap", { preferCanvas: true, zoomControl: true, attributionControl: true }).setView([36.16, -86.78], 11);
  map.attributionControl.setPrefix(false);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(map);
  const canvas = L.canvas({ padding: 0.3 });

  const match = r => C.types.includes(r.t) && r.p <= (C.pmax || 1e12) && r.p >= (C.pmin || 0) && (r.bd || 0) >= (C.bd || 0) && (r.ba || 0) >= (C.ba || 0)
    && (!C.sf || (r.sf || 0) >= C.sf) && (!C.ac || (r.ac || 0) >= C.ac) && (C.er == null || C.er === "" || (r.er && r.er[1] <= C.er));
  function compute() {
    stats = {};
    const d = D[city]; d.blocks.forEach(b => stats[b.id] = { rows: [] });
    d.listings.forEach(r => { if (match(r) && stats[r.b]) stats[r.b].rows.push(r); });
    for (const b of d.blocks) {
      const s = stats[b.id], rs = s.rows;
      s.n = rs.length; s.mp = med(rs.map(r => r.p)); s.ppsf = med(rs.map(r => r.ppsf)); s.er = med(rs.map(r => r.er && r.er[1])); s.tr = med(rs.map(r => r.tr && r.tr[1]));
      s.sf = med(rs.map(r => r.sf)); s.cs = rs.length ? rs.filter(r => r.t !== "house").length / rs.length : null;
      s.all = d.listings.filter(r => r.b === b.id).length;
    }
  }
  function classes() {
    const vals = Object.values(stats).map(s => s[metric]).filter(v => v != null).sort((a, b) => a - b);
    const brk = [1, 2, 3, 4].map(i => vals[Math.min(vals.length - 1, Math.floor(i * vals.length / 5))]);
    return v => v == null ? -1 : brk.filter(x => v > x).length;
  }
  function draw() {
    compute(); const d = D[city], cl = classes();
    if (blockLayer) map.removeLayer(blockLayer); if (pinLayer) map.removeLayer(pinLayer); if (labels) map.removeLayer(labels);
    blockLayer = L.layerGroup(); labels = L.layerGroup();
    for (const b of d.blocks) {
      const s = stats[b.id], k = cl(s[metric]);
      const poly = L.geoJSON(b.geom, { style: { color: "#33475b", weight: 1.4, fillColor: k < 0 ? "#e5e8eb" : RAMP[k], fillOpacity: 0.55 } });
      poly.on("click", () => go("b=" + b.id)); poly.bindTooltip(`${esc(b.name)}: ${MET[metric][1](s[metric])}`, { sticky: true });
      blockLayer.addLayer(poly);
      const lm = L.marker(b.c, { interactive: false, icon: L.divIcon({ className: "blab", html: esc(b.name.split(" / ")[0]) + "<br>" + fmt(s.n), iconSize: null }) }); lm._bb = poly.getBounds(); labels.addLayer(lm);
    }
    blockLayer.addTo(map);
    pinLayer = L.layerGroup();
    for (const r of d.listings) if (match(r)) {
      const m = L.circleMarker([r.lat, r.lon], { renderer: canvas, radius: 4, weight: 1, color: "#fff", fillColor: TCOL[r.t], fillOpacity: 0.9 });
      m.on("click", e => { L.DomEvent.stop(e); go("l=" + r.id); }); m.bindTooltip(`${money(r.p)} · ${TNAME[r.t]}`); pinLayer.addLayer(m);
    }
    for (const h of d.hospitals) if (h.er || h.tr) {
      const m = L.marker([h.lat, h.lon], { icon: L.divIcon({ className: "", html: `<div title="${esc(h.n)}" style="width:18px;height:18px;border-radius:4px;background:${h.tr ? "#c0392b" : "#e74c3c"};color:#fff;font:700 12px/18px system-ui;text-align:center;border:1.5px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.4)">H</div>`, iconSize: [18, 18] }) });
      m.bindTooltip(esc(h.n) + (h.tr ? ` · ${h.tr} trauma` : "") + (h.er ? " · ER" : "")); pinLayer.addLayer(m);
    }
    const fitLabels = () => labels.eachLayer(m => {  // a label shows only when its block is at least ~48 px wide on screen (no pile-ups in small central blocks)
      const a = map.latLngToContainerPoint(m._bb.getSouthWest()), c = map.latLngToContainerPoint(m._bb.getNorthEast()), el = m.getElement && m.getElement();
      if (el) el.style.display = Math.abs(c.x - a.x) >= 48 ? "" : "none"; });
    const showPins = () => { blockLayer.eachLayer(l => l.setStyle({ fillOpacity: map.getZoom() >= 12 ? 0.12 : 0.55 })); if (map.getZoom() >= 12) { if (!map.hasLayer(pinLayer)) pinLayer.addTo(map); if (map.hasLayer(labels)) map.removeLayer(labels); } else { if (map.hasLayer(pinLayer)) map.removeLayer(pinLayer); if (!map.hasLayer(labels)) labels.addTo(map); fitLabels(); } };
    if (window.__sp) map.off("zoomend", window.__sp); window.__sp = showPins; map.on("zoomend", showPins); showPins();
    if (legend) legend.remove();
    legend = L.control({ position: "bottomleft" }); legend.onAdd = () => { const el = L.DomUtil.create("div", "legend");
      const vals = Object.values(stats).map(s => s[metric]).filter(v => v != null).sort((a, b) => a - b);
      el.innerHTML = `<b>${MET[metric][0]}</b><br>` + (vals.length ? `<span class="sw" style="background:${RAMP[0]}"></span>${MET[metric][1](vals[0])} … <span class="sw" style="background:${RAMP[4]}"></span>${MET[metric][1](vals[vals.length - 1])}` : "no matches") +
        `<br><span class="sw" style="background:${TCOL.house}"></span>house <span class="sw" style="background:${TCOL.condo}"></span>condo <span class="sw" style="background:${TCOL.townhome}"></span>town · zoom in for pins`; return el; };
    legend.addTo(map);
  }
  const critLine = () => `${C.types.map(t => TNAME[t].toLowerCase() + "s").join(", ")}; ${C.pmin ? money(C.pmin) + "–" : "≤ "}${money(C.pmax)}; ${C.bd}+ bd, ${C.ba}+ ba${C.sf ? ", " + fmt(C.sf) + "+ sq ft" : ""}${C.ac ? ", " + C.ac + "+ acres" : ", any lot"}${C.er ? ", ER ≤ " + C.er + " min" : ""}`;
  function overview() {
    const d = D[city], arr = d.blocks.slice().sort((a, b) => (stats[b.id][metric] ?? -1) - (stats[a.id][metric] ?? -1));
    const all = d.blocks.reduce((t, b) => t + stats[b.id].n, 0), cl = classes();
    $("#pbody").innerHTML = `<div class="kick">${esc(d.county)} County · ${d.blocks.length} areas</div><h2>${esc(d.name)}</h2>
      <p class="muted">${fmt(all)} of ${fmt(d.listings.length)} listed homes match <button class="lnk" id="ec">${esc(critLine())}</button>${slot !== "all" ? " (" + esc(slot + " " + pName(slot)) + ")" : ""}.</p>
      <h3>Areas by ${MET[metric][0].toLowerCase()}</h3><ul class="blist">${arr.map(b => { const s = stats[b.id], k = cl(s[metric]); return `<li data-b="${b.id}"><span><span class="sw" style="background:${k < 0 ? "#e5e8eb" : RAMP[k]}"></span>${esc(b.name)}</span><span>${MET[metric][1](s[metric])}${metric !== "n" ? ` <span class="muted">(${s.n})</span>` : ""}</span></li>`; }).join("")}</ul>
      <p class="muted">Areas: ${esc(d.source)}. Listings: ${esc(d.listing_source)}; fetched ${esc(d.fetched)}. Areas whose search hit Zillow's 500-result cap were re-searched in smaller tiles, so the counts cover every matching listing the searches returned.</p>`;
    $("#pbody").querySelectorAll("li[data-b]").forEach(li => li.onclick = () => go("b=" + li.dataset.b));
    $("#ec").onclick = openCrit;
  }
  const row = r => `<div class="lrow" data-l="${r.id}">${r.img ? `<img loading="lazy" referrerpolicy="no-referrer" src="${esc(IMG(r))}" alt="">` : `<div class="noimg"></div>`}<div><b>${money(r.p)}</b> <span class="tag t-${r.t}">${TNAME[r.t]}</span><br><span class="muted">${r.bd ?? "?"} bd · ${r.ba ?? "?"} ba · ${fmt(r.sf)} sq ft${r.er ? " · ER " + r.er[1] + " min" : ""}</span><br><span class="muted">${esc(r.a)}</span></div></div>`;
  function blockCard(id) {
    const d = D[city], b = d.blocks.find(x => x.id === id); if (!b) return overview();
    const s = stats[id], mix = ["house", "condo", "townhome"].map(t => [t, s.rows.filter(r => r.t === t).length]).filter(x => x[1]);
    const best = s.rows.slice().sort((a, b) => (a.ppsf ?? 1e9) - (b.ppsf ?? 1e9)).slice(0, 8);
    $("#pbody").innerHTML = `<button class="lnk" id="bk">‹ All ${esc(d.name.split(" (")[0])} areas</button><div class="kick">${esc(b.kind)}</div><h2>${esc(b.name)}</h2>
      <p class="muted">${fmt(s.n)} of ${fmt(s.all)} listed homes in this area match <button class="lnk" id="ec">your criteria</button>.</p>
      <div class="stats"><div>Median price<b>${money(s.mp)}</b></div><div>Median $ / sq ft<b>${s.ppsf ? "$" + Math.round(s.ppsf) : "–"}</b></div>
      <div>Median size<b>${s.sf ? fmt(s.sf) + " sq ft" : "–"}</b></div><div>Median ER drive<b>${s.er != null ? Math.round(s.er) + " min" : "–"}</b></div>
      <div>Median trauma-center drive<b>${s.tr != null ? Math.round(s.tr) + " min" : "–"}</b></div><div>Mix<b style="font-size:13px">${mix.map(([t, n]) => `${n} ${TNAME[t].toLowerCase()}`).join(", ") || "–"}</b></div></div>
      <h3>Best value (lowest $ / sq ft)</h3>${best.map(row).join("") || '<p class="muted">Nothing matches here; loosen the criteria.</p>'}
      <p class="muted">ER = nearest Tennessee acute-care hospital with an emergency department; trauma = nearest Level I/II trauma center. OSRM free-flow drive minutes (no traffic).</p>`;
    $("#bk").onclick = () => go(""); $("#ec").onclick = openCrit;
    $("#pbody").querySelectorAll(".lrow").forEach(el => el.onclick = () => go("l=" + el.dataset.l));
    const bb = L.geoJSON(b.geom).getBounds(); map.fitBounds(bb, { padding: [20, 20] });
  }
  function listingCard(id) {
    const d = D[city], r = d.listings.find(x => x.id === id); if (!r) return overview();
    const b = d.blocks.find(x => x.id === r.b), hn = x => x && hosp[x[0]] ? `${esc(hosp[x[0]].n)}${hosp[x[0]].tr ? " (" + hosp[x[0]].tr + ")" : ""}: ${x[1]} min, ${x[2]} mi` : "–";
    $("#pbody").innerHTML = `<button class="lnk" id="bk">‹ ${esc(b ? b.name : "Areas")}</button><div class="lcard">
      ${r.img ? `<img class="hero" referrerpolicy="no-referrer" src="${esc(IMG(r))}" alt="Listing photo">` : ""}
      <div class="kick">${TNAME[r.t]} for sale · ${esc(b ? b.name : "")}</div><div class="price">${money(r.p)}</div>
      <div>${esc(r.a)}, ${esc(r.c)} ${esc(r.z)}</div>
      <div class="stats"><div>Beds / baths<b>${r.bd ?? "?"} / ${r.ba ?? "?"}</b></div><div>Size<b>${r.sf ? fmt(r.sf) + " sq ft" : "–"}</b></div>
      <div>$ / sq ft<b>${r.ppsf ? "$" + r.ppsf : "–"}</b></div><div>Lot<b>${r.ac ? r.ac + " ac" : "–"}</b></div></div>
      <div class="muted">Nearest ER: ${hn(r.er)}<br>Nearest Level I/II trauma: ${hn(r.tr)}${r.dom != null ? "<br>" + r.dom + " days on Zillow when fetched" : ""}${match(r) ? "" : "<br><b>Outside your current criteria.</b>"}</div>
      <a class="btn" href="${esc(ZURL(r))}" target="_blank" rel="noopener">Open on Zillow</a><button class="btn" id="cp">Copy link</button></div>`;
    $("#bk").onclick = () => go(b ? "b=" + b.id : "");
    $("#cp").onclick = () => { navigator.clipboard && navigator.clipboard.writeText(location.href); $("#cp").textContent = "Copied"; };
    map.setView([r.lat, r.lon], Math.max(map.getZoom(), 14));
    if (window.__hl) map.removeLayer(window.__hl); window.__hl = L.circleMarker([r.lat, r.lon], { radius: 10, color: "#d62828", weight: 3, fill: false }).addTo(map);
  }
  function openCrit() {
    const el = $("#crit"); el.hidden = false;
    el.innerHTML = `<b>City home criteria</b> <span class="muted">(${slot === "all" ? "no profile" : esc(slot + " " + pName(slot))}; saved on this device)</span>
      <div class="types">${["house", "condo", "townhome"].map(t => `<label><input type="checkbox" value="${t}" ${C.types.includes(t) ? "checked" : ""}> ${TNAME[t]}s</label>`).join("")}</div>
      <label>Min price ($)<input type="number" id="c_pmin" step="25000" min="0" value="${C.pmin || ""}" placeholder="0"></label>
      <label>Max price ($)<input type="number" id="c_pmax" step="25000" min="0" max="900000" value="${C.pmax || ""}"></label>
      <label>Min beds<input type="number" id="c_bd" min="0" max="6" value="${C.bd}"></label><label>Min baths<input type="number" id="c_ba" min="0" max="5" step="0.5" value="${C.ba}"></label>
      <label>Min sq ft<input type="number" id="c_sf" step="100" min="0" value="${C.sf || ""}" placeholder="any"></label>
      <label>Min acres<input type="number" id="c_ac" step="0.1" min="0" value="${C.ac || ""}" placeholder="none"></label>
      <label>Max ER drive (min)<input type="number" id="c_er" min="1" max="60" value="${C.er ?? ""}" placeholder="any"></label>
      <p class="muted">Data covers houses, condos and townhomes up to $900k with 1+ bedroom.</p>
      <button class="btn" id="c_ok">Apply</button><button class="btn" id="c_def" style="background:#6b7c8c">Defaults</button><button class="btn" id="c_x" style="background:#aab4bd">Close</button>`;
    const nv = id => { const v = $("#" + id).value; return v === "" ? null : +v; };
    $("#c_ok").onclick = () => { C = { types: [...el.querySelectorAll(".types input:checked")].map(i => i.value), pmin: nv("c_pmin") || 0, pmax: nv("c_pmax") || 900000, bd: nv("c_bd") || 0, ba: nv("c_ba") || 0, sf: nv("c_sf") || 0, ac: nv("c_ac") || 0, er: nv("c_er") };
      localStorage.setItem(critKey(), JSON.stringify(C)); el.hidden = true; draw(); route(); };
    $("#c_def").onclick = () => { C = Object.assign({}, DEF); localStorage.removeItem(critKey()); el.hidden = true; draw(); route(); };
    $("#c_x").onclick = () => el.hidden = true;
  }
  function profSel() {
    const s = $("#prof"); s.innerHTML = `<option value="all">All (no profile)</option>` + SLOTS.filter(k => k === "P1" || pGet(k)).map(k => `<option value="${k}">${k} ${esc(pName(k))}</option>`).join("");
    s.value = SLOTS.includes(slot) ? slot : "all";
    s.onchange = () => { slot = s.value; C = loadCrit(); draw(); route(); };
  }
  async function load(c) {
    if (!D[c]) { $("#pbody").innerHTML = '<p class="muted">Loading…</p>'; D[c] = await (await fetch(`city/${c}.json?v=${window.CITYV || 1}`)).json(); }
    D[c].hospitals.forEach(h => hosp[h.id] = h); return D[c];
  }
  function go(sub) { location.hash = city + (sub ? "/" + sub : ""); }
  async function route() {
    const h = decodeURIComponent(location.hash.slice(1)), [c, sub] = h.split("/"), want = c === "memphis" ? "memphis" : "nashville";
    if (want !== city) { const d = await load(want); city = want; document.querySelectorAll("#citysw button").forEach(b => b.classList.toggle("on", b.dataset.c === city)); draw();
      if (!sub) map.fitBounds(L.geoJSON({ type: "FeatureCollection", features: d.blocks.map(b => ({ type: "Feature", geometry: b.geom })) }).getBounds(), { padding: [0, 0] }); }
    if (window.__hl && !(sub || "").startsWith("l=")) { map.removeLayer(window.__hl); window.__hl = null; }
    if (sub && sub.startsWith("b=")) blockCard(sub.slice(2)); else if (sub && sub.startsWith("l=")) listingCard(sub.slice(2)); else overview();
    $("#pbody").parentElement.scrollTop = 0;
  }
  document.querySelectorAll("#citysw button").forEach(b => b.onclick = () => { location.hash = b.dataset.c; });
  $("#metric").onchange = e => { metric = e.target.value; draw(); route(); };
  $("#critbtn").onclick = () => { const el = $("#crit"); if (el.hidden) openCrit(); else el.hidden = true; };
  $("#pgrip").onclick = () => { $("#panel").classList.toggle("tall"); $("#cmap").classList.toggle("short"); setTimeout(() => map.invalidateSize(), 50); };
  window.addEventListener("hashchange", route);
  profSel(); route();
})();
