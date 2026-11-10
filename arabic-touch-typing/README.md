# Mahir Ketik Arab – Arabic Touch Typing

Website latihan mengetik Arab (gamifikasi + pengukuran kemampuan). Statis: HTML + CSS + JavaScript, tanpa instalasi.

## Cara menjalankan
1. Ekstrak ZIP.
2. Buka `index.html` di Chrome/Edge/Firefox (klik dua kali). Untuk hosting: unggah seluruh folder ke hosting statis (GitHub Pages, Netlify, dll).
3. Atur layout keyboard komputer ke **Arabic (101)** (Windows: Settings → Time & language → Language & region → Add a language → Arabic → Keyboard: Arabic (101)). Ganti dengan Win+Spasi.

## Struktur
- `index.html` – halaman & tampilan
- `css/style.css` – gaya (RTL, mode gelap otomatis)
- `js/data.js` – huruf, kata, kalimat, paragraf, peta keyboard, level, program 10 hari (10 pertemuan sesuai modul), lencana
- `js/engine.js` – pembanding real-time dan rumus metrik
- `js/app.js` – navigasi, poin, lencana, pre/post-test, laporan, penyimpanan (localStorage)

## Rumus
- WPM = karakter diketik ÷ 5 ÷ menit
- CPM = seluruh karakter ÷ menit
- Correct CPM = karakter benar ÷ menit
- Akurasi = benar ÷ total × 100%
- Kesalahan = salah ÷ total × 100%

## Kustomisasi
- Tambah kata/kalimat/paragraf: edit `js/data.js`.
- Ubah poin & syarat lencana: fungsi `award()` di `js/app.js`.
- Data tersimpan di browser (localStorage). Untuk banyak pengguna/akun, perlu backend (mis. Firebase/Supabase) – titik simpan ada di fungsi `save()`.

## Catatan
- Peta harakat pada keyboard di layar (Shift) bersifat penunjuk dan mungkin sedikit berbeda dari layout OS Anda; input tetap memakai keyboard sistem.
- Perbandingan karakter dilakukan per posisi; teks berharakat dihitung per karakter (huruf dan harakat masing-masing).

## Pembaruan v2
- Keyboard Arab bawaan situs (default): tombol fisik otomatis jadi huruf Arab, jadi tidak perlu menginstal layout Arabic. Ubah di ⚙ Pengaturan.
- Tema Arab, peringkat (Mubtadi’ → Ustadz), bintang, combo, streak harian, target harian, confetti, efek suara.
- Game "Hujan Huruf" (js/game.js), halaman Panduan, grafik kemajuan, unduh CSV, cetak laporan.
