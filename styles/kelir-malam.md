# Gaya "Kelir" (siluet hangat berlatar cahaya) — diukur dari 1 klip referensi

Sumber ukur: 1 klip Shorts horor-misteri Jawa, 79,17 s (kanal referensi: "Kelir Malam"). **Hanya gaya yang ditiru.** Jangan menyalin cerita, karakter, judul seri, teks, watermark/akun, atau frame-nya.
Semua angka diukur dengan ffmpeg/PIL dari klip; tanda (~) berarti estimasi dari pengamatan frame.

## Teknis
- 1080x1920, 30 fps, h264 ±668 kbps (video), AAC 44,1 kHz stereo 64 kbps. Durasi 79,2 s.
- Loudness -14,0 LUFS, LRA 5,4 LU. Audio tanpa jeda sunyi >0,4 s (ada bed musik/ambience terus-menerus di bawah narasi).
- Energi audio: bass(<200 Hz) -20,2 dB, mid(200–3000 Hz) -20,0 dB, high(>3 kHz) -30,4 dB → gelap/hangat, drone-ambient.

## Pacing & kamera
- 8 cut keras (scene>0,25) + total 16 perubahan adegan (>0,08) dalam 79 s → rata-rata 1 perubahan tiap ±5 s; teks caption berganti tiap ±3–4 s.
- Pergantian shot banyak berupa fade/dissolve lembut; pada satu adegan kamera hanya merayap pelan (push-in/drift) dengan debu halus melayang.
- Selisih rata-rata antar-detik: 15,4 (median 9,6) → gerak lambat, bukan aksi cepat.
- Tidak ada goncangan kamera. Komposisi: siluet besar di tengah/sepertiga, banyak ruang kosong; lantai hitam di bawah.

## Cahaya & warna (angka diukur)
- Luminans rata-rata 42,4/255. Piksel <10: 36,6%; <20: 54,3%; <40: 63,7%; >200: hanya 0,6% (low-key).
- Highlight (3% teratas) `#d7bb8b`; midtone `#241309`; bayangan dalam `#0b0402` (merah-cokelat sangat gelap, bukan hitam netral).
- Hue dominan ±25° (oranye-amber), saturasi rata-rata 0,66.
- Latar = "layar kelir": gradien glow hangat (pusat paling terang, ±`#e8a850`–`#d7bb8b`) + tekstur kertas berpetak/kisi tipis + vignette gelap kuat di tepi dan lantai.
- Objek & karakter = **siluet datar gelap tanpa outline, tanpa wajah**; detail hanya lewat bentuk (jendela berjeruji, kurungan, ranjang, pintu).
- Adegan eksterior malam: langit gelap-ungu kecokelatan, rumah siluet, kabut tipis.
- Lantai/bawah frame: y 1100 px lum 116 → y 1300: 15 → y 1900: 4 (≈ 60–100% tinggi frame hampir hitam; area ini dipakai untuk caption).

## Tipografi (1080x1920)
- **Header seri** (~): kecil, serif small-caps, tracking lebar, ±7% dari atas, rata tengah, warna `#93826e` (krem redup). Teks pendek "<JUDUL> · BAGIAN n". Padanan Google Fonts: *Alegreya SC* / *Cormorant SC*.
- **Caption** (~): 1–2 baris, rata tengah, blok di y 70,7%–76,3% dari atas (y 1357–1465 px), margin kiri/kanan ±50 px. Tinggi huruf ±35 px, jarak baris 64 px → ukuran font ±46–48 px, line-height ≈ 1,35. Sans humanis (padanan: *Alegreya Sans* medium).
- Warna caption normal krem `#e9ddc2`; baris penekanan/dialog kunci amber `#dfa351`; kadang abu redup untuk narasi tenang. Tanpa outline tebal; sedikit bayangan lembut.
- Frame penutup: "Bersambung" serif tracking lebar, di tengah, latar hitam.
- Pintar: caption tampil per kalimat (bukan per kata).

## Pemetaan ke engine (rencana)
- Komposisi baru `Kelir` (Remotion, 2D/SVG + CSS, tanpa WebGL): lapisan latar gradien + kisi kertas + vignette + debu; siluet SVG; kamera = transform scale/translate per shot (`from → to`); fade antar-shot 10–15 frame.
- Keuntungan: tanpa WebGL render jauh lebih cepat (perkiraan 10–25x dibanding ±5 s/frame untuk 3D di CPU) — perlu dibuktikan lewat uji.
- Audio: narasi + bed ambience (drone gelap) dimix ke -14 LUFS (`loudnorm=I=-14:LRA=7`), tanpa jeda sunyi.

## Cara memverifikasi kemiripan
1. Render still tiap tipe shot → bandingkan berdampingan dengan frame referensi.
2. Ukur ulang dengan skrip yang sama (luminans, highlight/shadow, % piksel gelap) dan cocokkan dalam ±10%.
3. Cek posisi caption (70,7–76,3%) dan warna (#e9ddc2 / #dfa351).
