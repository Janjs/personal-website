import { execSync } from "node:child_process";
import { writeFileSync, unlinkSync } from "node:fs";
import { chromium } from "playwright";

const baseUrl = process.env.PREVIEW_BASE_URL ?? "http://localhost:3000";
const outLight = new URL("../public/workspace/preview-light.png", import.meta.url);
const outDark = new URL("../public/workspace/preview-dark.png", import.meta.url);

async function waitForScene(page) {
  await page.waitForFunction(
    () => {
      const loading = document.querySelector('#workspace [role="status"]');
      return loading?.classList.contains("opacity-0") && loading?.getAttribute("aria-hidden") === "true";
    },
    { timeout: 120_000 },
  );
  await page.waitForTimeout(5000);
}

async function captureCanvas(page, outPath) {
  const dataUrl = await page.evaluate(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const source = document.querySelector("#workspace canvas");
    if (!source) return "";

    const w = source.width;
    const h = source.height;
    const snap = document.createElement("canvas");
    snap.width = w;
    snap.height = h;
    const snapCtx = snap.getContext("2d");
    if (!snapCtx) return source.toDataURL("image/png");
    snapCtx.drawImage(source, 0, 0);

    const { data } = snapCtx.getImageData(0, 0, w, h);
    let minX = w;
    let minY = h;
    let maxX = 0;
    let maxY = 0;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const alpha = data[i + 3];
        const luma = data[i] + data[i + 1] + data[i + 2];
        if (alpha > 12 && luma > 30) {
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }

    if (maxX <= minX || maxY <= minY) return source.toDataURL("image/png");

    const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.05);
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(w - 1, maxX + pad);
    maxY = Math.min(h - 1, maxY + pad);
    const cw = maxX - minX + 1;
    const ch = maxY - minY + 1;
    const size = Math.max(cw, ch);

    const out = document.createElement("canvas");
    out.width = size;
    out.height = size;
    const outCtx = out.getContext("2d");
    if (!outCtx) return source.toDataURL("image/png");
    outCtx.drawImage(snap, minX, minY, cw, ch, (size - cw) / 2, (size - ch) / 2, cw, ch);
    return out.toDataURL("image/png");
  });

  if (!dataUrl.startsWith("data:image/png;base64,")) {
    throw new Error("Canvas export failed");
  }

  const raw = new URL("../public/workspace/.capture-raw.png", import.meta.url);
  writeFileSync(raw.pathname, Buffer.from(dataUrl.split(",")[1], "base64"));
  execSync(`sips -z 320 320 "${raw.pathname}" --out "${outPath.pathname}"`, { stdio: "inherit" });
  unlinkSync(raw.pathname);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

await page.goto(`${baseUrl}/#workspace`, { waitUntil: "domcontentloaded", timeout: 120_000 });
await page.evaluate(() => document.documentElement.classList.remove("dark"));
await waitForScene(page);
await captureCanvas(page, outLight);

await page.evaluate(() => document.documentElement.classList.add("dark"));
await page.waitForTimeout(800);
await waitForScene(page);
await captureCanvas(page, outDark);

await browser.close();
console.log("Wrote", outLight.pathname, outDark.pathname);
