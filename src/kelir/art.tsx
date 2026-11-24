import React from "react";
import { useScene } from "./fmt";

// Warna diukur dari klip referensi (lihat styles/kelir-malam.md)
export const INK = "#0c0503";

const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const Backdrop: React.FC<{ mode: "warm" | "night"; glow?: [number, number]; frame?: number }> = ({ mode, glow = [540, 820], frame = 0 }) => {
  const { W, H, GY, k, wide, X, Y } = useScene();
  const warm = mode === "warm";
  const stops = warm
    ? [["0", "#f0c070"], ["0.32", "#d98e3f"], ["0.68", "#7a3c14"], ["1", "#1d0d05"]]
    : [["0", "#6d4b3b"], ["0.4", "#3a2523"], ["0.8", "#170c0b"], ["1", "#0b0402"]];
  const pulse = 1 + 0.015 * Math.sin(frame / 23);
  const g = wide ? 54 : 64;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="kglow" cx={X(glow[0])} cy={Y(glow[1])} r={(wide ? 1250 : 1050) * pulse} gradientUnits="userSpaceOnUse">
          {stops.map(([o, c]) => <stop key={o} offset={o} stopColor={c} />)}
        </radialGradient>
        <pattern id="kgrid" width={g} height={g} patternUnits="userSpaceOnUse">
          <path d={`M${g} 0H0V${g}`} fill="none" stroke={warm ? "#6b3a14" : "#2a1a14"} strokeOpacity={warm ? 0.3 : 0.5} strokeWidth="2" />
        </pattern>
        <linearGradient id="kfloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a0c06" />
          <stop offset="1" stopColor="#040101" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#kglow)" />
      <rect width={W} height={GY} fill="url(#kgrid)" />
      <rect y={GY} width={W} height={H - GY} fill="url(#kfloor)" />
    </svg>
  );
};

export const Vignette: React.FC = () => {
  const { W, H, GY } = useScene();
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <defs>
        <radialGradient id="kvig" cx={W / 2} cy={GY * 0.72} r={Math.max(W, H) * 0.58} gradientUnits="userSpaceOnUse">
          <stop offset="0.45" stopColor="#050201" stopOpacity="0" />
          <stop offset="1" stopColor="#050201" stopOpacity="0.9" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#kvig)" />
    </svg>
  );
};

export const Dust: React.FC<{ frame: number; n?: number }> = ({ frame, n = 30 }) => {
  const { W, H } = useScene();
  const span = H * 0.78;
  const cnt = W > H ? Math.round(n * 1.6) : n;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: cnt }, (_, i) => {
        const x = (rnd(i) * W + Math.sin(frame / (40 + i) + i) * 18 + frame * (0.12 + rnd(i + 9) * 0.2)) % W;
        const y = H * 0.82 - ((rnd(i + 3) * span + frame * (0.25 + rnd(i + 5) * 0.45)) % span);
        const r = 1.3 + rnd(i + 7) * 2.6;
        return <circle key={i} cx={x} cy={y} r={r} fill="#f3d9a0" opacity={0.18 + rnd(i + 11) * 0.4} />;
      })}
    </svg>
  );
};

// ---------- siluet ----------
const Glow: React.FC<{ id: string; color?: string }> = ({ id, color = "#ffcf7a" }) => (
  <radialGradient id={id}>
    <stop offset="0" stopColor={color} stopOpacity="0.9" />
    <stop offset="0.35" stopColor={color} stopOpacity="0.35" />
    <stop offset="1" stopColor={color} stopOpacity="0" />
  </radialGradient>
);

export const BarredWindow: React.FC<{ x: number; y: number; w: number; h: number; lit?: boolean; bars?: number }> = ({ x, y, w, h, lit = true, bars = 5 }) => (
  <g>
    <rect x={x - 12} y={y - 12} width={w + 24} height={h + 24} fill={INK} />
    <rect x={x} y={y} width={w} height={h} fill={lit ? "#f2b45a" : "#2a160b"} />
    {Array.from({ length: bars }, (_, i) => (
      <rect key={i} x={x + ((i + 1) * w) / (bars + 1) - 4} y={y} width={8} height={h} fill={INK} />
    ))}
    <rect x={x} y={y + h / 2 - 4} width={w} height={8} fill={INK} />
  </g>
);

export const House: React.FC<{ x: number; y: number; s?: number; frame?: number }> = ({ x, y, s = 1, frame = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill={INK}>
    <rect x={-60} y={-505} width={120} height={32} />
    <path d="M-330 -330 L-250 -470 L250 -470 L330 -330 Z" />
    <path d="M-430 -240 L-330 -345 L330 -345 L430 -240 Z" />
    <rect x={-300} y={-250} width={600} height={250} />
    <rect x={-330} y={-260} width={22} height={260} />
    <rect x={308} y={-260} width={22} height={260} />
    <BarredWindow x={-210} y={-200} w={130} h={110} lit />
    <rect x={30} y={-190} width={120} height={190} fill="#1a0b05" />
    <rect x={40} y={-180} width={100} height={170} fill={INK} />
  </g>
);

export const Lantern: React.FC<{ x: number; y: number; s?: number; frame?: number; glowR?: number; id?: string }> = ({ x, y, s = 1, frame = 0, glowR = 260, id = "kl" }) => {
  const fl = 0.85 + 0.12 * Math.sin(frame / 3.1) + 0.06 * Math.sin(frame / 1.7 + 2);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs><Glow id={id} /></defs>
      <circle cx={0} cy={-430} r={glowR * fl} fill={`url(#${id})`} />
      <g fill={INK}>
        <rect x={-8} y={-440} width={16} height={440} />
        <rect x={-30} y={-6} width={60} height={12} />
        <path d="M-44 -480 L0 -515 L44 -480 Z" />
        <rect x={-36} y={-482} width={72} height={8} />
        <rect x={-36} y={-400} width={72} height={8} />
      </g>
      <rect x={-28} y={-474} width={56} height={72} fill="#ffd98a" opacity={0.75 + 0.25 * fl} />
      <rect x={-30} y={-474} width={5} height={72} fill={INK} />
      <rect x={25} y={-474} width={5} height={72} fill={INK} />
      <rect x={-3} y={-474} width={6} height={72} fill={INK} />
    </g>
  );
};

export const Figure: React.FC<{ x: number; y: number; s?: number; walk?: number; suitcase?: boolean; flip?: boolean; tilt?: number; kind?: "woman" | "man"; stoop?: boolean; cane?: boolean }> = ({ x, y, s = 1, walk = 0, suitcase = false, flip = false, tilt = 0, kind = "woman", stoop = false, cane = false }) => {
  const sw = Math.sin(walk) * 14;
  const man = kind === "man";
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`} fill={INK} stroke={INK}>
      <g transform={stoop ? "rotate(-7 0 0)" : undefined}>
        <path d={man ? "M-46 -172 L46 -172 L40 -92 L50 0 L-50 0 L-40 -92 Z" : "M-40 -172 L40 -172 L32 -92 L54 0 L-54 0 L-32 -92 Z"} stroke="none" />
        <g transform={`rotate(${tilt + (stoop ? 12 : 0)} 0 -205)`}>
          <rect x={-9} y={-196} width={18} height={30} stroke="none" />
          <circle cx={0} cy={-212} r={30} stroke="none" />
          {man ? <rect x={-24} y={-248} width={48} height={22} rx={5} stroke="none" /> : <circle cx={-24} cy={-226} r={17} stroke="none" />}
        </g>
        <line x1={-42} y1={-168} x2={-52 - sw} y2={-92} strokeWidth={17} strokeLinecap="round" />
        <line x1={42} y1={-168} x2={52 + sw} y2={-92} strokeWidth={17} strokeLinecap="round" />
        {suitcase ? (
          <g stroke="none">
            <rect x={44} y={-100} width={70} height={52} rx={6} />
            <path d="M62 -100 V-114 H96 V-100" fill="none" stroke={INK} strokeWidth={7} />
          </g>
        ) : null}
      </g>
      {cane ? <line x1={66} y1={-98} x2={78} y2={0} strokeWidth={9} strokeLinecap="round" /> : null}
    </g>
  );
};

export const Tree: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill={INK}>
    <path d="M-50 0 L-26 -300 L26 -300 L50 0 Z" />
    <ellipse cx={0} cy={-380} rx={230} ry={130} />
    <ellipse cx={-150} cy={-320} rx={130} ry={90} />
    <ellipse cx={160} cy={-330} rx={140} ry={95} />
    {[-190, -120, -60, 40, 110, 190].map((dx, i) => (
      <rect key={i} x={dx} y={-300} width={5} height={110 + (i % 3) * 50} />
    ))}
  </g>
);

export const Door: React.FC<{ x: number; y: number; w?: number; h?: number; leak?: boolean; frame?: number }> = ({ x, y, w = 300, h = 640, leak = true, frame = 0 }) => (
  <g>
    <rect x={x - 26} y={y - h - 40} width={w + 52} height={h + 40} fill={INK} />
    <rect x={x} y={y - h} width={w} height={h} fill="#1c0d06" />
    {Array.from({ length: 5 }, (_, i) => (
      <rect key={i} x={x + (i * w) / 5 + 2} y={y - h} width={w / 5 - 6} height={h} fill={INK} />
    ))}
    <rect x={x} y={y - h * 0.62} width={w} height={14} fill={INK} />
    <rect x={x} y={y - h * 0.3} width={w} height={14} fill={INK} />
    <circle cx={x + w - 34} cy={y - h * 0.5} r={12} fill="#7a4a1c" />
    {leak ? <rect x={x + 6} y={y - 8} width={w - 12} height={6} fill="#f2b45a" opacity={0.6 + 0.2 * Math.sin(frame / 5)} /> : null}
  </g>
);
