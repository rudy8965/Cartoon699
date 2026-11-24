#!/usr/bin/env python3
"""Voice-over Indonesia + timing + mixing untuk komposisi Kelir.

  python3 scripts/kelir_voice.py kelir1

Alur: tiap baris naskah disintesis TERPISAH -> durasi persis diukur -> dirangkai di timeline
(lead-in, jeda antar baris/shot) -> episodes/<ep>/timing.json + public/<ep>/voice.wav -> mix.wav
(ambience drone gelap, ducking di bawah suara, loudnorm -14 LUFS).
Durasi video = timing.total + TAIL, jadi voice-over tidak pernah terpotong.

Mesin suara: edge-tts (id-ID-ArdiNeural) -> fallback espeak-ng (-v id) -> mode uji KELIR_FAKE=1 (nada).
Voice-over buatan sendiri: taruh public/<ep>/voice.wav + timing.json lalu jalankan dengan --mix-only.
"""
import asyncio, json, os, pathlib, subprocess, sys, wave

EP = next((a for a in sys.argv[1:] if not a.startswith("--")), "kelir1")
MIX_ONLY = "--mix-only" in sys.argv
FAKE = os.environ.get("KELIR_FAKE") == "1"
root = pathlib.Path("episodes") / EP
out = pathlib.Path("public") / EP
out.mkdir(parents=True, exist_ok=True)
tmp = pathlib.Path(os.environ.get("TMPDIR", "/tmp")) / ("tts_" + EP)
tmp.mkdir(parents=True, exist_ok=True)

SR = 44100
LEAD, GAP_LINE, GAP_SHOT, TAIL = 0.9, 0.55, 1.0, 0.6
script = json.load(open(root / "script.json"))
voice = script.get("voice", "id-ID-ArdiNeural")


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(" ".join(cmd[:3]) + " gagal: " + r.stderr[-600:])
    return r.stdout


def wav_dur(p):
    with wave.open(str(p)) as w:
        return w.getnframes() / w.getframerate()


def to_wav(src, dst):
    run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le", str(dst)])


def synth_fake(text, dst):
    d = max(0.8, len(text.split()) * 0.42)
    run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"sine=f=180:d={d:.3f}", "-af", "volume=0.3", "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le", str(dst)])


async def _edge(text, dst):
    import edge_tts
    await edge_tts.Communicate(text, voice, rate=script.get("rate", "-8%"), pitch=script.get("pitch", "-4Hz")).save(str(dst))


def synth_edge(text, dst):
    mp3 = dst.with_suffix(".mp3")
    asyncio.run(_edge(text, mp3))
    to_wav(mp3, dst)


def synth_espeak(text, dst):
    raw = dst.with_suffix(".raw.wav")
    run(["espeak-ng", "-v", "id", "-s", "135", "-p", "35", "-w", str(raw), text])
    to_wav(raw, dst)


lines = []
for sh in script["shots"]:
    for j, ln in enumerate(sh["lines"]):
        lines.append(dict(shot=sh["id"], text=ln["t"], say=ln.get("say", ln["t"]), em=bool(ln.get("em")), first=(j == 0)))

if not MIX_ONLY:
    engines = [("fake", synth_fake)] if FAKE else [("edge-tts", synth_edge), ("espeak-ng", synth_espeak)]
    chosen = None
    for name, fn in engines:
        try:
            fn(lines[0]["say"], tmp / "probe.wav")
            chosen = (name, fn)
            break
        except Exception as e:  # noqa
            print(f"[voice] mesin {name} gagal: {str(e)[:300]}", file=sys.stderr)
    if not chosen:
        sys.exit("Tidak ada mesin TTS yang bekerja")
    engine, synth = chosen
    print("[voice] mesin:", engine)

    durs = []
    for i, l in enumerate(lines):
        p = tmp / f"l{i}.wav"
        synth(l["say"], p)
        durs.append(wav_dur(p))

    # timeline
    t = LEAD
    for i, l in enumerate(lines):
        l["start"], l["end"] = round(t, 3), round(t + durs[i], 3)
        nxt = lines[i + 1] if i + 1 < len(lines) else None
        t = l["end"] + (GAP_SHOT if (nxt is None or nxt["first"]) else GAP_LINE)
    shots, last_t = [], 0.0
    for sh in script["shots"]:
        ls = [l for l in lines if l["shot"] == sh["id"]]
        if ls:
            shots.append({"id": sh["id"], "start": 0.0 if not shots else ls[0]["start"]})
            last_t = ls[-1]["end"]
        else:  # shot penutup tanpa narasi (end card)
            shots.append({"id": sh["id"], "start": round(last_t + 0.8, 3)})
            last_t = last_t + 0.8 + float(sh.get("hold", 3.0))
    total = round(last_t, 3)

    # rangkai suara ke timeline (mono PCM)
    buf = bytearray()
    pos = 0.0
    for i, l in enumerate(lines):
        gap = l["start"] - pos
        buf += b"\x00\x00" * int(round(gap * SR))
        with wave.open(str(tmp / f"l{i}.wav")) as w:
            buf += w.readframes(w.getnframes())
        pos = l["start"] + durs[i]
    buf += b"\x00\x00" * int(round((total + TAIL - pos) * SR))
    with wave.open(str(out / "voice.wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(bytes(buf))

    json.dump(
        {"voice": voice if engine == "edge-tts" else engine, "engine": engine, "total": total, "shots": shots,
         "lines": [{k: l[k] for k in ("shot", "text", "em", "start", "end")} for l in lines]},
        open(root / "timing.json", "w"), ensure_ascii=False, indent=1,
    )
    print(f"[voice] total {total}s, {len(lines)} baris")

timing = json.load(open(root / "timing.json"))
D = timing["total"] + TAIL
fg = (
    f"[1:a]volume=0.5[a1];[2:a]volume=0.32[a2];[3:a]lowpass=f=420,volume=0.55[a3];"
    f"[a1][a2][a3]amix=inputs=3:normalize=0,tremolo=f=0.13:d=0.35,"
    f"afade=t=in:d=2.5,afade=t=out:st={D-2.5:.3f}:d=2.5,volume=0.8[amb];"
    "[0:a]highpass=f=70,pan=stereo|c0=c0|c1=c0,equalizer=f=220:t=q:w=1:g=2,aecho=0.8:0.55:70:0.18,asplit=2[vo][vsc];"
    "[amb][vsc]sidechaincompress=threshold=0.02:ratio=8:attack=25:release=500[ambd];"
    "[ambd][vo]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=7[m]"
)
run([
    "ffmpeg", "-v", "error", "-y", "-i", str(out / "voice.wav"),
    "-f", "lavfi", "-t", f"{D:.3f}", "-i", "sine=f=55:r=44100",
    "-f", "lavfi", "-t", f"{D:.3f}", "-i", "sine=f=82.41:r=44100",
    "-f", "lavfi", "-t", f"{D:.3f}", "-i", "anoisesrc=c=brown:a=0.5:r=44100",
    "-filter_complex", fg, "-map", "[m]", "-t", f"{D:.3f}", "-ar", str(SR), "-ac", "2", "-c:a", "pcm_s16le", str(out / "mix.wav"),
])
print(f"[mix] {out/'mix.wav'}  durasi {D:.2f}s")
