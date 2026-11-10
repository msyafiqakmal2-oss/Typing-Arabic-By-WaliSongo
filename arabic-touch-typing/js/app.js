/* ===== APP: navigasi, poin, peringkat, streak, lencana, tes, rencana, laporan ===== */
const $ = id => document.getElementById(id);
const KEY = "att_v1";
const DEF = {points:0, badges:[], sessions:[], pre:null, post:null, days:[], stars:{}, streak:0, lastDay:"", gameBest:0,
             settings:{name:"", kb:"builtin", sound:true, showKb:true}};
const DEF_JSON = JSON.stringify(DEF), fresh = () => JSON.parse(DEF_JSON);   // salinan bersih (array tidak dipakai bersama DEF)
let DB = (()=>{ try{ const s = JSON.parse(localStorage.getItem(KEY)); return {...fresh(), ...s, settings:{...DEF.settings, ...(s&&s.settings)}}; }
                 catch(e){ return fresh(); } })();
if (!DB.v10){ DB.days = []; DB.v10 = 1; }      // program 14 hari diganti 10 pertemuan: mulai bersih
const save = () => { try{ localStorage.setItem(KEY, JSON.stringify(DB)); }catch(e){} };
const f1 = n => (Math.round(n*10)/10).toString();
const dayStr = d => d.toLocaleDateString("sv-SE");
const today = () => dayStr(new Date());
const starStr = n => "★".repeat(n||0) + "☆".repeat(3-(n||0));
const starsOf = a => a>=95 ? 3 : a>=90 ? 2 : a>=80 ? 1 : 0;
const rankIdx = p => RANKS.reduce((r,x,i)=>p>=x[0]?i:r, 0);
let lastView = "home";

/* ---------- navigasi ---------- */
function show(v){
  if (v!=="stage") Engine.abort();
  Game.stop();
  document.querySelectorAll(".view").forEach(e=>e.hidden = e.id !== "v-"+v);
  document.querySelectorAll("#nav button").forEach(b=>b.classList.toggle("on", b.dataset.view===v));
  ({home:renderHome, tutorial:renderTutorial, self:renderSelf, test:renderTest, report:renderReport})[v]?.();
  window.scrollTo(0,0);
}
document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>show(b.dataset.view));
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=e=>{e.preventDefault(); show(b.dataset.go)});
$("gameBack").onclick = ()=>show("self");

/* ---------- tombol "Selesai" + konfirmasi ---------- */
function askFinish(text, onYes, onNo){
  $("cfText").textContent = text; $("confirm").hidden = false; $("cfNo").focus();
  $("cfYes").onclick = ()=>{ $("confirm").hidden = true; onYes(); };
  $("cfNo").onclick = ()=>{ $("confirm").hidden = true; onNo(); };
}
$("btnFinish").onclick = ()=>{
  if (!Engine.active()) return; Engine.pause();
  askFinish("Apakah Anda yakin ingin menyelesaikannya? Hasil yang sudah diketik sampai saat ini akan dihitung.",
    ()=>{ if (!Engine.finishNow()) show(lastView); }, ()=>Engine.resume());
};
$("gameFinish").onclick = ()=>{
  if (!Game.active()) return; Game.pause();
  askFinish("Apakah Anda yakin ingin menyelesaikannya? Skor sampai saat ini akan dihitung.",
    ()=>{ if (!Game.finishNow()) show("self"); }, ()=>Game.resume());
};
document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("[data-tab]").forEach(x=>x.classList.toggle("on", x===b));
  $("tab-lv").hidden = b.dataset.tab!=="lv"; $("tab-plan").hidden = b.dataset.tab!=="plan";
});
$("btnBack").onclick = ()=>show(lastView);

/* ---------- streak, poin, lencana ---------- */
function touchStreak(){
  const t = today(); if (DB.lastDay === t) return;
  DB.streak = DB.lastDay === dayStr(new Date(Date.now()-864e5)) ? DB.streak+1 : 1; DB.lastDay = t;
}
const streakNow = () => (DB.lastDay===today() || DB.lastDay===dayStr(new Date(Date.now()-864e5))) ? DB.streak : 0;
const todayMin = () => DB.sessions.filter(s=>dayStr(new Date(s.date))===today()).reduce((a,s)=>a+s.sec,0)/60;

function give(id, got){ if (!DB.badges.includes(id)){ DB.badges.push(id); got.push(BADGES.find(b=>b.id===id).name); } }
function award(m, ctx){
  const got = []; let pts = 0;
  if (ctx.mode === "test") pts = 20;
  else {
    pts = Math.round(m.ccpm*m.acc/100/10) + ctx.stars*5 + Math.floor(m.maxCombo/10);
    const prev = DB.sessions.filter(s=>s.mode===ctx.mode).slice(-2)[0];
    if (prev && m.ccpm > prev.ccpm) pts += 10;
  }
  DB.points += pts;
  give("first", got);
  if (m.acc >= 95) give("teliti", got);
  if (m.wpm >= 20 && m.sec >= 60) give("cepat", got);
  if (ctx.sub==="s_h" && m.acc >= 90) give("harakat", got);
  if (ctx.sub==="p_l" && m.acc >= 80) give("tamat", got);
  if (DB.pre && DB.post && DB.post.ccpm > DB.pre.ccpm) give("naik", got);
  if (DB.days.length >= 7) give("konsisten", got);
  if (m.maxCombo >= 50) give("combo", got);
  if (DB.streak >= 3) give("streak3", got);
  return {pts, got};
}

/* ---------- tampilan atas & beranda ---------- */
function renderTop(){
  const r = RANKS[rankIdx(DB.points)];
  $("rankChip").innerHTML = `<span class="ar" lang="ar">${r[2]}</span> ${r[1]}`;
  $("pts").textContent = DB.points; $("streakN").textContent = streakNow();
  $("btnSound").textContent = DB.settings.sound ? "🔊" : "🔇";
  $("kbModeLbl").textContent = DB.settings.kb==="builtin" ? "Keyboard Arab bawaan situs" : "Keyboard sistem (Arabic 101)";
}
function renderHome(){
  const i = rankIdx(DB.points), r = RANKS[i], nx = RANKS[i+1];
  $("greet").textContent = DB.settings.name ? `Ahlan, ${DB.settings.name}!` : "Ahlan wa sahlan!";
  $("nameIn").value = DB.settings.name;
  const pct = nx ? Math.round((DB.points-r[0])/(nx[0]-r[0])*100) : 100;
  $("rankBox").innerHTML = `<div class="rk-ar" lang="ar">${r[2]}</div><b>${r[1]} · ${r[3]}</b><div class="xp"><i style="width:${pct}%"></i></div><small>${nx?`${nx[0]-DB.points} poin lagi → ${nx[1]}`:"Peringkat tertinggi!"}</small>`;
  const ss = DB.sessions, bw = ss.length ? Math.max(...ss.map(s=>s.wpm)) : 0, ba = ss.length ? Math.max(...ss.map(s=>s.acc)) : 0;
  const mins = Math.min(todayMin(),10), c = (ic,v,l)=>`<div class="stat"><span>${ic}</span><b>${v}</b><small>${l}</small></div>`;
  $("stats").innerHTML = c("🔥",streakNow()+" hari","Streak")
    + `<div class="stat"><span>🎯</span><b>${Math.round(mins)}/10 mnt</b><small>Target hari ini</small><div class="xp"><i style="width:${mins*10}%"></i></div></div>`
    + c("⚡",f1(bw),"WPM terbaik") + c("✔",f1(ba)+"%","Akurasi terbaik") + c("🎮",DB.gameBest,"Skor game terbaik");
  const nd = [...Array(10)].map((_,k)=>k+1).find(d=>!DB.days.includes(d));
  $("btnContinue").textContent = nd ? `Lanjut: Hari ${nd}` : "Ulangi program 10 hari";
  $("btnContinue").onclick = ()=>startDay(nd || 1);
}
$("nameIn").onchange = e=>{ DB.settings.name = e.target.value.trim(); save(); renderHome(); };

/* ---------- menjalankan sesi + hasil ---------- */
function run({title, kind, mode, sub, duration, day, after, race}){
  const cur = document.querySelector(".view:not([hidden])");
  if (cur && cur.id!=="v-stage") lastView = cur.id.slice(2);
  let curText = "";
  const restart = ()=>{
    let text = gen(kind); if (duration && kind!=="test" && !race) while (text.length < duration*3) text += " " + gen(kind);
    curText = text; show("stage"); Engine.start({title, text, duration, race, onFinish});
  };
  const onFinish = m => {
    const before = rankIdx(DB.points), key = sub||kind, st = starsOf(m.acc);
    DB.sessions.push({date:new Date().toISOString(), mode, sub:key, title, ...m});
    if (after) after(m);
    if (day && !DB.days.includes(day)) DB.days.push(day);
    if (mode!=="test") DB.stars[key] = Math.max(DB.stars[key]||0, st);
    touchStreak();
    const r = award(m, {mode, sub:key, stars:st});
    let note = "";
    if (race){ const won = m.total >= curText.length;
      if (won){ DB.points += 20; r.pts += 20; note = "🏁 Kamu menang melawan robot! "; } else note = m.early ? "Sesi diselesaikan sebelum garis finis. " : "🤖 Robot lebih cepat kali ini. Coba lagi! "; }
    save(); renderTop();
    openResult({title, note, stars:mode==="test"?null:st, again:restart, pts:r.pts, got:r.got, rankUp:rankIdx(DB.points)>before,
      grid:[[f1(m.wpm),"WPM"],[Math.round(m.cpm),"CPM"],[Math.round(m.ccpm),"Correct CPM"],[f1(m.acc)+"%","Akurasi"],[f1(m.err)+"%","Kesalahan"],[m.maxCombo,"Combo maks"]]});
  };
  restart();
}
function openResult(o){
  $("rTitle").textContent = o.title;
  $("rStars").textContent = o.stars==null ? "" : starStr(o.stars);
  $("rGrid").innerHTML = o.grid.map(([v,l])=>`<div><b>${v}</b><span>${l}</span></div>`).join("");
  const r = RANKS[rankIdx(DB.points)];
  $("rExtra").innerHTML = (o.note||"") + (o.pts?`+${o.pts} poin. `:"") + (o.rankUp?`<b>Naik peringkat: ${r[1]}!</b> `:"") + (o.got&&o.got.length?`Lencana baru: ${o.got.join(", ")}.`:"");
  $("result").hidden = false;
  if ((o.stars||0)>=2 || o.rankUp || (o.got&&o.got.length)){ confetti(); Sfx.win(); }
  $("rAgain").onclick = ()=>{ $("result").hidden = true; o.again(); };
  $("rClose").onclick = ()=>{ $("result").hidden = true; show(lastView); };
}
function gameDone(g){
  const before = rankIdx(DB.points), got = [], pts = Math.round(g.score/8);
  DB.points += pts; if (g.score > DB.gameBest) DB.gameBest = g.score;
  touchStreak(); give("first", got);
  if (g.score >= 200) give("hujan", got);
  if (g.max >= 50) give("combo", got);
  if (DB.streak >= 3) give("streak3", got);
  save(); renderTop(); lastView = "self";
  openResult({title:"Self Learning – selesai", stars:g.score>=300?3:g.score>=150?2:g.score>=60?1:0, again:g.again, pts, got, rankUp:rankIdx(DB.points)>before,
    grid:[[g.score,"Skor"],[DB.gameBest,"Terbaik"],[f1(g.acc)+"%","Ketepatan"],[g.max,"Combo maks"],[g.level,"Level"],[g.hits,"Berhasil diketik"]]});
}

/* ---------- level, rencana, tes ---------- */
function renderLevels(){
  $("levelList").innerHTML = LEVELS.map(l=>`
    <div class="row"><div><span class="ar" lang="ar">${l.ar}</span> <b>Level ${l.id}: ${l.name}</b><p>${l.desc}</p></div>
    <div class="sub">${l.subs.map(([n,k])=>`<button data-lv="${l.id}" data-k="${k}">${n}<span class="st">${starStr(DB.stars[k])}</span></button>`).join("")}</div></div>`).join("");
  document.querySelectorAll("[data-lv]").forEach(b=>b.onclick=()=>{
    const l = LEVELS[b.dataset.lv-1], n = b.firstChild.textContent;
    run({title:`Level ${l.id} – ${l.name} (${n})`, kind:b.dataset.k, mode:"level"+l.id, sub:b.dataset.k});
  });
}
function renderTutorial(){ renderLevels(); renderPlan(); }
function renderSelf(){
  $("gBest").textContent = DB.gameBest;
  $("gameWrap").hidden = true; $("selfList").hidden = false;
  $("selfList").innerHTML = SELF.map(l=>`
    <div class="row"><div><b>Level ${l.id}: ${l.name}</b><p>${l.desc}</p></div>
    <div class="sub">${l.subs.map(([n,k,c])=>`<button data-sl="${l.id}" data-k="${k}"${c?` data-cps="${c}"`:""}>${n}</button>`).join("")}</div></div>`).join("");
  document.querySelectorAll("[data-sl]").forEach(b=>b.onclick=()=>{
    const l = SELF[b.dataset.sl-1], n = b.textContent;
    if (l.race) run({title:`Balapan Paragraf – ${n}`, kind:b.dataset.k, mode:"race", sub:"race_"+b.dataset.k, duration:240, race:{cps:+b.dataset.cps}});
    else Game.start(b.dataset.k);
  });
}
/* ---------- Program 10 Hari: tiap hari = satu pertemuan modul; klik untuk memilih materi / mengulang pertemuan sebelumnya ---------- */
function startDay(d){ openMeet(d); }
function renderPlan(){
  let h = "";
  for (let d=1; d<=MEET.length; d++){
    const m = MEET[d-1], done = DB.days.includes(d);
    h += `<div class="row ${done?"done":""}"><div><b>Hari ${d} · Pertemuan ${d}</b> ${done?"✓":""}<p><bdi>${m.t}</bdi> · ${m.o.length} materi · 10 menit</p></div>
    <button class="${done?"":"primary"}" data-day="${d}">${done?"Ulangi":"Pilih materi"}</button></div>`;
  }
  $("planList").innerHTML = h;
  document.querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>openMeet(+b.dataset.day));
}
// d = hari yang diklik, n = pertemuan yang ditampilkan (boleh pertemuan sebelumnya untuk diulang)
function openMeet(d, n){
  n = n || d; const m = MEET[n-1];
  $("mTitle").innerHTML = `Pertemuan ${n}: <bdi>${m.t}</bdi>`;
  $("mSub").textContent = n===d ? `Hari ${d} · pilih materi latihan. Tiap sesi 10 menit dan boleh diulang.` : `Mengulang materi pertemuan ${n}.`;
  $("mChips").innerHTML = `<span>Pertemuan:</span>` + [...Array(d)].map((_,i)=>`<button data-mp="${i+1}" class="${i+1===n?"on":""}">${i+1}${DB.days.includes(i+1)?" ✓":""}</button>`).join("");
  $("mOpts").innerHTML = m.o.map(o=>`<div class="row"><div><b>${o[1]}</b><p>${o[2]}</p>${o[3]==="post"?"":`<span class="ar" dir="rtl">${gen("mt_"+o[0]).slice(0,40)}…</span>`}</div>
    <button class="primary" data-mo="${o[0]}">Mulai</button></div>`).join("");
  $("mPr").innerHTML = m.pr ? `Latihan lanjutan dari modul: <a href="${m.pr}" target="_blank" rel="noopener">${m.pr}</a>` : "";
  document.querySelectorAll("[data-mp]").forEach(b=>b.onclick=()=>openMeet(d, +b.dataset.mp));
  document.querySelectorAll("[data-mo]").forEach(b=>b.onclick=()=>{ $("meet").hidden = true; startMeet(n, b.dataset.mo); });
  $("meet").hidden = false;
}
$("mClose").onclick = ()=>{ $("meet").hidden = true; };
function startMeet(n, id){
  const o = MEET[n-1].o.find(x=>x[0]===id);
  if (o[3]==="post") return runTest("post", n);
  run({title:`Pertemuan ${n}: ${o[1]}`, kind:"mt_"+id, mode:"daily", sub:"mt_"+id, duration:600, day:n});
}
function runTest(which, day){
  run({title: which==="pre"?"Pre-test (1 paragraf)":"Post-test (1 paragraf)", kind:"test", mode:"test", sub:which, duration:180, day, after:m=>{ DB[which] = m; }});
}
function renderTest(){
  $("btnPre").onclick = ()=>runTest("pre"); $("btnPost").onclick = ()=>runTest("post");
  $("testStatus").textContent = `Pre-test: ${DB.pre?"sudah":"belum"} · Post-test: ${DB.post?"sudah":"belum"}`;
}

/* ---------- laporan ---------- */
function chart(){
  const s = DB.sessions.slice(-20);
  if (s.length < 2) return "<p class='lead'>Grafik muncul setelah 2 sesi.</p>";
  const w=640, h=180, p=26, mx = Math.max(...s.map(x=>x.ccpm),10);
  const pts = s.map((x,i)=>[p+i*(w-2*p)/(s.length-1), h-p-(x.ccpm/mx)*(h-2*p)]);
  return `<svg viewBox="0 0 ${w} ${h}" class="chart"><polyline fill="none" stroke="#e2b34f" stroke-width="3" points="${pts.map(a=>a.join(",")).join(" ")}"/>`
    + pts.map(a=>`<circle cx="${a[0]}" cy="${a[1]}" r="4" fill="#2bb5a0"/>`).join("")
    + `<text x="${p}" y="14" fill="#a9b3d1" font-size="12">Correct CPM per sesi (maks ${Math.round(mx)})</text></svg>`;
}
function renderReport(){
  $("repName").textContent = (DB.settings.name || "Tanpa nama") + " · " + `${RANKS[rankIdx(DB.points)][1]} · ${DB.points} poin · ${DB.sessions.length} sesi`;
  const rows = [["WPM","wpm",1],["CPM","cpm",1],["Correct CPM","ccpm",1],["Akurasi (%)","acc",1],["Tingkat kesalahan (%)","err",-1]];
  $("cmp").innerHTML = (!DB.pre || !DB.post)
    ? `<p class="lead">Perbandingan muncul setelah pre-test dan post-test selesai. Pre-test: ${DB.pre?"✓":"belum"} · Post-test: ${DB.post?"✓":"belum"}.</p>`
    : `<table><tr><th>Indikator</th><th>Pre-test</th><th>Post-test</th><th>Selisih</th></tr>` +
      rows.map(([n,k,dir])=>{ const d = DB.post[k]-DB.pre[k];
        return `<tr><td>${n}</td><td>${f1(DB.pre[k])}</td><td>${f1(DB.post[k])}</td><td class="${d*dir>=0?"up":"down"}">${d>=0?"+":""}${f1(d)}</td></tr>`; }).join("") + "</table>";
  $("chart").innerHTML = chart();
  $("badges").innerHTML = BADGES.map(b=>`<div class="badge ${DB.badges.includes(b.id)?"got":""}"><b>🏅 ${b.name}</b><small>${b.how}</small></div>`).join("");
  const s = DB.sessions.slice(-30).reverse();
  $("history").innerHTML = s.length ? `<table><tr><th>Tanggal</th><th>Sesi</th><th>WPM</th><th>Correct CPM</th><th>Akurasi</th></tr>` +
    s.map(x=>`<tr><td>${new Date(x.date).toLocaleString("id-ID")}</td><td>${x.title}</td><td>${f1(x.wpm)}</td><td>${f1(x.ccpm)}</td><td>${f1(x.acc)}%</td></tr>`).join("") + "</table>" : "<p class='lead'>Belum ada sesi.</p>";
}
$("btnPrint").onclick = ()=>window.print();
function exportCsv(){
  const q = v=>`"${String(v).replace(/"/g,'""')}"`, nm = DB.settings.name || "Tanpa nama";
  const csv = "\ufeffnama,tanggal,sesi,wpm,cpm,correct_cpm,akurasi,kesalahan,detik\n" + DB.sessions.map(x=>[q(nm),x.date,q(x.title),f1(x.wpm),f1(x.cpm),f1(x.ccpm),f1(x.acc),f1(x.err),Math.round(x.sec)].join(",")).join("\n");
  const slug = nm.replace(/[^\w\u0600-\u06FF]+/g,"-").replace(/^-|-$/g,"") || "tanpa-nama";
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"})); a.download = `laporan-ketik-arab-${slug}.csv`; a.click();
}
$("btnCsv").onclick = exportCsv;

/* ---------- ganti pengguna: hapus semua data di perangkat ini (tanpa database, jadi tidak ada yang tersimpan di tempat lain) ---------- */
function askNewUser(){ $("settings").hidden = true; $("newUser").hidden = false; $("nuNo").focus(); }
function resetUser(){
  Engine.abort(); Game.stop(); $("result").hidden = true; $("confirm").hidden = true; $("meet").hidden = true;
  const keep = {kb:DB.settings.kb, sound:DB.settings.sound, showKb:DB.settings.showKb};   // pengaturan perangkat tetap
  DB = fresh(); Object.assign(DB.settings, keep); DB.v10 = 1; save();
  $("newUser").hidden = true; lastView = "home"; renderTop(); show("home");
  $("greet").textContent = "Siap untuk pengguna baru! Isi namamu dulu."; $("nameIn").focus();
}
$("btnNewUser").onclick = askNewUser; $("btnNewUser2").onclick = askNewUser;
$("nuCsv").onclick = exportCsv; $("nuPrint").onclick = ()=>window.print();
$("nuNo").onclick = ()=>{ $("newUser").hidden = true; }; $("nuYes").onclick = resetUser;

/* ---------- pengaturan ---------- */
function openSettings(){
  const s = DB.settings; $("sName").value = s.name; $("sKb").value = s.kb; $("sSound").checked = s.sound; $("sShowKb").checked = s.showKb;
  $("settings").hidden = false;
}
$("btnSet").onclick = openSettings;
$("btnSound").onclick = ()=>{ DB.settings.sound = !DB.settings.sound; save(); renderTop(); Sfx.pop(); };
$("sClose").onclick = ()=>{
  Object.assign(DB.settings, {name:$("sName").value.trim(), kb:$("sKb").value, sound:$("sSound").checked, showKb:$("sShowKb").checked});
  save(); renderTop(); $("settings").hidden = true; if (!$("v-home").hidden) renderHome();
};
$("sReset").onclick = askNewUser;

renderTop(); renderHome();
