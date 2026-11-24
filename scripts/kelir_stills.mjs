// Render satu still per shot (bundle sekali) untuk pemeriksaan visual sebelum render penuh.
//   node scripts/kelir_stills.mjs <episode> <compositionShot> [frame=45]
//   contoh: node scripts/kelir_stills.mjs kelirlong1 KelirLongShot 45
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const ep = process.argv[2] || "kelir1";
const comp = process.argv[3] || "KelirShot";
const frame = Number(process.argv[4] || 45);
const script = JSON.parse(fs.readFileSync(`episodes/${ep}/script.json`, "utf8"));
fs.mkdirSync("out/stills", { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const chromiumOptions = { gl: "swangle" };
for (const s of script.shots) {
  const inputProps = { id: s.id };
  const composition = await selectComposition({ serveUrl, id: comp, inputProps, chromiumOptions });
  const output = `out/stills/${s.id}.png`;
  await renderStill({ composition, serveUrl, output, frame, inputProps, chromiumOptions });
  console.log("still", s.id, s.scene, "->", output);
}
