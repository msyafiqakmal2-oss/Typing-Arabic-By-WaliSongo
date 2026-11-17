/* ===== CLOUD: simpan & ambil data siswa lewat Firestore REST API (tanpa SDK, tanpa instalasi) =====
   Satu dokumen per siswa. ID dokumen = nama yang dinormalisasi, jadi mengetik nama yang sama = melanjutkan akun yang sama. */
const Cloud = (()=>{
  const C = (typeof CLOUD_CONFIG !== "undefined") ? CLOUD_CONFIG : {};
  const col = C.collection || "students";
  const enabled = () => !!(C.projectId && C.apiKey);
  const base = () => `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(C.projectId)}/databases/(default)/documents`;
  const key = () => `key=${encodeURIComponent(C.apiKey)}`;
  // "  Ahmad   Fauzi " -> "ahmad-fauzi" (huruf Latin/Arab/angka saja)
  const id = name => (name||"").normalize("NFC").toLowerCase().replace(/[^\p{L}\p{N}\s_-]/gu,"").trim().replace(/\s+/g,"-").slice(0,60);

  let state = enabled() ? "idle" : "off", dirty = false, timer = 0, retry = 0, inflight = null, provider = () => null;
  const subs = new Set();
  const setState = s => { state = s; subs.forEach(f=>{ try{ f(s); }catch(e){} }); };

  async function req(url, opt){
    const ctl = new AbortController(), t = setTimeout(()=>ctl.abort(), 10000);
    try{
      const r = await fetch(url, {...opt, signal:ctl.signal});
      if (r.status === 404) return null;
      if (!r.ok) throw new Error("HTTP "+r.status);
      return await r.json();
    } finally { clearTimeout(t); }
  }
  const S = v => ({stringValue:String(v)}), I = v => ({integerValue:String(Math.round(v))}), D = v => ({doubleValue:Number(v)});
  const num = f => f ? (f.integerValue!==undefined ? +f.integerValue : f.doubleValue!==undefined ? +f.doubleValue : 0) : 0;
  const str = f => f && f.stringValue !== undefined ? f.stringValue : "";

  // ambil data satu siswa (null = belum ada)
  async function pull(sid){
    const d = await req(`${base()}/${col}/${encodeURIComponent(sid)}?${key()}`);
    if (!d || !d.fields) return null;
    let data = null; try{ data = JSON.parse(str(d.fields.data)); }catch(e){}
    return data ? {data, updated:num(d.fields.updated), name:str(d.fields.name)} : null;
  }
  // kirim data satu siswa (membuat dokumen bila belum ada)
  async function push(sid, snap){
    const ss = snap.sessions || [];
    const body = {fields:{
      name:S(snap.settings.name), points:I(snap.points), rank:S(snap.rankName||""),
      wpm:D(ss.length ? Math.max(...ss.map(x=>x.wpm||0)) : 0), acc:D(ss.length ? Math.max(...ss.map(x=>x.acc||0)) : 0),
      streak:I(snap.streak||0), days:I((snap.days||[]).length), updated:I(snap.updated||Date.now()),
      data:S(JSON.stringify({...snap, settings:{name:snap.settings.name}, sessions:ss.slice(-100)}))
    }};
    await req(`${base()}/${col}/${encodeURIComponent(sid)}?${key()}`, {method:"PATCH", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)});
  }
  // klasemen: poin tertinggi dulu
  async function board(limit=100){
    const body = {structuredQuery:{from:[{collectionId:col}], orderBy:[{field:{fieldPath:"points"}, direction:"DESCENDING"}], limit}};
    const r = await req(`${base()}:runQuery?${key()}`, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)});
    return (r||[]).filter(x=>x.document && x.document.fields).map(x=>{ const f = x.document.fields;
      return {name:str(f.name), rank:str(f.rank), points:num(f.points), wpm:num(f.wpm), acc:num(f.acc), streak:num(f.streak), days:num(f.days), updated:num(f.updated)}; });
  }

  // simpan otomatis (ditunda 1,5 detik agar tidak terlalu sering mengirim)
  function touch(){ if (!enabled()) return; dirty = true; clearTimeout(timer); timer = setTimeout(flush, 1500); }
  async function flush(){
    clearTimeout(timer);
    if (!enabled() || !dirty) return;
    if (inflight) return inflight;
    const snap = provider(); const sid = snap && id(snap.settings.name);
    if (!sid){ dirty = false; return; }
    setState("saving");
    inflight = (async()=>{
      try{ dirty = false; await push(sid, snap); setState("ok"); clearTimeout(retry); }
      catch(e){ dirty = true; setState("offline"); clearTimeout(retry); retry = setTimeout(flush, 15000); }
      finally{ inflight = null; }
    })();
    return inflight;
  }
  window.addEventListener("online", ()=>{ if (dirty) flush(); });

  return {enabled, id, pull, push, board, touch, flush,
          dirty:()=>dirty, state:()=>state, setState, onState:f=>subs.add(f), setProvider:f=>{ provider = f; }};
})();
