import React from "react";
import { Backdrop, BarredWindow, Door, Figure, House, INK, Lantern, Tree } from "./art";
import { useScene } from "./fmt";

export type SceneProps = { frame: number; t: number };

const Fog: React.FC<{ frame: number; y: number }> = ({ frame, y }) => {
  const { W, k } = useScene();
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={W * (0.25 + i * 0.26) + Math.sin(frame / 90 + i) * 60 * k} cy={y + i * 30 * k} rx={W * 0.39} ry={(34 + i * 8) * k} fill="#f0d2a8" opacity={0.045} />
      ))}
    </g>
  );
};

const Moon: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const { k } = useScene();
  return (
    <g>
      <defs>
        <radialGradient id="kmoon"><stop offset="0" stopColor="#e8c89a" stopOpacity="0.55" /><stop offset="1" stopColor="#e8c89a" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx={x} cy={y} r={230 * k} fill="url(#kmoon)" />
      <circle cx={x} cy={y} r={64 * k} fill="#d9b98a" opacity={0.6} />
    </g>
  );
};

const Layer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { W, H } = useScene();
  return <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>{children}</svg>;
};

const Path: React.FC = () => {
  const { X, Y } = useScene();
  return <polygon points={`${X(470)},${Y(1170)} ${X(610)},${Y(1170)} ${X(800)},${Y(1920)} ${X(280)},${Y(1920)}`} fill="#1b0f08" />;
};

const Tomb: React.FC<{ x: number; y: number; s: number; cross?: boolean }> = ({ x, y, s, cross }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill={INK}>
    {cross ? (
      <>
        <rect x={-10} y={-190} width={20} height={190} />
        <rect x={-46} y={-150} width={92} height={18} />
      </>
    ) : (
      <path d="M-42 0 L-42 -120 Q-42 -168 0 -168 Q42 -168 42 -120 L42 0 Z" />
    )}
    <ellipse cx={0} cy={0} rx={80} ry={10} />
  </g>
);

const Ember: React.FC<{ x: number; y: number; s: number; frame: number }> = ({ x, y, s, frame }) => {
  const fl = 0.8 + 0.2 * Math.sin(frame / 2.3);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <defs>
        <radialGradient id="kemb"><stop offset="0" stopColor="#ffb04a" stopOpacity="0.9" /><stop offset="1" stopColor="#ffb04a" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx={0} cy={-6} r={80 * fl} fill="url(#kemb)" />
      <rect x={-22} y={-14} width={44} height={14} rx={3} fill="#241209" />
      <circle cx={0} cy={-16} r={5} fill="#ffcf7a" />
    </g>
  );
};

// ---------- scene bagian 1 ----------
export const house: React.FC<SceneProps> = ({ frame }) => {
  const { X, Y, GY, k, wide } = useScene();
  return (
    <>
      <Backdrop mode="night" glow={[540, 1000]} frame={frame} />
      <Layer>
        <Moon x={X(810)} y={Y(380)} />
        {wide ? (
          <>
            <House x={X(-300)} y={GY} s={0.42 * k} />
            <House x={X(1520)} y={GY} s={0.4 * k} />
            <Tree x={X(-60)} y={GY} s={0.7 * k} />
          </>
        ) : null}
        <Tree x={X(985)} y={GY} s={0.95 * k} />
        <House x={X(400)} y={GY} s={0.95 * k} frame={frame} />
        <Fog frame={frame} y={Y(1110)} />
      </Layer>
    </>
  );
};

export const alley: React.FC<SceneProps> = ({ frame }) => {
  const { W, X, Y, k } = useScene();
  return (
    <>
      <Backdrop mode="night" glow={[540, 1010]} frame={frame} />
      <Layer>
        <Tree x={X(120)} y={Y(900)} s={1.1 * k} />
        <Path />
        <polygon points={`0,${Y(260)} ${X(380)},${Y(760)} ${X(380)},${Y(1170)} 0,${Y(1500)}`} fill={INK} />
        <polygon points={`${W},${Y(260)} ${X(700)},${Y(760)} ${X(700)},${Y(1170)} ${W},${Y(1500)}`} fill={INK} />
        <Lantern x={X(540)} y={Y(1170)} s={0.6 * k} frame={frame} glowR={430 * k} id="kla" />
        <Fog frame={frame} y={Y(1160)} />
      </Layer>
    </>
  );
};

export const room: React.FC<SceneProps> = ({ frame }) => {
  const { W, GY, X, Y, k, wide } = useScene();
  return (
    <>
      <Backdrop mode="warm" glow={[540, 760]} frame={frame} />
      <Layer>
        <rect x={0} y={0} width={W} height={120 * k} fill={INK} />
        {wide ? <BarredWindow x={X(-330)} y={Y(540)} w={210 * k} h={300 * k} /> : null}
        {wide ? <rect x={X(1150)} y={0} width={46 * k} height={GY} fill={INK} /> : null}
        <BarredWindow x={X(110)} y={Y(520)} w={210 * k} h={330 * k} />
        <Door x={X(700)} y={GY} w={280 * k} h={700 * k} frame={frame} />
        <Figure x={X(470)} y={GY} s={2.3 * k} suitcase />
      </Layer>
    </>
  );
};

export const walk: React.FC<SceneProps> = ({ frame, t }) => {
  const { X, Y, k, wide } = useScene();
  const xs = wide ? -500 + t * 1100 : 150 + t * 560;
  return (
    <>
      <Backdrop mode="night" glow={[540, 1010]} frame={frame} />
      <Layer>
        <Path />
        <Lantern x={X(540)} y={Y(1170)} s={0.55 * k} frame={frame} glowR={520 * k} id="klw" />
        <Figure x={X(xs)} y={Y(1330)} s={2.0 * k} walk={frame / 5} />
        <Fog frame={frame} y={Y(1180)} />
      </Layer>
    </>
  );
};

export const lantern: React.FC<SceneProps> = ({ frame }) => {
  const { X, Y, k } = useScene();
  return (
    <>
      <Backdrop mode="warm" glow={[540, 700]} frame={frame} />
      <Layer>
        <Lantern x={X(540)} y={Y(1330)} s={2.2 * k} frame={frame} glowR={360 * k} id="kll" />
      </Layer>
    </>
  );
};

export const door: React.FC<SceneProps> = ({ frame }) => {
  const { GY, X, Y, k } = useScene();
  return (
    <>
      <Backdrop mode="warm" glow={[540, 900]} frame={frame} />
      <Layer>
        <rect x={X(150)} y={Y(190)} width={780 * k} height={70 * k} fill={INK} />
        <rect x={X(150)} y={Y(190)} width={50 * k} height={GY - Y(190)} fill={INK} />
        <rect x={X(880)} y={Y(190)} width={50 * k} height={GY - Y(190)} fill={INK} />
        <Door x={X(330)} y={GY} w={420 * k} h={860 * k} frame={frame} />
      </Layer>
    </>
  );
};

const makeWindow = (kind: "woman" | "man"): React.FC<SceneProps> => ({ frame, t }) => {
  const { W, GY, X, Y, k } = useScene();
  const man = kind === "man";
  return (
    <>
      <Backdrop mode="warm" glow={[540, 800]} frame={frame} />
      <Layer>
        <rect x={0} y={0} width={W} height={GY} fill={INK} />
        <rect x={X(240)} y={Y(410)} width={600 * k} height={640 * k} fill="#f2b45a" />
        <Figure x={X(540)} y={Y(1050)} s={2.4 * k} tilt={-14 * t} kind={kind} stoop={man} cane={man} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={X(240) + ((i + 1) * 600 * k) / 7 - 6} y={Y(410)} width={12} height={640 * k} fill={INK} />
        ))}
        <rect x={X(240)} y={Y(720)} width={600 * k} height={12} fill={INK} />
      </Layer>
    </>
  );
};
export const windowScene = makeWindow("woman");
export const windowMan = makeWindow("man");

export const end: React.FC<SceneProps> = () => (
  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 46%, #160a05 0%, #070302 70%)" }} />
);

// ---------- scene tambahan untuk video panjang ----------
export const graveyard: React.FC<SceneProps> = ({ frame }) => {
  const { X, Y, GY, k } = useScene();
  const stones: [number, number, boolean][] = [[-170, 0.9, false], [90, 1.1, true], [320, 0.8, false], [700, 1.0, false], [930, 0.85, true], [1190, 1.05, false]];
  return (
    <>
      <Backdrop mode="night" glow={[540, 1000]} frame={frame} />
      <Layer>
        <Moon x={X(300)} y={Y(380)} />
        <Tree x={X(860)} y={GY} s={1.05 * k} />
        {stones.map(([x, sc, cr], i) => <Tomb key={i} x={X(x)} y={GY + 4 * k} s={sc * k} cross={cr} />)}
        <Figure x={X(520)} y={GY + 30 * k} s={1.7 * k} />
        <Fog frame={frame} y={Y(1120)} />
      </Layer>
    </>
  );
};

export const tomb: React.FC<SceneProps> = ({ frame }) => {
  const { X, Y, GY, k } = useScene();
  return (
    <>
      <Backdrop mode="night" glow={[540, 1000]} frame={frame} />
      <Layer>
        <Moon x={X(800)} y={Y(380)} />
        <Tomb x={X(620)} y={GY + 30 * k} s={3.0 * k} />
        <Ember x={X(380)} y={GY + 14 * k} s={1.6 * k} frame={frame} />
        <Fog frame={frame} y={Y(1160)} />
      </Layer>
    </>
  );
};

export const well: React.FC<SceneProps> = ({ frame, t }) => {
  const { X, Y, GY, k } = useScene();
  const fl = 0.85 + 0.12 * Math.sin(frame / 3.1);
  return (
    <>
      <Backdrop mode="night" glow={[540, 960]} frame={frame} />
      <Layer>
        <defs>
          <radialGradient id="kwo"><stop offset="0" stopColor="#ffd98a" stopOpacity="0.9" /><stop offset="0.4" stopColor="#ffcf7a" stopOpacity="0.3" /><stop offset="1" stopColor="#ffcf7a" stopOpacity="0" /></radialGradient>
        </defs>
        <Tree x={X(130)} y={GY} s={0.9 * k} />
        <g fill={INK}>
          <rect x={X(540) - 120 * k} y={GY - 130 * k} width={240 * k} height={130 * k} />
          <ellipse cx={X(540)} cy={GY - 130 * k} rx={120 * k} ry={22 * k} />
          <rect x={X(540) - 112 * k} y={GY - 400 * k} width={16 * k} height={280 * k} />
          <rect x={X(540) + 96 * k} y={GY - 400 * k} width={16 * k} height={280 * k} />
          <path d={`M${X(540) - 150 * k} ${GY - 395 * k} L${X(540)} ${GY - 470 * k} L${X(540) + 150 * k} ${GY - 395 * k} Z`} />
          <rect x={X(540) - 4 * k} y={GY - 392 * k} width={8 * k} height={110 * k} />
          <rect x={X(540) - 26 * k} y={GY - 284 * k} width={52 * k} height={40 * k} />
        </g>
        <circle cx={X(540) + Math.sin(t * 6) * 40 * k} cy={GY - 620 * k + Math.sin(frame / 20) * 14 * k} r={150 * k * fl} fill="url(#kwo)" />
        <circle cx={X(540) + Math.sin(t * 6) * 40 * k} cy={GY - 620 * k + Math.sin(frame / 20) * 14 * k} r={16 * k} fill="#ffe6a8" />
        <Fog frame={frame} y={Y(1150)} />
      </Layer>
    </>
  );
};

export const hall: React.FC<SceneProps> = ({ frame }) => {
  const { W, GY, X, Y, k } = useScene();
  return (
    <>
      <Backdrop mode="warm" glow={[540, 760]} frame={frame} />
      <Layer>
        <rect x={0} y={0} width={W} height={120 * k} fill={INK} />
        <BarredWindow x={X(90)} y={Y(520)} w={190 * k} h={310 * k} />
        <g fill={INK}>
          <rect x={X(540) - 170 * k} y={GY - 235 * k} width={340 * k} height={24 * k} />
          <rect x={X(540) - 150 * k} y={GY - 212 * k} width={20 * k} height={212 * k} />
          <rect x={X(540) + 130 * k} y={GY - 212 * k} width={20 * k} height={212 * k} />
          <rect x={X(540) - 60 * k} y={GY - 270 * k} width={38 * k} height={36 * k} rx={6} />
          <rect x={X(540) + 24 * k} y={GY - 270 * k} width={38 * k} height={36 * k} rx={6} />
        </g>
        <Figure x={X(330)} y={GY} s={2.3 * k} />
        <Figure x={X(790)} y={GY} s={2.15 * k} flip stoop cane />
      </Layer>
    </>
  );
};

export const SCENES: Record<string, React.FC<SceneProps>> = {
  house, alley, room, walk, lantern, door, window: windowScene, windowMan, end, graveyard, tomb, well, hall,
};
