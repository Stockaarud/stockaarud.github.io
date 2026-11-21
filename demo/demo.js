/* Stockaarud : version de démonstration.
   Remplace backend.js : pas de Supabase, tout reste dans le navigateur de la personne.
   Les données du CAARUD fictif viennent de seed.json et sont décalées dans le temps
   à chaque ouverture, pour que l'année de mouvements se termine toujours la veille. */
(function () {
  "use strict";
  const ROLE_KEY = "stockaarud-demo-role", BASE_KEY = "stockaarud-demo-base", DAY = 864e5;
  const role = localStorage.getItem(ROLE_KEY) || "coordo";
  /* Deux CAARUD fictifs, pour essayer le passage de l'un à l'autre */
  const BASES = [{ ref: "nord", nom: "CAARUD Démo Nord" }, { ref: "sud", nom: "CAARUD Démo Sud" }];
  const base = BASES.some(b => b.ref === localStorage.getItem(BASE_KEY)) ? localStorage.getItem(BASE_KEY) : "nord";
  const KEY = base === "nord" ? "stockaarud-demo-v3" : "stockaarud-demo-v3-" + base;
  window.STK_NS = base === "nord" ? "stk:" : "stk@demo-" + base + ":";
  const store = new Map();
  const startOfDay = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };

  function persist() {
    const o = {}; for (const [c, m] of store) o[c] = Object.fromEntries(m);
    try { localStorage.setItem(KEY, JSON.stringify({ anchorDay: startOfDay(Date.now()), data: o })); } catch (e) { console.warn("Démo : stockage local plein", e); }
  }
  let tm = null; const save = () => { clearTimeout(tm); tm = setTimeout(persist, 300); };

  function load(saved, seed) {
    if (saved) {
      for (const c in saved.data) store.set(c, new Map(Object.entries(saved.data[c])));
      const days = Math.round((startOfDay(Date.now()) - saved.anchorDay) / DAY);
      if (days > 0) for (const m of (store.get("mouvements") || new Map()).values()) if (typeof m.t === "number") m.t += days * DAY;
    } else {
      const shift = startOfDay(Date.now()) - DAY - startOfDay(seed.anchor);
      const cf = JSON.parse(JSON.stringify(seed.config));
      if (cf.main) cf.main.nomStructure = BASES.find(b => b.ref === base).nom;
      store.set("config", new Map(Object.entries(cf)));
      store.set("produits", new Map(Object.entries(seed.produits)));
      const mv = new Map();
      seed.mouvements.forEach((m, i) => mv.set("demo-" + i.toString(36), { lieu: "principal", ...m, t: m.t + shift }));
      store.set("mouvements", mv);
    }
    persist();
  }

  const ready = (async () => {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
    if (saved && saved.data) {
      load(saved);
      const m = store.get("config"), c = m && m.get("main");
      if (c && !c.nomStructure) m.set("main", { ...c, nomStructure: BASES.find(b => b.ref === base).nom });
      return;
    }
    const r = await fetch("seed.json", { cache: "no-cache" });
    load(null, await r.json());
  })();

  const collL = new Map(), docL = new Map();
  const meta = () => ({ hasPendingWrites: false, fromCache: false });
  const copy = (d) => (d === undefined ? undefined : JSON.parse(JSON.stringify(d)));
  const docSnap = (c, id) => { const d = (store.get(c) || new Map()).get(id); return { id, exists: d !== undefined, data: () => copy(d), metadata: meta() }; };
  function emitColl(c) { const ls = collL.get(c); if (!ls) return; const m = store.get(c) || new Map(); const docs = [...m.keys()].sort().map((id) => docSnap(c, id)); const snap = { docs, size: docs.length, empty: !docs.length, metadata: meta(), docChanges: () => [] }; ls.forEach((cb) => cb(snap)); }
  function emitDoc(c, id) { const ls = docL.get(c + "/" + id); if (ls) ls.forEach((cb) => cb(docSnap(c, id))); }
  let pend = new Set(), sch = false;
  function put(c, id, data) {
    if (!store.has(c)) store.set(c, new Map());
    if (data === undefined) store.get(c).delete(id); else store.get(c).set(id, data);
    save(); pend.add(c); emitDoc(c, id);
    if (!sch) { sch = true; setTimeout(() => { sch = false; const p = pend; pend = new Set(); p.forEach(emitColl); }, 0); }
  }
  const split = (p) => { const i = p.indexOf("/"); return [p.slice(0, i), p.slice(i + 1)]; };
  const db = {
    doc(path) {
      const [c, id] = split(path);
      return {
        id, path,
        async get() { await ready; return docSnap(c, id); },
        async set(d) { await ready; put(c, id, copy(d)); },
        async update(p) { await ready; const cur = (store.get(c) || new Map()).get(id) || {}; put(c, id, { ...cur, ...copy(p) }); },
        async delete() { await ready; put(c, id, undefined); },
        onSnapshot(n) { const k = c + "/" + id; if (!docL.has(k)) docL.set(k, new Set()); docL.get(k).add(n); ready.then(() => n(docSnap(c, id))); return () => docL.get(k).delete(n); }
      };
    },
    collection(c) {
      return { path: c, doc: (id) => db.doc(c + "/" + id), onSnapshot(n) { if (!collL.has(c)) collL.set(c, new Set()); collL.get(c).add(n); ready.then(() => emitColl(c)); return () => collL.get(c).delete(n); } };
    }
  };
  const uid = role === "coordo" ? "demo-coordo" : "demo-equipe";
  const user = { isOwner: async () => role === "coordo", canEdit: async () => role === "coordo", can: async (n) => (n === "data.write" ? true : null), id: async () => uid, me: async () => ({ id: uid, name: "", isOwner: role === "coordo", canEdit: role === "coordo" }) };
  const assets = { async upload(b) { return { id: "demo", url: URL.createObjectURL(b), sizeBytes: b.size, contentType: b.type }; }, async delete() {}, async list() { return { assets: [], usage: {} }; } };
  const downloads = { async save({ filename, data }) { const blob = data instanceof Blob ? data : new Blob([data]); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); return { saved: true }; } };
  const caps = { db, user, assets, downloads };
  window.claude = Object.freeze({ use: (name) => ready.then(() => caps[name] || null) });

  function reset() {
    Object.keys(localStorage).filter((k) => k.startsWith("stockaarud-demo-v3") || k.startsWith("stk:") || k.startsWith("stk@demo-")).forEach((k) => localStorage.removeItem(k));
    location.reload();
  }
  const demoLink = () => "https://stockaarud.github.io/demo/";
  window.SKB = Object.freeze({
    get role() { return role; },
    get url() { return "démo (données dans ce navigateur)"; },
    async newCode() { return "DEMO2026"; },
    async disableCodes() {}, async removeTeam() {}, async removeGest() {},
    inviteLink: () => demoLink(),
    qrSvg(text) { if (typeof qrcode !== "function") return ""; const q = qrcode(0, "M"); q.addData(text); q.make(); return q.createSvgTag({ cellSize: 5, margin: 2, scalable: true }); },
    logout: reset,
    bases() {
      return BASES.map(b => {
        const ns = b.ref === "nord" ? "stk:" : "stk@demo-" + b.ref + ":"; let pend = 0;
        try { const q = JSON.parse(localStorage.getItem(ns + "queue") || "[]"); pend = Array.isArray(q) ? q.length : 0; } catch (e) {}
        return { ref: b.ref, nom: b.nom, cur: b.ref === base, pend };
      });
    },
    switchBase(r) { if (r !== base) { localStorage.setItem(BASE_KEY, r); location.reload(); } },
    addLink() { return "Dans la démo, les deux CAARUD fictifs sont déjà là. Avec la vraie appli, collez ici le lien d'invitation de l'autre CAARUD."; },
    setName() {},
    forget() { alert("Dans la démo, on garde les deux CAARUD fictifs."); }
  });

  /* Bandeau de démo */
  function banner() {
    const st = document.createElement("style");
    st.textContent = `#demoBar{position:relative;z-index:9999;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px 14px;padding:calc(6px + env(safe-area-inset-top,0px)) 12px 6px;background:#14201d;color:#f2f5f3;font:600 14px/1.3 system-ui,sans-serif}
#demoBar b{background:#f2b705;color:#14201d;padding:2px 8px;border-radius:4px}
#demoBar .dm-seg{display:inline-flex;border:1px solid #f2f5f3;border-radius:6px;overflow:hidden}
#demoBar button{font:inherit!important;border:0!important;background:transparent!important;color:#f2f5f3!important;padding:6px 10px!important;min-height:36px;cursor:pointer;box-shadow:none!important;border-radius:0!important}
#demoBar .dm-seg button[aria-pressed="true"]{background:#f2f5f3!important;color:#14201d!important}
#demoBar .dm-reset{text-decoration:underline}
#demoBar button:focus-visible{outline:2px solid #f2b705;outline-offset:2px}`;
    document.head.appendChild(st);
    const bar = document.createElement("div"); bar.id = "demoBar"; bar.setAttribute("role", "region"); bar.setAttribute("aria-label", "Démo");
    bar.innerHTML = `<span><b>Démo</b> CAARUD fictif, données inventées</span>
<span class="dm-seg" role="group" aria-label="Se connecter comme"><button type="button" data-r="equipe" aria-pressed="${role === "equipe"}">Équipe</button><button type="button" data-r="coordo" aria-pressed="${role === "coordo"}">Responsable stock</button></span>
<button type="button" class="dm-reset">Remettre à zéro</button>`;
    bar.querySelectorAll("[data-r]").forEach((b) => b.addEventListener("click", () => { if (b.dataset.r === role) return; localStorage.setItem(ROLE_KEY, b.dataset.r); location.reload(); }));
    bar.querySelector(".dm-reset").addEventListener("click", () => { if (confirm("Remettre la démo à zéro ? Ce que vous avez saisi sera effacé.")) reset(); });
    document.body.prepend(bar);
  }
  if (document.body) banner(); else document.addEventListener("DOMContentLoaded", banner);
})();
