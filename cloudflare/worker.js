const API_ORIGIN = "https://api.lol-esports.mckernant1.com";
const LOL_PATH_PREFIX = "/lol";
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const TWITCH_API_BASE = "https://api.twitch.tv/helix";
const DEFAULT_CACHE_TTL_SECONDS = 300;
const DEFAULT_LOL_TIMEOUT_MS = 4500;
const LAST_GOOD_KV_TTL_SECONDS = 7 * 24 * 60 * 60;

let twitchToken = null;

function buildCorsHeaders(extraHeaders) {
  const headers = new Headers(extraHeaders || {});
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return headers;
}

function jsonResponse(payload, init) {
  const headers = buildCorsHeaders(init?.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(payload), {
    ...init,
    headers,
  });
}

function withCors(response) {
  const headers = buildCorsHeaders(response.headers);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function withHeaders(response, extraHeaders) {
  const headers = new Headers(response.headers);
  Object.entries(extraHeaders || {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      headers.set(key, String(value));
    }
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function getLolTimeoutMs(env) {
  const configured = Number(env?.LOL_UPSTREAM_TIMEOUT_MS);
  if (Number.isFinite(configured) && configured >= 500) {
    return Math.floor(configured);
  }
  return DEFAULT_LOL_TIMEOUT_MS;
}

function getLolCacheTtl(pathname) {
  if (pathname.startsWith("/leagues") || pathname.startsWith("/teams")) {
    return 24 * 60 * 60;
  }
  if (pathname.startsWith("/most-recent-tournament")) {
    return 10 * 60;
  }
  if (pathname.startsWith("/matches")) {
    return 5 * 60;
  }
  return DEFAULT_CACHE_TTL_SECONDS;
}

function getLolSnapshotKey(pathname, search) {
  return `lol:last-good:${pathname}${search || ""}`;
}

function isRetriableUpstreamStatus(status) {
  return status >= 500 || status === 429;
}

async function fetchWithTimeout(url, init, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort("Upstream timeout"), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function saveLolSnapshot(env, key, response, cacheTtl) {
  if (!env?.LOL_LAST_GOOD || !response.ok) {
    return;
  }

  const contentType = response.headers.get("Content-Type") || "application/json; charset=utf-8";
  const body = await response.text();
  const payload = {
    body,
    contentType,
    savedAt: Date.now(),
    cacheTtl,
  };

  await env.LOL_LAST_GOOD.put(key, JSON.stringify(payload), {
    expirationTtl: LAST_GOOD_KV_TTL_SECONDS,
  });
}

async function readLolSnapshot(env, key) {
  if (!env?.LOL_LAST_GOOD) {
    return null;
  }

  try {
    const payload = await env.LOL_LAST_GOOD.get(key);
    if (!payload) {
      return null;
    }
    const parsed = JSON.parse(payload);
    if (!parsed?.body) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function buildLolSnapshotResponse(snapshot) {
  const headers = new Headers();
  headers.set("Content-Type", snapshot.contentType || "application/json; charset=utf-8");
  headers.set("X-Data-Source", "kv-last-good");
  if (snapshot.savedAt) {
    headers.set("X-Last-Good-Saved-At", new Date(snapshot.savedAt).toISOString());
  }
  return new Response(snapshot.body, { status: 200, headers });
}

async function handleLolRequest(request, env, ctx) {
  if (request.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  const url = new URL(request.url);
  const upstreamPath = url.pathname.replace(LOL_PATH_PREFIX, "") || "/";
  const upstreamUrl = new URL(API_ORIGIN);
  upstreamUrl.pathname = upstreamPath;
  upstreamUrl.search = url.search;

  const cacheTtl = getLolCacheTtl(upstreamPath);
  const timeoutMs = getLolTimeoutMs(env);
  const snapshotKey = getLolSnapshotKey(upstreamPath, url.search);

  try {
    const upstreamResponse = await fetchWithTimeout(
      upstreamUrl.toString(),
      {
        cf: { cacheEverything: true, cacheTtl },
      },
      timeoutMs
    );

    if (upstreamResponse.ok) {
      if (env?.LOL_LAST_GOOD) {
        ctx?.waitUntil(saveLolSnapshot(env, snapshotKey, upstreamResponse.clone(), cacheTtl));
      }
      return withCors(withHeaders(upstreamResponse, { "X-Data-Source": "upstream" }));
    }

    if (!isRetriableUpstreamStatus(upstreamResponse.status)) {
      return withCors(withHeaders(upstreamResponse, { "X-Data-Source": "upstream" }));
    }

    const snapshot = await readLolSnapshot(env, snapshotKey);
    if (snapshot) {
      return withCors(buildLolSnapshotResponse(snapshot));
    }

    return withCors(withHeaders(upstreamResponse, { "X-Data-Source": "upstream" }));
  } catch (error) {
    const snapshot = await readLolSnapshot(env, snapshotKey);
    if (snapshot) {
      return withCors(buildLolSnapshotResponse(snapshot));
    }

    const isTimeout = error?.name === "AbortError";
    return jsonResponse(
      {
        error: isTimeout
          ? "LoL API timed out and no fallback snapshot was available."
          : "LoL API request failed and no fallback snapshot was available.",
      },
      { status: isTimeout ? 504 : 502 }
    );
  }
}

async function handleYouTubeRequest(request, env) {
  if (request.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  if (!env?.YOUTUBE_API_KEY) {
    return jsonResponse({ error: "Missing YOUTUBE_API_KEY" }, { status: 500 });
  }

  const url = new URL(request.url);
  const endpoint = url.searchParams.get("endpoint");
  if (!endpoint) {
    return jsonResponse({ error: "Missing endpoint" }, { status: 400 });
  }

  const upstreamUrl = new URL(`${YOUTUBE_API_BASE}/${endpoint}`);
  url.searchParams.forEach((value, key) => {
    if (key !== "endpoint" && value !== "") {
      upstreamUrl.searchParams.set(key, value);
    }
  });
  upstreamUrl.searchParams.set("key", env.YOUTUBE_API_KEY);

  const response = await fetch(upstreamUrl.toString(), {
    headers: {
      Referer: request.headers.get("Referer") || "",
    },
  });
  return withCors(response);
}

async function getTwitchToken(env) {
  if (!env?.TWITCH_CLIENT_ID || !env?.TWITCH_CLIENT_SECRET) {
    throw new Error("Missing Twitch credentials.");
  }

  const now = Date.now();
  if (twitchToken && twitchToken.expiresAt > now) {
    return twitchToken.value;
  }

  const tokenUrl = new URL(TWITCH_TOKEN_URL);
  tokenUrl.searchParams.set("client_id", env.TWITCH_CLIENT_ID);
  tokenUrl.searchParams.set("client_secret", env.TWITCH_CLIENT_SECRET);
  tokenUrl.searchParams.set("grant_type", "client_credentials");

  const response = await fetch(tokenUrl.toString(), { method: "POST" });
  if (!response.ok) {
    throw new Error(`Twitch token request failed: ${response.status}`);
  }
  const data = await response.json();
  const expiresIn = Number(data?.expires_in) || 0;
  twitchToken = {
    value: data?.access_token,
    expiresAt: now + Math.max(expiresIn - 60, 0) * 1000,
  };
  return twitchToken.value;
}

async function handleTwitchStatus(request, env) {
  if (request.method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  const url = new URL(request.url);
  const userLogin = url.searchParams.get("user_login");
  if (!userLogin) {
    return jsonResponse({ error: "Missing user_login" }, { status: 400 });
  }

  try {
    const token = await getTwitchToken(env);
    const upstreamUrl = new URL(`${TWITCH_API_BASE}/streams`);
    upstreamUrl.searchParams.set("user_login", userLogin);
    const response = await fetch(upstreamUrl.toString(), {
      headers: {
        "Client-ID": env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
    });
    return withCors(response);
  } catch (error) {
    return jsonResponse({ error: error?.message || "Twitch proxy error." }, { status: 500 });
  }
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: buildCorsHeaders() });
    }

    const url = new URL(request.url);
    if (url.pathname.startsWith(LOL_PATH_PREFIX)) {
      return handleLolRequest(request, env, ctx);
    }
    if (url.pathname === "/youtube") {
      return handleYouTubeRequest(request, env);
    }
    if (url.pathname === "/twitch-status") {
      return handleTwitchStatus(request, env);
    }

    return jsonResponse({ error: "Not found" }, { status: 404 });
  },
};
