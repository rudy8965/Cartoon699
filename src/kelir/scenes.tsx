import React from "react";
import { Backdrop, BarredWindow, Door, Figure, GY, House, INK, Lantern, Tree, Wall } from "./art";

export type SceneProps = { frame: number; t: number };

const Fog: React.FC<{ frame: number; y?: number }> = ({ frame, y = 1110 }) => (
  <g>
    {[0, 1, 2].map((i) => (
      <ellipse key={i} cx={300 + i * 280 + Math.sin(frame / 90 + i) * 60} cy={y + i * 30} rx={420} ry={34 + i * 8} fill="#f0d2a8" opacity={0.045} />
    ))}
  </g>
);

const Moon: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <defs>
      <radialGradient id="kmoon"><stop offset="0" stopColor="#e8c89a" stopOpacity="0.55" /><stop offset="1" stopColor="#e8c89a" stopOpacity="0" /></radialGradient>
    </defs>
    <circle cx={x} cy={y} r={230} fill="url(#kmoon)" />
    <circle cx={x} cy={y} r={64} fill="#d9b98a" opacity={0.6} />
  </g>
);

const Layer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>{children}</svg>
);

const Path: React.FC = () => <polygon points="470,1170 610,1170 800,1920 280,1920" fill="#1b0f08" />;

export const house: React.FC<SceneProps> = ({ frame }) => (
  <>
    <Backdrop mode="night" glow={[540, 1000]} frame={frame} />
    <Layer>
      <Moon x={810} y={380} />
      <Tree x={985} y={GY} s={0.95} />
      <House x={400} y={GY} s={0.95} frame={frame} />
      <Fog frame={frame} />
    </Layer>
  </>
);

export const alley: React.FC<SceneProps> = ({ frame }) => (
  <>
    <Backdrop mode="night" glow={[540, 1010]} frame={frame} />
    <Layer>
      <Tree x={120} y={900} s={1.1} />
      <Path />
      <Wall side="l" />
      <Wall side="r" />
      <Lantern x={540} y={1170} s={0.6} frame={frame} glowR={430} id="kla" />
      <Fog frame={frame} y={1160} />
    </Layer>
  </>
);

export const room: React.FC<SceneProps> = ({ frame }) => (
  <>
    <Backdrop mode="warm" glow={[540, 760]} frame={frame} />
    <Layer>
      <rect x={0} y={0} width={1080} height={120} fill={INK} />
      <BarredWindow x={110} y={520} w={210} h={330} />
      <Door x={700} y={GY} w={280} h={700} frame={frame} />
      <Figure x={470} y={GY} s={2.3} suitcase />
    </Layer>
  </>
);

export const walk: React.FC<SceneProps> = ({ frame, t }) => (
  <>
    <Backdrop mode="night" glow={[540, 1010]} frame={frame} />
    <Layer>
      <Path />
      <Lantern x={540} y={1170} s={0.55} frame={frame} glowR={520} id="klw" />
      <Figure x={150 + t * 560} y={1330} s={2.0} walk={frame / 5} />
      <Fog frame={frame} y={1180} />
    </Layer>
  </>
);

export const lantern: React.FC<SceneProps> = ({ frame }) => (
  <>
    <Backdrop mode="warm" glow={[540, 700]} frame={frame} />
    <Layer>
      <Lantern x={540} y={1330} s={2.2} frame={frame} glowR={360} id="kll" />
    </Layer>
  </>
);

export const door: React.FC<SceneProps> = ({ frame }) => (
  <>
    <Backdrop mode="warm" glow={[540, 900]} frame={frame} />
    <Layer>
      <rect x={150} y={190} width={780} height={70} fill={INK} />
      <rect x={150} y={190} width={50} height={GY - 190} fill={INK} />
      <rect x={880} y={190} width={50} height={GY - 190} fill={INK} />
      <Door x={330} y={GY} w={420} h={860} frame={frame} />
    </Layer>
  </>
);

export const windowScene: React.FC<SceneProps> = ({ frame, t }) => (
  <>
    <Backdrop mode="warm" glow={[540, 800]} frame={frame} />
    <Layer>
      <rect x={0} y={0} width={1080} height={GY} fill={INK} />
      <rect x={240} y={410} width={600} height={640} fill="#f2b45a" />
      <Figure x={540} y={1050} s={2.4} tilt={-14 * t} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={240 + ((i + 1) * 600) / 7 - 6} y={410} width={12} height={640} fill={INK} />
      ))}
      <rect x={240} y={720} width={600} height={12} fill={INK} />
    </Layer>
  </>
);

export const end: React.FC<SceneProps> = () => (
  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 46%, #160a05 0%, #070302 70%)" }} />
);

export const SCENES: Record<string, React.FC<SceneProps>> = { house, alley, room, walk, lantern, door, window: windowScene, end };
