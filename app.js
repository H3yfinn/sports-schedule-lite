const API_BASE = "https://api.lol-esports.mckernant1.com";
const PRIORITY_EVENT_IDS = ["MSI", "WCS", "FST", "FS"];
const MAJOR_LEAGUE_IDS = ["LCK", "LEC", "LPL", "LCS"];
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
  TES: { color: "#0077C8" },
  JDG: { color: "#D4AF37" },
  BLG: { color: "#0084FF" },
  LNG: { color: "#00C7B7" },
  WBG: { color: "#D71920" },
  EDG: { color: "#002A5C" },
  RNG: { color: "#D40000" },
  IG: { color: "#0B1F2A" },
};
const CORS_PROXY = "https://corsproxy.io/?";
const LIVE_WINDOW_MS = 3 * 60 * 60 * 1000;
const PREVIOUS_LIMIT = 10;
const LEAGUE_STORAGE_KEY = "lolScheduleLeagueId";
const LEAGUE_DATA_CACHE_KEY = "lolScheduleLeagueDataCache";
const LEAGUE_DATA_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

const state = {
  leagues: [],
  teamsById: new Map(),
  leaguesById: new Map(),
  matches: [],
  currentLeagueId: null,
  currentTournamentId: null,
  view: "schedule",
  showPrevious: false,
};

const leagueSelect = document.getElementById("leagueSelect");
const statusEl = document.getElementById("status");
const matchesEl = document.getElementById("matches");
const tableEl = document.getElementById("table");
const previousEl = document.getElementById("previous");
const previousToggle = document.getElementById("previousToggle");
const viewButtons = Array.from(document.querySelectorAll(".view-button"));

function setStatus(message) {
  statusEl.textContent = message;
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

function resolveTeamName(teamId) {
  if (!teamId) {
    return "TBD";
  }
  return state.teamsById.get(teamId) || teamId;
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
  if (!teamId) {
    return null;
  }
  const brand = TEAM_BRAND_MAP[teamId];
  if (!brand) {
    return null;
  }
  return {
    color: brand.color,
    logoUrl: brand.logoUrl || `${TEAM_LOGO_BASE}${teamId}.png`,
  };
}

async function fetchJson(path) {
  const url = `${API_BASE}${path}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    // Fallback for browsers that block the API due to missing CORS headers.
    const proxiedUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
    const response = await fetch(proxiedUrl);
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  }
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
  if (streamInfo.coStream) {
    links.push({
      label: "Caedrel co-stream (if live)",
      url: streamInfo.coStream,
    });
  }
  return links;
}

function getVodLink(match, leagueId) {
  if (match.vod) {
    return {
      label: "Official VOD",
      url: match.vod,
    };
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
  return {
    label: "YouTube replay search",
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
  };
}

async function fetchLeagueHasData(leagueId) {
  const tournament = await fetchJson(`/most-recent-tournament/${leagueId}`);
  const tournamentId = tournament?.tournamentId;
  if (!tournamentId) {
    return false;
  }
  const matches = await fetchJson(`/matches/${tournamentId}`);
  return Array.isArray(matches) && matches.length > 0;
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
        dataCache[league.leagueId] = false;
      }
    });
    setLeagueDataCache(dataCache);
  }

  return leagues.filter((league) => dataCache[league.leagueId]);
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
      : [getVodLink(match, leagueId)];
  const watchMarkup = watchLinks.length
    ? `
        <div class="match-actions">
          ${watchLinks
            .map(
              (link) => `
                <a class="match-link" href="${link.url}" target="_blank" rel="noopener noreferrer">
                  ${link.label}
                </a>
              `
            )
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
    previousToggle.textContent = "No previous matches";
    previousToggle.disabled = true;
    return;
  }

  previousToggle.disabled = false;
  previousToggle.textContent = state.showPrevious
    ? "Hide previous matches"
    : `Show previous matches (${Math.min(count, PREVIOUS_LIMIT)})`;
}

async function loadMatches(leagueId) {
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

  try {
    setStatus("Loading leagues...");

    // Data flow: fetch league list once, then load matches per selection.
    const leagues = await fetchJson("/leagues");

    if (!leagues.length) {
      renderEmpty(matchesEl, "No leagues available from the API.");
      setPreviousToggleLabel(0);
      setStatus("");
      return;
    }

    setStatus("Checking leagues with data...");
    const leaguesWithData = await filterLeaguesWithData(leagues);

    if (!leaguesWithData.length) {
      renderEmpty(matchesEl, "No leagues with match data are available.");
      setPreviousToggleLabel(0);
      setStatus("");
      return;
    }

    state.leagues = leaguesWithData;
    state.leaguesById = new Map(
      leaguesWithData.map((league) => [league.leagueId, league.leagueName])
    );

    const leaguesToShow = [...leaguesWithData].sort((a, b) => {
      const weightA = getLeagueSortWeight(a);
      const weightB = getLeagueSortWeight(b);
      if (weightA !== weightB) {
        return weightA - weightB;
      }
      return (a.leagueName || "").localeCompare(b.leagueName || "");
    });
    populateLeagueOptions(leaguesToShow);

    const defaultLeague = pickDefaultLeague(leaguesToShow);
    leagueSelect.value = defaultLeague.leagueId;
    storeLeagueId(defaultLeague.leagueId);

    setStatus("Loading teams...");
    await loadTeams();

    await loadMatches(defaultLeague.leagueId);

    leagueSelect.addEventListener("change", () => {
      const selectedLeagueId = leagueSelect.value;
      storeLeagueId(selectedLeagueId);
      loadMatches(selectedLeagueId);
    });

  } catch (error) {
    console.error(error);
    renderEmptyActiveView("Could not load leagues. Please try again later.");
    setStatus("");
  }
}

init();
