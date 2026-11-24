import s1 from "../../episodes/kelir1/script.json";
import t1 from "../../episodes/kelir1/timing.json";
import sL from "../../episodes/kelirlong1/script.json";
import tL from "../../episodes/kelirlong1/timing.json";

export type ShotDef = {
  id: number;
  scene: string;
  cam: { s: number[]; x: number[]; y: number[]; o: number[] };
  lines: { t: string; em?: boolean }[];
  hold?: number;
};
export type Timing = {
  total: number;
  shots: { id: number; start: number }[];
  lines: { shot: number; text: string; em: boolean; start: number; end: number }[];
};
export type EpData = { id: string; title: string; part: string | number; next?: string | number; shots: ShotDef[]; timing: Timing; tail: number };

const mk = (id: string, script: unknown, timing: unknown, tail = 0.6): EpData => {
  const s = script as Omit<EpData, "id" | "timing" | "tail">;
  return { id, title: s.title, part: s.part, next: s.next, shots: s.shots, timing: timing as Timing, tail };
};

export const EP_SHORT = mk("kelir1", s1, t1);
export const EP_LONG = mk("kelirlong1", sL, tL);
