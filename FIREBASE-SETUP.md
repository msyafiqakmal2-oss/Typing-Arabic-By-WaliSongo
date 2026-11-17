# Menghubungkan Mahir Ketik Arab ke Database (Firebase Firestore)

Tanpa langkah ini, aplikasi tetap berjalan **lokal** (data hanya di perangkat). Setelah dihubungkan:
- siswa masuk dengan **nama**, lalu kemajuannya **disimpan otomatis** dan bisa **dilanjutkan dari perangkat mana pun**;
- menu **Klasemen** menampilkan peringkat berdasarkan total poin.

Gratis untuk kelas kecil (paket Spark, tanpa kartu kredit). Tampilan konsol Firebase bisa sedikit berbeda dari tulisan di bawah.

## Langkah
1. Buka https://console.firebase.google.com lalu **Add project** (Analytics boleh dimatikan).
2. Menu **Build › Firestore Database › Create database**. Pilih lokasi terdekat (mis. Jakarta atau Singapura) dan mode **Production**.
3. Tab **Rules**: hapus isinya, tempel seluruh isi file `firestore.rules` dari proyek ini, lalu **Publish**.
4. **Project settings** (ikon roda gigi) › **General** › **Your apps** › tambahkan **Web app** (ikon `</>`). Salin nilai `apiKey` dan `projectId`.
5. Buka `js/config.js`, isi:
   ```js
   const CLOUD_CONFIG = { projectId: "ISI_DI_SINI", apiKey: "ISI_DI_SINI", collection: "students" };
   ```
6. Publikasikan website (GitHub Pages, Netlify, atau Firebase Hosting) agar semua siswa memakai alamat yang sama. Untuk uji coba, `127.0.0.1` sudah cukup.

## Opsional tapi disarankan
Di Google Cloud Console › **APIs & Services › Credentials**, buka API key tadi dan batasi dengan **HTTP referrers** ke alamat website Anda (dan `127.0.0.1` bila masih menguji). Kunci web Firebase memang bukan rahasia, pengamannya adalah *rules* di langkah 3.

## Cara kerja singkat
- ID akun = nama yang dinormalisasi (huruf kecil, spasi jadi `-`). `Ahmad Fauzi` dan `ahmad  fauzi` = akun yang sama.
- Simpan otomatis 1,5 detik setelah ada perubahan. Bila offline, data aman di perangkat dan dikirim saat online.
- Tombol **Pengguna baru** hanya mengeluarkan akun dari perangkat; data di server tetap ada.

## Batasan yang perlu diketahui
- **Tanpa kata sandi.** Siapa pun yang mengetik nama yang sama akan masuk ke akun itu, dan data serta skor di server pada prinsipnya bisa dibaca atau diubah oleh orang yang paham teknis. Cocok untuk kelas yang saling percaya, belum cocok untuk lomba berhadiah.
- Dua siswa bernama sama akan berbagi akun. Minta siswa menambahkan inisial atau kelas (mis. `Ahmad Fauzi 9A`).
- Nama dan hasil siswa tersimpan di server Google. Simpan data seminimal mungkin dan pastikan pihak pesantren setuju.
- Untuk keamanan lebih kuat (PIN atau login), aplikasi perlu dikembangkan lebih lanjut.
