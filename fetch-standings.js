#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const engine = require("./playoff-engine");

const NDTV_URL = "https://sports.ndtv.com/ipl-2026/points-table";
const OUTPUT_PATH = path.join(__dirname, "data", "latest-ipl-2026.json");

async function main() {
  const response = await fetch(NDTV_URL, {
    headers: {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`NDTV fetch failed with HTTP ${response.status}. The app can still use its fallback data.`);
  }

  const html = await response.text();
  if (/Access Denied|You don't have permission/i.test(html)) {
    throw new Error("NDTV returned an access-denied page. The app can still use its fallback data.");
  }

  const seasonData = engine.parseNdtvPointsTableText(html);
  const validation = engine.validateSeasonData(seasonData);
  if (!validation.isValid) {
    throw new Error(`Parsed NDTV data was incomplete: ${validation.errors.join("; ")}`);
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify({
    ...seasonData,
    source: {
      ...seasonData.source,
      fetchedAt: new Date().toISOString(),
    },
  }, null, 2)}\n`);

  console.log(`Wrote ${OUTPUT_PATH}`);
  console.log(`Teams: ${seasonData.teams.length}; future fixtures: ${seasonData.futureFixtures.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
