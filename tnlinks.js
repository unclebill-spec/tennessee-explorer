/* Tennessee-only add-on (not part of the shared KY/TN app code): links the main map to the Phase 5 city page (city.html).
   - a "Nashville · Memphis homes by area" link at the top of the Layers panel
   - a link block under the heading of the Davidson and Shelby county cards
   Pure DOM, loaded after app.js; does nothing if the elements are missing. */
(function () {
  "use strict";
  const CITY = { "Davidson County, Tennessee": ["nashville", "Nashville"], "Shelby County, Tennessee": ["memphis", "Memphis"] };
  const css = document.createElement("style");
  css.textContent = ".tncity{display:block;margin:8px 0;padding:9px 11px;border-radius:10px;background:#eef4fb;border:1px solid #c9dbef;color:#1f3b57;text-decoration:none;font-weight:600;line-height:1.3}" +
    ".tncity small{display:block;font-weight:400;color:#4a5b6b}";
  document.head.appendChild(css);
  const lp = document.getElementById("layerList");
  if (lp && lp.parentNode) {
    const a = document.createElement("a"); a.className = "tncity"; a.href = "city.html#nashville"; a.id = "tnCityLink";
    a.innerHTML = "🏙 Nashville · Memphis homes by area<small>Houses, condos and townhomes by planning area, with median prices and ER drive minutes</small>";
    lp.parentNode.insertBefore(a, lp);
  }
  const body = document.getElementById("cardBody"); if (!body) return;
  const add = () => {
    const h = body.querySelector("h2"); if (!h || body.querySelector(".tncity")) return;
    const k = body.querySelector(".kicker"); if (!k || k.textContent.trim() !== "County") return;
    const c = CITY[h.textContent.trim()]; if (!c) return;
    const a = document.createElement("a"); a.className = "tncity"; a.href = "city.html#" + c[0];
    a.innerHTML = `🏙 ${c[1]} homes by area →<small>Houses, condos and townhomes in each planning area: counts, median price, $/sq ft and ER drive minutes</small>`;
    h.insertAdjacentElement("afterend", a);
  };
  new MutationObserver(add).observe(body, { childList: true, subtree: false });
})();
