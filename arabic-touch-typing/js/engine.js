/* ===== ENGINE: pembanding real-time, rumus metrik, suara, confetti ===== */
const rnd = a => a[Math.floor(Math.random()*a.length)];
const shuffle = a => a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);

function metrics(typed, target, sec){
  const total = typed.length; let correct = 0;
  for (let i=0;i<total;i++) if (typed[i] === target[i]) correct++;
  const min = Math.max(sec, 1) / 60;
  return { total, correct, wrong: total-correct,
    wpm: total/5/min, cpm: total/min, ccpm: correct/min,
    acc: total ? correct/total*100 : 100, err: total ? (total-correct)/total*100 : 0, sec };
}

// ambil n item dari daftar, diacak per putaran supaya tidak berulang-ulang
function pick(arr, n){ let out = []; while (out.length < n) out = out.concat(shuffle(arr)); return out.slice(0,n); }

// ---- materi Program 10 Hari (pertemuan modul) ----
const MG = (()=>{
  const seq = i => { const g = LETTER_GROUPS[i];                       // tiap huruf 20× (blok 5 + spasi), lalu semua huruf berurutan
    const all = g.join(""); return g.map(l=>Array(4).fill(l.repeat(5)).join(" ")).join(" ") + " " + [all,all,all].join(" "); };
  const mg = {
    mt_1a:()=>seq(0), mt_2a:()=>seq(1), mt_3a:()=>seq(2), mt_4a:()=>seq(3), mt_5a:()=>seq(4),
    mt_1b:()=>LAT1[0], mt_2b:()=>LAT1[1], mt_3b:()=>LAT1[2], mt_4b:()=>LAT1[3], mt_5b:()=>LAT1[4],
    mt_6a:()=>pick(LETTER_GROUPS.slice(0,3).flat(), 56).join(" "),
    mt_6b:()=>pick(LETTER_GROUPS.flat(), 70).join(" "),
    mt_7a:()=>LAT3A, mt_7b:()=>LAT3B, mt_7c:()=>LAT4A, mt_7d:()=>LAT4B,
    mt_8a:()=>pick(ALT4, 40).join(" "), mt_8b:()=>pick(ALT5, 40).join(" "),
    mt_9a:()=>SENT9.join(" "), mt_9b:()=>SENT9H.join(" "),
    mt_10a:()=>rnd(PARA.s), mt_10b:()=>rnd(PARA.m), mt_10c:()=>rnd(PARA.l)
  };
  return mg;
})();

function gen(kind, n=40){
  if (kind.startsWith("mt_")) return MG[kind]();
  const rep = (f,c) => Array.from({length:c}, f);
  switch(kind){
    case "seq":  return LETTERS.join(" ");
    case "rnd":  return rep(()=>rnd(LETTERS),n).join(" ");
    case "home": return pick(HOMEW, n).join(" ");   // kata bermakna dari home row
    case "all":  return pick(ALLW, n).join(" ");    // kata bermakna 2–4 huruf dari seluruh huruf
    case "c2_l": case "c2_r": case "c2_m": return pick(W2[kind[3]][2], n).join(" ");
    case "c3_l": case "c3_r": case "c3_m": return pick(W2[kind[3]][3], n).join(" ");
    case "c_l": case "c_r": case "c_m": return pick([...W2[kind[2]][2],...W2[kind[2]][3]], n).join(" ");
    case "w_s": case "w_m": case "w_l": return rep(()=>rnd(WORDS[kind[2]]),n/2).join(" ");
    case "word": return rep(()=>rnd([...WORDS.s,...WORDS.m,...WORDS.l]),n).join(" ");
    case "s_h":  return shuffle(SENT).join(" ");
    case "s_n": case "sent": return shuffle(SENT).map(strip).join(" ");
    case "p_s": case "p_m": case "p_l": return rnd(PARA[kind[2]]);
    case "para": return rnd(PARA.m);
    case "test": return TEST_TEXT;   // satu paragraf, sama untuk pre & post
  }
  return "";
}

/* suara */
const Sfx = (()=>{
  let ctx;
  function tone(f,d,type,v,delay=0){
    if (!DB.settings.sound) return;
    try{
      ctx = ctx || new (window.AudioContext||window.webkitAudioContext)();
      const o=ctx.createOscillator(), g=ctx.createGain(), t=ctx.currentTime+delay;
      o.type=type; o.frequency.value=f; g.gain.setValueAtTime(v,t); g.gain.exponentialRampToValueAtTime(.0001,t+d);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t+d+.02);
    }catch(e){}
  }
  return { ok:()=>tone(660,.07,"sine",.035), bad:()=>tone(150,.12,"sawtooth",.05),
           pop:()=>tone(520,.1,"triangle",.06), win:()=>{tone(660,.15,"sine",.06);tone(880,.15,"sine",.06,.13);tone(1100,.3,"sine",.06,.26)} };
})();

function confetti(){
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c=document.createElement("canvas"); c.style.cssText="position:fixed;inset:0;pointer-events:none;z-index:99";
  c.width=innerWidth; c.height=innerHeight; document.body.append(c);
  const x=c.getContext("2d"), cols=["#e2b34f","#2bb5a0","#f6dc94","#5b8cf0","#ffffff"];
  const P=Array.from({length:130},()=>({x:Math.random()*c.width,y:-20-Math.random()*250,vx:(Math.random()-.5)*4,vy:2+Math.random()*4,s:5+Math.random()*6,r:Math.random()*6,c:rnd(cols)}));
  let t=0;(function f(){x.clearRect(0,0,c.width,c.height);
    P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.r+=.1;x.fillStyle=p.c;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);x.restore()});
    if(++t<160) requestAnimationFrame(f); else c.remove();})();
}

/* sesi mengetik */
const Engine = (()=>{
  const $ = id => document.getElementById(id);
  let S = null;
  const MARK = /[\u064B-\u0652]/;

  function start(opt){
    if (S) clearInterval(S.tick);
    S = {...opt, t0:null, done:false, tick:null, combo:0, maxCombo:0, prevLen:0};
    $("stTitle").textContent = opt.title;
    $("input").value = ""; $("input").disabled = false; $("combo").textContent = ""; $("kbWarn").hidden = true;
    $("kb").hidden = !DB.settings.showKb;
    $("race").hidden = !opt.race;
    drawKeyboard(); renderTarget(""); renderLive(); highlight("");
    $("input").focus();
  }
  function renderTarget(typed){
    const t = S.text, n = typed.length; let h = '<span class="w">', i = 0;
    while (i < t.length){
      let j = i+1; while (j < t.length && MARK.test(t[j])) j++;       // huruf + harakatnya satu kelompok
      let cls = "";
      if (n >= j){ cls = "ok"; for (let k=i;k<j;k++) if (typed[k]!==t[k]) cls="bad"; }
      else if (n >= i) cls = "cur";
      if (t[i] === " ") h += `</span><span class="sp ${cls}"> </span><span class="w">`;
      else h += `<span class="${cls}">${t.slice(i,j)}</span>`;
      i = j;
    }
    $("target").innerHTML = h + "</span>";
    const cur = $("target").querySelector(".cur"); if (cur) cur.scrollIntoView({block:"nearest"});
  }
  const elapsed = () => S.t0 ? ((S.paused ? S.pausedAt : Date.now())-S.t0)/1000 : 0;
  const botProg = () => S.race ? Math.min(elapsed()*S.race.cps/S.text.length, 1) : 0;
  function renderLive(){
    const typed = $("input").value, m = metrics(typed,S.text,elapsed());
    const t = S.duration ? Math.max(S.duration-elapsed(),0) : elapsed();
    $("lvTime").textContent = Math.floor(t/60)+":"+String(Math.floor(t%60)).padStart(2,"0");
    $("lvWpm").textContent = Math.round(m.wpm); $("lvAcc").textContent = Math.round(m.acc)+"%";
    $("prog").style.width = Math.min(S.duration ? elapsed()/S.duration : typed.length/S.text.length,1)*100+"%";
    if (S.race){ $("raceMe").style.width = Math.min(typed.length/S.text.length,1)*100+"%"; $("raceBot").style.width = botProg()*100+"%"; }
  }
  function onInput(){
    if (!S || S.done || S.paused) return;
    const el = $("input");
    // pengaman: pada mode bawaan, huruf Latin yang lolos diubah ke huruf Arab sesuai tombol fisiknya
    // (huruf & simbol Latin yang diketik langsung oleh browser; hanya bagian baru, bukan tanda baca yang sah dari keyboard bawaan)
    if (DB.settings.kb === "builtin" && !S.ins && el.value.length > S.prevLen){
      const head = el.value.slice(0, S.prevLen), tail = el.value.slice(S.prevLen);
      el.value = head + tail.replace(LATIN_RE, ch => LATIN[ch] ?? ch);
    }
    const typed = el.value;
    if (!S.t0){ S.t0 = Date.now(); S.tick = setInterval(()=>{ renderLive(); if ((S.duration && elapsed()>=S.duration) || (S.race && botProg()>=1)) finish(); },250); }
    let c = 0; for (let i=typed.length-1;i>=0 && typed[i]===S.text[i];i--) c++;
    S.combo = c; S.maxCombo = Math.max(S.maxCombo,c);
    const cb = $("combo"); cb.textContent = c>=5 ? "🔥 Combo ×"+c : "";
    if (typed.length > S.prevLen){
      const k = typed.length-1;
      typed[k]===S.text[k] ? Sfx.ok() : Sfx.bad();
      $("kbWarn").hidden = !(DB.settings.kb==="system" && /[A-Za-z]/.test(typed[k]));
    }
    S.prevLen = typed.length;
    el.setSelectionRange(typed.length, typed.length);
    renderTarget(typed); renderLive(); highlight(typed);
    if (typed.length >= S.text.length) finish();
  }
  function finish(){
    if (S.done) return; S.done = true; clearInterval(S.tick);
    $("input").disabled = true;
    const typed = $("input").value.slice(0,S.text.length);
    const m = metrics(typed, S.text, S.duration ? Math.min(elapsed(),S.duration) : elapsed());
    m.maxCombo = S.maxCombo; m.early = !!S.early;
    S.onFinish(m);
  }
  const abort = () => { if (S){ S.done = true; clearInterval(S.tick); } };
  const active = () => !!(S && !S.done);
  // jeda saat dialog konfirmasi terbuka (waktu tidak berjalan)
  function pause(){ if (active() && !S.paused){ S.paused = true; S.pausedAt = Date.now(); } }
  function resume(){ if (active() && S.paused){ if (S.t0) S.t0 += Date.now()-S.pausedAt; S.paused = false; $("input").focus(); } }
  // tombol "Selesai": false = belum ada yang diketik (tidak dicatat)
  function finishNow(){
    if (!active()) return false;
    if (S.paused){ if (S.t0) S.t0 += Date.now()-S.pausedAt; S.paused = false; }
    if (!$("input").value.length){ abort(); return false; }
    S.early = true; finish(); return true;
  }

  function insert(ch){ const el=$("input"); el.setRangeText(ch, el.value.length, el.value.length, "end");
    if (S) S.ins = true; el.dispatchEvent(new Event("input",{bubbles:true})); if (S) S.ins = false; }
  function onKey(e){
    if (!S || S.done) return;
    if (S.paused){ e.preventDefault(); return; }
    if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End","Enter"].includes(e.key)){ e.preventDefault(); return; }
    if (DB.settings.kb !== "builtin" || e.ctrlKey || e.metaKey || e.altKey) return;
    let m = CODE_MAP[e.code];
    if (!m && e.key && e.key.length === 1 && LATIN[e.key] !== undefined){ e.preventDefault(); if (!e.repeat) insert(LATIN[e.key]); return; }   // cadangan: pakai e.key
    if (!m) return;
    e.preventDefault(); if (e.repeat) return;
    insert(e.shiftKey ? m.s : m.n);
  }
  // cadangan terakhir: cegah karakter Latin masuk langsung, ganti dengan huruf Arab
  function onBeforeInput(e){
    if (!S || S.done || S.paused || DB.settings.kb !== "builtin" || e.inputType !== "insertText" || !e.data || [...e.data].length !== 1) return;
    if (LATIN[e.data] === undefined) return;
    e.preventDefault(); insert(LATIN[e.data]);
  }

  function drawKeyboard(){
    if ($("kb").childElementCount) return;
    let h = "";
    KB_ROWS.forEach((r,i)=>{ h += `<div class="kr" style="margin-inline-start:${i*18}px">`;
      r.forEach(([c,n,s,f])=>{ h += `<div class="k f${f}${HOME_CODES.includes(c)?" home":""}" data-c="${c}">${n}<small>${keyName(c)}</small><em>${s}</em></div>`; });
      h += "</div>"; });
    h += `<div class="kr"><div class="k space f4" data-c="Space">Spasi</div></div>`;
    $("kb").innerHTML = h;
  }
  function highlight(typed){
    document.querySelectorAll(".k.next,.k.shift").forEach(e=>e.classList.remove("next","shift"));
    const t = S.text, ch = t[typed.length]; if (!ch) return;
    let m = CHAR_KEY[ch]; if (ch==="ل" && t[typed.length+1]==="ا") m = {code:"KeyB", shift:false};
    if (!m) return;
    const el = document.querySelector(`.k[data-c="${m.code}"]`);
    if (el){ el.classList.add("next"); if (m.shift) el.classList.add("shift"); }
  }
  (()=>{
    const el = $("input");
    el.addEventListener("input", onInput);
    el.addEventListener("keydown", onKey);
    el.addEventListener("beforeinput", onBeforeInput);
    el.addEventListener("click", ()=>el.setSelectionRange(el.value.length, el.value.length));
    el.addEventListener("paste", e=>e.preventDefault());
    el.addEventListener("drop", e=>e.preventDefault());
    $("target").addEventListener("click", ()=>el.focus());
    $("kb").addEventListener("mousedown", e=>{
      const k = e.target.closest(".k"); if (!k) return; e.preventDefault();
      if (!S || S.done) return;
      const c = k.dataset.c; insert(c==="Space" ? " " : CODE_MAP[c].n);
    });
  })();
  return {start, abort, pause, resume, finishNow, active};
})();
