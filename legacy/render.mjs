import { chromium } from "playwright";
import { createServer } from "node:http";
import { createReadStream, existsSync, mkdirSync, rmSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const OUT = resolve(ROOT, "out");
const args = process.argv.slice(2);
function arg(name, fallback) {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
}
const mode = arg("--mode", process.env.VIDEO_MODE || "shorts");
const preview = args.includes("--preview") || process.env.PREVIEW === "true";
const requested = Number(arg("--duration", process.env.VIDEO_DURATION || process.env.DURATION || "3"));
if (!Number.isFinite(requested) || requested <= 0) throw new Error("Durasi tidak valid");
const duration = Math.max(1, Math.min(preview ? 10 : 600, requested));
const outputName = arg("--output", process.env.OUTPUT_NAME || (preview ? "preview.mp4" : "cartoon-video.mp4")).replace(/[^a-zA-Z0-9._-]/g, "_");
const fps = 24;
const width = mode === "long" ? 1280 : 720;
const height = mode === "long" ? 720 : 1280;
const totalFrames = Math.ceil(duration * fps);
const framesDir = join(OUT, "frames");

if (!outputName.toLowerCase().endsWith(".mp4")) throw new Error("Nama output harus berakhiran .mp4");
if (!["shorts", "long"].includes(mode)) throw new Error("Mode harus shorts atau long");

mkdirSync(OUT, { recursive: true });
if (existsSync(framesDir)) rmSync(framesDir, { recursive: true, force: true });
mkdirSync(framesDir, { recursive: true });

const mime = { ".html":"text/html", ".js":"text/javascript", ".mjs":"text/javascript", ".css":"text/css", ".json":"application/json" };
const server = createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
  const relative = normalize(pathname).replace(/^([/\\])+/, "");
  const file = resolve(ROOT, relative || "index.html");
  if (!file.startsWith(ROOT) || !existsSync(file)) {
    res.writeHead(404); res.end("Not Found"); return;
  }
  res.setHeader("Content-Type", mime[extname(file)] || "application/octet-stream");
  createReadStream(file).pipe(res);
});
await new Promise(resolveListen => server.listen(0, "127.0.0.1", resolveListen));

let browser;
try {
  browser = await chromium.launch({ headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage", "--use-gl=angle", "--use-angle=swiftshader", "--enable-webgl"] });
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  page.on("console", msg => { if (msg.type() === "error") console.error("BROWSER:", msg.text()); });
  page.on("pageerror", err => console.error("PAGE ERROR:", err.message));
  const response = await page.goto(`http://127.0.0.1:${server.address().port}/index.html`, { waitUntil: "networkidle", timeout: 60000 });
  if (!response?.ok()) throw new Error(`Halaman gagal dimuat: HTTP ${response?.status()}`);
  await page.waitForFunction(() => typeof window.renderAt === "function", { timeout: 30000 });
  for (let frame = 0; frame < totalFrames; frame++) {
    const t = frame / fps;
    await page.evaluate(time => window.renderAt(time), t);
    await page.screenshot({ path: join(framesDir, `frame-${String(frame).padStart(6, "0")}.png`) });
    if (frame % 48 === 0) console.log(`Rendered ${frame + 1}/${totalFrames} frames`);
  }
  const output = join(OUT, outputName);
  await new Promise((resolveEncode, rejectEncode) => {
    const ff = spawn("ffmpeg", [
      "-y", "-framerate", String(fps), "-i", join(framesDir, "frame-%06d.png"),
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart", output
    ], { stdio: "inherit" });
    ff.on("error", rejectEncode);
    ff.on("close", code => code === 0 ? resolveEncode() : rejectEncode(new Error(`FFmpeg exit code ${code}`)));
  });
  console.log(`SUCCESS: ${output} (${width}x${height}, ${duration}s, ${preview ? "preview" : "full"})`);
} finally {
  if (browser) await browser.close();
  server.close();
}
