(async function () {
  const $ = (s) => document.querySelector(s);

  // ---------- Data ----------
  // data/councils.json is small and loaded up front; each council's plant list (data/plants/<key>.json)
  // is loaded the first time that council is shown.
  let COUNCILS, SUBURBS, NSW_COUNCILS;
  $("#addrForm").addEventListener("submit", (e) => e.preventDefault()); // don't reload the page if Enter is pressed while loading
  try {
    const r = await fetch("data/councils.json");
    if (!r.ok) throw new Error("HTTP " + r.status);
    const d = await r.json();
    COUNCILS = d.councils;
    SUBURBS = d.suburbs.map(([name, pc, council, share]) => ({ name, pc, council, share: share || [] }));
    NSW_COUNCILS = d.nswCouncils;
  } catch (e) {
    $("#landMsg").innerHTML = '<span class="status no">Couldn\'t load</span><div class="msg">The council data didn\'t load. Check your connection and reload the page. ' +
      (location.protocol === "file:" ? "This page has to be opened through a web server, not as a file: run <code>python -m http.server</code> in the project folder and open http://localhost:8000." : "") + "</div>";
    return;
  }
  // "Inner West, Hornsby and Ku-ring-gai"
  const listNames = () => Object.values(COUNCILS).map((c) => c.short).join(", ").replace(/, ([^,]*)$/, " and $1");
  $("#liveLists").textContent = listNames();
  const plantFiles = {};
  const loadPlants = (key) => (plantFiles[key] = plantFiles[key] || fetch("data/plants/" + key + ".json")
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status))))
    .then((d) => d.plants)
    .catch((e) => { delete plantFiles[key]; throw e; }));
  let PLANTS = [], plantsKey = null; // the plant list on screen, and which council it belongs to

  const COLOUR_GROUPS = {
    white: ["White & cream", "#F3F1E8"], yellow: ["Yellow", "#E6BE1A"], orange: ["Orange", "#E08A1E"],
    pink: ["Pink", "#E07AA6"], red: ["Red", "#C0262F"], purple: ["Purple & mauve", "#7E5BB5"],
    blue: ["Blue", "#3E6FC8"], green: ["Green", "#8DB04A"], brown: ["Brown seed heads", "#8A6A3E"]
  };
  const USAGES = ["Hedge", "Topiary", "Groundcover", "Feature plant", "Screen", "Windbreak", "Fragrant", "Border plant", "Attractive foliage", "Autumn foliage", "Lawn alternative", "Fire retardant", "Wow factor", "Bush tucker"];
  const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const SEASONS = { spring: [9, 10, 11], summer: [12, 1, 2], autumn: [3, 4, 5], winter: [6, 7, 8] };
  const TYPES = ["Tree", "Shrub", "Climber", "Groundcover", "Fern", "Grass", "Strappy", "Sedge & Rush"];
  const SUN = { FS: "Full sun", PS: "Part shade", S: "Shade" };
  const WATER = { LW: "Dry-tolerant", MW: "Moist", HW: "Wet-tolerant" };
  const TOX = { safe: "Non-toxic", low: "Low toxicity", caution: "Caution", toxic: "Toxic" };
  const ALG = { low: "Low allergy", moderate: "Moderate allergy", high: "High allergy" };
  const ICONS = {
    Tree: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="9" r="6" fill="currentColor" fill-opacity=".18"/><path d="M12 15v6M9 21h6"/></svg>',
    Shrub: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 19c0-5 3.5-9 8-9s8 4 8 9z" fill="currentColor" fill-opacity=".18"/><path d="M3 19h18"/></svg>',
    Climber: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 3v18"/><path d="M6 17c4 0 5-3 3-4s-3-3 1-4 3-3 0-4" /><circle cx="14" cy="8" r="2" fill="currentColor" fill-opacity=".3"/><circle cx="12" cy="15" r="2" fill="currentColor" fill-opacity=".3"/></svg>',
    Groundcover: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><ellipse cx="7" cy="16" rx="4" ry="2.4" fill="currentColor" fill-opacity=".18"/><ellipse cx="16" cy="16.5" rx="5" ry="2.6" fill="currentColor" fill-opacity=".18"/><path d="M2 19h20"/></svg>',
    Grass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 20V6M12 20c-1-5-4-8-6-9M12 20c1-5 4-8 6-9M12 20c-2-3-5-4-7-4M12 20c2-3 5-4 7-4"/></svg>',
    Strappy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 20c0-6-2-10-5-14M12 20c0-6 2-10 5-14M12 20c-1-4-4-6-8-7M12 20c1-4 4-6 8-7M12 20V5"/></svg>',
    Fern: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 21C12 13 9 7 4 4M12 21c0-8 3-14 8-17"/><path d="M6 7l2-1M7 10l3-1M8.5 13l2.5-.5M18 7l-2-1M17 10l-3-1M15.5 13L13 12.5" stroke-width="1.4"/></svg>',
    "Sedge & Rush": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M8 20V5M12 20V3M16 20V6M4 20h16"/><path d="M11 7h2M7 9h2M15 10h2" stroke-width="2.4"/></svg>'
  };

  const cur = () => $("#council").value;
  const C = () => COUNCILS[cur()];
  $("#council").innerHTML = Object.keys(COUNCILS).map((k) => '<option value="' + k + '">' + COUNCILS[k].name + "</option>").join("");

  // ---------- State ----------
  const state = { q: "", types: new Set(), sun: new Set(), water: new Set(), zones: new Set(), colours: new Set(), uses: new Set(), maxH: 40, season: "", petSafe: false, lowAllergy: false, onlyFav: false, view: "cards", sort: { key: "sci", dir: 1 } };
  let favs = new Set();
  try { favs = new Set(JSON.parse(localStorage.getItem("cpf-favs") || "[]")); } catch (e) {}
  try { const v = localStorage.getItem("cpf-view"); if (v === "table" || v === "cards") state.view = v; } catch (e) {}
  const saveFavs = () => { try { localStorage.setItem("cpf-favs", JSON.stringify([...favs])); } catch (e) {} };

  // ---------- Helpers ----------
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const rng = (a) => (a[0] === a[1] ? fmt(a[0]) : fmt(a[0]) + "–" + fmt(a[1])) + " m";
  function fmt(n) { return n < 1 ? String(n).replace(/^0/, "0") : String(n); }
  function monthsText(ms) {
    if (!ms.length) return "No flowers";
    if (ms.length === 12) return "All year";
    const N = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return N[ms[0] - 1] + (ms.length > 1 ? "–" + N[ms[ms.length - 1] - 1] : "");
  }
  const flowerText = (p) => esc(p.colour) + (p.months.length ? " · " + monthsText(p.months) : "");
  function monthsBar(p) {
    return '<div><div class="months" aria-label="Flowering: ' + monthsText(p.months) + '">' +
      MONTHS.map((_, i) => '<i class="' + (p.months.includes(i + 1) ? "on" : "") + '"' + (p.months.includes(i + 1) ? ' style="background:' + p.hex + '"' : "") + "></i>").join("") +
      '</div><div class="months-lbl">' + MONTHS.map((m) => "<span>" + m + "</span>").join("") + "</div></div>";
  }
  const zonesOf = (p) => (p.zonesBy && p.zonesBy[cur()]) || [];
  const zoneName = (z) => (C().zoneNames && C().zoneNames[z]) || z;
  // "All zones" (or the council's own wording) when a plant is in every main zone; extra zones such as
  // Hornsby's horticultural group or Ku-ring-gai's replacement trees are listed after it
  const zoneText = (p) => {
    const z = zonesOf(p), extra = C().extraZones || [], main = Object.keys(C().zones).filter((k) => !extra.includes(k));
    if (!main.every((k) => z.includes(k))) return z.map(zoneName).join(", ");
    return [C().allLabel || "All zones"].concat(z.filter((k) => extra.includes(k)).map(zoneName)).join(", ");
  };

  // ---------- Filter chips ----------
  function chips(el, opts, set, labelFn) {
    el.innerHTML = opts.map((o) => '<button type="button" class="chip" aria-pressed="false" data-v="' + esc(o) + '">' + labelFn(o) + "</button>").join("");
    el.addEventListener("click", (e) => {
      const b = e.target.closest(".chip"); if (!b) return;
      const v = b.dataset.v;
      set.has(v) ? set.delete(v) : set.add(v);
      b.setAttribute("aria-pressed", set.has(v));
      render();
    });
  }
  chips($("#fType"), TYPES, state.types, (t) => esc(t));
  chips($("#fSun"), Object.keys(SUN), state.sun, (k) => '<span class="mono">' + k + "</span> " + SUN[k]);
  chips($("#fWater"), ["LW", "MW", "HW"], state.water, (k) => '<span class="mono">' + k + "</span> " + WATER[k]);
  // Zone chips change with the council, so they get their own delegated listener
  $("#fZone").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    const v = b.dataset.v;
    state.zones.has(v) ? state.zones.delete(v) : state.zones.add(v);
    b.setAttribute("aria-pressed", state.zones.has(v));
    render();
  });
  function applyCouncil() {
    const c = C();
    state.zones.clear();
    $("#fZone").innerHTML = Object.keys(c.zones).map((k) => '<button type="button" class="chip" aria-pressed="false" data-v="' + k + '" title="' + esc(c.zones[k]) + '">' + (zoneName(k) !== k ? esc(zoneName(k)) : '<span class="mono">' + k + "</span>") + "</button>").join("");
    $("#zoneLabel").textContent = c.zoneLabel;
    $("#zoneHelp").textContent = c.zoneHelp + " ";
    $("#zoneLink").href = c.url;
    $("#hdrCouncil").textContent = "· " + c.short;
    $("#srcLinks").innerHTML = c.sources.map((s) => '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + "</a>").join("<br>");
    $("#fUse").querySelectorAll(".chip").forEach((b) => {
      const n = PLANTS.filter((p) => p.uses.includes(b.dataset.v)).length;
      b.querySelector(".n").textContent = n;
      b.disabled = !n && !state.uses.has(b.dataset.v);
      b.title = n ? "" : "None on this council's list yet";
    });
  }
  chips($("#fUse"), USAGES, state.uses, (u) => esc(u) + '<span class="n"></span>'); // counts are filled in by applyCouncil
  // Load a council's plant list (first time only) and make it the one on screen.
  // Resolves false if it failed or another council was picked while it loaded.
  async function showCouncil(key) {
    $("#council").value = key;
    if (plantsKey === key) return true;
    $("#count").textContent = "Loading plant list…";
    let list;
    try { list = await loadPlants(key); } catch (e) {
      if (cur() === key) { $("#count").textContent = ""; $("#out").innerHTML = '<div class="empty">This council\'s plant list didn\'t load. Check your connection and try again.</div>'; }
      return false;
    }
    if (cur() !== key) return false;
    if (plantsKey !== key) { PLANTS = list; plantsKey = key; applyCouncil(); }
    return true;
  }
  chips($("#fColour"), Object.keys(COLOUR_GROUPS), state.colours, (k) => '<span class="swatch" style="background:' + COLOUR_GROUPS[k][1] + '"></span>' + COLOUR_GROUPS[k][0]);

  $("#q").addEventListener("input", (e) => { state.q = e.target.value.trim().toLowerCase(); render(); });
  $("#maxH").addEventListener("input", (e) => { state.maxH = +e.target.value; $("#maxHOut").textContent = e.target.value + " m"; render(); });
  $("#season").addEventListener("change", (e) => { state.season = e.target.value; render(); });
  ["petSafe", "lowAllergy", "onlyFav"].forEach((k) => $("#" + k).addEventListener("change", (e) => { state[k] = e.target.checked; render(); }));
  $("#reset").addEventListener("click", () => {
    state.q = ""; state.maxH = 40; state.season = ""; state.petSafe = state.lowAllergy = state.onlyFav = false;
    [state.types, state.sun, state.water, state.zones, state.colours, state.uses].forEach((s) => s.clear());
    $("#q").value = ""; $("#maxH").value = 40; $("#maxHOut").textContent = "40 m"; $("#season").value = "";
    ["petSafe", "lowAllergy", "onlyFav"].forEach((k) => ($("#" + k).checked = false));
    document.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", "false"));
    render();
  });

  function filtered() {
    const list = PLANTS.filter((p) => {
      if (state.q && !(p.common + " " + p.sci).toLowerCase().includes(state.q)) return false;
      if (state.types.size && !state.types.has(p.type)) return false;
      if (state.sun.size && !p.sun.some((s) => state.sun.has(s))) return false;
      if (state.water.size && !state.water.has(p.water)) return false;
      if (state.zones.size && !zonesOf(p).some((z) => state.zones.has(z))) return false;
      if (state.uses.size && ![...state.uses].every((u) => p.uses.includes(u))) return false;
      if (state.colours.size && !p.cg.some((c) => state.colours.has(c))) return false;
      if (p.h[1] > state.maxH) return false;
      if (state.season && !p.months.some((mo) => SEASONS[state.season].includes(mo))) return false;
      if (state.petSafe && !(p.tox[0] === "safe" || p.tox[0] === "low")) return false;
      if (state.lowAllergy && p.allergy[0] !== "low") return false;
      if (state.onlyFav && !favs.has(p.id)) return false;
      return true;
    });
    const { key, dir } = state.sort;
    const val = (p) => (key === "h" ? p.h[1] : key === "w" ? p.w[1] : key === "type" ? TYPES.indexOf(p.type) : String(p[key]).toLowerCase());
    return list.sort((a, b) => (val(a) > val(b) ? dir : val(a) < val(b) ? -dir : a.sci.localeCompare(b.sci)));
  }

  // ---------- Photos (openly licensed only) ----------
  // Stored with the site: images/plants/{sm,lg}/<slug>.webp, with credits in data/photos.json
  // (built by tools/fetch_photos.py). Species not in photos.json yet fall back to a live lookup in the
  // visitor's browser, only for cards near the screen, at about one request per second (iNaturalist's
  // API limit): iNaturalist default photo, other iNaturalist photos, then Wikipedia / Wikimedia Commons.
  // If the host blocks outside requests, cards keep the plant-type icon.
  let localPhotos = {};
  const localPhotosReady = fetch("data/photos.json").then((r) => (r.ok ? r.json() : {})).then((d) => { localPhotos = d; }, () => {});
  const PHOTO_CACHE_KEY = "cpf-photos-v3";
  const MISS_RETRY_MS = 3 * 24 * 3600 * 1000; // try again after 3 days if nothing was found
  let photoCache = {};
  try { photoCache = JSON.parse(localStorage.getItem(PHOTO_CACHE_KEY) || "{}"); } catch (e) {}
  const saveCache = () => { try { localStorage.setItem(PHOTO_CACHE_KEY, JSON.stringify(photoCache)); } catch (e) {} };
  const pending = {};
  let photosBlocked = false, everOk = false, active = 0, pausedUntil = 0, lastStart = 0, photoTimer = null;
  const queue = [];
  function photoBox(p) {
    return '<div class="photo" data-photo="' + esc(p.sci) + '"><span class="ph">' + ICONS[p.type] + '</span><span class="credit" hidden></span></div>';
  }
  function cached(sci) {
    const c = photoCache[sci];
    if (!c) return undefined;
    if (c.miss) return Date.now() - c.t < MISS_RETRY_MS ? null : undefined;
    return c;
  }
  function fetchPhoto(sci) {
    return localPhotosReady.then(() => {
      const e = localPhotos[sci];
      if (e && e.file) return { file: e.file, credit: e.credit, note: e.note, src: e.src };
      if (e && e.miss) return null;
      return livePhoto(sci);
    });
  }
  function livePhoto(sci) {
    const c = cached(sci);
    if (c !== undefined) return Promise.resolve(c);
    if (photosBlocked) return Promise.resolve(null);
    if (!pending[sci]) pending[sci] = new Promise((resolve) => { queue.push({ sci, resolve, tries: 0 }); pump(); });
    return pending[sci];
  }
  function pump() {
    clearTimeout(photoTimer);
    if (!queue.length || active >= 2) return;
    const wait = Math.max(pausedUntil - Date.now(), lastStart + 1100 - Date.now(), 0);
    if (wait > 0) { photoTimer = setTimeout(pump, wait); return; }
    const job = queue.shift();
    if (photosBlocked) { job.resolve(null); pump(); return; }
    active++; lastStart = Date.now();
    findPhoto(job.sci).then((out) => {
      everOk = true;
      photoCache[job.sci] = out || { miss: true, t: Date.now() };
      saveCache();
      job.resolve(out);
    }).catch((e) => {
      const status = typeof e === "number" ? e : 0;
      if (!status && !everOk) { photosBlocked = true; job.resolve(null); return; } // blocked or offline
      if (job.tries++ < 3) { pausedUntil = Date.now() + (status === 429 ? 30000 : 10000); queue.unshift(job); }
      else job.resolve(null);
    }).finally(() => { active--; pump(); });
    pump();
  }
  const getJSON = (u) => fetch(u).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));
  const OPEN = (code) => !!code && code !== "all rights reserved";
  async function findPhoto(q) {
    const plain = !/var\.|subsp\.|'/.test(q);
    const d = await getJSON("https://api.inaturalist.org/v1/taxa?is_active=true&per_page=10" + (plain ? "&rank=species" : "") + "&q=" + encodeURIComponent(q));
    const res = d.results || [];
    const genus = q.split(" ")[0];
    const t = res.find((x) => x.name === q) || res.find((x) => x.matched_term === q) || res.find((x) => x.name && x.name.split(" ")[0] === genus);
    if (t) {
      const ph = t.default_photo;
      if (ph && OPEN(ph.license_code) && ph.medium_url) return { url: ph.medium_url, credit: ph.attribution, src: "iNaturalist" };
      const full = await getJSON("https://api.inaturalist.org/v1/taxa/" + t.id);
      const tp = ((full.results && full.results[0] && full.results[0].taxon_photos) || []).map((x) => x.photo).find((x) => x && OPEN(x.license_code) && x.medium_url);
      if (tp) return { url: tp.medium_url, credit: tp.attribution, src: "iNaturalist" };
    }
    try { const w = await wikiPhoto(q); if (w) return w; } catch (e) {}
    return null;
  }
  async function wikiPhoto(name) {
    const sum = await getJSON("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(name.replace(/ /g, "_")));
    const src = sum && (sum.originalimage || sum.thumbnail);
    if (!src) return null;
    const file = decodeURIComponent(src.source.split("/").pop().replace(/^\d+px-/, ""));
    const d = await getJSON("https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=640&titles=File:" + encodeURIComponent(file));
    const page = d.query && Object.values(d.query.pages)[0];
    const ii = page && page.imageinfo && page.imageinfo[0];
    if (!ii) return null;
    const md = ii.extmetadata || {};
    const lic = (md.LicenseShortName && md.LicenseShortName.value) || "";
    if (!/cc|public domain|pd/i.test(lic)) return null;
    const artist = ((md.Artist && md.Artist.value) || "Unknown").replace(/<[^>]+>/g, "").trim();
    return { url: ii.thumburl || ii.url, credit: "© " + artist + " (" + lic + "), via Wikimedia Commons", src: "Wikimedia" };
  }
  function showPhoto(box) {
    const sci = box.dataset.photo;
    fetchPhoto(sci).then((info) => {
      if (!info || !box.isConnected || box.querySelector("img")) return;
      const img = new Image();
      img.alt = sci;
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      img.onload = () => img.classList.add("ready");
      img.onerror = () => img.remove();
      const big = !!box.closest(".panel");
      img.src = info.file ? "images/plants/" + (big ? "lg" : "sm") + "/" + info.file + ".webp"
        : big && info.src === "iNaturalist" ? info.url.replace("/medium.", "/large.") : info.url;
      box.insertBefore(img, box.querySelector(".credit"));
      const c = box.querySelector(".credit");
      c.textContent = (info.note ? info.note + " · " : "") + "Photo " + String(info.credit || "").replace(/\s*\(c\)\s*/i, "© ");
      c.title = c.textContent;
      c.hidden = false;
    });
  }
  // Only ask for photos of cards that are on (or close to) the screen
  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { io.unobserve(en.target); showPhoto(en.target); } });
  }, { rootMargin: "300px 0px" }) : null;
  function loadPhotos(root) {
    root.querySelectorAll(".photo[data-photo]").forEach((box) => (io && !box.closest(".panel") ? io.observe(box) : showPhoto(box)));
  }

  // ---------- Render ----------
  function starBtn(p) {
    return '<button type="button" class="star" data-fav="' + p.id + '" aria-pressed="' + favs.has(p.id) + '" aria-label="Add ' + esc(p.common) + ' to shortlist" title="Shortlist">' + (favs.has(p.id) ? "★" : "☆") + "</button>";
  }
  // Exotic trees are only on Ku-ring-gai's tree replacement list: dark red names and a tag
  const exCls = (p) => (p.exotic ? " exotic" : "");
  const exoticTag = (p) => (p.exotic ? '<span class="exotic-tag">Exotic · tree replacement only</span>' : "");
  function card(p) {
    return '<article class="card" tabindex="0" data-id="' + p.id + '">' + photoBox(p) +
      '<div class="card-head"><div class="ico">' + ICONS[p.type] + '</div><div><div class="type-tag">' + esc(p.size || p.type) + '</div><h3 class="' + exCls(p) + '">' + esc(p.common) + '</h3><div class="sci' + exCls(p) + '">' + esc(p.sci) + "</div>" + exoticTag(p) + "</div>" + starBtn(p) + "</div>" +
      '<div class="dims"><div><span>H </span>' + rng(p.h) + '</div><div><span>W </span>' + rng(p.w) + "</div></div>" +
      '<div class="codes">' + p.sun.map((s) => '<span class="code sun" title="' + SUN[s] + '">' + s + "</span>").join("") + '<span class="code water" title="' + WATER[p.water] + '">' + p.water + '</span><span class="code" title="' + esc(zonesOf(p).map((z) => C().zones[z]).join("; ")) + '">' + zoneText(p) + "</span></div>" +
      monthsBar(p) +
      '<div class="flower"><span class="dot" style="background:' + p.hex + '"></span>' + flowerText(p) + "</div>" +
      '<div class="pills"><span class="pill ' + p.tox[0] + '">' + TOX[p.tox[0]] + '</span><span class="pill ' + p.allergy[0] + '">' + ALG[p.allergy[0]] + "</span></div>" +
      "</article>";
  }
  const COLS = [["common", "Common name"], ["sci", "Scientific name"], ["type", "Type"], ["h", "Height"], ["w", "Width"], ["sun", "Sun"], ["water", "Water"], ["zones", "Zone / area"], ["months", "Flowering"], ["uses", "Usage"], ["tox", "Toxicity"], ["allergy", "Allergy"], ["pot", "Pot size"]];
  function table(list) {
    const sortable = ["common", "sci", "type", "h", "w"];
    return '<div class="table-wrap"><table><thead><tr><th scope="col" aria-label="Shortlist"></th>' +
      COLS.map(([k, l]) => '<th scope="col"' + (sortable.includes(k) ? ' data-sort="' + k + '"' + (state.sort.key === k ? ' aria-sort="' + (state.sort.dir > 0 ? "ascending" : "descending") + '"' : "") : ' style="cursor:default"') + ">" + l + "</th>").join("") +
      "</tr></thead><tbody>" +
      list.map((p) => '<tr data-id="' + p.id + '"><td>' + starBtn(p) + '</td><td><b class="' + exCls(p) + '">' + esc(p.common) + "</b>" + (p.exotic ? "<br>" + exoticTag(p) : "") + '</td><td class="sci' + exCls(p) + '">' + esc(p.sci) + "</td><td>" + esc(p.size || p.type) + '</td><td class="num">' + rng(p.h) + '</td><td class="num">' + rng(p.w) + '</td><td class="num">' + p.sun.join(" ") + '</td><td class="num">' + p.water + '</td><td class="num">' + zoneText(p) + '</td><td><span class="dot" style="display:inline-block;vertical-align:-1px;background:' + p.hex + '"></span> ' + flowerText(p) + '</td><td>' + p.uses.map(esc).join(", ") + '</td><td><span class="pill ' + p.tox[0] + '">' + TOX[p.tox[0]] + '</span></td><td><span class="pill ' + p.allergy[0] + '">' + ALG[p.allergy[0]] + "</span></td><td>" + esc(p.pot) + "</td></tr>").join("") +
      "</tbody></table></div>";
  }
  let current = [];
  function render() {
    if (plantsKey !== cur()) return; // still loading this council's list; showCouncil's caller renders when ready
    current = filtered();
    const total = PLANTS.length;
    $("#count").innerHTML = "<b>" + current.length + "</b> of " + total + " plants";
    $("#vCards").setAttribute("aria-pressed", state.view === "cards");
    $("#vTable").setAttribute("aria-pressed", state.view === "table");
    if (!current.length) {
      $("#out").innerHTML = '<div class="empty">No plants match all these filters. Try raising the maximum height or removing a filter.</div>';
      return;
    }
    $("#out").innerHTML = state.view === "cards" ? '<div class="grid">' + current.map(card).join("") + "</div>" : table(current);
    loadPhotos($("#out"));
  }

  $("#sortSel").addEventListener("change", (e) => { state.sort = { key: e.target.value, dir: 1 }; render(); });
  $("#vCards").addEventListener("click", () => { state.view = "cards"; try { localStorage.setItem("cpf-view", "cards"); } catch (e) {} render(); });
  $("#vTable").addEventListener("click", () => { state.view = "table"; try { localStorage.setItem("cpf-view", "table"); } catch (e) {} render(); });

  $("#out").addEventListener("click", (e) => {
    const f = e.target.closest("[data-fav]");
    if (f) {
      const id = +f.dataset.fav;
      favs.has(id) ? favs.delete(id) : favs.add(id);
      saveFavs(); render(); return;
    }
    const th = e.target.closest("th[data-sort]");
    if (th) {
      const k = th.dataset.sort;
      state.sort = { key: k, dir: state.sort.key === k ? -state.sort.dir : 1 };
      if ([...$("#sortSel").options].some((o) => o.value === k)) $("#sortSel").value = k;
      render(); return;
    }
    const row = e.target.closest("[data-id]");
    if (row) openPanel(+row.dataset.id);
  });
  $("#out").addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches(".card")) { e.preventDefault(); openPanel(+e.target.dataset.id); }
  });

  // ---------- Detail panel ----------
  let lastFocus = null;
  function openPanel(id) {
    const p = PLANTS.find((x) => x.id === id);
    lastFocus = document.activeElement;
    const ref = '<span class="ref" title="General horticultural reference, not from the council list">ref</span>';
    $("#panel").innerHTML =
      '<button class="btn close" type="button" id="pClose">Close</button>' +
      '<div class="card-head" style="padding-right:70px"><div class="ico">' + ICONS[p.type] + '</div><div><div class="type-tag">' + esc(p.size || p.type) + '</div><h2 id="pTitle" class="' + exCls(p) + '">' + esc(p.common) + '</h2><div class="sci' + exCls(p) + '">' + esc(p.sci) + "</div>" + exoticTag(p) + "</div></div>" +
      (p.exotic ? '<p class="exotic-note">Exotic tree, not a local native. It is on Ku-ring-gai Council’s Tree Replacement Planting List, so consider it only when choosing a replacement tree.</p>' : "") +
      photoBox(p) + monthsBar(p) +
      '<dl class="spec">' +
      "<dt>Type</dt><dd>" + esc(p.size || p.type) + "</dd>" +
      "<dt>Height</dt><dd>" + rng(p.h) + (p.type === "Climber" || p.hRef ? " " + ref : "") + "</dd>" +
      "<dt>Width</dt><dd>" + rng(p.w) + " " + ref + "</dd>" +
      "<dt>Sunlight</dt><dd>" + p.sun.map((s) => SUN[s]).join(", ") + "</dd>" +
      "<dt>Water</dt><dd>" + WATER[p.water] + ' <span class="mono">(' + p.water + ")</span></dd>" +
      "<dt>Usage</dt><dd>" + (p.uses.length ? p.uses.map(esc).join(", ") : "–") + "</dd>" +
      "<dt>Soil</dt><dd>" + esc(p.soil) + "</dd>" +
      "<dt>Flowers</dt><dd>" + flowerText(p) + "</dd>" +
      '<dt>Toxicity</dt><dd><span class="pill ' + p.tox[0] + '">' + TOX[p.tox[0]] + "</span> " + ref + "<br>" + esc(p.tox[1]) + "</dd>" +
      '<dt>Allergy</dt><dd><span class="pill ' + p.allergy[0] + '">' + ALG[p.allergy[0]] + "</span> " + ref + "<br>" + esc(p.allergy[1]) + "</dd>" +
      "<dt>Pot size</dt><dd>" + esc(p.pot) + " " + ref + "</dd>" +
      "<dt>" + (p.exotic ? "Listed by" : "Native to") + "</dt><dd>" + p.councils.map((c) => "<b>" + esc(COUNCILS[c].name) + '</b><br><span class="help">' + (p.zonesBy[c] || []).map((z) => esc(COUNCILS[c].zones[z])).concat(p.infoBy && p.infoBy[c] ? ["Council list: " + esc(p.infoBy[c])] : []).join("<br>") + "</span>").join("<br>") + (p.alias ? '<br><span class="help">' + esc(p.alias) + "</span>" : "") + "</dd>" +
      "</dl>" +
      '<div class="note-box"><div class="eyebrow" style="margin-bottom:4px">Note</div>' + esc(p.note) + "</div>" +
      (p.hRef || p.detailsRef ? '<p class="help" style="margin:0">' + (p.hRef ? "The council list gives no measurements for this plant, so the height, width," : "Height is from the council list. Width,") + " sun, water and flowering months shown here are general reference values; see the council notes under Native to.</p>" : "") +
      gwaBlock(p) +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' + '<button class="btn primary" type="button" id="pFav">' + (favs.has(p.id) ? "Remove from shortlist" : "Add to shortlist") + "</button>" +
      '<a class="btn" style="text-decoration:none;color:var(--ink)" target="_blank" rel="noopener" href="https://www.inaturalist.org/taxa/search?q=' + encodeURIComponent(p.sci) + '">More photos ↗</a>' +
      '<a class="btn" style="text-decoration:none;color:var(--ink)" target="_blank" rel="noopener" href="https://bie.ala.org.au/search?q=' + encodeURIComponent(p.sci) + '">Atlas of Living Australia ↗</a></div>';
    $("#panel").hidden = false; $("#scrim").hidden = false;
    loadPhotos($("#panel"));
    $("#pClose").focus();
    $("#pClose").addEventListener("click", closePanel);
    $("#pFav").addEventListener("click", () => { favs.has(p.id) ? favs.delete(p.id) : favs.add(p.id); saveFavs(); render(); openPanel(p.id); });
  }
  function gwaBlock(p) {
    const g = p.gwa;
    if (!g) return "";
    const link = '<a href="' + esc(g.url) + '" target="_blank" rel="noopener">' + (g.cv ? "View the ‘" + esc(g.cv) + "’ cultivar ↗" : "View on Gardening with Angus ↗") + "</a>";
    if (g.cv) return '<div class="gwa"><div class="eyebrow">Gardening with Angus</div><p class="help" style="margin:4px 0">Only a cultivar is listed there, so its sizes aren\'t used here.</p>' + link + "</div>";
    const diffH = g.h[1] > p.h[1] * 1.5 || g.h[1] < p.h[1] / 1.5;
    return '<div class="gwa"><div class="eyebrow">Gardening with Angus</div><dl class="spec mini">' +
      "<dt>Height</dt><dd>" + rng(g.h) + (diffH ? ' <span class="flag">differs from council list</span>' : "") + "</dd>" +
      "<dt>Width</dt><dd>" + rng(g.w) + "</dd>" +
      "<dt>Frost</dt><dd>Tolerates " + esc(g.frost.toLowerCase()) + "</dd>" +
      (g.wildlife ? "<dt>Attracts</dt><dd>" + esc(g.wildlife) + "</dd>" : "") +
      "</dl>" + link + "</div>";
  }
  function closePanel() { $("#panel").hidden = true; $("#scrim").hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  $("#scrim").addEventListener("click", closePanel);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#panel").hidden) closePanel(); });

  // ---------- CSV ----------
  $("#copyCsv").addEventListener("click", () => {
    const head = ["Type", "Scientific name", "Common name", "Origin", "Height (m)", "Width (m)", "Sunlight", "Water", "Soil", "Vegetation zone", "Toxicity", "Allergy", "Native to council", "Pot size", "Flower season", "Flower colour", "Plant usage", "Note"];
    // Tab-separated, so pasting into Excel or Google Sheets puts each field in its own cell.
    // Tabs and line breaks inside a value would split it, and a leading " makes Excel parse quotes, so clean those out.
    const q = (v) => String(v).replace(/[\t\r\n]+/g, " ").replace(/"/g, "”");
    const rows = current.map((p) => [p.size || p.type, p.sci, p.common, p.exotic ? "Exotic (tree replacement only)" : "Native", rng(p.h).replace(" m", ""), rng(p.w).replace(" m", ""), p.sun.map((s) => SUN[s]).join("/"), WATER[p.water], p.soil, zonesOf(p).map(zoneName).join("/"), TOX[p.tox[0]] + " – " + p.tox[1], ALG[p.allergy[0]] + " – " + p.allergy[1], p.councils.map((c) => COUNCILS[c].name).join("/"), p.pot, monthsText(p.months), p.colour, p.uses.join(", "), p.note].map(q).join("\t"));
    const csv = [head.map(q).join("\t")].concat(rows).join("\n");
    const done = (msg) => { $("#toast").textContent = msg; setTimeout(() => ($("#toast").textContent = ""), 3000); };
    try {
      navigator.clipboard.writeText(csv).then(() => done("Copied " + current.length + " rows — paste into Excel or Sheets"), () => fallback());
    } catch (e) { fallback(); }
    function fallback() {
      const ta = document.createElement("textarea"); ta.value = csv; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch (e) {}
      ta.remove(); done(ok ? "Copied " + current.length + " rows" : "Copy isn't available here");
    }
  });

  // ---------- Council matching ----------
  const byLen = SUBURBS.slice().sort((a, b) => b.name.length - a.name.length);
  function councilName(key) { return COUNCILS[key] ? COUNCILS[key].name : key; }
  function match(input) {
    const s = " " + input.toLowerCase().replace(/[,.]/g, " ").replace(/\bnsw\b/g, " ").replace(/\s+/g, " ") + " ";
    const pcM = s.match(/\b(\d{4})\b/g);
    const pc = pcM ? pcM[pcM.length - 1] : null;
    const sub = byLen.find((x) => s.includes(" " + x.name.toLowerCase() + " "));
    if (sub) return { kind: "suburb", sub, pcMismatch: pc && pc !== sub.pc ? pc : null };
    if (pc) {
      const subs = SUBURBS.filter((x) => x.pc === pc);
      if (subs.length) return { kind: "postcode", pc, subs };
    }
    return { kind: "none" };
  }
  function showResultInner(r, raw) {
    const el = $("#result");
    if (!raw) {
      el.innerHTML = '<span class="status idle">Waiting for an address</span><div class="council">Which council is your site in?</div><div class="msg">Councils publish their own local native plant lists. Enter an address to load the right one.</div>';
      return;
    }
    if (r.kind === "none") {
      el.innerHTML = '<span class="status no">Not found</span><div class="council">No suburb or postcode recognised</div><div class="msg">Include the suburb name or a 4-digit postcode, e.g. "Marrickville 2204". For other areas, choose an address from the suggestions.</div>';
      return;
    }
    if (r.kind === "postcode") {
      const ok = r.subs.filter((x) => COUNCILS[x.council]);
      const list = r.subs.map((x) => esc(x.name) + " (" + esc(councilName(x.council)) + (x.share.length ? ", part" : "") + ")").join(", ");
      const keys = [...new Set(ok.map((x) => x.council))];
      if (ok.length === r.subs.length && keys.length === 1 && ok.every((x) => !x.share.length)) {
        el.innerHTML = '<span class="status ok">✓ Supported</span><div class="council">' + esc(COUNCILS[keys[0]].name) + '</div><div class="msg">Postcode ' + r.pc + " covers " + list + ". Showing plants from the " + esc(COUNCILS[keys[0]].short) + " list.</div>";
        selectCouncil(keys[0], zonesFor(ok));
      } else if (ok.length) {
        el.innerHTML = '<span class="status part">Check boundary</span><div class="council">Probably ' + esc(COUNCILS[keys[0]].name) + '</div><div class="msg">Postcode ' + r.pc + " is split between councils: " + list + ". Add the suburb name or your street address. Showing the " + esc(COUNCILS[keys[0]].short) + " list for now.</div>";
        selectCouncil(keys[0], zonesFor(ok.filter((x) => x.council === keys[0])));
      } else {
        el.innerHTML = '<span class="status no">Not in database yet</span><div class="council">' + esc(councilName(r.subs[0].council)) + '</div><div class="msg">Postcode ' + r.pc + " (" + list + "). This council's plant list hasn't been added yet.</div>";
      }
      return;
    }
    const x = r.sub;
    const warnPc = r.pcMismatch ? " Note: postcode " + r.pcMismatch + " doesn't usually match " + esc(x.name) + " (" + x.pc + ")." : "";
    const cx = COUNCILS[x.council];
    const areaTxt = "";
    if (cx && !x.share.length) {
      el.innerHTML = '<span class="status ok">✓ Supported</span><div class="council">' + esc(cx.name) + '</div><div class="msg">' + esc(x.name) + " " + x.pc + " is fully within " + esc(cx.short) + "." + areaTxt + " Showing plants from the council's native plant list." + warnPc + "</div>";
      selectCouncil(x.council, x.zone ? [x.zone] : []);
    } else if (cx) {
      el.innerHTML = '<span class="status part">Check boundary</span><div class="council">' + esc(cx.name) + ' <span style="font-size:15px;color:var(--muted)">(part of suburb)</span></div><div class="msg">' + esc(x.name) + " is shared with " + x.share.map(esc).join(" and ") + ". Enter your street address to confirm which council you are in. Showing the " + esc(cx.short) + " list for now." + warnPc + "</div>";
      selectCouncil(x.council, x.zone ? [x.zone] : []);
    } else {
      el.innerHTML = '<span class="status no">Not in database yet</span><div class="council">' + esc(x.council) + '</div><div class="msg">' + esc(x.name) + " " + x.pc + " is in " + esc(x.council) + ". This council's plant list hasn't been added yet." + warnPc + "</div>";
    }
  }
  function zonesFor(subs) { const z = [...new Set(subs.map((x) => x.zone).filter(Boolean))]; return z.length === 1 ? z : []; }
  async function selectCouncil(key, zones) {
    if (!(await showCouncil(key))) return;
    state.zones.clear();
    (zones || []).forEach((z) => state.zones.add(z));
    $("#fZone").querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", state.zones.has(b.dataset.v)));
    render();
  }
  // ---------- Address autocomplete (NSW Spatial Services, official government data) ----------
  const NSW = "https://portal.spatial.nsw.gov.au/server/rest/services/";
  const ADDR_URL = NSW + "NSW_Geocoded_Addressing_Theme/MapServer/1/query";
  const SUB_URL = NSW + "NSW_Administrative_Boundaries_Theme/MapServer/2/query";
  const LGA_URL = NSW + "NSW_Administrative_Boundaries_Theme/MapServer/8/query";
  const SYDNEY = "150.5,-34.3,151.45,-33.4";
  const ABBR = { ST: "STREET", RD: "ROAD", AVE: "AVENUE", AV: "AVENUE", PDE: "PARADE", CRES: "CRESCENT", CR: "CRESCENT", CL: "CLOSE", CT: "COURT", DR: "DRIVE", HWY: "HIGHWAY", LN: "LANE", PL: "PLACE", TCE: "TERRACE", BLVD: "BOULEVARD", BVD: "BOULEVARD", CCT: "CIRCUIT", ESP: "ESPLANADE", GR: "GROVE", SQ: "SQUARE", PWY: "PATHWAY", WY: "WAY" };
  const ROAD_TYPES = new Set(Object.values(ABBR).concat(["WAY", "ROW", "WALK", "MEWS", "RISE", "VIEW", "TRACK", "LOOP", "GLADE", "GREEN", "CORSO", "BROADWAY", "PROMENADE", "QUAY", "RIDGE", "CHASE", "OUTLOOK", "VISTA", "WHARF", "BOULEVARDE", "GARDENS", "ARCADE", "ALLEY", "CROSS", "PASS"]));
  const qs = (o) => Object.entries(o).map(([k, v]) => k + "=" + encodeURIComponent(v)).join("&");
  const sql = (t) => t.replace(/'/g, "''");
  const titleCase = (t) => String(t).toLowerCase().replace(/(^|[\s\-'])([a-z])/g, (m, a, c) => a + c.toUpperCase()).replace(/\bNsw\b/g, "NSW").replace(/\bMc([a-z])/g, (m, c) => "Mc" + c.toUpperCase());
  let jsonpN = 0, useJsonp = false, nswDown = false;
  function jsonp(url) {
    return new Promise((res, rej) => {
      const cb = "__cpf" + ++jsonpN, s = document.createElement("script");
      const done = () => { clearTimeout(t); try { delete window[cb]; } catch (e) {} s.remove(); };
      const t = setTimeout(() => { done(); rej(new Error("timeout")); }, 8000);
      window[cb] = (d) => { done(); res(d); };
      s.onerror = () => { done(); rej(new Error("jsonp")); };
      s.src = url + "&callback=" + cb;
      document.head.appendChild(s);
    });
  }
  async function arcgis(base, params, signal) {
    const url = base + "?" + qs(Object.assign({}, params, { f: "json" }));
    if (!useJsonp) {
      try {
        const r = await fetch(url, { signal });
        if (!r.ok) throw new Error("HTTP " + r.status);
        const d = await r.json();
        if (d.error) throw new Error(d.error.message || "error");
        return d;
      } catch (e) {
        if (e.name === "AbortError" || !(e instanceof TypeError)) throw e;
        useJsonp = true; // blocked by CORS: fall back to JSONP
      }
    }
    const d = await jsonp(url);
    if (d.error) throw new Error(d.error.message || "error");
    return d;
  }
  function normalise(v) {
    let s = v.toUpperCase().replace(/,/g, " ").replace(/\b(NSW|AUSTRALIA)\b/g, " ").replace(/\b\d{4}\s*$/, "").replace(/[^A-Z0-9'\-\/ ]/g, " ").replace(/\s+/g, " ").trim();
    s = s.replace(/^(UNIT|APT|SHOP)\s+\S+\s+/, "").replace(/^\S+\/(?=\d)/, ""); // drop unit prefix: 3/45 -> 45
    const t = s.split(" ");
    return t.map((w, i) => (i < t.length - 1 && ABBR[w] ? ABBR[w] : w)).join(" ");
  }
  // "83 NORTON STREET ASHFIELD" -> { num, street, suburb }
  function splitAddress(a) {
    const t = a.split(" ");
    let i = 0; const num = [];
    while (i < t.length && /\d/.test(t[i])) num.push(t[i++]);
    let j = i + 1;
    while (j < t.length && !ROAD_TYPES.has(t[j])) j++;
    if (j >= t.length) return null;
    return { num: num.join(" "), street: t.slice(i, j + 1).join(" "), suburb: t.slice(j + 1).join(" ") };
  }
  async function nswSuggest(text, signal) {
    const out = [];
    const jobs = [];
    if (/^\d/.test(text)) {
      jobs.push(arcgis(ADDR_URL, { where: "address LIKE '" + sql(text) + "%'", outFields: "address", returnGeometry: true, outSR: 4326, orderByFields: "address", resultRecordCount: 8 }, signal).then((d) => {
        (d.features || []).forEach((f) => {
          const sp = splitAddress(f.attributes.address);
          out.push({ kind: "Addresses", main: titleCase(sp ? sp.num + " " + sp.street : f.attributes.address), sub: sp ? titleCase(sp.suburb) : "", x: f.geometry.x, y: f.geometry.y });
        });
      }));
    } else {
      jobs.push(arcgis(ADDR_URL, { where: "address LIKE '% " + sql(text) + "%'", outFields: "address", returnGeometry: true, outSR: 4326, geometry: SYDNEY, geometryType: "esriGeometryEnvelope", inSR: 4326, spatialRel: "esriSpatialRelIntersects", resultRecordCount: 300 }, signal).then((d) => {
        const seen = new Map();
        (d.features || []).forEach((f) => {
          const sp = splitAddress(f.attributes.address);
          if (!sp || !sp.suburb || !(sp.street + " " + sp.suburb).startsWith(text)) return; // text must start at the street name
          const k = sp.street + "|" + sp.suburb;
          if (!seen.has(k)) seen.set(k, { kind: "Streets", main: titleCase(sp.street), sub: titleCase(sp.suburb), x: f.geometry.x, y: f.geometry.y });
        });
        [...seen.values()].sort((a, b) => (a.main + a.sub).localeCompare(b.main + b.sub)).slice(0, 8).forEach((o) => out.push(o));
      }));
      jobs.push(arcgis(SUB_URL, { where: "suburbname LIKE '" + sql(text) + "%'", outFields: "suburbname,postcode", returnGeometry: false, orderByFields: "suburbname", resultRecordCount: 6 }, signal).then((d) => {
        (d.features || []).forEach((f) => out.push({ kind: "Suburbs", main: titleCase(f.attributes.suburbname), sub: String(f.attributes.postcode || ""), suburb: f.attributes.suburbname, pc: f.attributes.postcode }));
      }));
    }
    const res = await Promise.allSettled(jobs);
    const abort = res.find((r) => r.status === "rejected" && r.reason && r.reason.name === "AbortError");
    if (abort) throw abort.reason;
    if (res.every((r) => r.status === "rejected")) throw res[0].reason;
    return out;
  }
  function localSuggest(v) {
    const t = v.trim().toLowerCase();
    if (!t) return [];
    return SUBURBS.filter((x) => x.name.toLowerCase().startsWith(t) || x.pc.startsWith(t)).slice(0, 6)
      .map((x) => ({ kind: "Suburbs", main: x.name, sub: x.pc, local: x }));
  }

  const input = $("#addr"), list = $("#addrList");
  let opts = [], activeIdx = -1, ctrl = null, timer = null, chosen = null;
  function drawList(items, note) {
    opts = items; activeIdx = -1;
    if (!items.length && !note) { closeList(); return; }
    let html = "", last = "";
    items.forEach((o, i) => {
      if (o.kind !== last) { html += '<li class="grp" role="presentation">' + o.kind + "</li>"; last = o.kind; }
      html += '<li class="opt" role="option" id="opt' + i + '" data-i="' + i + '" aria-selected="false"><span>' + esc(o.main) + '</span><span class="sub">' + esc(o.sub || "") + "</span></li>";
    });
    if (note) html += '<li class="note" role="presentation">' + note + "</li>";
    list.innerHTML = html; list.hidden = false; input.setAttribute("aria-expanded", "true");
  }
  function closeList() { list.hidden = true; input.setAttribute("aria-expanded", "false"); input.removeAttribute("aria-activedescendant"); activeIdx = -1; }
  function highlight(i) {
    activeIdx = i;
    list.querySelectorAll(".opt").forEach((el) => el.setAttribute("aria-selected", String(+el.dataset.i === i)));
    const el = list.querySelector("#opt" + i);
    if (el) { input.setAttribute("aria-activedescendant", el.id); el.scrollIntoView({ block: "nearest" }); }
  }
  function mergeSuburbs(nsw, local) {
    const names = new Set(nsw.filter((o) => o.kind === "Suburbs").map((o) => o.main.toLowerCase()));
    return nsw.concat(local.filter((o) => !names.has(o.main.toLowerCase())));
  }
  const ORDER = { Addresses: 0, Suburbs: 1, Streets: 2 };
  input.addEventListener("input", () => {
    chosen = null;
    const v = input.value;
    clearTimeout(timer); if (ctrl) ctrl.abort();
    const local = localSuggest(v);
    const text = normalise(v);
    if (text.length < 3 || nswDown) { drawList(local); return; }
    drawList(local, "Searching NSW addresses…");
    timer = setTimeout(() => {
      ctrl = new AbortController();
      const myCtrl = ctrl;
      nswSuggest(text, ctrl.signal).then((items) => {
        if (myCtrl.signal.aborted || input.value !== v) return;
        const all = mergeSuburbs(items, local).sort((a, b) => ORDER[a.kind] - ORDER[b.kind]);
        drawList(all, all.length ? "" : "No matching NSW addresses. Check the spelling, or enter a suburb or postcode.");
      }).catch((e) => {
        if (e && e.name === "AbortError") return;
        nswDown = true; // offline or blocked: keep the local suburb list
        if (input.value === v) drawList(local, local.length ? "" : "Address search isn't available here. Enter a suburb or postcode instead.");
      });
    }, 250);
  });
  input.addEventListener("keydown", (e) => {
    if (list.hidden || !opts.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); highlight((activeIdx + 1) % opts.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); highlight((activeIdx - 1 + opts.length) % opts.length); }
    else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); pick(opts[activeIdx]); }
    else if (e.key === "Escape") { closeList(); }
  });
  list.addEventListener("mousedown", (e) => { const li = e.target.closest(".opt"); if (!li) return; e.preventDefault(); pick(opts[+li.dataset.i]); });
  input.addEventListener("blur", () => setTimeout(closeList, 150));

  function pick(o) {
    chosen = o; closeList(); clearTimeout(timer); if (ctrl) ctrl.abort();
    input.value = o.kind === "Suburbs" ? o.main + " NSW " + o.sub : o.main + ", " + o.sub + " NSW";
    lookup(o);
  }
  const councilKey = (n) => String(n || "").toLowerCase().trim().replace(/\s+/g, "-");
  function polyCentroid(rings) {
    let best = null, bestA = 0;
    (rings || []).forEach((r) => {
      let a = 0, cx = 0, cy = 0;
      for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const f = r[j][0] * r[i][1] - r[i][0] * r[j][1]; a += f; cx += (r[j][0] + r[i][0]) * f; cy += (r[j][1] + r[i][1]) * f; }
      if (a && Math.abs(a) > bestA) { bestA = Math.abs(a); best = [cx / (3 * a), cy / (3 * a)]; }
    });
    return best;
  }
  function lgaAt(x, y) {
    return arcgis(LGA_URL, { geometry: x + "," + y, geometryType: "esriGeometryPoint", inSR: 4326, spatialRel: "esriSpatialRelIntersects", outFields: "lganame,councilname", returnGeometry: false })
      .then((d) => (d.features && d.features[0] ? d.features[0].attributes : null));
  }
  async function lookup(o) {
    if (o.local) { showResult({ kind: "suburb", sub: o.local, pcMismatch: null }, input.value); return; }
    $("#result").innerHTML = '<span class="status idle">Checking…</span><div class="council">Looking up the council boundary</div>';
    try {
      let x = o.x, y = o.y;
      if (o.kind === "Suburbs") {
        const d = await arcgis(SUB_URL, { where: "suburbname='" + sql(o.suburb) + "'" + (o.pc ? " AND postcode=" + (+o.pc) : ""), outFields: "suburbname", returnGeometry: true, outSR: 4326, maxAllowableOffset: 0.0005 });
        const g = d.features && d.features[0] && d.features[0].geometry;
        const c = g && polyCentroid(g.rings);
        if (!c) throw new Error("no geometry");
        [x, y] = c;
      }
      const lga = await lgaAt(x, y);
      if (!lga) throw new Error("no council");
      if (chosen === o) showExact(o, lga);
    } catch (e) {
      if (chosen === o) showResult(match(input.value), input.value); // fall back to the built-in suburb list
    }
  }
  function showExactInner(o, lga) {
    const key = councilKey(lga.lganame);
    const name = titleCase(lga.councilname || lga.lganame);
    const place = o.kind === "Suburbs" ? o.main : o.main + ", " + o.sub;
    const local = SUBURBS.find((x) => x.name.toLowerCase() === String(o.kind === "Suburbs" ? o.main : o.sub).toLowerCase());
    const shared = o.kind === "Suburbs" && local && local.share.length;
    const how = o.kind === "Addresses" ? "This address is inside the " + esc(name) + " boundary." :
      o.kind === "Streets" ? "Checked at a property on this street. For a long street near a council border, choose the exact address." :
      shared ? "The centre of " + esc(o.main) + " is in " + esc(name) + ", but part of the suburb belongs to " + local.share.map(esc).join(" and ") + ". Choose your street address to be sure." :
      "The centre of this suburb is in " + esc(name) + ".";
    const src = '<span class="help">Source: NSW Spatial Services council boundaries.</span>';
    if (COUNCILS[key]) {
      $("#result").innerHTML = '<span class="status ' + (shared ? "part" : "ok") + '">' + (shared ? "Check boundary" : "✓ Supported") + '</span><div class="council">' + esc(COUNCILS[key].name) + '</div><div class="msg">' + esc(place) + ". " + how + " Showing plants from the council's native plant list.</div>" + src;
      const sub = SUBURBS.find((x) => x.council === key && x.name.toLowerCase() === String(o.kind === "Suburbs" ? o.main : o.sub).toLowerCase());
      selectCouncil(key, sub && sub.zone ? [sub.zone] : []);
    } else {
      $("#result").innerHTML = '<span class="status no">Not in database yet</span><div class="council">' + esc(name) + '</div><div class="msg">' + esc(place) + ". " + how + " This council's plant list hasn't been added yet.</div>" + src;
    }
  }

  $("#addrForm").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!list.hidden && opts.length) { pick(opts[activeIdx >= 0 ? activeIdx : 0]); return; }
    if (chosen) { lookup(chosen); return; }
    const v = input.value.trim(); closeList(); showResult(match(v), v);
  });
  document.querySelectorAll("[data-ex]").forEach((b) => b.addEventListener("click", () => {
    input.value = b.dataset.ex; chosen = null;
    if (b.hasAttribute("data-suggest")) { input.focus(); input.dispatchEvent(new Event("input")); }
    else { closeList(); showResult(match(b.dataset.ex), b.dataset.ex); }
  }));
  $("#council").addEventListener("change", () => { showCouncil(cur()).then((ok) => ok && render()); });

  // ---------- Landing screen ----------
  function showResult(r, raw) { showResultInner(r, raw); if (raw) afterLookup(); }
  function showExact(o, lga) { showExactInner(o, lga); afterLookup(); }
  const landing = $("#landing"), app = $("#app"), form = $("#addrForm"), matcher = $(".matcher");
  let onLanding = true;
  function afterLookup() {
    if (!onLanding) return;
    const st = $("#result .status");
    if (st && (st.classList.contains("ok") || st.classList.contains("part"))) { enterApp(); return; }
    $("#landMsg").innerHTML = $("#result").innerHTML + (st && st.classList.contains("no") ? '<button type="button" class="btn" id="anyway" style="align-self:flex-start;margin-top:4px">Browse the available plant lists</button>' : "");
    const b = $("#anyway"); if (b) b.addEventListener("click", enterApp);
  }
  function enterApp() {
    onLanding = false;
    matcher.insertBefore(form, $("#result"));
    app.hidden = false;
    landing.classList.add("leaving");
    setTimeout(() => { landing.hidden = true; }, 450);
    window.scrollTo(0, 0);
    showCouncil(cur()).then((ok) => ok && render());
  }
  function showLanding() {
    onLanding = true;
    $("#landMsg").innerHTML = "";
    $("#landSlot").appendChild(form);
    landing.hidden = false;
    restoreCard(false);
    buildWall(); // the window may have been resized while the landing was hidden
    requestAnimationFrame(() => landing.classList.remove("leaving"));
    app.hidden = true;
    const i = $("#addr"); i.value = ""; i.focus();
  }
  $("#skip").addEventListener("click", enterApp);
  $("#newAddr").addEventListener("click", showLanding);

  // Minimise the start card into a pill at the bottom of the page, to see the council names behind it
  const landCard = $("#landCard"), pill = $("#landRestore");
  function minimiseCard() {
    const r = landCard.getBoundingClientRect();
    const target = window.innerHeight - 70; // about where the pill sits
    landCard.style.setProperty("--drop", target - (r.top + r.height / 2) + "px");
    landing.classList.add("min");
    pill.hidden = false;
    pill.focus();
  }
  function restoreCard(focus) {
    if (!landing.classList.contains("min")) return;
    landing.classList.remove("min");
    pill.hidden = true;
    if (focus) requestAnimationFrame(() => $("#landMin").focus()); // once the card is visible again
  }
  $("#landMin").addEventListener("click", minimiseCard);
  pill.addEventListener("click", () => restoreCard(true));

  // Background wall of council names: hover to highlight, click to open
  const wall = $("#names");
  const nice = (n) => n.toLowerCase().replace(/(^|[\s\-])([a-z])/g, (m, a, c) => a + c.toUpperCase()).replace(/\bOf\b/g, "of").replace("Ku-Ring-Gai", "Ku-ring-gai");
  function rand(seed) { let x = Math.sin(seed * 9301 + 49297) * 233280; return x - Math.floor(x); }
  // Each council appears once. Names are dealt into rows in a fixed shuffled order, at the largest size
  // where the rows fill the screen; spare space is then shared out unevenly and each name is nudged up or
  // down within its row, so the wall looks scattered but has no clumps or empty patches.
  function buildWall() {
    const W = wall.clientWidth, H = wall.clientHeight;
    if (!W || !H) return; // landing is hidden; rebuilt when shown
    wall.innerHTML = "";
    const BASE = 20, pad = 6, GX = 0.32, GY = 0.05; // gaps as a share of the name's height
    const items = NSW_COUNCILS.map((n, i) => {
      const key = n.toLowerCase().replace(/\s+/g, "-"), t = nice(n);
      const el = document.createElement("span");
      el.className = "nm" + (rand(i) > 0.72 ? " serif" : "") + (COUNCILS[key] ? " live" : "");
      el.dataset.t = t;
      el.dataset.key = key;
      el.setAttribute("role", "button");
      el.tabIndex = -1;
      el.innerHTML = "<span>" + t + "</span>";
      const weight = 0.85 + rand(i + 7) * 0.45; // relative size, varied per name
      el.style.fontSize = BASE * weight + "px";
      wall.appendChild(el);
      return { el, i, weight };
    });
    items.forEach((it) => { it.w = it.el.offsetWidth; it.h = it.el.offsetHeight; }); // at BASE * weight
    const order = items.slice().sort((a, b) => rand(a.i * 31 + 5) - rand(b.i * 31 + 5));
    function rowsAt(s) {
      const rows = [];
      let row = [], x = 0;
      for (const it of order) {
        const w = it.w * s, g = it.h * s * GX;
        if (row.length && x + g + w > W - 2 * pad) { rows.push(row); row = []; x = 0; }
        x += (row.length ? g : 0) + w;
        row.push(it);
      }
      rows.push(row);
      const height = rows.reduce((a, r) => a + Math.max(...r.map((it) => it.h * s)) * (1 + GY), 0);
      return { rows, height, fits: height <= H - 2 * pad && order.every((it) => it.w * s <= W - 2 * pad) };
    }
    let lo = 0.05, hi = 10;
    for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (rowsAt(m).fits) lo = m; else hi = m; }
    const s = lo, { rows, height } = rowsAt(s);
    const vGap = (H - 2 * pad - height) / (rows.length + 1);
    let y = pad + vGap;
    rows.forEach((row, ri) => {
      const rh = Math.max(...row.map((it) => it.h * s));
      const used = row.reduce((a, it, j) => a + it.w * s + (j ? it.h * s * GX : 0), 0);
      // Uneven shares of the row's spare width; the two ends get less so rows reach the page edges
      const shares = row.concat([null]).map((_, k) => (k === 0 || k === row.length ? 0.4 : 1) * (0.3 + rand(ri * 101 + k * 7 + 11)));
      const total = shares.reduce((a, b) => a + b, 0), spare = W - 2 * pad - used;
      let x = pad;
      row.forEach((it, j) => {
        x += (spare * shares[j]) / total + (j ? it.h * s * GX : 0);
        it.el.style.fontSize = BASE * it.weight * s + "px";
        it.el.style.left = x + "px";
        it.el.style.top = y + (rh - it.h * s) * rand(it.i * 13 + 3) + "px";
        x += it.w * s;
      });
      y += rh * (1 + GY) + vGap;
    });
  }
  buildWall();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildWall); // widths change once web fonts load
  let rt; window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(buildWall, 200); });
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let hot = null;
  function ripple(el, cx, cy) {
    if (hot) hot.classList.remove("hot");
    hot = el; el.classList.add("hot");
    if (still) return;
    // A wave rolls outward through the neighbouring names
    wall.querySelectorAll(".nm").forEach((n) => {
      if (n === el) return;
      const b = n.getBoundingClientRect();
      const dx = b.left + b.width / 2 - cx, dy = b.top + b.height / 2 - cy;
      const d = Math.hypot(dx, dy);
      if (d > 320 || !n.animate) return;
      const push = 7 * (1 - d / 320);
      const ux = dx / (d || 1), uy = dy / (d || 1);
      n.animate([
        { transform: "translate(0,0) scale(1)" },
        { transform: "translate(" + (ux * push) + "px," + (uy * push) + "px) scale(" + (1 + 0.12 * (1 - d / 320)) + ")", opacity: 0.45 },
        { transform: "translate(0,0) scale(1)" }
      ], { duration: 700, delay: d * 1.6, easing: "cubic-bezier(.3,.7,.3,1)" });
    });
  }
  wall.addEventListener("pointerover", (e) => {
    const el = e.target.closest(".nm");
    if (!el || el === hot) return;
    const b = el.getBoundingClientRect();
    ripple(el, b.left + b.width / 2, b.top + b.height / 2);
  });
  // Click a name to open that council's plant list
  wall.addEventListener("click", (e) => {
    const el = e.target.closest(".nm");
    if (!el) return;
    const key = el.dataset.key, name = el.dataset.t;
    if (COUNCILS[key]) {
      $("#result").innerHTML = '<span class="status ok">✓ Supported</span><div class="council">' + esc(COUNCILS[key].name) + '</div><div class="msg">Chosen from the council list. Enter your site address to check it is in this council' + (key === "hornsby" ? " and to select your area" : "") + ".</div>";
      selectCouncil(key);
      enterApp();
    } else {
      $("#landMsg").innerHTML = '<span class="status no">Coming soon</span><div class="council">' + esc(name) + ' Council</div><div class="msg">This council\'s native plant list hasn\'t been added yet. Available now: ' + esc(listNames()) + '.</div><button type="button" class="btn" id="anyway" style="align-self:flex-start;margin-top:4px">Browse the available plant lists</button>';
      $("#anyway").addEventListener("click", enterApp);
      restoreCard(false); // the message is shown in the card
    }
  });
  wall.addEventListener("pointerleave", () => { if (hot) { hot.classList.remove("hot"); hot = null; } });
  // Names sit behind the card, so let pointer events reach them around it
  $("#landSlot").appendChild(form);
  showResultInner(null, "");
})();
