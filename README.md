# Cartoon-Studio (RH Cartoon Studio)

Sistem produksi kartun 3D sinematik: Three.js + Playwright + FFmpeg + GitHub Actions.
Format: Shorts 9:16 dan Long 16:9. Progres & rencana: [docs/PROGRESS.md](docs/PROGRESS.md).

## Render lokal
```
npm ci && npx playwright install chromium
npm run render -- --mode shorts --duration 10 --preview
python3 tools/qa.py out/preview.mp4 --mode shorts
```

## GitHub Actions
Actions -> "Render Cartoon Video" -> Run workflow. Hasil MP4 ada di Artifacts.
