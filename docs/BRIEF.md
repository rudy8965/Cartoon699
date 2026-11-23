# BRIEF PROYEK — RH CARTOON STUDIO (dari pemilik proyek)

Disimpan agar sesi berikutnya bisa dilanjutkan tanpa mengulang. Sumber: instruksi pemilik di sesi 1 (2026-11-23).

## Peran
Claude adalah satu-satunya AI Engineer dan Production Director: software, cerita & storyboard, desain karakter 3D, lingkungan & objek, animasi, kamera sinematik, voice-over & audio mixing, render, pengujian kualitas, pengiriman MP4 final.

## Teknologi
Three.js, Node.js, Playwright (prototipe `legacy/`), FFmpeg, Python, GitHub Actions. (Engine aktif: Remotion + three.js + Kokoro; lihat `README.md`.)

## Format
- Shorts 9:16, Long 16:9.
- Voice-over tidak boleh dipotong; durasi video mengikuti durasi voice-over.
- Output MP4 harus dapat diunduh.
- Sistem produksi universal untuk berbagai genre kartun 3D sinematik.

## Aturan kerja
1. Audit repo dulu; jangan merusak fitur yang berjalan; jangan hapus file penting.
2. Kerja di branch terpisah (`v4`); jangan sentuh `main` sebelum lulus uji.
3. Buat preview sebelum render penuh.
4. Uji visual, audio, durasi, dan resolusi.
5. Perbaiki error secara mandiri; jalankan GitHub Actions dan periksa hasilnya.
6. **Jangan menyatakan selesai sebelum MP4 benar-benar tersedia dan sudah diuji.**
7. Dokumentasikan progres di `docs/PROGRESS.md` di setiap sesi.

## Keputusan pemilik
- Repo kerja: `rudy8965/Cartoon699`, branch `v4` (repo `Cartoon-Studio` tidak ditemukan).
- Engine dari `animated-shorts-skill.zip` dijadikan basis; prototipe lama dipindah ke `legacy/`.
- Akses GitHub: lewat token fine-grained terbatas ke Cartoon699 (kedaluwarsa 7 hari). **Token tidak pernah disimpan di repo.** Pemilik diminta mencabut (revoke) token setelah selesai.

## Permintaan lanjutan
- Meniru gaya video referensi (kamera, ritme, warna/cahaya, caption, proporsi karakter) hanya sebagai gaya terukur; tidak menyalin karakter, cerita, atau frame. Font berlisensi diganti padanan Google Fonts. Referensi dikirim pemilik sebagai klip/tangkapan layar, lalu diukur dengan `scripts/measure.py` dan ditulis ke `styles/<nama>.md`.

## Catatan keamanan
- Jangan commit token, kunci, atau kredensial apa pun. Gunakan GitHub Secrets bila diperlukan.
