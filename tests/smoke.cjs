const fs = require("node:fs");
const path = require("node:path");

function read(relPath) {
  return fs.readFileSync(path.join(process.cwd(), relPath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  const appJs = read("app.js");
  const configExample = read("config.example.js");
  const workerJs = read("cloudflare/worker.js");

  assert(
    appJs.includes('const PROXY_BASE_URL = APP_CONFIG.proxyBaseUrl || "";'),
    "app.js: proxy base URL should come from APP_CONFIG.proxyBaseUrl"
  );
  assert(
    appJs.includes("return Boolean(getProxyBaseUrl());"),
    "app.js: YouTube access should require worker proxy"
  );
  assert(
    appJs.includes('const url = new URL(`${proxyBase}/youtube`);'),
    "app.js: YouTube lookups should use the worker /youtube endpoint"
  );
  assert(
    appJs.includes('const url = new URL(`${proxyBase}/twitch-status`);'),
    "app.js: Twitch status should use the worker /twitch-status endpoint"
  );

  const forbiddenFrontendConfigKeys = [
    "youtubeApiKey",
    "twitchClientId",
    "twitchAccessToken",
  ];
  for (const key of forbiddenFrontendConfigKeys) {
    assert(
      !configExample.includes(`${key}:`),
      `config.example.js: remove ${key} from public frontend config`
    );
  }

  assert(
    workerJs.includes("env?.LOL_LAST_GOOD"),
    "cloudflare/worker.js: expected LOL_LAST_GOOD fallback support"
  );
  assert(
    workerJs.includes('headers.set("X-Data-Source", "kv-last-good");'),
    "cloudflare/worker.js: expected kv-last-good response header"
  );
}

main();
console.log("Smoke tests passed.");
