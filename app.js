const API_BASE = "https://api.lol-esports.mckernant1.com";
const APP_CONFIG = window.APP_CONFIG || {};
const TWITCH_CLIENT_ID = APP_CONFIG.twitchClientId || "";
const TWITCH_ACCESS_TOKEN = APP_CONFIG.twitchAccessToken || "";
const TWITCH_STREAMER_LOGIN = APP_CONFIG.twitchStreamerLogin || "caedrel";
const PRIORITY_EVENT_IDS = ["MSI", "WCS", "FST", "FS"];
const MAJOR_LEAGUE_IDS = ["LCK", "LPL", "LCS", "LEC"];
const MAIN_LEAGUE_IDS = [
  "LCK",
  "LPL",
  "LCS",
  "LEC",
  "LoL_EMEA_Championship",
  "MSI",
  "WCS",
  "FST",
  "FS",
];
const LIKELY_LEAGUE_IDS = [
  "2015_ASE",
  "AC",
  "AG",
  "AG_2018",
  "AG_2022",
  "AL",
  "AL2",
  "AOL",
  "ASCI",
  "ASI",
  "All-Star",
  "Asia_Master",
  "BGL",
  "BIG",
  "BL",
  "BM",
  "BOTA",
  "BP",
  "BRCC",
  "BRMA",
  "BRMC",
  "CBLOL",
  "CBLOL.A",
  "CD",
  "CDF",
  "CDLN",
  "CDLS",
  "CIS_CL",
  "CK",
  "CLS",
  "CSL",
  "CU",
  "DC",
  "DL",
  "EBL",
  "EBL2021_Pro-Am",
  "ECS",
  "EGL",
  "EL",
  "EM",
  "EPL",
  "ES",
  "ESLOL",
  "ESM",
  "EU_LCS",
  "EWC",
  "GL",
  "GLL",
  "GLL20_ProAm",
  "GPL",
  "GSG",
  "HC",
  "HLL",
  "HM",
  "HW",
  "IC",
  "IWCQ",
  "KeG",
  "KeSPA",
  "LAS",
  "LASA",
  "LCK_CL",
  "LCL",
  "LCO",
  "LCP",
  "LCPW",
  "LCP_Wildcard",
  "LCS.A",
  "LDL",
  "LFL",
  "LFL2",
  "LGL",
  "LHE",
  "LIT",
  "LJL",
  "LJLA",
  "LJLCS",
  "LJL_SG",
  "LLA",
  "LLN",
  "LMF",
  "LMS",
  "LPLOL",
  "LSC",
  "LST",
  "LTA",
  "LTA_N",
  "LTA_S",
  "LVPSL",
  "LVP_DDH",
  "Legends_Ascend_South_Asia",
  "MSC",
  "NACL",
  "NASG",
  "NERD",
  "NEST",
  "NEXO",
  "NLC",
  "NLC_Aurora_Open",
  "OCS",
  "OPL",
  "OTBLX",
  "Origin",
  "PCL",
  "PCS",
  "PEF",
  "PGN",
  "PRM",
  "Prime_Pokal",
  "Proving_Grounds_Circuit",
  "RCL",
  "ROL",
  "RR",
  "SEA",
  "SL",
  "SLL",
  "SLO",
  "TAL",
  "TCS",
  "TFPP",
  "TRA",
  "TSC",
  "UGP",
  "UKLC",
  "UL",
  "UL2",
  "UPL",
  "Ultraliga_Super_Puchar",
  "VCS",
  "VL",
];
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const YOUTUBE_API_KEY = APP_CONFIG.youtubeApiKey || "";
const YOUTUBE_API_KEY_STORAGE_KEY = "lolScheduleYouTubeApiKey";
const LCK_GLOBAL_HANDLE = "@LCKglobal";
const LCK_GLOBAL_CHANNEL_URL = "https://www.youtube.com/@LCKglobal";
const LCK_ENGLISH_HANDLE = "@LCK_English";
const LCK_ENGLISH_CHANNEL_URL = "https://www.youtube.com/@LCK_English";
const LCK_VOD_LABEL = "Official LCK Global VOD";
const LCK_LIVE_START_LABEL = "Official live (from start)";
const LCK_ENGLISH_VOD_LABEL = "LCK English VOD";

const STREAMS_BY_LEAGUE_ID = {
  LCK: {
    official: "https://www.youtube.com/@LCKglobal/live",
    coStream: "https://www.twitch.tv/caedrel",
  },
  LEC: {
    official: "https://www.youtube.com/@LEC/live",
    coStream: "https://www.twitch.tv/caedrel",
  },
  LPL: {
    official: "https://www.youtube.com/@lplenglish/live",
  },
  LCS: {
    official: "https://www.youtube.com/@LCS/live",
  },
  MSI: {
    official: "https://www.youtube.com/@lolesports/live",
    coStream: "https://www.twitch.tv/caedrel",
  },
  WCS: {
    official: "https://www.youtube.com/@lolesports/live",
  },
  FST: {
    official: "https://www.youtube.com/@lolesports/live",
  },
  FS: {
    official: "https://www.youtube.com/@lolesports/live",
  },
};
const TEAM_LOGO_BASE = "https://static.lolesports.com/teams/";
const LOCAL_LOGO_BASE = "assets/logos/";
const TEAM_BRAND_MAP = {
  T1: { color: "#C8102E", logoUrl: `${LOCAL_LOGO_BASE}T1.svg` },
  GEN: { color: "#AF8B4C", logoUrl: `${LOCAL_LOGO_BASE}GEN.svg` },
  DK: { color: "#0A1A3F", logoUrl: `${LOCAL_LOGO_BASE}DK.svg` },
  HLE: { color: "#F37021", logoUrl: `${LOCAL_LOGO_BASE}HLE.svg` },
  KT: { color: "#E2231A", logoUrl: `${LOCAL_LOGO_BASE}KT.svg` },
  DRX: { color: "#1E5AA8", logoUrl: `${LOCAL_LOGO_BASE}DRX.svg` },
  KDF: { color: "#1E73BE", logoUrl: `${LOCAL_LOGO_BASE}KDF.svg` },
  NS: { color: "#5B5B5B", logoUrl: `${LOCAL_LOGO_BASE}NS.svg` },
  BRO: { color: "#1B5C2E", logoUrl: `${LOCAL_LOGO_BASE}BRO.svg` },
  FOX: { color: "#111111", logoUrl: `${LOCAL_LOGO_BASE}FOX.svg` },
  G2: { color: "#C9A63B" },
  FNC: { color: "#FF6A00" },
  MDK: { color: "#E11D48" },
  MAD: { color: "#E11D48" },
  BDS: { color: "#0D47A1" },
  VIT: { color: "#F2E74B" },
  SK: { color: "#C00000" },
  TH: { color: "#7A5CFF" },
  GX: { color: "#191970" },
  KC: { color: "#1F6FEB" },
  TL: { color: "#001C3D" },
  C9: { color: "#6AAFE6" },
  "100": { color: "#DBB25F" },
  FLY: { color: "#00C2A8" },
  NRG: { color: "#111111" },
  TES: { color: "#0077C8", logoUrl: `${LOCAL_LOGO_BASE}TES.svg` },
  JDG: { color: "#D4AF37", logoUrl: `${LOCAL_LOGO_BASE}JDG.svg` },
  BLG: { color: "#0084FF", logoUrl: `${LOCAL_LOGO_BASE}BLG.svg` },
  LNG: { color: "#00C7B7", logoUrl: `${LOCAL_LOGO_BASE}LNG.svg` },
  WBG: { color: "#D71920", logoUrl: `${LOCAL_LOGO_BASE}WBG.svg` },
  EDG: { color: "#002A5C", logoUrl: `${LOCAL_LOGO_BASE}EDG.svg` },
  RNG: { color: "#D40000", logoUrl: `${LOCAL_LOGO_BASE}RNG.svg` },
  IG: { color: "#0B1F2A", logoUrl: `${LOCAL_LOGO_BASE}IG.svg` },
  FPX: { color: "#E10600", logoUrl: `${LOCAL_LOGO_BASE}FPX.svg` },
  OMG: { color: "#111111", logoUrl: `${LOCAL_LOGO_BASE}OMG.svg` },
  NIP: { color: "#7C3AED", logoUrl: `${LOCAL_LOGO_BASE}NIP.svg` },
  WE: { color: "#B91C1C", logoUrl: `${LOCAL_LOGO_BASE}WE.svg` },
  LGD: { color: "#2563EB", logoUrl: `${LOCAL_LOGO_BASE}LGD.svg` },
  AL: { color: "#0F766E", logoUrl: `${LOCAL_LOGO_BASE}AL.svg` },
  RA: { color: "#F97316", logoUrl: `${LOCAL_LOGO_BASE}RA.svg` },
  TT: { color: "#2563EB", logoUrl: `${LOCAL_LOGO_BASE}TT.svg` },
  UP: { color: "#14B8A6", logoUrl: `${LOCAL_LOGO_BASE}UP.svg` },
};
const TEAM_ID_ALIASES = {
  DNS: "NS",
  BRION: "BRO",
  BFX: "FOX",
};
const TEAM_DISPLAY_ID_OVERRIDES = {
  FOX: "BFX",
};
const CORS_PROXIES = [
  "https://corsproxy.io/?",
  "https://api.allorigins.win/raw?url=",
];
const RESPONSE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const FALLBACK_DATA = {
  "/leagues": [
    { leagueId: "LCK", leagueName: "LCK", isOfficial: true, level: "primary" },
    { leagueId: "LEC", leagueName: "LEC", isOfficial: true, level: "primary" },
    { leagueId: "LPL", leagueName: "LPL", isOfficial: true, level: "primary" },
    { leagueId: "LCS", leagueName: "LCS", isOfficial: true, level: "primary" },
    { leagueId: "MSI", leagueName: "MSI", isOfficial: true, level: "primary" },
    { leagueId: "WCS", leagueName: "Worlds", isOfficial: true, level: "primary" },
  ],
  "/teams": [
    { teamId: "T1", name: "T1" },
    { teamId: "GEN", name: "Gen.G" },
    { teamId: "DK", name: "Dplus KIA" },
    { teamId: "HLE", name: "Hanwha Life Esports" },
    { teamId: "KT", name: "KT Rolster" },
    { teamId: "DRX", name: "DRX" },
    { teamId: "KDF", name: "Kwangdong Freecs" },
    { teamId: "NS", name: "Nongshim RedForce" },
    { teamId: "BRO", name: "OKSavingsBank BRION" },
    { teamId: "FOX", name: "FearX" },
    { teamId: "G2", name: "G2 Esports" },
    { teamId: "FNC", name: "Fnatic" },
    { teamId: "MDK", name: "MAD Lions KOI" },
    { teamId: "BDS", name: "Team BDS" },
    { teamId: "VIT", name: "Team Vitality" },
    { teamId: "SK", name: "SK Gaming" },
    { teamId: "TH", name: "Team Heretics" },
    { teamId: "GX", name: "GIANTX" },
    { teamId: "KC", name: "Karmine Corp" },
    { teamId: "RGE", name: "Rogue" },
    { teamId: "TES", name: "Top Esports" },
    { teamId: "JDG", name: "JD Gaming" },
    { teamId: "BLG", name: "Bilibili Gaming" },
    { teamId: "LNG", name: "LNG Esports" },
    { teamId: "WBG", name: "Weibo Gaming" },
    { teamId: "EDG", name: "EDward Gaming" },
    { teamId: "RNG", name: "Royal Never Give Up" },
    { teamId: "IG", name: "Invictus Gaming" },
    { teamId: "FPX", name: "FunPlus Phoenix" },
    { teamId: "OMG", name: "Oh My God" },
    { teamId: "NIP", name: "Ninjas in Pyjamas" },
    { teamId: "WE", name: "Team WE" },
    { teamId: "LGD", name: "LGD Gaming" },
    { teamId: "AL", name: "Anyone's Legend" },
    { teamId: "RA", name: "Rare Atom" },
    { teamId: "TT", name: "ThunderTalk Gaming" },
    { teamId: "UP", name: "Ultra Prime" },
  ],
};
const LIVE_WINDOW_MS = 3 * 60 * 60 * 1000;
const RECENT_MATCH_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const PREVIOUS_LIMIT = 10;
const LEAGUE_STORAGE_KEY = "lolScheduleLeagueId";
const LEAGUE_PREFERENCES_KEY = "lolSchedulePreferredLeagues";
const LEAGUE_CATALOG_KEY = "lolScheduleLeagueCatalog";
const LEAGUE_DATA_CACHE_KEY = "lolScheduleLeagueDataCache:v3";
const LEAGUE_DATA_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const TWITCH_STATUS_TTL_MS = 2 * 60 * 1000;
const LEAGUE_REFRESH_DELAY_MS = 1500;
const LEAGUE_REFRESH_STEP_DELAY_MS = 1000;
const LEAGUE_REFRESH_INTERVAL_MS = 30 * 60 * 1000;
const LEAGUE_REFRESH_MAX_CHECKS = 20;
const LEAGUE_BUCKETS_KEY = "lolScheduleLeagueBuckets";
const LEAGUE_CHECKING_MESSAGE = "Checking leagues for match data...";

const lckVodCache = new Map();
let lckChannelIdKey = null;
let lckChannelIdPromise = null;
let lckChannelIdValue = null;
let leagueDataRefreshScheduled = false;
let leagueDataRefreshInFlight = false;
let leagueRefreshInterval = null;
const lckLiveStartCache = new Map();
const lckLiveStartPromises = new Map();

const state = {
  leagues: [],
  leagueCatalog: [],
  teamsById: new Map(),
  leaguesById: new Map(),
  matches: [],
  currentLeagueId: null,
  currentTournamentId: null,
  view: "schedule",
  showPrevious: false,
  caedrelLive: null,
  lastTwitchCheck: 0,
  leagueBuckets: {
    withData: new Set(),
    likelyNoData: new Set(),
    unlikelyNoData: new Set(),
  },
};

const leagueSelect = document.getElementById("leagueSelect");
const statusEl = document.getElementById("status");
const matchesEl = document.getElementById("matches");
const tableEl = document.getElementById("table");
const previousEl = document.getElementById("previous");
const previousToggle = document.getElementById("previousToggle");
const leagueFilter = document.getElementById("leagueFilter");
const saveLeagueButton = document.getElementById("saveLeague");
const leagueOptionsList = document.getElementById("leagueOptions");
const viewButtons = Array.from(document.querySelectorAll(".view-button"));
const loadingIndicator = document.getElementById("loadingIndicator");
let loadingCount = 0;

function setStatus(message) {
  statusEl.textContent = message;
}

function setLoading(isLoading) {
  if (!loadingIndicator) {
    return;
  }

  if (isLoading) {
    loadingCount += 1;
  } else {
    loadingCount = Math.max(loadingCount - 1, 0);
  }

  const isActive = loadingCount > 0;
  loadingIndicator.classList.toggle("is-active", isActive);
  loadingIndicator.setAttribute("aria-hidden", isActive ? "false" : "true");
}

function renderEmpty(targetEl, message) {
  targetEl.innerHTML = `<div class="empty">${message}</div>`;
}

function renderEmptyActiveView(message) {
  if (state.view === "table") {
    matchesEl.innerHTML = "";
    previousEl.innerHTML = "";
    previousEl.style.display = "none";
    renderEmpty(tableEl, message);
  } else {
    tableEl.innerHTML = "";
    renderEmpty(matchesEl, message);
    previousEl.innerHTML = "";
    previousEl.style.display = "none";
  }
}

function normalizeStartTime(rawValue) {
  if (rawValue === null || rawValue === undefined) {
    return null;
  }

  const numericValue = typeof rawValue === "string" ? Number(rawValue) : rawValue;
  if (Number.isFinite(numericValue)) {
    return numericValue < 1e12 ? numericValue * 1000 : numericValue;
  }

  const date = new Date(rawValue);
  return Number.isNaN(date.getTime()) ? null : date.getTime();
}

function formatLocalTime(rawValue) {
  const timestamp = normalizeStartTime(rawValue);
  if (!timestamp) {
    return "TBD";
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function formatDayLabel(timestamp) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}

function getMatchStartValue(match) {
  return (
    match.startTime ||
    match.startTimeMillis ||
    match.startTimeUnix ||
    match.startTimeUtc ||
    match.startTimeISO
  );
}

function normalizeId(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function getKnownTeamIds() {
  return new Set([...state.teamsById.keys(), ...Object.keys(TEAM_BRAND_MAP)]);
}

function getClosestTeamId(inputId) {
  const normalizedInput = normalizeId(inputId);
  if (!normalizedInput) {
    return null;
  }

  const candidates = Array.from(getKnownTeamIds());
  let bestMatch = null;
  let bestScore = Infinity;

  candidates.forEach((candidate) => {
    const score = levenshtein(normalizeId(candidate), normalizedInput);
    if (score < bestScore) {
      bestScore = score;
      bestMatch = candidate;
    }
  });

  if (bestScore <= 2) {
    return bestMatch;
  }

  return null;
}

function resolveTeamId(teamId) {
  if (!teamId) {
    return null;
  }
  if (TEAM_ID_ALIASES[teamId]) {
    return TEAM_ID_ALIASES[teamId];
  }
  if (state.teamsById.has(teamId) || TEAM_BRAND_MAP[teamId]) {
    return teamId;
  }
  return getClosestTeamId(teamId) || teamId;
}

function resolveTeamName(teamId) {
  if (!teamId) {
    return "TBD";
  }
  const resolvedId = resolveTeamId(teamId);
  return state.teamsById.get(resolvedId) || resolvedId;
}

function resolveLeagueName(leagueId) {
  if (!leagueId) {
    return "";
  }
  return state.leaguesById.get(leagueId) || leagueId;
}

function hexToRgba(hex, alpha) {
  if (!hex || hex[0] !== "#" || (hex.length !== 7 && hex.length !== 4)) {
    return null;
  }

  const fullHex =
    hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex;
  const r = parseInt(fullHex.slice(1, 3), 16);
  const g = parseInt(fullHex.slice(3, 5), 16);
  const b = parseInt(fullHex.slice(5, 7), 16);
  if ([r, g, b].some((value) => Number.isNaN(value))) {
    return null;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getTeamBrand(teamId) {
  const resolvedId = resolveTeamId(teamId);
  if (!resolvedId) {
    return null;
  }
  const brand = TEAM_BRAND_MAP[resolvedId];
  if (!brand) {
    return null;
  }
  return {
    color: brand.color,
    logoUrl: brand.logoUrl || `${TEAM_LOGO_BASE}${resolvedId}.png`,
  };
}

function getCachedResponse(path) {
  try {
    const raw = localStorage.getItem(`lolScheduleCache:${path}`);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed?.timestamp || parsed?.data === undefined) {
      return null;
    }
    if (Date.now() - parsed.timestamp > RESPONSE_CACHE_TTL_MS) {
      return null;
    }
    return parsed.data;
  } catch (error) {
    return null;
  }
}

function setCachedResponse(path, data) {
  try {
    localStorage.setItem(
      `lolScheduleCache:${path}`,
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch (error) {
    console.warn("Unable to store response cache.", error);
  }
}

function getYouTubeApiKey() {
  try {
    const stored = localStorage.getItem(YOUTUBE_API_KEY_STORAGE_KEY);
    if (stored) {
      return stored;
    }
  } catch (error) {
    // Ignore storage errors and fall back to the inline key.
  }
  return YOUTUBE_API_KEY;
}

async function fetchYouTubeJson(endpoint, params) {
  try {
    const apiKey = getYouTubeApiKey();
    if (!apiKey) {
      return null;
    }
    const url = new URL(`${YOUTUBE_API_BASE}/${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
    url.searchParams.set("key", apiKey);
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`YouTube request failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("Unable to fetch YouTube data.", error);
    return null;
  }
}

async function fetchLckGlobalChannelId() {
  const apiKey = getYouTubeApiKey();
  if (!apiKey) {
    return null;
  }
  if (lckChannelIdValue && lckChannelIdKey === apiKey) {
    return lckChannelIdValue;
  }
  if (lckChannelIdPromise && lckChannelIdKey === apiKey) {
    return lckChannelIdPromise;
  }

  lckChannelIdKey = apiKey;
  lckChannelIdPromise = (async () => {
    const data = await fetchYouTubeJson("channels", {
      part: "id",
      forHandle: LCK_GLOBAL_HANDLE,
    });
    const channelId = data?.items?.[0]?.id || null;
    lckChannelIdValue = channelId;
    return channelId;
  })();
  return lckChannelIdPromise;
}

function normalizeMatchupText(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
}

function buildTeamMatchTokens(teamId, teamName) {
  const tokens = new Set();
  const normalizedId = normalizeMatchupText(teamId);
  const normalizedName = normalizeMatchupText(teamName);
  if (normalizedId) {
    tokens.add(normalizedId);
  }
  if (normalizedName) {
    tokens.add(normalizedName);
    tokens.add(normalizedName.replace(/\s+/g, ""));
    const parts = normalizedName.split(" ").filter(Boolean);
    if (parts.length > 1) {
      tokens.add(parts[0]);
      tokens.add(parts[parts.length - 1]);
    }
  }
  return tokens;
}

function titleMatchesTeams(title, teamAId, teamBId, teamAName, teamBName) {
  if (!title) {
    return false;
  }
  const titleNormalized = normalizeMatchupText(title);
  const teamATokens = buildTeamMatchTokens(teamAId, teamAName);
  const teamBTokens = buildTeamMatchTokens(teamBId, teamBName);
  const matchesTeamA = Array.from(teamATokens).some((token) =>
    token ? titleNormalized.includes(token) : false
  );
  const matchesTeamB = Array.from(teamBTokens).some((token) =>
    token ? titleNormalized.includes(token) : false
  );
  return matchesTeamA && matchesTeamB;
}
function getLckVodCacheKey(matchupString, matchStartTime) {
  const keyTime = Number.isFinite(matchStartTime) ? String(matchStartTime) : "unknown";
  return `${matchupString}::${keyTime}`;
}

function isLckVodFresh(publishedAt, matchStartTime) {
  if (!publishedAt || !Number.isFinite(matchStartTime)) {
    return true;
  }
  const publishedTime = new Date(publishedAt).getTime();
  if (!Number.isFinite(publishedTime)) {
    return false;
  }
  const diffMs = Math.abs(publishedTime - matchStartTime);
  return diffMs <= 24 * 60 * 60 * 1000;
}

async function fetchLckVodVideoId(matchupString, matchStartTime) {
  const channelId = await fetchLckGlobalChannelId();
  if (!channelId) {
    return null;
  }

  const primary = await fetchYouTubeJson("search", {
    part: "snippet",
    channelId,
    type: "video",
    eventType: "completed",
    order: "date",
    maxResults: 5,
    q: matchupString,
  });
  const primaryItems = Array.isArray(primary?.items) ? primary.items : [];
  const primaryMatch = primaryItems.find((item) => {
    return isLckVodFresh(item?.snippet?.publishedAt, matchStartTime);
  });
  if (primaryMatch?.id?.videoId) {
    return primaryMatch.id.videoId;
  }

  const parts = matchupString
    .split(" - ")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length < 2) {
    return null;
  }

  const fallback = await fetchYouTubeJson("search", {
    part: "snippet",
    channelId,
    type: "video",
    eventType: "completed",
    order: "date",
    maxResults: 5,
    q: parts[0],
  });
  const fallbackItems = Array.isArray(fallback?.items) ? fallback.items : [];
  const requiredParts = parts.slice(1).map((part) => normalizeMatchupText(part));
  const candidate = fallbackItems.find((item) => {
    if (!item?.id?.videoId || !item?.snippet?.title) {
      return false;
    }
    const titleNormalized = normalizeMatchupText(item.snippet.title);
    const isValid = requiredParts.every((part) => part && titleNormalized.includes(part));
    if (!isValid) {
      return false;
    }
    return isLckVodFresh(item?.snippet?.publishedAt, matchStartTime);
  });
  return candidate?.id?.videoId || null;
}

async function fetchLckVodUrl(matchupString, matchStartTime) {
  const cacheKey = getLckVodCacheKey(matchupString, matchStartTime);
  if (lckVodCache.has(cacheKey)) {
    return lckVodCache.get(cacheKey);
  }

  const videoId = await fetchLckVodVideoId(matchupString, matchStartTime);
  const url = videoId ? `https://www.youtube.com/watch?v=${videoId}&t=0s` : null;
  lckVodCache.set(cacheKey, url);
  return url;
}

function titleMatchesMatchup(title, matchupString) {
  if (!title || !matchupString) {
    return false;
  }
  const titleNormalized = normalizeMatchupText(title);
  const requiredParts = matchupString
    .split(" - ")
    .map((part) => normalizeMatchupText(part))
    .filter(Boolean);
  return requiredParts.every((part) => titleNormalized.includes(part));
}

async function fetchLckLiveVideo(matchupString) {
  const channelId = await fetchLckGlobalChannelId();
  if (!channelId) {
    return null;
  }

  const data = await fetchYouTubeJson("search", {
    part: "snippet",
    channelId,
    type: "video",
    eventType: "live",
    order: "date",
    maxResults: 5,
  });
  const items = Array.isArray(data?.items) ? data.items : [];
  if (!matchupString) {
    return items[0] || null;
  }
  return (
    items.find((item) => titleMatchesMatchup(item?.snippet?.title, matchupString)) || null
  );
}

async function fetchLckLiveStartUrl(matchupString) {
  const cacheKey = matchupString || "generic";
  if (lckLiveStartCache.has(cacheKey)) {
    return lckLiveStartCache.get(cacheKey);
  }
  if (lckLiveStartPromises.has(cacheKey)) {
    return lckLiveStartPromises.get(cacheKey);
  }

  const promise = (async () => {
    const liveVideo = await fetchLckLiveVideo(matchupString);
    const videoId = liveVideo?.id?.videoId;
    const url = videoId ? `https://www.youtube.com/watch?v=${videoId}&t=0s` : null;
    if (url) {
      lckLiveStartCache.set(cacheKey, url);
    }
    lckLiveStartPromises.delete(cacheKey);
    return url;
  })();
  lckLiveStartPromises.set(cacheKey, promise);
  return promise;
}

async function hydrateLckLiveStartLinks(container) {
  const apiKey = getYouTubeApiKey();
  if (!apiKey || !container) {
    return;
  }

  const pendingLinks = Array.from(
    container.querySelectorAll('a[data-lck-live-start="pending"]')
  );
  if (!pendingLinks.length) {
    return;
  }

  const url = await fetchLckLiveStartUrl(null);
  if (!url) {
    return;
  }

  pendingLinks.forEach((link) => {
    link.href = url;
    link.dataset.lckLiveStart = "ready";
  });
}

async function fetchLckEnglishChannelId() {
  const apiKey = getYouTubeApiKey();
  if (!apiKey) {
    return null;
  }
  const data = await fetchYouTubeJson("channels", {
    part: "id",
    forHandle: LCK_ENGLISH_HANDLE,
  });
  return data?.items?.[0]?.id || null;
}

function parseGameNumber(title) {
  const match = String(title || "").match(/(?:game|match|set)\s*(\d+)/i);
  return match ? Number(match[1]) : null;
}

function buildLckEnglishQuery(matchupString, teamAName, teamBName, teamAId, teamBId) {
  if (teamAName && teamBName) {
    return `${teamAName} vs ${teamBName}`;
  }
  if (teamAId && teamBId) {
    return `${teamAId} vs ${teamBId}`;
  }
  return matchupString;
}

async function fetchLckEnglishVodLinks(
  matchupString,
  matchStartTime,
  bestOf,
  teamAId,
  teamBId,
  teamAName,
  teamBName
) {
  const channelId = await fetchLckEnglishChannelId();
  if (!channelId) {
    return [];
  }

  const query = buildLckEnglishQuery(matchupString, teamAName, teamBName, teamAId, teamBId);
  const data = await fetchYouTubeJson("search", {
    part: "snippet",
    channelId,
    type: "video",
    eventType: "completed",
    order: "date",
    maxResults: 10,
    q: query,
  });
  const items = Array.isArray(data?.items) ? data.items : [];
  const filtered = items.filter((item) => {
    if (!item?.id?.videoId) {
      return false;
    }
    const hasTeamTokens =
      Boolean(teamAId || teamAName) && Boolean(teamBId || teamBName);
    if (hasTeamTokens) {
      if (
        !titleMatchesTeams(item?.snippet?.title, teamAId, teamBId, teamAName, teamBName)
      ) {
        return false;
      }
    } else if (!titleMatchesMatchup(item?.snippet?.title, matchupString)) {
      return false;
    }
    return isLckVodFresh(item?.snippet?.publishedAt, matchStartTime);
  });

  const sorted = filtered.sort((a, b) => {
    const timeA = new Date(a?.snippet?.publishedAt || 0).getTime();
    const timeB = new Date(b?.snippet?.publishedAt || 0).getTime();
    return timeA - timeB;
  });

  const limited =
    Number.isFinite(bestOf) && bestOf > 0 ? sorted.slice(0, bestOf) : sorted;
  return limited.map((item, index) => {
    const gameNumber = parseGameNumber(item?.snippet?.title);
    const labelNumber = Number.isFinite(gameNumber) ? gameNumber : index + 1;
    return {
      label: `${LCK_ENGLISH_VOD_LABEL} (Game ${labelNumber})`,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}&t=0s`,
    };
  });
}
  const data = await fetchYouTubeJson("search", {
    part: "snippet",
    channelId,
    type: "video",
    eventType: "completed",
    order: "date",
    maxResults: 10,
    q: matchupString,
  });
  const items = Array.isArray(data?.items) ? data.items : [];
  const filtered = items.filter((item) => {
    if (!item?.id?.videoId) {
      return false;
    }
    if (!titleMatchesMatchup(item?.snippet?.title, matchupString)) {
      return false;
    }
    return isLckVodFresh(item?.snippet?.publishedAt, matchStartTime);
  });

  const sorted = filtered.sort((a, b) => {
    const timeA = new Date(a?.snippet?.publishedAt || 0).getTime();
    const timeB = new Date(b?.snippet?.publishedAt || 0).getTime();
    return timeA - timeB;
  });

  const limited =
    Number.isFinite(bestOf) && bestOf > 0 ? sorted.slice(0, bestOf) : sorted;
  return limited.map((item, index) => {
    const gameNumber = parseGameNumber(item?.snippet?.title);
    const hasGameNumber = Number.isFinite(gameNumber);
    const label =
      hasGameNumber
        ? `${LCK_ENGLISH_VOD_LABEL} (Game ${gameNumber})`
        : limited.length > 1
          ? `${LCK_ENGLISH_VOD_LABEL} (Part ${index + 1})`
          : LCK_ENGLISH_VOD_LABEL;
    return {
      label,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}&t=0s`,
    };
  });
}

function getMatchupDisplayTeamId(teamId) {
  const resolvedId = resolveTeamId(teamId);
  if (!resolvedId) {
    return "TBD";
  }
  return TEAM_DISPLAY_ID_OVERRIDES[resolvedId] || resolvedId;
}

function getLckDayKey(timestamp) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(timestamp));
}

function buildLckMatchupString(match) {
  const startTime = normalizeStartTime(getMatchStartValue(match));
  if (!startTime) {
    return null;
  }
  const dayKey = getLckDayKey(startTime);
  const dayMatches = state.matches.filter((item) => {
    const itemStart = normalizeStartTime(getMatchStartValue(item));
    return itemStart && getLckDayKey(itemStart) === dayKey;
  });

  const sortedDayMatches = [...dayMatches].sort(
    (a, b) =>
      normalizeStartTime(getMatchStartValue(a)) - normalizeStartTime(getMatchStartValue(b))
  );
  const matchupParts = sortedDayMatches
    .map((item) => {
      const blueId = item.blueTeamId || item.blueTeam?.id;
      const redId = item.redTeamId || item.redTeam?.id;
      if (!blueId || !redId) {
        return null;
      }
      return `${getMatchupDisplayTeamId(blueId)} vs ${getMatchupDisplayTeamId(redId)}`;
    })
    .filter(Boolean);

  return matchupParts.length ? matchupParts.join(" - ") : null;
}

function buildLckSingleMatchupString(match) {
  const blueId = match.blueTeamId || match.blueTeam?.id;
  const redId = match.redTeamId || match.redTeam?.id;
  if (!blueId || !redId) {
    return null;
  }
  return `${getMatchupDisplayTeamId(blueId)} vs ${getMatchupDisplayTeamId(redId)}`;
}

async function hydrateLckVodLinks(container) {
  const apiKey = getYouTubeApiKey();
  if (!apiKey || !container) {
    return;
  }

  const pendingLinks = Array.from(container.querySelectorAll('a[data-lck-vod="pending"]'));
  if (!pendingLinks.length) {
    return;
  }

  const linksByMatchup = new Map();
  pendingLinks.forEach((link) => {
    const dayEncoded = link.dataset.lckMatchup || "";
    const matchupDay = decodeURIComponent(dayEncoded);
    const singleEncoded = link.dataset.lckMatchupSingle || "";
    const matchupSingle = decodeURIComponent(singleEncoded);
    const teamAId = decodeURIComponent(link.dataset.lckTeamAId || "");
    const teamBId = decodeURIComponent(link.dataset.lckTeamBId || "");
    const teamAName = decodeURIComponent(link.dataset.lckTeamAName || "");
    const teamBName = decodeURIComponent(link.dataset.lckTeamBName || "");
    if (!matchupDay) {
      return;
    }
    if (!linksByMatchup.has(matchupDay)) {
      linksByMatchup.set(matchupDay, []);
    }
    linksByMatchup.get(matchupDay).push({
      link,
      matchupSingle,
      teamAId,
      teamBId,
      teamAName,
      teamBName,
    });
  });

  for (const [matchupDay, entries] of linksByMatchup) {
    try {
      for (const entry of entries) {
        const { link, matchupSingle, teamAId, teamBId, teamAName, teamBName } = entry;
        const startTime = Number(link.dataset.lckStartTime);
        const url = await fetchLckVodUrl(matchupDay, startTime);
        if (url) {
          link.href = url;
          link.dataset.lckVod = "ready";
          continue;
        }

        const isRecentMatch =
          Number.isFinite(startTime) && Math.abs(Date.now() - startTime) <= 24 * 60 * 60 * 1000;
        if (isRecentMatch) {
          const liveStartUrl = await fetchLckLiveStartUrl(matchupSingle || matchupDay);
          if (liveStartUrl) {
            link.href = liveStartUrl;
            link.dataset.lckVod = "ready";
            continue;
          }
        }

        const bestOf = Number(link.dataset.lckBestOf);
        const englishLinks = await fetchLckEnglishVodLinks(
          matchupSingle || matchupDay,
          startTime,
          Number.isFinite(bestOf) ? bestOf : null,
          teamAId,
          teamBId,
          teamAName,
          teamBName
        );
        if (englishLinks.length) {
          link.href = englishLinks[0].url;
          link.textContent = englishLinks[0].label;
          link.dataset.lckVod = "ready";
          englishLinks.slice(1).forEach((entry) => {
            const extraLink = document.createElement("a");
            extraLink.className = "match-link";
            extraLink.href = entry.url;
            extraLink.target = "_blank";
            extraLink.rel = "noopener noreferrer";
            extraLink.textContent = entry.label;
            link.parentElement?.appendChild(extraLink);
          });
          continue;
        }

        link.href = `${LCK_ENGLISH_CHANNEL_URL}`;
        link.textContent = LCK_ENGLISH_VOD_LABEL;
        link.dataset.lckVod = "ready";
      }
    } catch (error) {
      console.warn("Failed to hydrate LCK VOD link.", error);
    }
  }
}

async function fetchJson(path) {
  const url = `${API_BASE}${path}`;
  const urlsToTry = [url, ...CORS_PROXIES.map((proxy) => `${proxy}${encodeURIComponent(url)}`)];

  for (const targetUrl of urlsToTry) {
    try {
      const response = await fetch(targetUrl);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const data = await response.json();
      setCachedResponse(path, data);
      return data;
    } catch (error) {
      // Continue to the next URL.
    }
  }

  const cached = getCachedResponse(path);
  if (cached !== null) {
    return cached;
  }

  if (Object.prototype.hasOwnProperty.call(FALLBACK_DATA, path)) {
    return FALLBACK_DATA[path];
  }

  throw new Error(`All requests failed for ${path}`);
}

function getLiveLinks(leagueId) {
  const streamInfo =
    STREAMS_BY_LEAGUE_ID[leagueId] || {
      official: "https://www.youtube.com/@lolesports/live",
    };
  const links = [
    {
      label: "Official live",
      url: streamInfo.official,
    },
  ];
  if (streamInfo.coStream && state.caedrelLive !== false) {
    links.push({
      label: "Caedrel co-stream",
      url: streamInfo.coStream,
    });
  }
  if (leagueId === "LCK" && getYouTubeApiKey()) {
    links.push({
      label: LCK_LIVE_START_LABEL,
      url: `${LCK_GLOBAL_CHANNEL_URL}/live`,
      lckLiveStart: true,
    });
  }
  return links;
}

async function refreshCaedrelStatus() {
  if (!TWITCH_CLIENT_ID || !TWITCH_ACCESS_TOKEN) {
    state.caedrelLive = null;
    return;
  }

  const now = Date.now();
  if (state.lastTwitchCheck && now - state.lastTwitchCheck < TWITCH_STATUS_TTL_MS) {
    return;
  }

  state.lastTwitchCheck = now;
  try {
    const response = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${TWITCH_STREAMER_LOGIN}`,
      {
        headers: {
          "Client-ID": TWITCH_CLIENT_ID,
          Authorization: `Bearer ${TWITCH_ACCESS_TOKEN}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Twitch request failed: ${response.status}`);
    }
    const data = await response.json();
    state.caedrelLive = Array.isArray(data?.data) && data.data.length > 0;
  } catch (error) {
    console.warn("Unable to check Twitch live status.", error);
    state.caedrelLive = null;
  }
}

function getVodLinks(match, leagueId) {
  if (leagueId === "LCK") {
    const matchupString = buildLckMatchupString(match);
    if (matchupString) {
      const startTime = normalizeStartTime(getMatchStartValue(match));
      const singleMatchup = buildLckSingleMatchupString(match);
      const blueId = match.blueTeamId || match.blueTeam?.id;
      const redId = match.redTeamId || match.redTeam?.id;
      const teamAName = resolveTeamName(blueId);
      const teamBName = resolveTeamName(redId);
      const bestOf = Number(match.bestOf);
      return [
        {
          label: LCK_VOD_LABEL,
          url: `${LCK_GLOBAL_CHANNEL_URL}/videos`,
          lckMatchup: matchupString,
          lckMatchupSingle: singleMatchup,
          lckTeamAId: blueId,
          lckTeamBId: redId,
          lckTeamAName: teamAName,
          lckTeamBName: teamBName,
          lckStartTime: Number.isFinite(startTime) ? startTime : null,
          lckBestOf: Number.isFinite(bestOf) ? bestOf : null,
        },
      ];
    }
  }

  if (match.vod) {
    return [
      {
        label: "Official VOD",
        url: match.vod,
      },
    ];
  }

  const blueId = match.blueTeamId || match.blueTeam?.id;
  const redId = match.redTeamId || match.redTeam?.id;
  const teamA = resolveTeamName(blueId);
  const teamB = resolveTeamName(redId);
  const leagueName = resolveLeagueName(leagueId);
  const startTime = normalizeStartTime(getMatchStartValue(match));
  const dateLabel = startTime ? formatDayLabel(startTime) : "";

  const query = [leagueName, teamA, teamB, dateLabel, "full game"]
    .filter(Boolean)
    .join(" ");
  return [
    {
      label: "YouTube replay search",
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    },
  ];
}

async function fetchLeagueHasData(leagueId) {
  const tournament = await fetchJson(`/most-recent-tournament/${leagueId}`);
  const tournamentId = tournament?.tournamentId;
  if (!tournamentId) {
    return false;
  }
  const matches = await fetchJson(`/matches/${tournamentId}`);
  if (!Array.isArray(matches) || !matches.length) {
    return false;
  }

  const now = Date.now();
  return matches.some((match) => {
    const startTime = normalizeStartTime(getMatchStartValue(match));
    return startTime && startTime >= now - RECENT_MATCH_WINDOW_MS;
  });
}

async function mapWithConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let index = 0;

  const runners = new Array(Math.min(limit, items.length)).fill(null).map(async () => {
    while (index < items.length) {
      const currentIndex = index;
      index += 1;
      results[currentIndex] = await worker(items[currentIndex], currentIndex);
    }
  });

  await Promise.all(runners);
  return results;
}

async function filterLeaguesWithData(leagues) {
  const cached = getLeagueDataCache();
  const dataCache = cached?.data ? { ...cached.data } : {};
  const toCheck = leagues.filter((league) => dataCache[league.leagueId] === undefined);

  if (toCheck.length) {
    await mapWithConcurrency(toCheck, 6, async (league) => {
      try {
        const hasData = await fetchLeagueHasData(league.leagueId);
        dataCache[league.leagueId] = hasData;
      } catch (error) {
        dataCache[league.leagueId] =
          PRIORITY_EVENT_IDS.includes(league.leagueId) ||
          MAJOR_LEAGUE_IDS.includes(league.leagueId);
      }
    });
    setLeagueDataCache(dataCache);
  }

  const filtered = leagues.filter((league) => dataCache[league.leagueId]);
  return filtered.length ? filtered : leagues;
}

async function loadTeams() {
  if (state.teamsById.size) {
    return;
  }

  try {
    // Data flow: preload teams to map IDs to readable names.
    const teams = await fetchJson("/teams");
    teams.forEach((team) => {
      if (team?.teamId) {
        state.teamsById.set(team.teamId, team.name || team.teamId);
      }
    });
  } catch (error) {
    console.warn("Failed to load teams. Falling back to IDs.", error);
  }
}

function buildMatchCard(match, leagueId, isLive) {
  const startTime = getMatchStartValue(match);
  const startTimestamp = normalizeStartTime(startTime);
  const isUpcoming = !isLive && startTimestamp && startTimestamp > Date.now();
  const blueId = match.blueTeamId || match.blueTeam?.id;
  const redId = match.redTeamId || match.redTeam?.id;
  const teamA = resolveTeamName(blueId);
  const teamB = resolveTeamName(redId);
  const bestOf = match.bestOf ? `Bo${match.bestOf}` : "";
  const patch = match.patch ? `Patch ${match.patch}` : "";
  const badge = match.badge ? `<span class="live-badge">${match.badge}</span>` : "";
  const brandA = getTeamBrand(blueId);
  const brandB = getTeamBrand(redId);
  const themeA = brandA?.color ? hexToRgba(brandA.color, 0.12) : null;
  const themeB = brandB?.color ? hexToRgba(brandB.color, 0.12) : null;
  const themeStyle = themeA && themeB ? `style="--team-a:${themeA};--team-b:${themeB};"` : "";
  const logoA = brandA?.logoUrl
    ? `<span class="team-logo" style="--logo-url:url('${brandA.logoUrl}')">${blueId}</span>`
    : `<span class="team-logo team-logo--fallback">${blueId}</span>`;
  const logoB = brandB?.logoUrl
    ? `<span class="team-logo" style="--logo-url:url('${brandB.logoUrl}')">${redId}</span>`
    : `<span class="team-logo team-logo--fallback">${redId}</span>`;
  const watchLinks = isUpcoming
    ? []
    : isLive
      ? getLiveLinks(leagueId)
      : getVodLinks(match, leagueId);
  const watchMarkup = watchLinks.length
    ? `
        <div class="match-actions">
          ${watchLinks
            .map((link) => {
              const lckAttrs = link.lckMatchup
                ? ` data-lck-vod="pending" data-lck-matchup="${encodeURIComponent(
                    link.lckMatchup
                  )}"`
                : "";
              const lckSingleAttrs = link.lckMatchupSingle
                ? ` data-lck-matchup-single="${encodeURIComponent(link.lckMatchupSingle)}"`
                : "";
              const lckStartAttr = Number.isFinite(link.lckStartTime)
                ? ` data-lck-start-time="${link.lckStartTime}"`
                : "";
              const lckBestOfAttr = Number.isFinite(link.lckBestOf)
                ? ` data-lck-best-of="${link.lckBestOf}"`
                : "";
              const lckTeamAIdAttr = link.lckTeamAId
                ? ` data-lck-team-a-id="${encodeURIComponent(link.lckTeamAId)}"`
                : "";
              const lckTeamBIdAttr = link.lckTeamBId
                ? ` data-lck-team-b-id="${encodeURIComponent(link.lckTeamBId)}"`
                : "";
              const lckTeamANameAttr = link.lckTeamAName
                ? ` data-lck-team-a-name="${encodeURIComponent(link.lckTeamAName)}"`
                : "";
              const lckTeamBNameAttr = link.lckTeamBName
                ? ` data-lck-team-b-name="${encodeURIComponent(link.lckTeamBName)}"`
                : "";
              const lckLiveAttrs = link.lckLiveStart
                ? ' data-lck-live-start="pending"'
                : "";
              return `
                <a class="match-link" href="${link.url}" target="_blank" rel="noopener noreferrer"${lckAttrs}${lckSingleAttrs}${lckStartAttr}${lckBestOfAttr}${lckTeamAIdAttr}${lckTeamBIdAttr}${lckTeamANameAttr}${lckTeamBNameAttr}${lckLiveAttrs}>
                  ${link.label}
                </a>
              `;
            })
            .join("")}
        </div>
      `
    : "";

  return `
    <article class="match match-themed" ${themeStyle}>
      <div class="match-header">
        <div class="team-line">
          <span class="team-block">${logoA}<span class="team-name">${teamA}</span></span>
          <span class="team-vs">vs</span>
          <span class="team-block">${logoB}<span class="team-name">${teamB}</span></span>
          ${badge}
        </div>
        <div class="match-time">${formatLocalTime(startTime)}</div>
      </div>
      <div class="match-meta">
        ${[bestOf, patch].filter(Boolean).join(" · ")}
      </div>
      ${watchMarkup}
    </article>
  `;
}

function filterUpcomingMatches(matches) {
  const now = Date.now();

  return matches
    .map((match) => ({
      match,
      start: normalizeStartTime(getMatchStartValue(match)),
    }))
    .filter((item) => Number.isFinite(item.start))
    .filter((item) => item.start >= now)
    .sort((a, b) => a.start - b.start)
    .map((item) => item.match);
}

function groupMatchesByDay(matches) {
  const groups = new Map();

  matches.forEach((match) => {
    const startTime = normalizeStartTime(getMatchStartValue(match));
    if (!startTime) {
      return;
    }
    const dateKey = new Date(startTime).toDateString();
    if (!groups.has(dateKey)) {
      groups.set(dateKey, { label: formatDayLabel(startTime), matches: [] });
    }
    groups.get(dateKey).matches.push(match);
  });

  return Array.from(groups.values());
}

function splitMatchesByTiming(matches) {
  const now = Date.now();
  const live = [];
  const upcoming = [];
  const previous = [];

  matches.forEach((match) => {
    const startTime = normalizeStartTime(getMatchStartValue(match));
    if (!startTime) {
      return;
    }

    if (startTime <= now && startTime >= now - LIVE_WINDOW_MS) {
      live.push({ ...match, badge: "Live" });
    } else if (startTime < now - LIVE_WINDOW_MS) {
      previous.push(match);
    } else {
      upcoming.push(match);
    }
  });

  live.sort((a, b) => normalizeStartTime(getMatchStartValue(a)) - normalizeStartTime(getMatchStartValue(b)));
  upcoming.sort(
    (a, b) => normalizeStartTime(getMatchStartValue(a)) - normalizeStartTime(getMatchStartValue(b))
  );
  previous.sort(
    (a, b) => normalizeStartTime(getMatchStartValue(b)) - normalizeStartTime(getMatchStartValue(a))
  );

  return { live, upcoming, previous };
}

function computeStandings(matches) {
  const table = new Map();

  matches.forEach((match) => {
    const blueId = match.blueTeamId || match.blueTeam?.id;
    const redId = match.redTeamId || match.redTeam?.id;
    if (!blueId || !redId || !match.winner) {
      return;
    }

    let winnerId = match.winner;
    if (winnerId === "BLUE") {
      winnerId = blueId;
    }
    if (winnerId === "RED") {
      winnerId = redId;
    }

    if (winnerId !== blueId && winnerId !== redId) {
      return;
    }

    const ensureRow = (teamId) => {
      if (!table.has(teamId)) {
        table.set(teamId, {
          teamId,
          name: resolveTeamName(teamId),
          wins: 0,
          losses: 0,
        });
      }
    };

    ensureRow(blueId);
    ensureRow(redId);

    if (winnerId === blueId) {
      table.get(blueId).wins += 1;
      table.get(redId).losses += 1;
    } else {
      table.get(redId).wins += 1;
      table.get(blueId).losses += 1;
    }
  });

  return Array.from(table.values()).sort((a, b) => {
    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }
    if (a.losses !== b.losses) {
      return a.losses - b.losses;
    }
    return a.name.localeCompare(b.name);
  });
}

function renderSchedule() {
  matchesEl.style.display = "grid";
  tableEl.style.display = "none";
  previousEl.style.display = "none";

  if (!state.matches.length) {
    renderEmpty(matchesEl, "No matches available for this tournament.");
    setPreviousToggleLabel(0);
    setStatus("");
    return;
  }

  const { live, upcoming, previous } = splitMatchesByTiming(state.matches);
  setPreviousToggleLabel(previous.length);
  if (!upcoming.length && !live.length) {
    renderEmpty(matchesEl, "No upcoming matches right now. Check back later.");
    setStatus("");
    return;
  }

  const groupedUpcoming = groupMatchesByDay(upcoming);
  const liveSection = live.length
    ? `
      <section class="day-group">
        <div class="day-header">Live now</div>
        <div class="day-matches">
          ${live.map((match) => buildMatchCard(match, state.currentLeagueId, true)).join("")}
        </div>
      </section>
    `
    : "";

  matchesEl.innerHTML = `${liveSection}${groupedUpcoming
    .map((group) => {
      return `
        <section class="day-group">
          <div class="day-header">${group.label}</div>
          <div class="day-matches">
            ${group.matches
              .map((match) => buildMatchCard(match, state.currentLeagueId, false))
              .join("")}
          </div>
        </section>
      `;
    })
    .join("")}`;

  const previousMatches = previous.slice(0, PREVIOUS_LIMIT);
  if (state.showPrevious && previousMatches.length) {
    const groupedPrevious = groupMatchesByDay(previousMatches);
    previousEl.innerHTML = `
      <div class="section-title">Previous matches</div>
      ${groupedPrevious
        .map((group) => {
          return `
            <section class="day-group">
              <div class="day-header">${group.label}</div>
              <div class="day-matches">
                ${group.matches
                  .map((match) => buildMatchCard(match, state.currentLeagueId, false))
                  .join("")}
              </div>
            </section>
          `;
        })
        .join("")}
    `;
    previousEl.style.display = "block";
  } else {
    previousEl.innerHTML = "";
    previousEl.style.display = "none";
  }

  const statusParts = [];
  if (live.length) {
    statusParts.push(`${live.length} live`);
  }
  if (upcoming.length) {
    statusParts.push(`${upcoming.length} upcoming`);
  }
  setStatus(`Showing ${statusParts.join(" · ")} matches.`);
  hydrateLckVodLinks(matchesEl);
  hydrateLckVodLinks(previousEl);
  hydrateLckLiveStartLinks(matchesEl);
}

function renderStandings() {
  matchesEl.style.display = "none";
  tableEl.style.display = "block";
  previousEl.style.display = "none";

  if (!state.matches.length) {
    renderEmpty(tableEl, "No matches available for this tournament.");
    setStatus("");
    return;
  }

  const standings = computeStandings(state.matches);
  if (!standings.length) {
    renderEmpty(tableEl, "No results yet for this tournament.");
    setStatus("");
    return;
  }

  const rows = standings
    .map((row, index) => {
      const played = row.wins + row.losses;
      const winRate = played ? `${Math.round((row.wins / played) * 100)}%` : "0%";
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${row.name}</td>
          <td>${row.wins}</td>
          <td>${row.losses}</td>
          <td>${winRate}</td>
        </tr>
      `;
    })
    .join("");

  tableEl.innerHTML = `
    <table class="standings">
      <thead>
        <tr>
          <th>#</th>
          <th>Team</th>
          <th>W</th>
          <th>L</th>
          <th>Win%</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;

  setStatus(`Showing standings with ${standings.length} teams.`);
}

function renderCurrentView() {
  if (state.view === "table") {
    renderStandings();
  } else {
    renderSchedule();
  }
}

function setView(view) {
  state.view = view;
  viewButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });
  renderCurrentView();
}

function setPreviousToggleLabel(count) {
  if (!previousToggle) {
    return;
  }

  if (count === 0) {
    previousToggle.textContent = "";
    previousToggle.disabled = true;
    return;
  }

  previousToggle.disabled = false;
  previousToggle.textContent = state.showPrevious
    ? "Hide previous matches"
    : `Show previous matches (${Math.min(count, PREVIOUS_LIMIT)})`;
}

async function loadMatches(leagueId) {
  await refreshCaedrelStatus();
  setLoading(true);
  try {
    setStatus("Loading tournament...");

    // Data flow: league -> most recent tournament -> matches list.
    const tournament = await fetchJson(`/most-recent-tournament/${leagueId}`);
    const tournamentId = tournament?.tournamentId;

    if (!tournamentId) {
      state.matches = [];
      renderEmptyActiveView("No recent tournament found for this league.");
      setStatus("");
      return;
    }

    state.currentLeagueId = leagueId;
    state.currentTournamentId = tournamentId;

    setStatus("Loading matches...");
    const matches = await fetchJson(`/matches/${tournamentId}`);
    state.matches = Array.isArray(matches) ? matches : [];

    if (!state.matches.length) {
      renderCurrentView();
      setPreviousToggleLabel(0);
      setStatus("");
      return;
    }

    const { previous } = splitMatchesByTiming(state.matches);
    setPreviousToggleLabel(previous.length);
    renderCurrentView();
  } catch (error) {
    console.error(error);
    renderEmptyActiveView("Could not load schedule. Please try again later.");
    setStatus("");
  } finally {
    setLoading(false);
  }
}

function populateLeagueOptions(leagues) {
  leagueSelect.innerHTML = "";

  leagues.forEach((league) => {
    const option = document.createElement("option");
    option.value = league.leagueId;
    option.textContent = league.leagueName;
    leagueSelect.appendChild(option);
  });
}

function getLeagueSortWeight(league) {
  if (PRIORITY_EVENT_IDS.includes(league.leagueId)) {
    return 0;
  }
  if (MAJOR_LEAGUE_IDS.includes(league.leagueId)) {
    return 1;
  }

  const level = (league.level || "").toLowerCase();
  if (league.isOfficial && level === "primary") {
    return 2;
  }
  if (league.isOfficial) {
    return 3;
  }
  return 4;
}

function getStoredLeagueId() {
  try {
    return localStorage.getItem(LEAGUE_STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function storeLeagueId(leagueId) {
  try {
    localStorage.setItem(LEAGUE_STORAGE_KEY, leagueId);
  } catch (error) {
    console.warn("Unable to store league preference.", error);
  }
}

function getPreferredLeagues() {
  try {
    const raw = localStorage.getItem(LEAGUE_PREFERENCES_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function setPreferredLeagues(leagueIds) {
  try {
    localStorage.setItem(LEAGUE_PREFERENCES_KEY, JSON.stringify(leagueIds));
  } catch (error) {
    console.warn("Unable to store preferred leagues.", error);
  }
}

function getLeagueCatalog() {
  try {
    const raw = localStorage.getItem(LEAGUE_CATALOG_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function setLeagueCatalog(leagues) {
  try {
    const slim = leagues.map((league) => ({
      leagueId: league.leagueId,
      leagueName: league.leagueName,
    }));
    localStorage.setItem(LEAGUE_CATALOG_KEY, JSON.stringify(slim));
  } catch (error) {
    console.warn("Unable to store league catalog.", error);
  }
}

function populateLeagueDatalist(leagues) {
  if (!leagueOptionsList) {
    return;
  }

  leagueOptionsList.innerHTML = "";
  leagues
    .filter((league) => league?.leagueName)
    .sort((a, b) => (a.leagueName || "").localeCompare(b.leagueName || ""))
    .forEach((league) => {
      const option = document.createElement("option");
      option.value = league.leagueName;
      leagueOptionsList.appendChild(option);
    });
}

function updateLeagueDatalist(searchValue) {
  const needle = normalizeLeagueSearch(searchValue);
  if (needle.length < 2) {
    populateLeagueDatalist(state.leagues);
    return;
  }

  const matches = state.leagueCatalog.filter((league) =>
    normalizeLeagueSearch(league.leagueName).includes(needle)
  );
  populateLeagueDatalist(matches);
}

function normalizeLeagueSearch(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function findLeagueBySearch(leagues, searchValue) {
  const needle = normalizeLeagueSearch(searchValue);
  if (!needle) {
    return null;
  }

  const exact = leagues.find(
    (league) => normalizeLeagueSearch(league.leagueName) === needle
  );
  if (exact) {
    return exact;
  }

  return (
    leagues.find((league) =>
      normalizeLeagueSearch(league.leagueName).includes(needle)
    ) || null
  );
}

function orderLeaguesByPreference(leagues, preferredIds) {
  if (!preferredIds.length) {
    return leagues;
  }

  const preferred = leagues.filter((league) => preferredIds.includes(league.leagueId));
  const remaining = leagues.filter((league) => !preferredIds.includes(league.leagueId));
  return [
    ...preferred,
    ...remaining.sort((a, b) => (a.leagueName || "").localeCompare(b.leagueName || "")),
  ];
}

function buildLeagueOptionsList(leagues) {
  const sortedByPriority = [...leagues].sort((a, b) => {
    const weightA = getLeagueSortWeight(a);
    const weightB = getLeagueSortWeight(b);
    if (weightA !== weightB) {
      return weightA - weightB;
    }
    return (a.leagueName || "").localeCompare(b.leagueName || "");
  });
  const preferredLeagues = getPreferredLeagues();
  const leaguesToShow = orderLeaguesByPreference(sortedByPriority, preferredLeagues);
  populateLeagueOptions(leaguesToShow);
  return leaguesToShow;
}

function filterLeaguesByData(leagues, dataCache) {
  if (!dataCache) {
    return [];
  }
  return leagues.filter((league) => dataCache[league.leagueId] === true);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getLeagueDataCache() {
  try {
    const raw = localStorage.getItem(LEAGUE_DATA_CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed?.timestamp || !parsed?.data) {
      return null;
    }
    if (Date.now() - parsed.timestamp > LEAGUE_DATA_CACHE_TTL_MS) {
      return null;
    }
    return parsed;
  } catch (error) {
    return null;
  }
}

function setLeagueDataCache(data) {
  try {
    localStorage.setItem(
      LEAGUE_DATA_CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch (error) {
    console.warn("Unable to store league data cache.", error);
  }
}

function setLeagueBuckets(buckets) {
  try {
    const payload = {
      withData: Array.from(buckets.withData),
      likelyNoData: Array.from(buckets.likelyNoData),
      unlikelyNoData: Array.from(buckets.unlikelyNoData),
    };
    localStorage.setItem(LEAGUE_BUCKETS_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("Unable to store league buckets.", error);
  }
}

function updateLeagueBuckets(dataCache) {
  const buckets = {
    withData: new Set(),
    likelyNoData: new Set(),
    unlikelyNoData: new Set(),
  };

  state.leagueCatalog.forEach((league) => {
    const hasData = dataCache[league.leagueId];
    if (hasData === true) {
      buckets.withData.add(league.leagueId);
    } else if (hasData === false) {
      if (LIKELY_LEAGUE_IDS.includes(league.leagueId)) {
        buckets.likelyNoData.add(league.leagueId);
      } else {
        buckets.unlikelyNoData.add(league.leagueId);
      }
    }
  });

  state.leagueBuckets = buckets;
  setLeagueBuckets(buckets);
}

function sortLeaguesForCheck(leagues) {
  return [...leagues].sort((a, b) => {
    const bucketA = MAIN_LEAGUE_IDS.includes(a.leagueId)
      ? 0
      : LIKELY_LEAGUE_IDS.includes(a.leagueId)
        ? 1
        : 2;
    const bucketB = MAIN_LEAGUE_IDS.includes(b.leagueId)
      ? 0
      : LIKELY_LEAGUE_IDS.includes(b.leagueId)
        ? 1
        : 2;
    if (bucketA !== bucketB) {
      return bucketA - bucketB;
    }
    return (a.leagueName || "").localeCompare(b.leagueName || "");
  });
}

async function refreshLeaguesWithData(leagues) {
  if (!leagues.length || leagueDataRefreshInFlight) {
    return null;
  }

  leagueDataRefreshInFlight = true;
  try {
    const cached = getLeagueDataCache();
    const dataCache = cached?.data ? { ...cached.data } : {};
    const toCheck = sortLeaguesForCheck(leagues).filter(
      (league) =>
        dataCache[league.leagueId] === undefined || dataCache[league.leagueId] === null
    );

    if (toCheck.length) {
      const limitedChecks = toCheck.slice(0, LEAGUE_REFRESH_MAX_CHECKS);
      for (const league of limitedChecks) {
        try {
          const hasData = await fetchLeagueHasData(league.leagueId);
          dataCache[league.leagueId] = hasData;
        } catch (error) {
          dataCache[league.leagueId] = null;
        }
        await sleep(LEAGUE_REFRESH_STEP_DELAY_MS);
      }
      setLeagueDataCache(dataCache);
    }
    updateLeagueBuckets(dataCache);

    return {
      filtered: filterLeaguesByData(leagues, dataCache),
      dataCache,
    };
  } finally {
    leagueDataRefreshInFlight = false;
  }
}

function scheduleLeagueDataRefresh() {
  if (leagueDataRefreshScheduled) {
    return;
  }

  leagueDataRefreshScheduled = true;
  const runRefresh = () => {
    refreshLeaguesWithData(state.leagueCatalog)
      .then((result) => {
        if (!result) {
          return;
        }

        const { filtered } = result;
        if (filtered.length === state.leagues.length && filtered.length > 0) {
          return;
        }

        state.leagues = filtered;
        state.leaguesById = new Map(
          filtered.map((league) => [league.leagueId, league.leagueName])
        );
  const leaguesToShow = buildLeagueOptionsList(filtered);

  if (!leaguesToShow.length) {
          matchesEl.innerHTML = "";
          setPreviousToggleLabel(0);
          setStatus(LEAGUE_CHECKING_MESSAGE);
          return;
        }

        const currentSelection = leagueSelect.value;
        if (!filtered.some((league) => league.leagueId === currentSelection)) {
          const defaultLeague = pickDefaultLeague(leaguesToShow);
          leagueSelect.value = defaultLeague.leagueId;
          storeLeagueId(defaultLeague.leagueId);
          loadMatches(defaultLeague.leagueId);
        }
        updateLeagueDatalist(leagueFilter?.value || "");
      })
      .catch((error) => {
        console.warn("Unable to refresh league data availability.", error);
      })
      .finally(() => {
        leagueDataRefreshScheduled = false;
      });
  };

  if (window.requestIdleCallback) {
    window.requestIdleCallback(runRefresh, { timeout: LEAGUE_REFRESH_DELAY_MS });
  } else {
    setTimeout(runRefresh, LEAGUE_REFRESH_DELAY_MS);
  }
}

function startLeagueDataRefresh() {
  if (leagueRefreshInterval) {
    return;
  }
  leagueRefreshInterval = setInterval(() => {
    if (document.hidden) {
      return;
    }
    scheduleLeagueDataRefresh();
  }, LEAGUE_REFRESH_INTERVAL_MS);
}

function pickDefaultLeague(leagues) {
  const storedId = getStoredLeagueId();
  const findLeague = (leagueId) =>
    leagues.find((league) => league.leagueId === leagueId);

  const priorityLeague = PRIORITY_EVENT_IDS.map(findLeague).find(Boolean);

  if (storedId) {
    const storedLeague = findLeague(storedId);
    if (storedLeague) {
      if (storedId === "LCK" && priorityLeague) {
        return priorityLeague;
      }
      return storedLeague;
    }
  }

  if (priorityLeague) {
    return priorityLeague;
  }

  return findLeague("LCK") || leagues[0];
}

async function init() {
  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setView(button.dataset.view);
    });
  });
  setView(state.view);

  if (previousToggle) {
    previousToggle.addEventListener("click", () => {
      state.showPrevious = !state.showPrevious;
      renderSchedule();
      if (state.showPrevious) {
        previousEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  if (saveLeagueButton && leagueFilter) {
    leagueFilter.addEventListener("input", () => {
      updateLeagueDatalist(leagueFilter.value);
    });

    saveLeagueButton.addEventListener("click", () => {
      const match = findLeagueBySearch(state.leagueCatalog, leagueFilter.value);
      if (!match) {
        setStatus("No matching league found.");
        return;
      }

      if (!state.leagues.some((league) => league.leagueId === match.leagueId)) {
        state.leagues = [...state.leagues, match];
        state.leaguesById.set(match.leagueId, match.leagueName);
      }

      const current = getPreferredLeagues();
      const updated = current.includes(match.leagueId)
        ? current
        : [...current, match.leagueId];
      setPreferredLeagues(updated);
      buildLeagueOptionsList(state.leagues);

      leagueSelect.value = match.leagueId;
      storeLeagueId(match.leagueId);
      setStatus(`Saved ${match.leagueName}. Checking data...`);
      refreshLeaguesWithData([match]).then((result) => {
        if (!result) {
          return;
        }
        state.leagues = result.filtered;
        state.leaguesById = new Map(
          result.filtered.map((league) => [league.leagueId, league.leagueName])
        );
        const leaguesToShow = buildLeagueOptionsList(result.filtered);
        if (!leaguesToShow.length) {
          renderEmpty(matchesEl, "No leagues with match data are available.");
          setStatus("No leagues with match data are available.");
          return;
        }
        if (result.filtered.some((league) => league.leagueId === match.leagueId)) {
          loadMatches(match.leagueId);
          setStatus(`Saved ${match.leagueName}.`);
        } else {
          setStatus(`No match data found for ${match.leagueName} yet.`);
        }
      });
      scheduleLeagueDataRefresh();
    });
  }

  const cachedCatalog = getLeagueCatalog();
  if (cachedCatalog.length) {
    state.leagueCatalog = cachedCatalog;
    updateLeagueDatalist(leagueFilter?.value || "");
  }

  setLoading(true);
  try {
    await refreshCaedrelStatus();
    setStatus("Loading leagues...");

    // Data flow: fetch league list once, then load matches per selection.
    const leagues = await fetchJson("/leagues");

    if (!leagues.length) {
      renderEmpty(matchesEl, "No leagues available from the API.");
      setPreviousToggleLabel(0);
      setStatus("");
      return;
    }

    const primaryLeagues = leagues.filter((league) =>
      MAIN_LEAGUE_IDS.includes(league.leagueId)
    );
    const leaguesToUse = primaryLeagues.length ? primaryLeagues : leagues;

    const filteredLeagues = filterLeaguesByData(
      leaguesToUse,
      getLeagueDataCache()?.data
    );
    state.leagues = filteredLeagues;
    state.leagueCatalog = leagues;
    state.leaguesById = new Map(
      filteredLeagues.map((league) => [league.leagueId, league.leagueName])
    );
    setLeagueCatalog(leagues);
    updateLeagueDatalist(leagueFilter?.value || "");

    const leaguesToShow = buildLeagueOptionsList(filteredLeagues);
    if (!leaguesToShow.length) {
      matchesEl.innerHTML = "";
      setPreviousToggleLabel(0);
      setStatus(LEAGUE_CHECKING_MESSAGE);
    } else {
      const defaultLeague = pickDefaultLeague(leaguesToShow);
      leagueSelect.value = defaultLeague.leagueId;
      storeLeagueId(defaultLeague.leagueId);

      setStatus("Loading teams...");
      await loadTeams();

      await loadMatches(defaultLeague.leagueId);
    }

    leagueSelect.addEventListener("change", () => {
      const selectedLeagueId = leagueSelect.value;
      storeLeagueId(selectedLeagueId);
      loadMatches(selectedLeagueId);
    });
    scheduleLeagueDataRefresh();
    startLeagueDataRefresh();

  } catch (error) {
    console.error(error);
    renderEmptyActiveView("Could not load leagues. Please try again later.");
    setStatus("");
  } finally {
    setLoading(false);
  }
}

init();
