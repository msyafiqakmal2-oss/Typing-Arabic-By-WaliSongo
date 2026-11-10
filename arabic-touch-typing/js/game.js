/* ===== SELF LEARNING: satu jenis game untuk tiap level =====
   L1 Hujan Huruf · L2 Tebak Gambar · L3 Bom Waktu · L4 Pelari Rintangan · (L5 Balapan Paragraf ada di engine.js) */
const Game = (()=>{
  const W = 720, H = 440, $ = id => document.getElementById(id);
  const EMOJI = "'Segoe UI Emoji','Noto Color Emoji','Apple Color Emoji',sans-serif";
  let cv, cx, raf = 0, st = null, mode = "L1h", M = null, scene = null;

  const MODES = {
    L1h:{scene:"rain", pool:()=>HOME,    sp:1.7, v:38, dv:14, f:34},
    L1a:{scene:"rain", pool:()=>LETTERS, sp:1.7, v:38, dv:14, f:34},
    pic_l:{scene:"pic", hand:"l"}, pic_r:{scene:"pic", hand:"r"}, pic_m:{scene:"pic", hand:"m"},
    w_s:{scene:"bomb", pool:()=>WORDS.s}, w_m:{scene:"bomb", pool:()=>WORDS.m}, w_l:{scene:"bomb", pool:()=>WORDS.l},
    k_s:{scene:"run", pool:()=>PHR.s}, k_m:{scene:"run", pool:()=>PHR.m}
  };
  const level = () => 1 + Math.floor(st.score/150);
  const good = pts => { st.ok++; st.combo++; st.max = Math.max(st.max, st.combo); st.score += pts; Sfx.ok(); };
  const bad = () => { st.bad++; st.combo = 0; Sfx.bad(); };
  const loseLife = () => { st.lives--; st.combo = 0; Sfx.bad(); };

  /* ---------- alat gambar ---------- */
  function bg(c1, c2){ const g = cx.createLinearGradient(0,0,0,H); g.addColorStop(0,c1); g.addColorStop(1,c2); cx.fillStyle = g; cx.fillRect(0,0,W,H); }
  function hud(extra){
    cx.textBaseline = "middle"; cx.textAlign = "left"; cx.font = "700 18px Tajawal, sans-serif"; cx.fillStyle = "#f3ecd8";
    cx.fillText(`Skor ${st.score}   Level ${level()}   Combo ${st.combo}${extra||""}`, 14, 22);
    cx.textAlign = "right"; cx.fillStyle = "#ff8b8b"; cx.fillText("♥".repeat(Math.max(st.lives,0)), W-14, 22);
  }
  function pill(x,y,w,h,fill){
    const r = h/2; cx.beginPath(); cx.moveTo(x-w/2+r,y-h/2); cx.lineTo(x+w/2-r,y-h/2); cx.arc(x+w/2-r,y,r,-Math.PI/2,Math.PI/2);
    cx.lineTo(x-w/2+r,y+h/2); cx.arc(x-w/2+r,y,r,Math.PI/2,Math.PI*1.5); cx.closePath(); cx.fillStyle = fill; cx.fill();
  }
  // teks Arab dengan bagian yang sudah diketik diwarnai (dari kanan ke kiri, tanpa memutus sambungan huruf)
  function progText(t, x, y, size, frac, c1, c2, maxW){
    cx.textAlign = "center"; cx.textBaseline = "middle";
    do { cx.font = `700 ${size}px Amiri, serif`; size -= 2; } while (maxW && cx.measureText(t).width > maxW && size > 14);
    const w = cx.measureText(t).width; cx.fillStyle = c1; cx.fillText(t,x,y);
    if (frac > 0){ cx.save(); cx.beginPath(); cx.rect(x+w/2-w*frac-1, y-80, w*frac+2, 160); cx.clip(); cx.fillStyle = c2; cx.fillText(t,x,y); cx.restore(); }
    return w;
  }
  const hint = (ch, x, y) => { if (!DB.settings.showKb) return; const k = CHAR_KEY[ch]; if (!k) return;
    cx.textAlign = "center"; cx.font = "700 14px Tajawal, sans-serif"; cx.fillStyle = "#f6dc94"; cx.fillText("Tombol: "+(k.shift?"⇧+":"")+keyName(k.code), x, y); };
  const bar = (x,y,w,h,r,c) => { cx.fillStyle = "rgba(255,255,255,.12)"; cx.fillRect(x,y,w,h); cx.fillStyle = c; cx.fillRect(x,y,w*Math.max(0,Math.min(1,r)),h); };
  const popRings = () => st.pops.forEach(p=>{ cx.strokeStyle = `rgba(95,220,160,${1-p.t/.4})`; cx.lineWidth = 3; cx.beginPath(); cx.arc(p.x||W/2,p.y||200,27+p.t*90,0,7); cx.stroke(); });
  const tickPops = dt => { st.pops.forEach(p=>p.t += dt); st.pops = st.pops.filter(p=>p.t<.4); };

  /* ---------- LEVEL 1: Hujan Huruf ---------- */
  const rain = {
    lives:5,
    init(){ st.items = []; st.lock = null; st.spawn = 0; },
    spawn(){
      const t = rnd(M.pool()); cx.font = `700 ${M.f}px Amiri, serif`;
      const w = Math.max(56, cx.measureText(t).width + 36);
      st.items.push({t, i:0, w, x:w/2+8+Math.random()*(W-w-16), y:-30, v:M.v+level()*M.dv+Math.random()*M.dv});
      st.spawn = Math.max(M.sp*.45, M.sp-level()*M.sp*.07);
    },
    update(dt){
      st.spawn -= dt; if (st.spawn <= 0) rain.spawn();
      st.items.forEach(l=>l.y += l.v*dt);
      st.items = st.items.filter(l=>{ if (l.y > H-30){ loseLife(); if (st.lock===l) st.lock = null; return false; } return true; });
      tickPops(dt);
    },
    feed(ch){
      let it = st.lock;
      if (!it){ it = st.items.filter(l=>l.t[0]===ch).sort((a,b)=>b.y-a.y)[0]; if (!it) return bad(); st.lock = it; }
      if (it.t[it.i] !== ch) return bad();
      it.i++; good(2);
      if (it.i >= it.t.length){ st.items.splice(st.items.indexOf(it),1); st.lock = null; st.done++;
        st.score += 8 + Math.min(st.combo,10); st.pops.push({x:it.x,y:it.y,t:0}); Sfx.pop(); }
    },
    draw(){
      bg("#0c1a46","#112a5c"); cx.fillStyle = "rgba(226,179,79,.25)"; cx.fillRect(0,H-26,W,2);
      st.items.forEach(l=>{
        const locked = st.lock === l, h = 54, gr = cx.createLinearGradient(0,l.y-h/2,0,l.y+h/2);
        if (locked){ gr.addColorStop(0,"#5fe0c8"); gr.addColorStop(1,"#1d9e8a"); } else { gr.addColorStop(0,"#f6dc94"); gr.addColorStop(1,"#c9962e"); }
        pill(l.x,l.y,l.w,h,gr); cx.textAlign = "center"; cx.textBaseline = "middle";
        cx.fillStyle = "#0a1636"; cx.font = `700 ${M.f}px Amiri, serif`; cx.fillText(l.t,l.x,l.y-3);
        hint(l.t[l.i], l.x, l.y+h/2+10);
      });
      popRings(); hud();
    }
  };

  /* ---------- LEVEL 2: Tebak Gambar ---------- */
  const pic = {
    lives:3, total:90,
    init(){ st.queue = []; st.time = pic.total; pic.next(); },
    next(){ if (!st.queue.length) st.queue = shuffle(PICS[M.hand]); const q = st.queue.pop();
      st.cur = {e:q[0], w:q[1], m:q[2], i:0, t:0, limit:Math.max(8, 7+q[1].length*1.6-(level()-1)*.5), rev:0, ok:false, shake:0}; },
    update(dt){
      st.time -= dt; const c = st.cur; c.shake = Math.max(0, c.shake-dt);
      if (c.rev > 0){ c.rev -= dt; if (c.rev <= 0) pic.next(); }
      else { c.t += dt; if (c.t >= c.limit){ loseLife(); c.rev = 1.4; c.ok = false; } }
      if (st.time <= 0) st.lives = 0;
      tickPops(dt);
    },
    feed(ch){
      const c = st.cur; if (c.rev > 0) return;
      if (c.w[c.i] !== ch){ bad(); c.shake = .25; return; }
      c.i++; good(2);
      if (c.i >= c.w.length){ st.score += 8 + Math.min(st.combo,10) + Math.ceil((1-c.t/c.limit)*6); st.done++; Sfx.pop(); c.rev = .6; c.ok = true; st.pops.push({t:0}); }
    },
    draw(){
      bg("#0c1a46","#16336b"); const c = st.cur;
      bar(14,38,W-28,6,st.time/pic.total,"#e2b34f");
      cx.textAlign = "center"; cx.textBaseline = "middle"; cx.font = `100px ${EMOJI}`; cx.fillStyle = "#fff"; cx.fillText(c.e, W/2, 150);
      cx.font = "700 22px Tajawal, sans-serif"; cx.fillStyle = "#a9b3d1"; cx.fillText("Arti: "+c.m, W/2, 235);
      const n = c.w.length, gap = 78, sh = c.shake > 0 ? Math.sin(c.shake*70)*7 : 0;
      for (let k=0;k<n;k++){                       // huruf pertama di kanan (Arab ditulis dari kanan)
        const x = W/2 + ((n-1)/2-k)*gap + sh, filled = k < c.i || c.rev > 0;
        cx.fillStyle = "#f6dc94"; cx.fillRect(x-30, 352, 60, 4);
        if (filled){ cx.font = "700 62px Amiri, serif"; cx.fillStyle = c.ok ? "#5fe0c8" : (c.rev>0 ? "#ff8b8b" : "#f6dc94"); cx.fillText(c.w[k], x, 315); }
      }
      if (c.rev <= 0) hint(c.w[c.i], W/2, 385);
      bar(120,408,W-240,8,1-c.t/c.limit,"#2bb5a0");
      hud(`   ⏱ ${Math.max(0,Math.ceil(st.time))}s`); popRings();
    }
  };

  /* ---------- LEVEL 3: Bom Waktu ---------- */
  const bomb = {
    lives:3,
    init(){ st.flash = 0; bomb.next(); },
    next(){ const t = rnd(M.pool()), lim = Math.max(4, t.length*1.1+3.5-(level()-1)*.5); st.cur = {t, i:0, f:lim, max:lim, rev:0, ok:false}; },
    update(dt){
      st.flash = Math.max(0, st.flash-dt); const c = st.cur;
      if (c.rev > 0){ c.rev -= dt; if (c.rev <= 0) bomb.next(); return; }
      c.f -= dt; if (c.f <= 0){ loseLife(); st.flash = .5; c.rev = 1; c.ok = false; c.f = 0; }
    },
    feed(ch){
      const c = st.cur; if (c.rev > 0) return;
      if (c.t[c.i] !== ch){ bad(); c.f = Math.max(.1, c.f-.6); return; }
      c.i++; good(2);
      if (c.i >= c.t.length){ st.score += 8 + Math.min(st.combo,10) + Math.round(c.f); st.done++; Sfx.pop(); c.rev = .5; c.ok = true; }
    },
    draw(){
      bg("#1a0f2e","#2a1442"); const c = st.cur, r = c.f/c.max, now = performance.now()/1000;
      pill(W/2,100,Math.min(W-40,Math.max(220,c.t.length*34+60)),84,"rgba(255,255,255,.08)");
      progText(c.t, W/2, 100, 54, c.i/c.t.length, c.ok ? "#5fe0c8" : "#f3ecd8", "#5fe0c8", W-120);
      hint(c.t[c.i], W/2, 160);
      const dx = c.rev>0 || r>.35 ? 0 : Math.sin(now*60)*(1-r*2)*5;
      cx.textAlign = "center"; cx.textBaseline = "middle"; cx.font = `120px ${EMOJI}`; cx.fillStyle = "#fff";
      cx.fillText(c.rev>0 && !c.ok ? "💥" : "💣", W/2+dx, 265);
      const x0 = 110, w = W-220; bar(x0,372,w,12,r,r>.35?"#f59e0b":"#ef4444");
      if (c.rev<=0){ cx.font = `22px ${EMOJI}`; cx.fillText("✨", x0+w*Math.max(0,Math.min(1,r)), 378); }
      cx.font = "700 16px Tajawal, sans-serif"; cx.fillStyle = "#f3ecd8"; cx.fillText(c.rev>0 ? (c.ok?"Bom padam! 🎉":"Meledak!") : c.f.toFixed(1)+" detik", W/2, 405);
      if (st.flash > 0){ cx.fillStyle = `rgba(239,68,68,${st.flash*.6})`; cx.fillRect(0,0,W,H); }
      hud();
    }
  };

  /* ---------- LEVEL 4: Pelari Rintangan ---------- */
  const RUNX = 150;
  const run = {
    lives:3,
    init(){ st.dist = 0; st.jump = 0; st.hit = 0; st.pops = []; run.next(); },
    next(){ const t = rnd(M.pool()), T = Math.max(t.length*.55+3, t.length*.95+4-(level()-1)*.4);
      st.cur = {t, i:0, x:W+20, v:(W+20-RUNX)/T, T, state:"go", jumped:false}; },
    update(dt){
      st.dist += dt*90; st.jump = Math.max(0, st.jump-dt); st.hit = Math.max(0, st.hit-dt); const c = st.cur;
      c.x -= c.v*dt;
      if (c.state === "go" && c.x <= RUNX){ loseLife(); st.hit = .6; c.state = "gone"; }
      else if (c.state === "cleared" && !c.jumped && c.x <= RUNX+45){ st.jump = .7; c.jumped = true; }
      if (c.state !== "go" && c.x < -40) run.next();
    },
    feed(ch){
      const c = st.cur; if (c.state !== "go") return;
      if (c.t[c.i] !== ch) return bad();
      c.i++; good(2);
      if (c.i >= c.t.length){ st.score += 8 + Math.min(st.combo,10) + Math.round((c.x-RUNX)/(W-RUNX)*8); st.done++; Sfx.pop();
        c.state = "cleared"; c.v = Math.max(260,(c.x-RUNX)/.45); }
    },
    draw(){
      const gy = H-90; bg("#0e2a5a","#2a5a9a");
      cx.fillStyle = "#1b3a2a"; cx.fillRect(0,gy+34,W,H-gy-34); cx.fillStyle = "#2f6b48"; cx.fillRect(0,gy+34,W,6);
      cx.fillStyle = "rgba(255,255,255,.35)"; for (let k=-1;k<14;k++){ const x = ((k*60 - st.dist) % 840 + 840) % 840 - 60; cx.fillRect(x, gy+62, 30, 3); }
      const c = st.cur;
      // panel teks target
      pill(W/2,92,W-60,96,"rgba(8,16,44,.78)");
      progText(c.t, W/2, 88, c.t.length>20?30:40, c.i/c.t.length, "#f3ecd8", "#5fe0c8", W-110);
      hint(c.t[c.i], W/2, 124);
      bar(60,142,W-120,5,(c.x-RUNX)/(W+20-RUNX),"#ef4444");
      // rintangan & pelari
      cx.textAlign = "center"; cx.textBaseline = "middle"; cx.fillStyle = "#fff";
      cx.font = `58px ${EMOJI}`; if (c.x > -40) cx.fillText("🌵", c.x, gy+4);
      const jy = st.jump > 0 ? -Math.sin((1-st.jump/.7)*Math.PI)*95 : 0, bob = st.jump>0 ? 0 : Math.sin(st.dist/9)*3;
      cx.save(); cx.translate(110, gy+jy+bob); cx.scale(-1,1); if (st.hit>0) cx.globalAlpha = .45+.35*Math.sin(st.hit*50);
      cx.font = `64px ${EMOJI}`; cx.fillText("🏃",0,0); cx.restore();
      hud(); popRings();
    }
  };
  const SCENES = {rain, pic, bomb, run};

  /* ---------- kendali ---------- */
  function start(k){
    mode = k || mode; M = MODES[mode]; scene = SCENES[M.scene];
    cv = $("gameCv"); cx = cv.getContext("2d"); cv.width = W; cv.height = H;
    $("selfList").hidden = true; $("gameWrap").hidden = false; $("gameOverlay").hidden = true;
    st = {score:0, lives:scene.lives, combo:0, max:0, ok:0, bad:0, done:0, pops:[], over:false, paused:false, last:performance.now()};
    scene.init();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
  }
  function stop(){ cancelAnimationFrame(raf); st = null; }
  function loop(now){
    if (!st) return;
    const dt = Math.min((now-st.last)/1000, .05); st.last = now;
    if (!st.paused) scene.update(dt);
    scene.draw();
    if (!st.paused && st.lives <= 0) return end();
    raf = requestAnimationFrame(loop);
  }
  function end(){
    st.over = true; const s = st, tot = s.ok+s.bad;
    gameDone({score:s.score, hits:s.done, acc: tot ? s.ok/tot*100 : 0, max:s.max, level:level(), again:()=>start(mode)});
  }
  const active = () => !!(st && !st.over);
  function pause(){ if (active()) st.paused = true; }
  function resume(){ if (active()){ st.paused = false; st.last = performance.now(); } }
  // tombol "Selesai": false = belum ada yang dimainkan (tidak dicatat)
  function finishNow(){
    if (!active()) return false;
    if (st.ok+st.bad === 0 && st.score === 0){ stop(); return false; }
    cancelAnimationFrame(raf); end(); return true;
  }
  function key(e){
    if (!st || st.over || st.paused || e.ctrlKey || e.metaKey || e.altKey) return;
    let chars;
    if (e.code === "Space") chars = " ";
    else { const m = CODE_MAP[e.code];
      if (m) chars = e.shiftKey ? m.s : m.n;
      else if (e.key && e.key.length === 1 && LATIN[e.key] !== undefined) chars = LATIN[e.key];
      else return; }
    e.preventDefault(); if (e.repeat) return;
    [...chars].forEach(ch=>{ if (st && !st.over) scene.feed(ch); });
  }
  window.addEventListener("keydown", key);
  return {start, stop, pause, resume, finishNow, active, _peek:()=>st};
})();
