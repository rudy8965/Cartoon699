# Cartoon-Studio (RH Cartoon Studio)

Kartun 3D sinematik dibuat dari kode: Three.js + Remotion, suara Kokoro lokal, musik dari kode, FFmpeg, GitHub Actions.
Durasi video = durasi voice-over (`timing.total` + ekor), sehingga VO tidak terpotong.
Progres & rencana: [docs/PROGRESS.md](docs/PROGRESS.md). Alur kerja engine: [.claude/skills/animated-shorts/SKILL.md](.claude/skills/animated-shorts/SKILL.md).

## Struktur
- `src/engine/` mesin (Stage, karakter 2D di dunia 3D, kit objek, caption)
- `src/ep1/`, `episodes/ep1*/`, `public/ep1*/` episode contoh (Short 9:16 + Long 16:9)
- `scripts/` voice (Kokoro), sound, stills, measure
- `tools/qa.py` QA MP4 (resolusi, codec, durasi vs VO, audio, frame hitam)
- `legacy/` prototipe awal Playwright (disimpan, tidak dihapus)

## Render lokal
```
npm ci --onnxruntime-node-install-cuda=skip
node scripts/stills.mjs 1 2 3          # cek still dulu
npx remotion render src/index.ts Short out/Short.mp4 --codec=h264 --crf=18
python3 tools/qa.py out/Short.mp4 --mode shorts --expect-duration $(python3 tools/expected_duration.py Short) --require-audio
```

## GitHub Actions
Actions -> "Render Episode (Remotion)" -> Run workflow (pilih Short/Long, preview 8 detik dulu). MP4 ada di Artifacts.
