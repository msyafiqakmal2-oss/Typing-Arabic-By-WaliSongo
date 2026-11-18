# Panduan Tutor — KATIB

## 1. Menyiapkan teks ajar (`js/materi.js`)
Semua teks yang disiapkan tutor ada di **satu file**: `js/materi.js`. Isi saat ini masih **teks contoh bawaan**. Ganti isinya, simpan, lalu buka **`cek-materi.html`** untuk memeriksa (huruf yang tidak bisa diketik, daftar kosong atau ganda, klasifikasi Tebak Gambar).

| Bagian di file | Dipakai di | Keterangan |
|---|---|---|
| `WORDS` (`s`, `m`, `l`) | Tutorial Level 3 dan Self Learning *Bom Waktu* | 3 grade: sederhana, 4–5 huruf, panjang. Satu butir = satu kata. |
| `SENT` | Tutorial Level 4 (tanpa dan dengan harakat) dan Self Learning *Pelari Rintangan* | Tulis **berharakat**. Versi tanpa harakat dibuat otomatis. |
| `PARA` (`s`, `m`, `l`) | Tutorial Level 5 dan *Balapan Paragraf* | 3 grade: sederhana, menengah, lanjutan. Satu butir = satu paragraf. |
| `PICS` (`l`, `r`, `m`) | Self Learning level 2 *Tebak Gambar* | 3 klasifikasi: tangan kiri, kanan, gabungan. Format `["emoji","kata","arti"]`. |
| `PRETEST_TEXT`, `POSTTEST_TEXT` | Pre-test dan Post-test | Satu paragraf tiap tes. Boleh sama, atau teks pasangan yang setara. |

Aturan menulis:
- Satu butir diapit tanda kutip `"..."` dan dipisah koma.
- Gunakan huruf yang ada di keyboard Arabic (101). Harakat boleh; urutan harakat dan syaddah tidak dipermasalahkan.
- Klasifikasi Tebak Gambar: huruf tangan kiri `ذضصثقفشسيبلرئءؤ`, tangan kanan `غعهخحجداتنمكطىةوزظ`. Kata kelompok **kiri** hanya berisi huruf kiri, **kanan** hanya huruf kanan, **gabungan** harus memuat keduanya.
- Setelah mengubah file, muat ulang aplikasi dengan **Ctrl + F5**.

## 2. Aturan Backspace dan keyboard di layar (`POLICY` di `js/data.js`)
| | Backspace | Keyboard di layar |
|---|---|---|
| Tutorial Learning Level 1 | ✅ aktif | ✅ tampil |
| Tutorial Learning Level 2–5 | ✅ aktif | ❌ disembunyikan |
| Program 10 Hari | ✅ aktif | ✅ tampil |
| Self Learning (game level 1–4) | tidak ada (game bukan teks) | — |
| Self Learning level 5 (Balapan Paragraf) | ❌ nonaktif | ✅ tampil |
| Pre-test | ❌ nonaktif | ✅ tampil |
| Post-test | ❌ nonaktif | ❌ disembunyikan |

Ubah angka `true`/`false` di objek `POLICY` bila kebijakan berubah. Keyboard di layar juga tetap bisa dimatikan siswa lewat ⚙.
Catatan: untuk perbandingan yang adil, pertimbangkan menyamakan tampilan keyboard antara Pre-test dan Post-test.

## 3. Peringkat
| Peringkat | Poin minimal |
|---|---|
| Mubtadi’ | 0 |
| Thalib | 100 |
| Katib | 300 |
| Adib | 700 |
| Khattab | 1500 |
| Ustadz | 3000 |

Daftar ada di `RANKS` (`js/data.js`).

## 4. Rumus perolehan poin (untuk dikaji tutor)
Rumus ada di fungsi `award()` (`js/app.js`) dan `gameDone()`.

- **Latihan (Tutorial Learning dan Program 10 Hari)** = `round(Correct CPM × akurasi% ÷ 10)` + `5 × bintang` + `1 per 10 combo maksimal` + `10 bila Correct CPM lebih tinggi dari sesi sebelumnya`.
  Bintang: ★ akurasi ≥ 80%, ★★ ≥ 90%, ★★★ ≥ 95%.
- **Pre-test / Post-test**: 20 poin tetap.
- **Self Learning (game)**: poin = `round(skor ÷ 8)`. **Balapan Paragraf**: +20 bila menang.

Perkiraan poin satu sesi 10 menit (hanya gambaran, bukan hasil pengukuran):

| Kemampuan | Correct CPM | Akurasi | Poin sesi |
|---|---|---|---|
| Pemula | 40 | 90% | ± 15 (25 bila lebih baik dari sebelumnya) |
| Menengah | 120 | 95% | ± 29 (39) |
| Mahir | 250 | 98% | ± 48 (58) |

Dengan 10 sesi dalam Program 10 Hari, pemula mencapai ± 150–250 poin (**Thalib**), dan siswa menengah ± 290–390 poin (**Katib**). Jumlah sesi rata-rata untuk mencapai tiap peringkat (poin game membantu):

| Peringkat | Pemula | Menengah | Mahir |
|---|---|---|---|
| Adib (700) | ± 35 sesi | ± 21 sesi | ± 13 sesi |
| Khattab (1500) | ± 75 sesi | ± 44 sesi | ± 28 sesi |
| Ustadz (3000) | ± 150 sesi | ± 88 sesi | ± 57 sesi |

Bila tutor ingin peringkat atas tercapai dalam waktu pelatihan yang lebih singkat, ambang poin atau rumus bisa disesuaikan.
Catatan: poin latihan bergantung pada **Correct CPM**, sehingga siswa cepat mengumpulkan poin lebih banyak daripada siswa teliti tapi lambat. Tutor dapat mempertimbangkan bobot akurasi.

## 5. Logo KATIB, UNIDA, dan LPM
Aplikasi sudah menyediakan tempat logo di **header**, **Beranda**, **footer**, dan **kop Laporan Evaluasi**. Tutor cukup menaruh tiga file di folder `assets/`:

| File | Isi |
|---|---|
| `assets/logo-katib.png` | Logo KATIB |
| `assets/logo-unida.png` | Logo UNIDA Gontor |
| `assets/logo-lpm.png` | Logo LPM |

Saran: PNG berlatar transparan, tinggi minimal 200 px. Nama atau alamat file bisa diubah di bagian `LOGOS` pada `js/materi.js`. Selama file belum ada, aplikasi menampilkan tulisan sementara ("كاتب KATIB", "UNIDA Gontor", "LPM"). Buka `cek-materi.html` untuk memeriksa apakah logo sudah terbaca.

## 6. Laporan Evaluasi Pelatihan (`laporan.html`)
Dibuka dari tombol **Laporan cetak (A4)** di menu Laporan. Isinya mengikuti lembar evaluasi di modul:
- **A.** Identitas peserta, **B.** tabel Pre-test dan Post-test (durasi, WPM, CPM, Correct CPM, akurasi, kesalahan, dan selisih), **C.** pencapaian indikator keberhasilan, **D.** ringkasan latihan dan lencana, **E.** grafik kemajuan, **F.** riwayat 10 sesi, **G.** catatan instruktur dan kolom tanda tangan.
- Cetak langsung atau pilih *Save as PDF* di jendela cetak (A4, skala 100%, aktifkan *Background graphics*).
- **Meninjau desain tanpa data peserta:** buka `laporan.html?contoh=1`. Halaman memakai data rekaan dan diberi tanda **CONTOH**.
- Judul, nama program, penyelenggara, mitra, nama instruktur, dan catatan kaki diubah di bagian `LAPORAN` pada `js/materi.js`.

Catatan indikator: ✓ Correct CPM dan/atau WPM meningkat, ✓ akurasi terjaga atau meningkat (post ≥ pre), ✓ kesalahan menurun. Modul menyatakan target numerik ditetapkan tim pelatihan, jadi lembar ini hanya membandingkan pre-test dengan post-test, tanpa angka target.
