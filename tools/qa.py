#!/usr/bin/env python3
"""QA MP4: resolusi, codec, durasi, audio, frame hitam. Exit 1 jika gagal."""
import argparse, json, re, subprocess, sys

ap = argparse.ArgumentParser()
ap.add_argument("file")
ap.add_argument("--mode", choices=["shorts", "long"], default="shorts")
ap.add_argument("--expect-duration", type=float, help="detik (mis. durasi voice-over)")
ap.add_argument("--tolerance", type=float, default=0.1)
ap.add_argument("--require-audio", action="store_true")
a = ap.parse_args()

def run(cmd): return subprocess.run(cmd, capture_output=True, text=True)

r = run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", a.file])
if r.returncode: print("FAIL: file tidak terbaca:", r.stderr.strip()); sys.exit(1)
info = json.loads(r.stdout)
v = next((s for s in info["streams"] if s["codec_type"] == "video"), None)
au = next((s for s in info["streams"] if s["codec_type"] == "audio"), None)
errs = []
if not v: errs.append("tidak ada stream video")
else:
    ok_res = [(1280, 720), (1920, 1080)] if a.mode == "long" else [(720, 1280), (1080, 1920)]
    if (v["width"], v["height"]) not in ok_res: errs.append(f"resolusi {v['width']}x{v['height']} tidak di {ok_res}")
    if v["codec_name"] != "h264": errs.append(f"codec {v['codec_name']} != h264")
    if v.get("pix_fmt") != "yuv420p": errs.append(f"pix_fmt {v.get('pix_fmt')} != yuv420p")
dur = float(info["format"]["duration"])
if a.expect_duration is not None and abs(dur - a.expect_duration) > a.tolerance:
    errs.append(f"durasi {dur:.2f}s != {a.expect_duration:.2f}s (+/-{a.tolerance})")
if a.require_audio and not au: errs.append("audio tidak ada")
if au:
    ad = float(au.get("duration", dur))
    if ad - dur > a.tolerance: errs.append(f"audio ({ad:.2f}s) lebih panjang dari video ({dur:.2f}s): VO terpotong")
# frame hitam
b = run(["ffmpeg", "-v", "info", "-i", a.file, "-vf", "blackdetect=d=0.5:pix_th=0.05", "-an", "-f", "null", "-"])
black = sum(float(m) for m in re.findall(r"black_duration:([\d.]+)", b.stderr))
if black > 0.5 * dur: errs.append(f"terlalu banyak frame hitam ({black:.1f}s dari {dur:.1f}s)")
print(f"{a.file}: {v['width']}x{v['height']} {v['codec_name']} {dur:.2f}s audio={'ya' if au else 'tidak'} hitam={black:.1f}s")
if errs: print("QA GAGAL:\n - " + "\n - ".join(errs)); sys.exit(1)
print("QA LULUS")
