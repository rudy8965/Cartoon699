# Kelir — cara membuat video (branch `kelir`)

Komposisi 2D siluet bergaya "kelir" (layar bayangan hangat), cerita orisinal, voice-over Indonesia.
Durasi video = durasi voice-over + 0,6 detik (suara tidak pernah terpotong).

## Berkas yang dibutuhkan
| Berkas | Fungsi |
|---|---|
| `episodes/kelir1/script.json` | Naskah: shot, scene, kamera (`cam`), baris narasi (`em` = penekanan amber) |
| `episodes/kelir1/timing.json` | Timing hasil voice (dibuat otomatis; ikut di-commit) |
| `public/kelir1/voice.wav`, `mix.wav` | Suara & mix hasil CI (opsi `save_assets`); dibuat ulang oleh `kelir_voice.py` |
| `src/kelir/art.tsx`, `scenes.tsx`, `Kelir.tsx` | Seni SVG, scene, komposisi Remotion (header, caption, kamera, fade) |
| `src/Root.tsx` | Komposisi `Kelir` (video) dan `KelirShot` (still per shot) |
| `scripts/kelir_voice.py` | TTS (edge-tts id-ID-ArdiNeural, cadangan espeak-ng) -> timing -> mix -14 LUFS |
| `scripts/kelir_stills.mjs` | Still tiap shot untuk cek visual |
| `tools/qa.py`, `tools/expected_duration.py` | QA otomatis (resolusi, codec, durasi=VO, audio, frame hitam) |
| `.github/workflows/render-kelir.yml` | Workflow render |
| `styles/kelir-malam.md` | Angka gaya hasil ukur dari klip referensi |
| `requirements.txt`, `package.json` | Dependensi Python / Node |

Klip referensi dan frame-nya **tidak** disimpan di repo (hak cipta pemilik aslinya); hanya angka ukurnya di `styles/kelir-malam.md`.

## Render lewat GitHub Actions
Actions -> **Render Kelir** -> Run workflow (pilih branch `kelir`):
- `preview` dicentang: 10 detik pertama (cek cepat). Tidak dicentang: render penuh.
- `save_assets` dicentang: voice.wav, mix.wav, timing.json hasil CI disimpan ke branch.
- Render penuh juga membuat **GitHub Release** berisi `Kelir.mp4` (unduhan permanen). Artifact `kelir-video` hanya 7 hari.
- Gambar kontak/still/loudness ada di branch `previews`.

## Render lokal
```
npm ci --onnxruntime-node-install-cuda=skip
python3 -m pip install -r requirements.txt
python3 scripts/kelir_voice.py kelir1          # butuh internet (edge-tts) dan ffmpeg
node scripts/kelir_stills.mjs 45               # opsional: still per shot di out/stills
npx remotion render src/index.ts Kelir out/Kelir.mp4 --codec=h264 --crf=18
python3 tools/qa.py out/Kelir.mp4 --mode shorts --expect-duration $(python3 tools/expected_duration.py Kelir) --require-audio
```
Voice-over buatan sendiri: taruh `public/kelir1/voice.wav` (mono 44,1 kHz) + `episodes/kelir1/timing.json`, lalu `python3 scripts/kelir_voice.py kelir1 --mix-only`.

## Menambah episode
Salin `episodes/kelir1` -> `episodes/kelir2`, ubah naskah, dan arahkan impor di `src/kelir/Kelir.tsx` (saat ini tetap ke `kelir1`).

## Batasan diketahui
- edge-tts adalah layanan tidak resmi; bisa berubah. Cadangan: espeak-ng (robotik) atau voice buatan sendiri.
- Animasi karakter masih sederhana; transisi masih fade-through-black.
