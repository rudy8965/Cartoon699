# RH CARTOON STUDIO — PROGRESS LOG

Terakhir diperbarui: 2026-11-23 (Sesi 1)
Status: **Engine Remotion terintegrasi di branch `v4`. Belum di-push, belum dijalankan di GitHub Actions. Belum ada MP4 yang diuji.**

## Repositori
- Repo kerja: `rudy8965/Cartoon699` (README: "Cartoon-Studio"). `rudy8965/Cartoon-Studio` → 404 tanpa login.
- `rudy8965/Cartoon` = prototipe lama, tidak diubah.

## Isi branch v4 (2 commit)
1. **Fase 0**: perbaikan prototipe Playwright (casing `src/`, workflow, env, artifact, QA).
2. **Import engine `animated-shorts-skill.zip`**: Remotion 4.0.534 + @react-three/fiber + three 0.170, Kokoro TTS, sound.mjs, episode contoh `ep1` (Short, 64,65 s VO) & `ep1long` (Long, 125,29 s VO), skill `.claude/skills/animated-shorts`.
   - Prototipe Playwright dipindah ke `legacy/` (workflow: `render-legacy.yml`, hanya manual).
   - Workflow baru: `render-episode.yml` (preview 8 detik default; otomatis saat push ke `v4`).
   - `tools/qa.py` menerima 1080p; `tools/expected_duration.py` menghitung durasi yang diharapkan dari `timing.json`.

## Temuan penting
- Durasi mengikuti VO: `totalFrames = ceil((timing.total + TAIL) * fps)`; TAIL Short 0,7 s, Long 1,2 s. `mix.wav` = VO + 0,7 s (diverifikasi ffprobe). Durasi MP4 yang diharapkan: Short 65,367 s, Long 126,500 s.
- `kokoro-js` → `onnxruntime-node` mencoba mengunduh binary CUDA saat `npm ci`; gunakan `--onnxruntime-node-install-cuda=skip` (sudah di workflow & README).
- Untuk preview Remotion `--frames=0-239` (8 s @30fps).
- Render 3D di CPU (ANGLE/SwiftShader, concurrency 1) lambat: perkirakan puluhan menit sampai beberapa jam untuk Long; timeout job 350 menit.
- WAV ep1/ep1long (±37 MB) ikut di-commit agar CI tidak bergantung pada unduhan model Kokoro. Opsi `regenerate_audio` tersedia tapi belum teruji.
- Skill berisi fitur mengunduh Shorts kanal lain untuk "mengukur gaya"; `styles/ricks-clips.md` meniru gaya kanal tertentu. Jangan memakai frame/cerita kanal lain; buat karakter dan cerita sendiri ("Make it yours").

## Teruji di sandbox
- [x] `npm ci` (dengan skip CUDA), `tsc --noEmit` lulus, `remotion bundle` berhasil
- [x] `tools/qa.py` & `expected_duration.py` dengan video sintetis (lulus/gagal sesuai harapan)
- [x] YAML kedua workflow valid
- [ ] Render Remotion: **tidak bisa** (unduhan Chrome `remotion.media` diblokir sandbox)
- [ ] Kokoro/voice.mjs: tidak diuji

## Checklist
- [x] Audit, repo target, Fase 0, import engine
- [ ] Push `v4`; workflow hijau; preview MP4 diunduh & lulus QA
- [ ] Render penuh Short, lalu Long; QA lulus
- [ ] Fase berikutnya: skema cerita universal multi-genre, library karakter/lingkungan, shot library kamera, episode baru "ep2" (cerita sendiri), merge ke `main`

## Langkah berikutnya
1. Push `v4`. Workflow "Render Episode (Remotion)" jalan otomatis (preview Short).
2. Kirim hasil/log; perbaiki error; unduh artifact; jalankan QA.
3. Jika hijau: jalankan Short penuh, lalu Long.
