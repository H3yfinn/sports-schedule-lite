import { test, expect } from "@playwright/test";

const API_BASE = "https://api.lol-esports.mckernant1.com";

test("renders the schedule with mocked data", async ({ page }) => {
  const now = Date.now();
  const tournamentId = "LCK-2024";

  await page.route(`${API_BASE}/leagues`, async (route) => {
    await route.fulfill({
      json: [
        {
          leagueId: "LCK",
          leagueName: "LCK",
          isOfficial: true,
          level: "primary",
        },
      ],
    });
  });

  await page.route(
    `${API_BASE}/most-recent-tournament/LCK`,
    async (route) => {
      await route.fulfill({
        json: { tournamentId },
      });
    }
  );

  await page.route(`${API_BASE}/matches/${tournamentId}`, async (route) => {
    await route.fulfill({
      json: [
        {
          matchId: "match-1",
          startTime: now,
          blueTeamId: "T1",
          redTeamId: "GEN",
          bestOf: 3,
          patch: "14.1",
        },
      ],
    });
  });

  await page.route(`${API_BASE}/teams`, async (route) => {
    await route.fulfill({
      json: [
        { teamId: "T1", name: "T1" },
        { teamId: "GEN", name: "Gen.G" },
      ],
    });
  });

  await page.route("https://api.twitch.tv/helix/streams?user_login=caedrel", async (route) => {
    await route.fulfill({
      json: {
        data: [{ id: "123", user_name: "Caedrel", type: "live" }],
      },
    });
  });

  await page.goto("/");

  await expect(page.getByRole("heading", { name: "LoL Esports Schedule" })).toBeVisible();
  await expect(page.getByText("T1")).toBeVisible();
  await expect(page.getByText("Gen.G")).toBeVisible();

  const watchLinks = page.locator(".match-actions .match-link");
  await expect(watchLinks).toHaveCount(2);
  await expect(watchLinks.nth(0)).toHaveText("Official live");
  await expect(watchLinks.nth(1)).toHaveText("Caedrel co-stream");

  const logo = page.locator(".team-logo").first();
  await expect(logo).toHaveCSS("background-image", /assets\/logos\/T1\.svg/);
});
