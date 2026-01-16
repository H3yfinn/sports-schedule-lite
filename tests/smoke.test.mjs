import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const port = 5173;

const contentTypes = new Map([
  [".html", "text/html"],
  [".js", "text/javascript"],
  [".css", "text/css"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
]);

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const cleanPath = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = path.join(rootDir, cleanPath);
    const fileBuffer = await readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": contentTypes.get(ext) || "application/octet-stream" });
    res.end(fileBuffer);
  } catch (error) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchText(pathname) {
  const response = await fetch(`http://127.0.0.1:${port}${pathname}`);
  const body = await response.text();
  return { status: response.status, body };
}

async function run() {
  await new Promise((resolve) => server.listen(port, resolve));

  try {
    const index = await fetchText("/");
    assert(index.status === 200, "Expected index.html to return 200.");
    assert(index.body.includes("LoL Esports Schedule"), "Expected page title in HTML.");

    const app = await fetchText("/app.js");
    assert(app.status === 200, "Expected app.js to return 200.");
    assert(app.body.includes("getLiveLinks"), "Expected live link helper in app.js.");
    assert(app.body.includes("getVodLink"), "Expected VOD link helper in app.js.");

    const logo = await fetchText("/assets/logos/T1.svg");
    assert(logo.status === 200, "Expected local LCK logo asset to return 200.");
    assert(logo.body.includes("T1"), "Expected T1 logo asset to include team label.");

    console.log("Smoke tests passed.");
  } finally {
    server.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
