import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/AlegreyaSans";
import { loadFont as loadSC } from "@remotion/google-fonts/AlegreyaSC";
import timing from "../../episodes/kelir1/timing.json";
import script from "../../episodes/kelir1/script.json";
import { Dust, Vignette } from "./art";
import { SCENES } from "./scenes";

const sans = loadSans("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily;
const sc = loadSC("normal", { weights: ["500"], subsets: ["latin"] }).fontFamily;

export const TAIL = 0.6; // detik setelah akhir (konstanta sama di tools/expected_duration.py)
export const kelirFrames = (fps: number) => Math.ceil((timing.total + TAIL) * fps);

export const kelirSpans = (fps: number) =>
  timing.shots.map((s, i) => {
    const a = i === 0 ? 0 : Math.round(s.start * fps);
    const b = i + 1 < timing.shots.length ? Math.round(timing.shots[i + 1].start * fps) : kelirFrames(fps);
    return { id: s.id, from: a, dur: Math.max(1, b - a) };
  });

const lerp = (p: number[], t: number) => p[0] + (p[1] - p[0]) * t;

const Header: React.FC = () => (
  <div style={{ position: "absolute", top: 118, left: 0, right: 0, textAlign: "center", fontFamily: sc, fontWeight: 500, fontSize: 30, letterSpacing: "0.17em", color: "#93826e" }}>
    {script.title} · BAGIAN {script.part}
  </div>
);

export const KelirShot: React.FC<{ id: number; dur: number }> = ({ id, dur }) => {
  const f = useCurrentFrame();
  const S = script.shots.find((x) => x.id === id)!;
  const Scene = SCENES[S.scene];
  const t = f / Math.max(1, dur - 1);
  const fade = Math.min(
    interpolate(f, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [dur - 10, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const isEnd = S.scene === "end";
  return (
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
      <Header />
      {isEnd ? (
        <div style={{ position: "absolute", top: 880, left: 0, right: 0, textAlign: "center" }}>
          <div style={{ fontFamily: sc, fontWeight: 500, fontSize: 64, letterSpacing: "0.2em", color: "#8a7a66" }}>Bersambung</div>
          <div style={{ fontFamily: sc, fontWeight: 500, fontSize: 28, letterSpacing: "0.2em", color: "#6a5c4c", marginTop: 26 }}>BAGIAN {script.part + 1}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// Caption per kalimat: blok 1-2 baris di 70,7%-76,3% tinggi frame (y 1357-1465 px)
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const ln = timing.lines.find((l) => t >= l.start - 0.05 && t < l.end + 0.4);
  if (!ln) return null;
  const a =
    interpolate(t, [ln.start - 0.05, ln.start + 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
    interpolate(t, [ln.end + 0.1, ln.end + 0.4], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute", top: 1340, left: 50, width: 980, textAlign: "center",
        fontFamily: sans, fontWeight: 500, fontSize: 47, lineHeight: "64px",
        color: ln.em ? "#dfa351" : "#e9ddc2", opacity: a, textShadow: "0 2px 14px rgba(0,0,0,0.75)",
      }}
    >
      {ln.text}
    </div>
  );
};

export const Kelir: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#050201" }}>
      {kelirSpans(fps).map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={"shot " + s.id}>
          <KelirShot id={s.id} dur={s.dur} />
        </Sequence>
      ))}
      <Captions />
      <Audio src={staticFile("kelir1/mix.wav")} />
    </AbsoluteFill>
  );
};

export const KelirShotStill: React.FC<{ id: number }> = ({ id }) => {
  const { fps } = useVideoConfig();
  const s = kelirSpans(fps).find((x) => x.id === id)!;
  return <KelirShot id={id} dur={s.dur} />;
};
