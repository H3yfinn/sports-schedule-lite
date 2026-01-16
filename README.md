# LoL Esports Schedule Lite

This app loads match data client-side and relies on a small Cloudflare Worker
proxy for YouTube and Twitch API calls. The worker exists to keep API keys out
of the browser while still allowing the site to run on GitHub Pages.

## Why the Worker Matters

The site requests YouTube and Twitch data from the worker (see `proxyBaseUrl`
in `config.example.js`). The worker then calls the upstream APIs server-side.

Two common issues can break VOD links:

- YouTube 403 "Requests from referer <empty> are blocked."
  The worker makes server-side requests without a browser referer. If the
  YouTube API key is restricted to HTTP referrers, Google blocks the request.
  Fix: either allow server-side usage (no referrer restriction), or forward
  the browser referer when the worker calls YouTube.
- Twitch 401 "Invalid OAuth token"
  The Twitch access token expires. A long-lived worker must refresh it using
  the client credentials flow.

## Cloudflare Worker (Recommended)

The worker should:

- Forward the browser Referer to YouTube, so referrer-restricted keys pass.
- Auto-refresh the Twitch token using `TWITCH_CLIENT_ID` and
  `TWITCH_CLIENT_SECRET`.

Required secrets:

- `YOUTUBE_API_KEY`
- `TWITCH_CLIENT_ID`
- `TWITCH_CLIENT_SECRET`

## Worker Endpoints

- `GET /youtube?endpoint=search|channels&...`
- `GET /twitch-status?user_login=caedrel`

## Request Flow (Diagram)

```
Browser (GitHub Pages)
  | 1) GET /index.html -> loads config.example.js + app.js
  | 2) app.js requests proxyBaseUrl endpoints
  v
Cloudflare Worker
  | 3) Adds API secrets + headers
  | 4) Calls upstream APIs
  v
YouTube / Twitch APIs
  | 5) JSON response
  v
Cloudflare Worker
  | 6) Returns JSON with CORS headers
  v
Browser renders schedule + VOD links
```
