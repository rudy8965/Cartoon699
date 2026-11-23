#!/usr/bin/env python3
"""Durasi MP4 penuh yang diharapkan = ceil((timing.total + TAIL) * fps) / fps.
TAIL harus sama dengan konstanta di src/ep1/Episode.tsx (0.7) dan src/ep1/Long.tsx (1.2)."""
import json, math, sys
comp = sys.argv[1] if len(sys.argv) > 1 else "Short"
ep, tail = ("ep1long", 1.2) if comp == "Long" else ("ep1", 0.7)
total = json.load(open(f"episodes/{ep}/timing.json"))["total"]
fps = 30
print(f"{math.ceil((total + tail) * fps) / fps:.3f}")
