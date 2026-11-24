// Render satu still per shot (bundle sekali) untuk pemeriksaan visual sebelum render penuh.
// node scripts/kelir_stills.mjs [frame=45]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const frame = Number(process.argv[2] || 45);
const script = JSON.parse(fs.readFileSync("episodes/kelir1/script.json", "utf8"));
fs.mkdirSync("out/stills", { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const chromiumOptions = { gl: "swangle" };
for (const s of script.shots) {
  const inputProps = { id: s.id };
  const composition = await selectComposition({ serveUrl, id: "KelirShot", inputProps, chromiumOptions });
  const output = `out/stills/${s.id}.png`;
  await renderStill({ composition, serveUrl, output, frame, inputProps, chromiumOptions });
  console.log("still", s.id, s.scene, "->", output);
}
