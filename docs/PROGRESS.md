# RH CARTOON STUDIO — PROGRESS LOG

Terakhir diperbarui: 2026-11-23 (Sesi 1)
Status: **Fase 0 siap di branch `v4`, belum dijalankan di GitHub Actions. Belum ada MP4 yang diuji.**

## 1. Repositori
- Repo kerja V4: `rudy8965/Cartoon699` (README bertuliskan "Cartoon-Studio").
- `rudy8965/Cartoon-Studio` → 404 dari akses tanpa login (privat atau tidak ada).
- `rudy8965/Cartoon` adalah prototipe lama (basis kode Fase 0); tidak diubah.

## 2. Temuan audit prototipe `rudy8965/Cartoon`
Kritis:
1. Folder `SRC/` (huruf besar) vs `index.html` memuat `./src/main.js` → gagal di Linux. **Diperbaiki.**
2. `render.yml` kosong; 3 run Actions terakhir gagal. **Diperbaiki (workflow baru).**
3. Env `DURATION` tidak terbaca (`render.mjs` memakai `VIDEO_DURATION`); artifact mencari `*.mp4` di root padahal output di `out/`. **Diperbaiki.**
4. `npm install` tanpa lockfile, `vite` tak terpakai. **Diperbaiki (`npm ci`, lockfile).**

Belum ada (rencana V4):
5. Audio / voice-over; durasi masih manual (1–600 s) dan belum mengikuti VO.
6. Sistem cerita/storyboard; scene masih hard-coded.
7. Karakter primitif tanpa rig/ekspresi/lip-sync; kamera hampir statis.
8. Resolusi 720p (target 1080p); render PNG per frame via software GL lambat untuk video panjang (perlu chunk paralel).
9. Pengujian otomatis kualitas: hanya `tools/qa.py` dasar (resolusi, codec, durasi, audio, frame hitam).

## 3. Rencana V4
- Fase 0 — Perbaikan pipeline (**selesai dikodekan, menunggu uji di Actions**)
- Fase 1 — Arsitektur: `engine/`, `stories/*.json`, `characters/`, `environments/`, `pipeline/`, `tools/`, `tests/`
- Fase 2 — Skema cerita JSON (genre, scene, shot, dialog, emosi, aset)
- Fase 3 — Audio: durasi dari `ffprobe` VO, mixing/ducking, VO tidak dipotong
- Fase 4 — Karakter & aset 3D, ekspresi, lip-sync amplitudo
- Fase 5 — Kamera sinematik (shot library, easing)
- Fase 6 — Render: preview 10 s dulu, lalu full; chunk paralel; preset 9:16 & 16:9 (1080p)
- Fase 7 — QA otomatis lengkap
- Fase 8 — PR ke `main`, MP4 sebagai artifact

## 4. Perubahan Fase 0
- `SRC/` → `src/`; `.gitignore` + `out/`; `package-lock.json`.
- `render.mjs`: baca `VIDEO_DURATION` atau `DURATION`, mode `--preview` (maks 10 s), port otomatis.
- `.github/workflows/render.yml`: dispatch (mode, durasi, preview, nama output) + otomatis saat push ke `v4`; QA; upload `out/*.mp4`.
- `tools/qa.py`: uji dengan video sintetis (lulus untuk video benar, gagal untuk resolusi salah/tanpa audio).

## 5. Batasan sesi 1
- Tidak ada akses GitHub dari sandbox (tanpa login): push, branch di remote, dan Actions belum dijalankan.
- Sandbox tidak punya Chromium: render Playwright belum diuji.
- TTS belum diputuskan (file VO dari pengguna atau layanan TTS).

## 6. Checklist
- [x] Audit
- [x] Repo target: Cartoon699
- [x] Fase 0 dikodekan; skrip QA teruji lokal
- [ ] Push `v4` & Actions hijau
- [ ] MP4 preview diunduh & lulus QA
- [ ] Fase 1–8
- [ ] MP4 final teruji

## 7. Langkah berikutnya
1. Push `v4`; workflow "Render Cartoon Video" jalan otomatis (preview).
2. Periksa log, perbaiki error, unduh artifact, jalankan `python3 tools/qa.py out/<file>.mp4`.
3. Jika hijau, mulai Fase 1.
