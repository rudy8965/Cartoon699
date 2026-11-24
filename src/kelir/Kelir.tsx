import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/AlegreyaSans";
import { loadFont as loadSC } from "@remotion/google-fonts/AlegreyaSC";
import { Dust, Vignette } from "./art";
import { SCENES } from "./scenes";
import { Fmt, FmtCtx } from "./fmt";
import type { EpData } from "./episodes";

const sans = loadSans("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;
const sc = loadSC("normal", { weights: ["500"], subsets: ["latin"] }).fontFamily;

// Durasi video = durasi voice-over (timing.total) + tail. Tail harus sama dengan tools/expected_duration.py
export const kelirFrames = (ep: EpData, fps: number) => Math.ceil((ep.timing.total + ep.tail) * fps);

export const kelirSpans = (ep: EpData, fps: number) =>
  ep.timing.shots.map((s, i) => {
    const a = i === 0 ? 0 : Math.round(s.start * fps);
    const b = i + 1 < ep.timing.shots.length ? Math.round(ep.timing.shots[i + 1].start * fps) : kelirFrames(ep, fps);
    return { id: s.id, from: a, dur: Math.max(1, b - a) };
  });

const lerp = (p: number[], t: number) => p[0] + (p[1] - p[0]) * t;

// Tata letak teks per format. Portrait mengikuti angka referensi (caption di 70,7%-76,3% tinggi frame).
const layout = (f: Fmt) =>
  f.wide
    ? { head: { top: 54, size: 26 }, cap: { top: 842, left: 180, width: 1560, size: 46, lh: 58 }, endTop: 440, endSize: 62 }
    : { head: { top: 118, size: 30 }, cap: { top: 1340, left: 50, width: 980, size: 56, lh: 64 }, endTop: 880, endSize: 64 };

export const KelirShot: React.FC<{ ep: EpData; fmt: Fmt; id: number; dur: number }> = ({ ep, fmt, id, dur }) => {
  const f = useCurrentFrame();
  const S = ep.shots.find((x) => x.id === id)!;
  const Scene = SCENES[S.scene];
  const L = layout(fmt);
  const t = f / Math.max(1, dur - 1);
  const fade = Math.min(
    interpolate(f, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const isEnd = S.scene === "end";
  return (
    <FmtCtx.Provider value={fmt}>
      <AbsoluteFill style={{ opacity: fade, backgroundColor: "#050201" }}>
        <div
          style={{
            position: "absolute", inset: 0,
            transform: `translate(${lerp(S.cam.x, t)}px, ${lerp(S.cam.y, t)}px) scale(${lerp(S.cam.s, t)})`,
            transformOrigin: `${S.cam.o[0]}% ${S.cam.o[1]}%`,
          }}
        >
          <Scene frame={f} t={t} />
        </div>
        {isEnd ? null : <Dust frame={f} />}
        <Vignette />
        <div style={{ position: "absolute", top: L.head.top, left: 0, right: 0, textAlign: "center", fontFamily: sc, fontWeight: 500, fontSize: L.head.size, letterSpacing: "0.17em", color: "#93826e" }}>
          {ep.title} · BAGIAN {ep.part}
        </div>
        {isEnd ? (
          <div style={{ position: "absolute", top: L.endTop, left: 0, right: 0, textAlign: "center" }}>
            <div style={{ fontFamily: sc, fontWeight: 500, fontSize: L.endSize, letterSpacing: "0.2em", color: "#8a7a66" }}>Bersambung</div>
            <div style={{ fontFamily: sc, fontWeight: 500, fontSize: L.endSize * 0.44, letterSpacing: "0.2em", color: "#6a5c4c", marginTop: 26 }}>
              BAGIAN {ep.next ?? (typeof ep.part === "number" ? ep.part + 1 : "")}
            </div>
          </div>
        ) : null}
      </AbsoluteFill>
    </FmtCtx.Provider>
  );
};

// Caption per kalimat, 1-2 baris, rata tengah.
const Captions: React.FC<{ ep: EpData; fmt: Fmt }> = ({ ep, fmt }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const ln = ep.timing.lines.find((l) => t >= l.start - 0.05 && t < l.end + 0.4);
  if (!ln) return null;
  const C = layout(fmt).cap;
  const a =
    interpolate(t, [ln.start - 0.05, ln.start + 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    interpolate(t, [ln.end + 0.1, ln.end + 0.4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute", top: C.top, left: C.left, width: C.width, textAlign: "center",
        fontFamily: sans, fontWeight: 500, fontSize: C.size, lineHeight: `${C.lh}px`,
        color: ln.em ? "#dfa351" : "#e9ddc2", opacity: a, textShadow: "0 2px 14px rgba(0,0,0,0.75)",
      }}
    >
      {ln.text}
    </div>
  );
};

export const KelirVideo: React.FC<{ ep: EpData; fmt: Fmt }> = ({ ep, fmt }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#050201" }}>
      {kelirSpans(ep, fps).map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={"shot " + s.id}>
          <KelirShot ep={ep} fmt={fmt} id={s.id} dur={s.dur} />
        </Sequence>
      ))}
      <FmtCtx.Provider value={fmt}>
        <Captions ep={ep} fmt={fmt} />
      </FmtCtx.Provider>
      <Audio src={staticFile(`${ep.id}/mix.wav`)} />
    </AbsoluteFill>
  );
};

export const KelirShotStill: React.FC<{ ep: EpData; fmt: Fmt; id: number }> = ({ ep, fmt, id }) => {
  const { fps } = useVideoConfig();
  const s = kelirSpans(ep, fps).find((x) => x.id === id)!;
  return <KelirShot ep={ep} fmt={fmt} id={id} dur={s.dur} />;
};
