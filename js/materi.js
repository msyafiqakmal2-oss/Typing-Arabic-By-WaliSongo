/* =====================================================================
   MATERI AJAR  —  FILE INI DISIAPKAN/DIGANTI OLEH TUTOR
   ---------------------------------------------------------------------
   Ganti isi daftar di bawah dengan teks dari tutor. Aturan umum:
   • Satu teks = satu butir dalam tanda kutip "...", dipisah koma.
   • Hanya karakter yang bisa diketik di keyboard Arabic (101); harakat
     boleh ada. Setelah mengubah, buka  cek-materi.html  untuk memeriksa.
   • Isi di bawah SAAT INI masih teks contoh bawaan aplikasi.
   ===================================================================== */

/* LEVEL 3 — Kata, per grade: s = sederhana, m = 4–5 huruf, l = panjang */
const WORDS = {
  s: ["أب","أم","بيت","باب","كتب","علم","نور","ماء","قلم","ولد","بنت","شمس","قمر","نهر","جبل","خبز","ورد","يد","رجل","عين"],
  m: ["مدرسة","مكتبة","طالب","معلم","حديقة","سيارة","طعام","صديق","مسجد","كتاب","مفتاح","نافذة","شجرة","سماء","طريق","مدينة"],
  l: ["استخدام","مستقبل","اجتماعي","اللغة","العربية","مجتمع","الحاسوب","الإنسان","المعلومات","الجامعة","التعليم","المسؤولية"]
};

/* LEVEL 4 — Kalimat (BERHARAKAT). Versi "tanpa harakat" dibuat otomatis dari daftar ini. */
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

/* LEVEL 5 — Paragraf/teks, per grade: s = sederhana, m = menengah, l = lanjutan */
const PARA = {
  s: ["أنا طالب في المدرسة. أحب القراءة كل يوم. في البيت مكتبة صغيرة فيها كتب كثيرة. أقرأ مع أبي وأمي بعد الغداء.",
      "ذهب أحمد إلى السوق مع أمه. اشترى خبزا وماء وفاكهة. ثم رجع إلى البيت وأكل مع أسرته."],
  m: ["اللغة العربية من أجمل اللغات في العالم، وهي لغة القرآن الكريم. يتعلم الطلاب الكتابة بها في المدارس والجامعات، ويستخدمون الحاسوب لكتابة الرسائل والبحوث. ومن المهم أن يتقن الطالب الكتابة بالأصابع العشرة لتوفير الوقت.",
      "تعد المكتبة مكانا مناسبا للدراسة والمطالعة. يجلس الطلاب حول الطاولات ويقرؤون الكتب بهدوء، ويستعير بعضهم كتبا ليقرؤوها في البيت."],
  l: ["إن التقدم التقني في عصرنا الحاضر أتاح للإنسان وسائل متنوعة لنشر المعرفة وتبادل المعلومات بين المجتمعات المختلفة. ومن هنا أصبحت مهارة الطباعة الصحيحة بالحاسوب ضرورة علمية ومهنية، لأنها تختصر الجهد وتزيد الإنتاجية وتحسن جودة العمل الأكاديمي والإداري على حد سواء.",
      "يرى كثير من الباحثين أن الممارسة اليومية المنتظمة، ولو لمدة قصيرة، أفضل أثرا من التدريب الطويل المتقطع؛ فالمهارات الحركية تتثبت بالتكرار والتركيز والتغذية الراجعة الفورية عن الأخطاء."]
};

/* SELF LEARNING level 2 — Tebak Gambar, 3 klasifikasi: l = tangan kiri, r = tangan kanan, m = gabungan.
   Format tiap butir: ["emoji", "kata Arab", "arti Indonesia"] */
const PICS = {
  l:[["❤️","قلب","hati"],["⚡","برق","kilat"],["🐎","فرس","kuda"],["🌃","ليل","malam"],["✈️","سفر","perjalanan"],["🥤","شرب","minum"],["🕳️","ثقب","lubang"],["⭕","صفر","nol"],["🛑","قف","berhenti!"],["👊","ضرب","memukul"],["👓","بصر","penglihatan"],["🧘","صبر","sabar"],["🤫","سر","rahasia"]],
  r:[["👴","جد","kakek"],["👵","جدة","nenek"],["🕋","حج","haji"],["🩸","دم","darah"],["⭐","نجم","bintang"],["😴","نوم","tidur"],["😢","دمع","air mata"],["👑","تاج","mahkota"],["🍑","خوخ","persik"],["😔","حزن","sedih"],["📅","عام","tahun"],["🍽️","جوع","lapar"],["🌴","جنة","surga"],["👨","عم","paman"]],
  m:[["✋","يد","tangan"],["👄","فم","mulut"],["🦷","سن","gigi"],["🐻","دب","beruang"],["😍","حب","cinta"],["✏️","قلم","pena"],["🏠","بيت","rumah"],["☀️","شمس","matahari"],["🌕","قمر","bulan"],["⛰️","جبل","gunung"],["🏞️","نهر","sungai"],["🌹","ورد","mawar"],["🍞","خبز","roti"],["👁️","عين","mata"],["🐕","كلب","anjing"],["🏪","سوق","pasar"],["🌊","بحر","laut"],["🌳","شجر","pohon"],["🥇","ذهب","emas"],["👕","ثوب","baju"],["🚪","باب","pintu"],["📚","كتب","buku"],["💡","نور","cahaya"],["👦","ولد","anak laki-laki"],["📖","درس","pelajaran"],["🎨","فن","seni"]]
};

/* PRE-TEST & POST-TEST — satu paragraf tiap tes.
   Disarankan teksnya setara tingkat kesulitannya (atau sama persis) agar perbandingan adil. */
const PRETEST_TEXT  = "اللغة العربية من أجمل اللغات في العالم، وهي لغة القرآن الكريم. يتعلم الطلاب الكتابة بها في المدارس والجامعات، ويستخدمون الحاسوب لكتابة الرسائل والبحوث. ومن المهم أن يتقن الطالب الكتابة بالأصابع العشرة لتوفير الوقت.";
const POSTTEST_TEXT = PRETEST_TEXT;   // ganti dengan teks lain bila tutor menyiapkan teks pasangan


/* =====================================================================
   LOGO & IDENTITAS LAPORAN  —  DISIAPKAN TUTOR
   ---------------------------------------------------------------------
   Taruh file logo di folder  assets/  dengan nama di bawah (atau ubah alamatnya).
   Selama file belum ada, aplikasi menampilkan tulisan sementara sebagai pengganti.
   Saran: PNG latar transparan, tinggi minimal 200 px.
   ===================================================================== */
const LOGOS = {
  katib: "assets/logo-katib.png",   // logo KATIB
  unida: "assets/logo-unida.png",   // logo UNIDA Gontor
  lpm:   "assets/logo-lpm.png"      // logo LPM
};

/* Isi kop dan catatan pada lembar Laporan Evaluasi (halaman laporan.html, siap cetak A4). */
const LAPORAN = {
  judul: "LAPORAN EVALUASI PELATIHAN",
  subjudul: "ARABIC TOUCH TYPING BERBASIS TEKNIK 10 JARI",
  program: "KATIB · Kelas Akselerasi Touch-typing Intensif Bahasa Arab",
  penyelenggara: "Lembaga Pengabdian Masyarakat · Universitas Darussalam Gontor",
  mitra: "Pondok Pesantren Wali Songo Ngabar",     // kosongkan ("") bila tidak dicantumkan
  instruktur: "",                                    // nama tutor untuk kolom tanda tangan (boleh kosong)
  catatanKaki: "Target numerik keberhasilan ditetapkan berdasarkan hasil pre-test dan kesepakatan tim pelatihan."
};
