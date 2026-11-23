# RH CARTOON STUDIO — PROGRESS LOG

Terakhir diperbarui: 2026-11-23 (Sesi 1)
Status: **`v4` sudah di-push. Preview Short 8 detik berhasil dirender di GitHub Actions dan lulus QA otomatis (run 45106259514). Render penuh Short/Long belum dilakukan. Isi visual belum diperiksa manusia/Claude.**

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

## Hasil Actions (sesi 1)
- Run 1 (`35e1f1b`) & 2 (`07a298e`): gagal di Render. Penyebab: runner tanpa GPU, `THREE.WebGLRenderer: Error creating WebGL context` (config `angle` butuh GPU).
- Perbaikan: `--gl=swangle --concurrency=2` di `render-episode.yml`.
- Run 3 (`0775c11`): **sukses**. Render 240 frame ±21 menit (±5,2 dtk/frame). Artifact `episode-Short` 10,8 MB; QA lulus (1080x1920, h264, 8,0 s, audio ada).
- Estimasi render penuh pada kecepatan itu: Short ±1.961 frame ≈ 2,8 jam; Long ±3.800 frame ≈ 5,5 jam (mendekati batas 350 menit) → perlu render paralel per rentang frame (matrix job) + gabung FFmpeg.
- Log mentah & artifact tidak bisa diunduh dari sandbox (blob.core.windows.net diblokir). Diagnosa lewat annotation (`render-log-tail`) dan gambar kontak 12 frame di branch `previews`.

## TODO berikutnya
1. Periksa gambar kontak di branch `previews` (visual preview).
2. Render paralel (matrix frame range) + `ffmpeg concat` + QA durasi = VO.
3. Render Short penuh, lalu Long; QA lulus; unduh MP4.
4. Uji `regenerate_audio` (Kokoro) di Actions.
5. Gaya referensi: terima klip referensi, `measure.py`, `styles/<nama>.md`, cocokkan still.
6. Cabut token GitHub setelah selesai (pemilik).

## Gaya referensi (sesi 1)
- Klip referensi pertama (1080x1920, 79 s, siluet hangat "kelir") sudah diukur → `styles/kelir-malam.md` (luminans, warna, caption, pacing, audio -14 LUFS).
- Ide: komposisi `Kelir` 2D/SVG tanpa WebGL (lebih cepat dirender); belum dibangun/diuji.
- Hanya gaya yang ditiru; bukan cerita/karakter/judul/akun/frame referensi.
