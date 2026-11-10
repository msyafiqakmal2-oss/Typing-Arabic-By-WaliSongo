/* ===== DATA: huruf, kata, kalimat, paragraf, layout keyboard Arabic (101) ===== */
const strip = s => s.replace(/[\u064B-\u0652]/g, "");
const LETTERS = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي".split("");
const HOME = "شسيبلاتنمك".split("");

const WORDS = {
  s: ["أب","أم","بيت","باب","كتب","علم","نور","ماء","قلم","ولد","بنت","شمس","قمر","نهر","جبل","خبز","ورد","يد","رجل","عين"],
  m: ["مدرسة","مكتبة","طالب","معلم","حديقة","سيارة","طعام","صديق","مسجد","كتاب","مفتاح","نافذة","شجرة","سماء","طريق","مدينة"],
  l: ["استخدام","مستقبل","اجتماعي","اللغة","العربية","مجتمع","الحاسوب","الإنسان","المعلومات","الجامعة","التعليم","المسؤولية"]
};

const SENT = [
  "الْعِلْمُ نُورٌ وَالْجَهْلُ ظَلَامٌ",
  "ذَهَبَ الطَّالِبُ إِلَى الْمَدْرَسَةِ صَبَاحًا",
  "اللُّغَةُ الْعَرَبِيَّةُ لُغَةُ الْقُرْآنِ الْكَرِيمِ",
  "يَقْرَأُ الْوَلَدُ كِتَابًا جَدِيدًا فِي الْمَكْتَبَةِ",
  "الْوَقْتُ كَالسَّيْفِ إِنْ لَمْ تَقْطَعْهُ قَطَعَكَ",
  "مَنْ جَدَّ وَجَدَ وَمَنْ زَرَعَ حَصَدَ",
  "تَعَلَّمْ مَهَارَةَ الْكِتَابَةِ بِالْحَاسُوبِ كُلَّ يَوْمٍ",
  "الصَّدِيقُ وَقْتَ الضِّيقِ"
];

/* ===== Kata bermakna 2–3 huruf, disusun sesuai pola belajar: tangan kiri → tangan kanan → gabungan ===== */
const HAND_L = "ذضصثقفشسيبلرئءؤ", HAND_R = "غعهخحجداتنمكطىةوزظ";
const W2 = {
  l:{2:["قل","بر","رب","سر","شر","في","لي","بي","صف","قف","بل","رش","صب","فر"],
     3:["قلب","ربي","سبب","فرس","برق","ضرب","صبر","شرب","سفر","ثقب","ليل","فصل","صفر","قبل","بصر","فقر","سرب"]},
  r:{2:["جد","خد","حج","دم","عم","حد","نم","دع","كن","هو","ما","من","عن","هم"],
     3:["حمد","مجد","جمع","نجم","حزن","كون","عود","جدة","جنة","ندم","دمع","جوع","نوم","نحن","تاج","كان","عام","نام","خوخ"]},
  m:{2:["بن","يد","فم","سن","دب","حب","نص","رد","قم","فن","سد","سم","ضد","كل","لم","قد"],
     3:["كتب","علم","قلم","ولد","بيت","نهر","نور","ورد","جبل","قمر","شمس","خبز","رجل","عين","درس","كلب","سوق","بحر","شجر","ذهب","ثوب","باب"]}
};
// Home row (ش س ي ب ل ا ت ن م ك): hanya kata bermakna
const HOMEW = ["بيت","ليل","سبب","كتب","نمل","ملك","تين","سمك","كان","شمس","كلب","لبن","ابن","بنت","سلم","مسك","نيل","بسم","سكن","سبت","كتاب","مكتب","سكين","بستان","لسان","مسلم","كسل"];
const ALLW = [...W2.l[2],...W2.l[3],...W2.r[2],...W2.r[3],...W2.m[2],...W2.m[3],...HOMEW];

const PARA = {
  s: ["أنا طالب في المدرسة. أحب القراءة كل يوم. في البيت مكتبة صغيرة فيها كتب كثيرة. أقرأ مع أبي وأمي بعد الغداء.",
      "ذهب أحمد إلى السوق مع أمه. اشترى خبزا وماء وفاكهة. ثم رجع إلى البيت وأكل مع أسرته."],
  m: ["اللغة العربية من أجمل اللغات في العالم، وهي لغة القرآن الكريم. يتعلم الطلاب الكتابة بها في المدارس والجامعات، ويستخدمون الحاسوب لكتابة الرسائل والبحوث. ومن المهم أن يتقن الطالب الكتابة بالأصابع العشرة لتوفير الوقت.",
      "تعد المكتبة مكانا مناسبا للدراسة والمطالعة. يجلس الطلاب حول الطاولات ويقرؤون الكتب بهدوء، ويستعير بعضهم كتبا ليقرؤوها في البيت."],
  l: ["إن التقدم التقني في عصرنا الحاضر أتاح للإنسان وسائل متنوعة لنشر المعرفة وتبادل المعلومات بين المجتمعات المختلفة. ومن هنا أصبحت مهارة الطباعة الصحيحة بالحاسوب ضرورة علمية ومهنية، لأنها تختصر الجهد وتزيد الإنتاجية وتحسن جودة العمل الأكاديمي والإداري على حد سواء.",
      "يرى كثير من الباحثين أن الممارسة اليومية المنتظمة، ولو لمدة قصيرة، أفضل أثرا من التدريب الطويل المتقطع؛ فالمهارات الحركية تتثبت بالتكرار والتركيز والتغذية الراجعة الفورية عن الأخطاء."]
};

const PHR = { s:["العلم نور","من جد وجد","من زرع حصد","الوقت كالسيف","الصديق وقت الضيق","نتعلم كل يوم"], m:SENT.map(strip) };
// Pre/Post-test: SATU paragraf yang sama agar hasil sebelum–sesudah bisa dibandingkan adil
const TEST_TEXT = PARA.m[0];

/* Layout Arabic (101): [event.code, huruf, label shift, jari 0=kelingking … 3=telunjuk, 4=jempol] */
const KB_ROWS = [
  [["Backquote","ذ","ّ",0],["KeyQ","ض","َ",0],["KeyW","ص","ً",0],["KeyE","ث","ُ",1],["KeyR","ق","ٌ",2],["KeyT","ف","لإ",3],["KeyY","غ","إ",3],["KeyU","ع","`",3],["KeyI","ه","÷",2],["KeyO","خ","×",1],["KeyP","ح","؛",0],["BracketLeft","ج","<",0],["BracketRight","د",">",0]],
  [["KeyA","ش","ِ",0],["KeyS","س","ٍ",1],["KeyD","ي","]",2],["KeyF","ب","[",3],["KeyG","ل","لأ",3],["KeyH","ا","أ",3],["KeyJ","ت","ـ",3],["KeyK","ن","،",2],["KeyL","م","/",1],["Semicolon","ك",":",0],["Quote","ط",'"',0]],
  [["KeyZ","ئ","~",0],["KeyX","ء","ْ",1],["KeyC","ؤ","}",2],["KeyV","ر","{",3],["KeyB","لا","لآ",3],["KeyN","ى","آ",3],["KeyM","ة","'",3],["Comma","و",",",2],["Period","ز",".",1],["Slash","ظ","؟",0]]
];
const HOME_CODES = ["KeyF","KeyJ"];
// peta karakter -> tombol
const CHAR_KEY = {};
KB_ROWS.forEach(r => r.forEach(([c, n]) => { if (n.length===1) CHAR_KEY[n] = {code:c, shift:false}; }));
KB_ROWS.forEach(r => r.forEach(([c, n, s]) => { if (s.length===1 && !CHAR_KEY[s]) CHAR_KEY[s] = {code:c, shift:true}; }));
// harakat (Shift + tombol)
CHAR_KEY["ّ"] = {code:"Backquote", shift:true};
CHAR_KEY["ذ"] = {code:"Backquote", shift:false};
CHAR_KEY[" "] = {code:"Space", shift:false};

/* ===== LEVEL & RENCANA 14 HARI ===== */
const LEVELS = [
  {id:1, name:"Huruf", ar:"ح ر ف", desc:"Satu huruf hijaiyah: berurutan atau acak.", subs:[["Berurutan","seq"],["Acak","rnd"]]},
  {id:2, name:"Kata pendek (2–3 huruf)", ar:"بت جح", desc:"Kata bermakna, bertahap: tangan kiri → tangan kanan → gabungan kiri + kanan.", subs:[["Kiri · 2 huruf","c2_l"],["Kiri · 3 huruf","c3_l"],["Kanan · 2 huruf","c2_r"],["Kanan · 3 huruf","c3_r"],["Kiri+kanan · 2 huruf","c2_m"],["Kiri+kanan · 3 huruf","c3_m"]]},
  {id:3, name:"Kata", ar:"كلمة", desc:"Dari kata sederhana sampai kata panjang (4–5 huruf atau lebih).", subs:[["Sederhana","w_s"],["4–5 huruf","w_m"],["Panjang","w_l"]]},
  {id:4, name:"Kalimat", ar:"جملة", desc:"Kalimat utuh, tanpa atau dengan harakat.", subs:[["Tanpa harakat","s_n"],["Dengan harakat","s_h"]]},
  {id:5, name:"Paragraf / teks", ar:"نص", desc:"Teks utuh dengan tiga tingkat kesulitan.", subs:[["Sederhana","p_s"],["Menengah","p_m"],["Lanjutan","p_l"]]}
];
/* ===== SELF LEARNING: satu game untuk tiap level ===== */
const SELF = [
  {id:1, name:"Hujan Huruf", desc:"Huruf berjatuhan. Tekan huruf yang sama sebelum menyentuh tanah.", subs:[["Home row","L1h"],["Semua huruf","L1a"]]},
  {id:2, name:"Tebak Gambar", desc:"Lihat gambar, ketik kata Arabnya. Kata disusun: tangan kiri → kanan → gabungan. Waktu 90 detik, 3 nyawa.", subs:[["Tangan kiri","pic_l"],["Tangan kanan","pic_r"],["Kiri + kanan","pic_m"]]},
  {id:3, name:"Bom Waktu", desc:"Ketik kata sebelum sumbu bom habis. Makin lancar, sumbu makin pendek. 3 nyawa.", subs:[["Sederhana","w_s"],["4–5 huruf","w_m"],["Panjang","w_l"]]},
  {id:4, name:"Pelari Rintangan", desc:"Ketik ungkapan atau kalimat sampai habis agar pelari melompati rintangan sebelum menabrak.", subs:[["Ungkapan pendek","k_s"],["Kalimat","k_m"]]},
  {id:5, name:"Balapan Paragraf", desc:"Ketik satu paragraf sebelum robot sampai garis finis. Menang = +20 poin.", subs:[["Sederhana · robot santai","p_s",1.2],["Menengah · robot sedang","p_m",2],["Lanjutan · robot cepat","p_l",3]], race:true}
];

/* ===== Tebak Gambar: [emoji, kata Arab, arti] — kata konkret, dikelompokkan per tangan ===== */
const PICS = {
  l:[["❤️","قلب","hati"],["⚡","برق","kilat"],["🐎","فرس","kuda"],["🌃","ليل","malam"],["✈️","سفر","perjalanan"],["🥤","شرب","minum"],["🕳️","ثقب","lubang"],["⭕","صفر","nol"],["🛑","قف","berhenti!"],["👊","ضرب","memukul"],["👓","بصر","penglihatan"],["🧘","صبر","sabar"],["🤫","سر","rahasia"]],
  r:[["👴","جد","kakek"],["👵","جدة","nenek"],["🕋","حج","haji"],["🩸","دم","darah"],["⭐","نجم","bintang"],["😴","نوم","tidur"],["😢","دمع","air mata"],["👑","تاج","mahkota"],["🍑","خوخ","persik"],["😔","حزن","sedih"],["📅","عام","tahun"],["🍽️","جوع","lapar"],["🌴","جنة","surga"],["👨","عم","paman"]],
  m:[["✋","يد","tangan"],["👄","فم","mulut"],["🦷","سن","gigi"],["🐻","دب","beruang"],["😍","حب","cinta"],["✏️","قلم","pena"],["🏠","بيت","rumah"],["☀️","شمس","matahari"],["🌕","قمر","bulan"],["⛰️","جبل","gunung"],["🏞️","نهر","sungai"],["🌹","ورد","mawar"],["🍞","خبز","roti"],["👁️","عين","mata"],["🐕","كلب","anjing"],["🏪","سوق","pasar"],["🌊","بحر","laut"],["🌳","شجر","pohon"],["🥇","ذهب","emas"],["👕","ثوب","baju"],["🚪","باب","pintu"],["📚","كتب","buku"],["💡","نور","cahaya"],["👦","ولد","anak laki-laki"],["📖","درس","pelajaran"],["🎨","فن","seni"]]
};

/* ===== PROGRAM 10 HARI = 10 pertemuan sesuai Modul Pelatihan Arabic Touch Typing =====
   Tiap pertemuan punya beberapa materi: [id, nama, keterangan, (penanda "post" = post-test)] */
const LETTER_GROUPS = [["ا","ب","ت","ث","ج","ح","خ"],["د","ذ","ر","ز","س","ش","ص"],["ض","ط","ظ","ع","غ","ف","ق"],["ك","ل","م","ن","و","ه","ي"],["ء","ئ","ؤ","لا","ة","ى"]];
const LAT1 = ["اب تث جحخ ابت ثج حخ","دذ رز سش صد ذر زس شص","ضط ظعغ فقض طظع غفق","كلم نو هي كل من وهي","ءئؤ لا ة يء ئؤ لاةي"];
const LAT3A = "اب يب بو ات يت تو ان ين نو ما مي مو لا يل لو سا سي سو را ري رو فا يف فو قا قي قو كا كي كو";
const LAT3B = "جا جي جو حا حي حو شا شي شو صا صي صو ضا ضي ضو طا طي طو عا عي عو غا غي غو دا دي دو زا زي زو";
const LAT4A = "بسم رسم شرح سبح فرح فرغ بسط برع محل جعل هجر غمر عمل عمر ذكر مهر";
const LAT4B = "فعل قتل قهر خبل بطل بعض شكر شغل قمر شعر رجل فجر مسح نسخ نبذ هبط ذبح خلع ظلم طبع حفظ نفع كبح خبط نبت نبح";
// Latihan 5–6: tangan bergantian (tidak ada dua huruf berurutan dari tangan yang sama)
const ALT4 = ["شجرة", "ثمرة", "فكرة", "بدلة", "قطرة", "سورة", "صورة", "ثورة", "ذكرى", "لعبة", "جلوس", "دفتر", "نفكر", "نشكر", "نذكر", "شكرا", "هيكل", "عقول", "جبال", "خيال", "هلال", "حقول", "وقار", "حساب", "عذاب"];
const ALT5 = ["مشكلة", "مسطرة", "تذكرة", "مذكرة", "مفكرة", "دفترك", "كراسة", "دراسة", "حراسة", "عبارة", "حضارة", "زيارة"];
const SENT9 = ["كتب أبوك الدرس الجديد في الدفتر.", "سلمت على أخيك المجتهد بعد الدرس.", "رأيت أباك ومعلمك في المكتبة.", "حضر الطلاب كلهم إلا طالبا واحدا.", "عاد المسافرون متعبين من الرحلة.", "جاء أخو خالد وصديقه مبكرين.", "قابلت الأستاذ خالدا في الجامعة."];
const SENT9H = ["كَتَبَ أَبُوكَ الدَّرْسَ الْجَدِيدَ فِي الدَّفْتَرِ.", "سَلَّمْتُ عَلَى أَخِيكَ الْمُجْتَهِدِ بَعْدَ الدَّرْسِ.", "رَأَيْتُ أَبَاكَ وَمُعَلِّمَكَ فِي الْمَكْتَبَةِ.", "حَضَرَ الطُّلَّابُ كُلُّهُمْ إِلَّا طَالِبًا وَاحِدًا.", "عَادَ الْمُسَافِرُونَ مُتْعَبِينَ مِنَ الرِّحْلَةِ.", "جَاءَ أَخُو خَالِدٍ وَصَدِيقُهُ مُبَكِّرَيْنِ.", "قَابَلْتُ الْأُسْتَاذَ خَالِدًا فِي الْجَامِعَةِ."];
const MEET = [
  {n:1, t:"Huruf ا ب ت ث ج ح خ", pr:"https://harmash.com/learn-typing", o:[["1a","Huruf berurutan","Tiap huruf diketik 20× (spasi per 5 ketikan), lalu ketujuh huruf berurutan."],["1b","Latihan 1: rangkaian huruf","Kata-kata latihan 1 dari modul."]]},
  {n:2, t:"Huruf د ذ ر ز س ش ص", pr:"https://harmash.com/learn-typing", o:[["2a","Huruf berurutan","Tiap huruf diketik 20× (spasi per 5 ketikan), lalu ketujuh huruf berurutan."],["2b","Latihan 1: rangkaian huruf","Kata-kata latihan 1 dari modul."]]},
  {n:3, t:"Huruf ض ط ظ ع غ ف ق", pr:"https://harmash.com/learn-typing", o:[["3a","Huruf berurutan","Tiap huruf diketik 20× (spasi per 5 ketikan), lalu ketujuh huruf berurutan."],["3b","Latihan 1: rangkaian huruf","Kata-kata latihan 1 dari modul."]]},
  {n:4, t:"Huruf ك ل م ن و ه ي", pr:"https://harmash.com/learn-typing", o:[["4a","Huruf berurutan","Tiap huruf diketik 20× (spasi per 5 ketikan), lalu ketujuh huruf berurutan."],["4b","Latihan 1: rangkaian huruf","Kata-kata latihan 1 dari modul."]]},
  {n:5, t:"Huruf ء ئ ؤ لا ة ى", pr:"https://harmash.com/learn-typing", o:[["5a","Huruf berurutan","Tiap huruf diketik 20× (spasi per 5 ketikan), lalu keenam huruf berurutan."],["5b","Latihan 1: rangkaian huruf","Kata-kata latihan 1 dari modul."]]},
  {n:6, t:"Huruf secara acak", pr:"https://harmash.com/learn-typing", o:[["6a","Acak huruf pertemuan 1–3","Mengenali letak huruf tanpa urutan alfabet."],["6b","Acak seluruh huruf (Latihan 2)","Seluruh huruf dari pertemuan 1–5, urutan diacak."]]},
  {n:7, t:"Dua dan tiga huruf", pr:"https://www.typingstudy.com/ar-arabic-3/", o:[["7a","Latihan 3 · Dua huruf (bagian 1)","Konsonan + vokal panjang (ا و ي)."],["7b","Latihan 3 · Dua huruf (bagian 2)","Perpindahan jari lebih luas, satu tangan maupun lintas tangan."],["7c","Latihan 4 · Tiga huruf (bagian 1)","Pola kiri-kiri-kanan atau kanan-kanan-kiri."],["7d","Latihan 4 · Tiga huruf (bagian 2)","Pola kiri-kanan-kiri atau kanan-kiri-kanan."]]},
  {n:8, t:"Empat huruf atau lebih", pr:"https://www.typingstudy.com/ar-arabic-3/speedtest", o:[["8a","Latihan 5 · Empat huruf","Tangan bergantian pada setiap ketukan huruf."],["8b","Latihan 6 · Lima huruf atau lebih","Pergantian tangan dipertahankan pada kata yang lebih panjang."]]},
  {n:9, t:"Kalimat sempurna", pr:"https://www.typingstudy.com/ar-arabic-3/speedtest", o:[["9a","Latihan 7 · Kalimat tanpa harakat","Tujuh kalimat bervariasi kaidah nahwu, lengkap dengan spasi dan tanda baca."],["9b","Latihan 8 · Kalimat dengan harakat","Kalimat yang sama dengan harakat (Shift + huruf)."]]},
  {n:10, t:"Teks bertingkat + post-test", pr:"https://www.clavier-arabe.org/ar/p/test-dactylographie-arabe.html", o:[["10a","Teks tingkat sederhana","Kalimat pendek, kosakata umum."],["10b","Teks tingkat menengah","Beberapa kalimat yang saling berkaitan."],["10c","Teks tingkat lanjutan","Paragraf panjang dengan hamzah dan tanda baca."],["post","Post-test (1 paragraf)","Ukur kemajuanmu setelah latihan. Maksimal 3 menit.","post"]]}
];
const BADGES = [
  {id:"first",  name:"Langkah pertama", how:"Selesaikan 1 sesi"},
  {id:"teliti", name:"Teliti", how:"Akurasi ≥ 95%"},
  {id:"cepat",  name:"Cepat", how:"WPM ≥ 20 pada sesi ≥ 1 menit"},
  {id:"harakat",name:"Ahli harakat", how:"Selesaikan kalimat berharakat, akurasi ≥ 90%"},
  {id:"naik",   name:"Meroket", how:"Correct CPM post-test lebih tinggi dari pre-test"},
  {id:"konsisten",name:"Konsisten", how:"Selesaikan 7 hari latihan"},
  {id:"tamat",  name:"Penakluk teks", how:"Selesaikan paragraf Lanjutan"}
];

/* peta tombol fisik -> huruf (dipakai keyboard bawaan & game) */
const CODE_MAP = {Backquote:{n:"ذ", s:"ّ"}};
KB_ROWS.forEach(r => r.forEach(([c, n, s]) => { CODE_MAP[c] = {n, s}; }));
const KEYNAMES = {BracketLeft:"[",BracketRight:"]",Semicolon:";",Quote:"'",Comma:",",Period:".",Slash:"/",Backquote:"`",Space:"Spasi"};
const keyName = c => KEYNAMES[c] || c.replace("Key","");
const RANKS = [[0,"Mubtadi’","مبتدئ","Pemula"],[100,"Thalib","طالب","Pelajar"],[300,"Katib","كاتب","Penulis"],[700,"Adib","أديب","Sastrawan"],[1500,"Khattat","خطّاط","Kaligrafer"],[3000,"Ustadz","أستاذ","Maestro"]];
BADGES.push({id:"hujan",name:"Pemburu huruf",how:"Skor ≥ 200 di Self Learning"},{id:"combo",name:"Combo 50",how:"50 huruf benar beruntun"},{id:"streak3",name:"Api semangat",how:"Streak 3 hari"});

/* peta karakter Latin (QWERTY US) -> karakter Arab; dipakai bila browser tidak memberi kode tombol */
const LATIN = {};
(()=>{ const SYM = {Backquote:["`","~"],BracketLeft:["[","{"],BracketRight:["]","}"],Semicolon:[";",":"],Quote:["'",'"'],Comma:[",","<"],Period:[".",">"],Slash:["/","?"]};
  Object.entries(CODE_MAP).forEach(([c,m])=>{ const l = SYM[c] || (/^Key[A-Z]$/.test(c) ? [c[3].toLowerCase(), c[3]] : null);
    if (l){ LATIN[l[0]] = m.n; LATIN[l[1]] = m.s; } }); })();
const LATIN_RE = /[A-Za-z`\[\];',.\/~{}:"<>?]/g;
