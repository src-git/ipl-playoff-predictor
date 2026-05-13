(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  root.PlayoffEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  const TEAMS = [
    { id: "GT", name: "Gujarat Titans", shortName: "GT", currentPoints: 16, nrr: 0.551, rank: 1 },
    { id: "RCB", name: "Royal Challengers Bengaluru", shortName: "RCB", currentPoints: 14, nrr: 1.103, rank: 2 },
    { id: "SRH", name: "Sunrisers Hyderabad", shortName: "SRH", currentPoints: 14, nrr: 0.331, rank: 3 },
    { id: "PBKS", name: "Punjab Kings", shortName: "PBKS", currentPoints: 13, nrr: 0.428, rank: 4 },
    { id: "CSK", name: "Chennai Super Kings", shortName: "CSK", currentPoints: 12, nrr: 0.185, rank: 5 },
    { id: "RR", name: "Rajasthan Royals", shortName: "RR", currentPoints: 12, nrr: 0.082, rank: 6 },
    { id: "DC", name: "Delhi Capitals", shortName: "DC", currentPoints: 10, nrr: -0.993, rank: 7 },
    { id: "KKR", name: "Kolkata Knight Riders", shortName: "KKR", currentPoints: 9, nrr: -0.169, rank: 8 },
    { id: "MI", name: "Mumbai Indians", shortName: "MI", currentPoints: 6, nrr: -0.585, rank: 9 },
    { id: "LSG", name: "Lucknow Super Giants", shortName: "LSG", currentPoints: 6, nrr: -0.907, rank: 10 },
  ];

  const FUTURE_FIXTURES = [
    { id: "RCB-KKR", date: "13 May", teams: ["RCB", "KKR"] },
    { id: "PBKS-MI", date: "14 May", teams: ["PBKS", "MI"] },
    { id: "CSK-LSG", date: "15 May", teams: ["CSK", "LSG"] },
    { id: "GT-KKR", date: "16 May", teams: ["GT", "KKR"] },
    { id: "RCB-PBKS", date: "17 May", teams: ["RCB", "PBKS"] },
    { id: "RR-DC", date: "17 May", teams: ["RR", "DC"] },
    { id: "SRH-CSK", date: "18 May", teams: ["SRH", "CSK"] },
    { id: "RR-LSG", date: "19 May", teams: ["RR", "LSG"] },
    { id: "KKR-MI", date: "20 May", teams: ["KKR", "MI"] },
    { id: "GT-CSK", date: "21 May", teams: ["GT", "CSK"] },
    { id: "RCB-SRH", date: "22 May", teams: ["RCB", "SRH"] },
    { id: "PBKS-LSG", date: "23 May", teams: ["PBKS", "LSG"] },
    { id: "RR-MI", date: "24 May", teams: ["RR", "MI"] },
    { id: "DC-KKR", date: "24 May", teams: ["DC", "KKR"] },
  ];

  const COMPLETED_ROWS = {
    GT: [
      ["PBKS", "L", 0], ["RR", "L", 0], ["DC", "W", 2], ["LSG", "W", 4],
      ["KKR", "W", 6], ["MI", "L", 6], ["RCB", "L", 6], ["CSK", "W", 8],
      ["RCB", "W", 10], ["PBKS", "W", 12], ["RR", "W", 14], ["SRH", "W", 16],
    ],
    RCB: [
      ["SRH", "W", 2], ["CSK", "W", 4], ["RR", "L", 4], ["MI", "W", 6],
      ["LSG", "W", 8], ["DC", "L", 8], ["GT", "W", 10], ["DC", "W", 12],
      ["GT", "L", 12], ["LSG", "L", 12], ["MI", "W", 14],
    ],
    SRH: [
      ["RCB", "L", 0], ["KKR", "W", 2], ["LSG", "L", 2], ["PBKS", "L", 2],
      ["RR", "W", 4], ["CSK", "W", 6], ["DC", "W", 8], ["RR", "W", 10],
      ["MI", "W", 12], ["KKR", "L", 12], ["PBKS", "W", 14], ["GT", "L", 14],
    ],
    PBKS: [
      ["GT", "W", 2], ["CSK", "W", 4], ["KKR", "NR", 5], ["SRH", "W", 7],
      ["MI", "W", 9], ["LSG", "W", 11], ["DC", "W", 13], ["RR", "L", 13],
      ["GT", "L", 13], ["SRH", "L", 13], ["DC", "L", 13],
    ],
    CSK: [
      ["RR", "L", 0], ["PBKS", "L", 0], ["RCB", "L", 0], ["DC", "W", 2],
      ["KKR", "W", 4], ["SRH", "L", 4], ["MI", "W", 6], ["GT", "L", 6],
      ["MI", "W", 8], ["DC", "W", 10], ["LSG", "W", 12],
    ],
    RR: [
      ["CSK", "W", 2], ["GT", "W", 4], ["MI", "W", 6], ["RCB", "W", 8],
      ["SRH", "L", 8], ["KKR", "L", 8], ["LSG", "W", 10], ["SRH", "L", 10],
      ["PBKS", "W", 12], ["DC", "L", 12], ["GT", "L", 12],
    ],
    DC: [
      ["LSG", "W", 2], ["MI", "W", 4], ["GT", "L", 4], ["CSK", "L", 4],
      ["RCB", "W", 6], ["SRH", "L", 6], ["PBKS", "L", 6], ["RCB", "L", 6],
      ["RR", "W", 8], ["CSK", "L", 8], ["KKR", "L", 8], ["PBKS", "W", 10],
    ],
    KKR: [
      ["MI", "L", 0], ["SRH", "L", 0], ["PBKS", "NR", 1], ["LSG", "L", 1],
      ["CSK", "L", 1], ["GT", "L", 1], ["RR", "W", 3], ["LSG", "W", 5],
      ["SRH", "W", 7], ["DC", "W", 9],
    ],
    MI: [
      ["KKR", "W", 2], ["DC", "L", 2], ["RR", "L", 2], ["RCB", "L", 2],
      ["PBKS", "L", 2], ["GT", "W", 4], ["CSK", "L", 4], ["SRH", "L", 4],
      ["CSK", "L", 4], ["LSG", "W", 6], ["RCB", "L", 6],
    ],
    LSG: [
      ["DC", "L", 0], ["SRH", "W", 2], ["KKR", "W", 4], ["GT", "L", 4],
      ["RCB", "L", 4], ["PBKS", "L", 4], ["RR", "L", 4], ["KKR", "L", 4],
      ["MI", "L", 4], ["RCB", "W", 6], ["CSK", "L", 6],
    ],
  };

  const TEAM_FUTURE_ORDER = {
    GT: ["GT-KKR", "GT-CSK"],
    RCB: ["RCB-KKR", "RCB-PBKS", "RCB-SRH"],
    SRH: ["SRH-CSK", "RCB-SRH"],
    PBKS: ["PBKS-MI", "RCB-PBKS", "PBKS-LSG"],
    CSK: ["CSK-LSG", "SRH-CSK", "GT-CSK"],
    RR: ["RR-DC", "RR-LSG", "RR-MI"],
    DC: ["RR-DC", "DC-KKR"],
    KKR: ["RCB-KKR", "GT-KKR", "KKR-MI", "DC-KKR"],
    MI: ["PBKS-MI", "KKR-MI", "RR-MI"],
    LSG: ["CSK-LSG", "RR-LSG", "PBKS-LSG"],
  };

  const teamById = Object.fromEntries(TEAMS.map((team) => [team.id, team]));
  const fixtureById = Object.fromEntries(FUTURE_FIXTURES.map((fixture) => [fixture.id, fixture]));
  const FALLBACK_SEASON_DATA = {
    source: {
      name: "Built-in screenshot data",
      url: "https://www.espncricinfo.com/series/ipl-2026-1510719/points-table-standings",
    },
    teams: TEAMS.map((team) => ({ ...team })),
    futureFixtures: FUTURE_FIXTURES.map((fixture) => ({ ...fixture, teams: [...fixture.teams] })),
    completedRows: cloneCompletedRows(COMPLETED_ROWS),
    teamFutureOrder: cloneTeamFutureOrder(TEAM_FUTURE_ORDER),
  };
  const teamNameAliases = new Map();
  rebuildLookups();

  function cloneCompletedRows(rows) {
    return Object.fromEntries(Object.entries(rows).map(([teamId, teamRows]) => [
      teamId,
      teamRows.map((row) => [...row]),
    ]));
  }

  function cloneTeamFutureOrder(order) {
    return Object.fromEntries(Object.entries(order).map(([teamId, fixtureIds]) => [teamId, [...fixtureIds]]));
  }

  function clearObject(object) {
    for (const key of Object.keys(object)) delete object[key];
  }

  function rebuildLookups() {
    clearObject(teamById);
    clearObject(fixtureById);
    teamNameAliases.clear();

    for (const team of TEAMS) {
      teamById[team.id] = team;
      teamNameAliases.set(team.name.toUpperCase(), team.id);
      teamNameAliases.set(team.shortName.toUpperCase(), team.id);
    }

    for (const fixture of FUTURE_FIXTURES) {
      fixtureById[fixture.id] = fixture;
    }

    teamNameAliases.set("MUMBAI INDIANS", "MI");
    teamNameAliases.set("MUMBAIINDIANS", "MI");
    teamNameAliases.set("KOLKATA KNIGHT RIDERS", "KKR");
    teamNameAliases.set("LUCKNOW SUPER GIANTS", "LSG");
    teamNameAliases.set("ROYAL CHALLENGERS BANGALORE", "RCB");
  }

  function clonePredictions(predictions) {
    return Object.fromEntries(Object.entries(predictions || {}).map(([key, value]) => [key, { ...value }]));
  }

  function opponentFor(fixture, teamId) {
    return fixture.teams[0] === teamId ? fixture.teams[1] : fixture.teams[0];
  }

  function pointsForOutcome(outcome, fixture, teamId) {
    if (!outcome) return 0;
    if (outcome.type === "win") return outcome.winner === teamId ? 2 : 0;
    if (outcome.type === "tie" || outcome.type === "nr") return 1;
    return 0;
  }

  function resultForTeam(outcome, fixture, teamId) {
    if (!outcome) return "";
    if (outcome.type === "win") return outcome.winner === teamId ? "W" : "L";
    if (outcome.type === "tie") return "T";
    if (outcome.type === "nr") return "NR";
    return "";
  }

  function nextOutcomeForTeam(currentOutcome, fixture, teamId) {
    const current = resultForTeam(currentOutcome, fixture, teamId);
    if (!current) return { type: "win", winner: teamId };
    if (current === "W") return { type: "win", winner: opponentFor(fixture, teamId) };
    if (current === "L") return { type: "tie" };
    if (current === "T") return { type: "nr" };
    return null;
  }

  function normalizeFutureFixtureIds(futureFixtureIds) {
    if (!futureFixtureIds) return null;
    return futureFixtureIds instanceof Set ? futureFixtureIds : new Set(futureFixtureIds);
  }

  function isActiveFutureFixture(fixtureId, futureFixtureIds) {
    const normalized = normalizeFutureFixtureIds(futureFixtureIds);
    return !normalized || normalized.has(fixtureId);
  }

  function deriveFutureFixtureIds(importedStandings) {
    if (!importedStandings) return null;
    const futureIds = new Set();
    for (const fixture of FUTURE_FIXTURES) {
      const [home, away] = fixture.teams;
      const homeNext = importedStandings[home] ? importedStandings[home].next : [];
      const awayNext = importedStandings[away] ? importedStandings[away].next : [];
      if (homeNext.includes(away) || awayNext.includes(home)) {
        futureIds.add(fixture.id);
      }
    }
    return futureIds;
  }

  function computePointsMap(predictions, importedStandings, futureFixtureIds) {
    const points = currentPointsMap(importedStandings);
    for (const fixture of FUTURE_FIXTURES) {
      if (!isActiveFutureFixture(fixture.id, futureFixtureIds)) continue;
      const outcome = predictions[fixture.id];
      if (!outcome) continue;
      for (const teamId of fixture.teams) {
        points[teamId] += pointsForOutcome(outcome, fixture, teamId);
      }
    }
    return points;
  }

  function currentPointsMap(importedStandings) {
    return Object.fromEntries(TEAMS.map((team) => [
      team.id,
      importedStandings && importedStandings[team.id]
        ? importedStandings[team.id].points
        : team.currentPoints,
    ]));
  }

  function normalizeTeamToken(value) {
    return String(value || "").toUpperCase().replace(/[^A-Z]/g, "");
  }

  function teamIdFromName(value) {
    const normalized = normalizeTeamToken(value);
    for (const [alias, id] of teamNameAliases.entries()) {
      if (normalizeTeamToken(alias) === normalized) return id;
    }
    return null;
  }

  function parseNextOpponents(fragment) {
    const nextPart = fragment.split(/\s+\d{3,4}\//)[0] || fragment;
    const candidates = nextPart
      .replace(/^vs\s+/i, "")
      .split(/[,/]| and /i)
      .map((item) => item.trim())
      .filter(Boolean);
    return candidates
      .map(teamIdFromName)
      .filter(Boolean);
  }

  function parseStandingsText(text) {
    const parsed = {};
    const normalizedText = String(text || "").replace(/\s+/g, " ").trim();
    const statsLookahead = "\\s+\\d+\\s+\\d+\\s+\\d+\\s+\\d+\\s+\\d+\\s+\\d+\\s+-?\\d";
    const teamAnchors = TEAMS
      .map((team) => {
        const escapedName = team.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const rowPattern = new RegExp(`(?:^|\\s)(?:\\d{1,2}\\s+)?${escapedName}(?=${statsLookahead})`, "i");
        const match = normalizedText.match(rowPattern);
        if (!match || match.index === undefined) return { team, index: -1 };
        const teamOffset = match[0].toUpperCase().lastIndexOf(team.name.toUpperCase());
        return {
          team,
          index: match.index + teamOffset,
        };
      })
      .filter((anchor) => anchor.index >= 0)
      .sort((a, b) => a.index - b.index);

    for (let index = 0; index < teamAnchors.length; index += 1) {
      const { team } = teamAnchors[index];
      const rowStart = teamAnchors[index].index + team.name.length;
      const rowEnd = index + 1 < teamAnchors.length ? teamAnchors[index + 1].index : normalizedText.length;
      const rowText = normalizedText.slice(rowStart, rowEnd).trim();
      const match = rowText.match(/(?:^|\s)(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(-?\d+(?:\.\d+)?)(.*)$/);
      if (!match) continue;

      const [, matches, wins, losses, ties, noResults, points, nrr, rest] = match;
      const nextMatch = rest.match(/\bvs\s+(.+)/i);
      parsed[team.id] = {
        matches: Number(matches),
        wins: Number(wins),
        losses: Number(losses),
        ties: Number(ties),
        noResults: Number(noResults),
        points: Number(points),
        nrr: Number(nrr),
        next: nextMatch ? parseNextOpponents(nextMatch[0]) : [],
      };
    }

    return parsed;
  }

  function decodeHtmlEntities(value) {
    return String(value || "")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/gi, '"')
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">");
  }

  function htmlToPlainText(value) {
    return decodeHtmlEntities(String(value || "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "));
  }

  function normalizeSourceText(value) {
    return htmlToPlainText(value)
      .replace(/\s+/g, " ")
      .trim();
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function findTeamPrefix(value, excludedTeamId) {
    const normalized = String(value || "").trim().toUpperCase();
    const candidates = [...TEAMS].sort((a, b) => b.name.length - a.name.length);
    for (const team of candidates) {
      if (team.id === excludedTeamId) continue;
      if (normalized.startsWith(team.name.toUpperCase())) return team;
      if (normalized.startsWith(team.shortName.toUpperCase())) return team;
    }
    return null;
  }

  function resultFromNdtvPoint(pointValue, resultText) {
    const point = Number(pointValue);
    if (point === 2) return "W";
    if (point === 0) return "L";
    if (point === 1) return /\btied\b/i.test(resultText) ? "T" : "NR";
    return "";
  }

  function fixturePairKey(teamA, teamB) {
    return [teamA, teamB].sort().join("-");
  }

  function parseNdtvMatches(sectionText, teamId, fixtureIdsByPair) {
    const completedRows = [];
    const futureFixtureIds = [];
    let runningPoints = 0;
    const matchPattern = /Match\s+(\d+)\s+([A-Z][a-z]{2})\s+(\d{1,2})\s+2026,\s*\([^)]+\)\s+([\s\S]*?)(?=Match\s+\d+\s+[A-Z][a-z]{2}\s+\d{1,2}\s+2026|$)/g;
    let match;
    while ((match = matchPattern.exec(sectionText)) !== null) {
      const [, matchNumber, month, day, detail] = match;
      const vsMatch = detail.match(/\bvs\s+(.+)/i);
      if (!vsMatch) continue;

      const afterVs = vsMatch[1].replace(/% Chance to Win.*/i, "").trim();
      const opponent = findTeamPrefix(afterVs, teamId);
      if (!opponent) continue;

      const pointMatch = detail.match(/\bPoint\s+([+-]?\d+)/i);
      if (pointMatch) {
        const result = resultFromNdtvPoint(pointMatch[1], detail);
        runningPoints += Number(pointMatch[1]);
        completedRows.push([opponent.id, result, runningPoints]);
        continue;
      }

      const pairKey = fixturePairKey(teamId, opponent.id);
      if (!fixtureIdsByPair.has(pairKey)) {
        fixtureIdsByPair.set(pairKey, {
          id: `${teamId}-${opponent.id}`,
          date: `${month} ${Number(day)}`,
          matchNumber: Number(matchNumber),
          teams: [teamId, opponent.id],
        });
      }
      futureFixtureIds.push(fixtureIdsByPair.get(pairKey).id);
    }
    return { completedRows, futureFixtureIds };
  }

  function parseNdtvPointsTableText(text) {
    const normalizedText = normalizeSourceText(text);
    const rowAnchors = TEAMS
      .map((team) => {
        const pattern = new RegExp(
          `(?:^|\\s)(\\d{1,2})\\s*\\|?\\s*${escapeRegExp(team.name)}\\s+${escapeRegExp(team.shortName)}\\s*\\|?\\s*` +
          `(\\d+)\\s*\\|?\\s*(\\d+)\\s*\\|?\\s*(\\d+)\\s*\\|?\\s*(\\d+)\\s*\\|?\\s*(\\d+)\\s*\\|?\\s*(\\d+)\\s*\\|?\\s*([+-]?\\d+(?:\\.\\d+)?)`,
          "i"
        );
        const match = normalizedText.match(pattern);
        if (!match || match.index === undefined) return null;
        return { team, match, index: match.index, rowEnd: match.index + match[0].length };
      })
      .filter(Boolean)
      .sort((a, b) => a.index - b.index);

    const fixtureIdsByPair = new Map();
    const teams = [];
    const completedRows = {};
    const teamFutureOrder = {};

    for (let index = 0; index < rowAnchors.length; index += 1) {
      const anchor = rowAnchors[index];
      const [, rank, matches, wins, losses, ties, noResults, points, nrr] = anchor.match;
      const sectionEnd = index + 1 < rowAnchors.length ? rowAnchors[index + 1].index : normalizedText.length;
      const sectionText = normalizedText.slice(anchor.rowEnd, sectionEnd);
      const parsedMatches = parseNdtvMatches(sectionText, anchor.team.id, fixtureIdsByPair);

      teams.push({
        id: anchor.team.id,
        name: anchor.team.name,
        shortName: anchor.team.shortName,
        currentPoints: Number(points),
        nrr: Number(nrr),
        rank: Number(rank),
        matches: Number(matches),
        wins: Number(wins),
        losses: Number(losses),
        ties: Number(ties),
        noResults: Number(noResults),
      });
      completedRows[anchor.team.id] = parsedMatches.completedRows;
      teamFutureOrder[anchor.team.id] = parsedMatches.futureFixtureIds;
    }

    const futureFixtures = [...fixtureIdsByPair.values()]
      .sort((a, b) => a.matchNumber - b.matchNumber)
      .map(({ matchNumber, ...fixture }) => fixture);

    return {
      source: {
        name: "NDTV Sports IPL 2026 points table",
        url: "https://sports.ndtv.com/ipl-2026/points-table",
        fetchedAt: new Date().toISOString(),
      },
      teams: teams.sort((a, b) => a.rank - b.rank),
      futureFixtures,
      completedRows,
      teamFutureOrder,
    };
  }

  function validateSeasonData(data) {
    const errors = [];
    const teamIds = new Set((data && data.teams ? data.teams : []).map((team) => team.id));
    const expectedTeamIds = new Set(TEAMS.map((team) => team.id));
    for (const team of TEAMS) {
      if (!teamIds.has(team.id)) errors.push(`Missing team ${team.id}`);
    }
    for (const teamId of teamIds) {
      if (!expectedTeamIds.has(teamId)) errors.push(`Unknown team ${teamId}`);
    }

    const fixtureIds = new Set();
    for (const fixture of data && data.futureFixtures ? data.futureFixtures : []) {
      if (!fixture.id || !Array.isArray(fixture.teams) || fixture.teams.length !== 2) {
        errors.push(`Invalid fixture ${fixture.id || "(missing id)"}`);
        continue;
      }
      fixtureIds.add(fixture.id);
      for (const teamId of fixture.teams) {
        if (!teamIds.has(teamId)) errors.push(`Fixture ${fixture.id} references unknown team ${teamId}`);
      }
    }

    for (const teamId of teamIds) {
      if (!data.completedRows || !Array.isArray(data.completedRows[teamId])) {
        errors.push(`Missing completed rows for ${teamId}`);
      }
      if (!data.teamFutureOrder || !Array.isArray(data.teamFutureOrder[teamId])) {
        errors.push(`Missing future order for ${teamId}`);
        continue;
      }
      for (const fixtureId of data.teamFutureOrder[teamId]) {
        if (!fixtureIds.has(fixtureId)) errors.push(`Future order for ${teamId} references unknown fixture ${fixtureId}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  function loadSeasonData(data) {
    const validation = validateSeasonData(data);
    if (!validation.isValid) {
      throw new Error(`Invalid season data: ${validation.errors.join("; ")}`);
    }

    TEAMS.splice(0, TEAMS.length, ...data.teams.map((team) => ({
      id: team.id,
      name: team.name,
      shortName: team.shortName,
      currentPoints: team.currentPoints,
      nrr: team.nrr,
      rank: team.rank,
    })));
    FUTURE_FIXTURES.splice(0, FUTURE_FIXTURES.length, ...data.futureFixtures.map((fixture) => ({
      id: fixture.id,
      date: fixture.date,
      teams: [...fixture.teams],
    })));

    clearObject(COMPLETED_ROWS);
    for (const [teamId, rows] of Object.entries(data.completedRows)) {
      COMPLETED_ROWS[teamId] = rows.map((row) => [...row]);
    }

    clearObject(TEAM_FUTURE_ORDER);
    for (const [teamId, fixtureIds] of Object.entries(data.teamFutureOrder)) {
      TEAM_FUTURE_ORDER[teamId] = [...fixtureIds];
    }

    rebuildLookups();
    finalStateCache.clear();
    return validation;
  }

  function validateStandingsImport(importedStandings) {
    const missingTeamIds = TEAMS
      .map((team) => team.id)
      .filter((teamId) => !importedStandings || !importedStandings[teamId]);
    const parsedCount = TEAMS.length - missingTeamIds.length;
    return {
      isComplete: missingTeamIds.length === 0,
      parsedCount,
      missingTeamIds,
      missingTeamNames: missingTeamIds.map((teamId) => teamById[teamId].name),
    };
  }

  function qualificationStatus(pointsByTeam, teamId) {
    const teamPoints = pointsByTeam[teamId];
    const greater = TEAMS.filter((team) => pointsByTeam[team.id] > teamPoints).length;
    const equal = TEAMS.filter((team) => pointsByTeam[team.id] === teamPoints).length;
    if (greater >= 4) return "out";
    if (greater + equal > 4) return "nrr";
    return "qualified";
  }

  function playoffSeedStatus(pointsByTeam, teamId) {
    const teamPoints = pointsByTeam[teamId];
    const greater = TEAMS.filter((team) => pointsByTeam[team.id] > teamPoints).length;
    const equal = TEAMS.filter((team) => pointsByTeam[team.id] === teamPoints).length;
    if (greater >= 4) return "out";
    if (greater < 2 && greater + equal > 2) return "top-two-nrr";
    if (greater < 2) return "top-two";
    if (greater + equal > 4) return "playoff-nrr";
    return "playoff";
  }

  function nrrForTeam(teamId, importedStandings) {
    return importedStandings && importedStandings[teamId] ? importedStandings[teamId].nrr : teamById[teamId].nrr;
  }

  function hasResolvedNrr(teamId, importedStandings, staleNrrTeams) {
    return Number.isFinite(nrrForTeam(teamId, importedStandings)) && !staleNrrTeams.has(teamId);
  }

  function teamsWithProjectedNrr(predictions) {
    const affected = new Set();
    for (const [fixtureId, outcome] of Object.entries(predictions || {})) {
      if (!outcome || outcome.type !== "win") continue;
      const fixture = fixtureById[fixtureId];
      if (!fixture) continue;
      affected.add(fixture.teams[0]);
      affected.add(fixture.teams[1]);
    }
    return affected;
  }

  function rankedSeedStatus(rankIndex) {
    if (rankIndex < 2) return "top-two";
    if (rankIndex < 4) return "playoff";
    return "out";
  }

  function computeStandings(predictions, importedStandings, futureFixtureIds) {
    const points = computePointsMap(predictions || {}, importedStandings, futureFixtureIds);
    const staleNrrTeams = teamsWithProjectedNrr(predictions || {});
    const standings = TEAMS.map((team) => ({
      ...team,
      nrr: nrrForTeam(team.id, importedStandings),
      points: points[team.id],
    })).sort((a, b) => b.points - a.points || b.nrr - a.nrr || a.rank - b.rank);

    const resolvedStandings = standings.map((team, index) => ({
      ...team,
      status: index < 4 ? "qualified" : "out",
      seedStatus: rankedSeedStatus(index),
    }));

    for (let start = 0; start < resolvedStandings.length; start += 1) {
      let end = start;
      while (
        end + 1 < resolvedStandings.length &&
        resolvedStandings[end + 1].points === resolvedStandings[start].points
      ) {
        end += 1;
      }

      if (end > start) {
        const tiedGroup = resolvedStandings.slice(start, end + 1);
        const hasUnresolvedNrr = tiedGroup.some((team) => !hasResolvedNrr(team.id, importedStandings, staleNrrTeams));
        if (hasUnresolvedNrr && start < 2 && end >= 2) {
          for (let index = start; index <= end; index += 1) {
            resolvedStandings[index].seedStatus = "top-two-nrr";
          }
        }
        if (hasUnresolvedNrr && start < 4 && end >= 4) {
          for (let index = start; index <= end; index += 1) {
            resolvedStandings[index].status = "nrr";
            if (resolvedStandings[index].seedStatus !== "top-two-nrr") {
              resolvedStandings[index].seedStatus = "playoff-nrr";
            }
          }
        }
      }

      start = end;
    }

    return resolvedStandings;
  }

  function buildTeamRows(predictions, importedStandings, futureFixtureIds) {
    const safePredictions = predictions || {};
    const activeFixtureIds = normalizeFutureFixtureIds(futureFixtureIds);
    return TEAMS.map((team) => {
      let running = importedStandings && importedStandings[team.id] ? importedStandings[team.id].points : 0;
      const completed = COMPLETED_ROWS[team.id].map(([opponent, result, cumulative], index) => {
        if (!importedStandings) running = cumulative;
        return {
          kind: "completed",
          matchNumber: index + 1,
          opponent,
          result,
          projectedPoints: cumulative,
        };
      });

      const future = TEAM_FUTURE_ORDER[team.id].map((fixtureId, index) => {
        const fixture = fixtureById[fixtureId];
        const isFuture = !activeFixtureIds || activeFixtureIds.has(fixtureId);
        const outcome = safePredictions[fixtureId];
        if (isFuture) running += pointsForOutcome(outcome, fixture, team.id);
        return {
          kind: "future",
          locked: !isFuture,
          matchNumber: completed.length + index + 1,
          fixtureId,
          date: fixture.date,
          opponent: opponentFor(fixture, team.id),
          result: isFuture ? resultForTeam(outcome, fixture, team.id) : "FINAL",
          projectedPoints: running,
        };
      });

      return {
        ...team,
        slots: [...completed, ...future],
        projectedPoints: running,
      };
    });
  }

  function pointKey(points) {
    return TEAMS.map((team) => points[team.id]).join("|");
  }

  function predictionKey(predictions, importedStandings, futureFixtureIds) {
    const importedKey = importedStandings
      ? TEAMS.map((team) => `${team.id}:${importedStandings[team.id] ? importedStandings[team.id].points : team.currentPoints}`).join("|")
      : "base";
    const futureKey = futureFixtureIds ? [...normalizeFutureFixtureIds(futureFixtureIds)].sort().join("|") : "all";
    return FUTURE_FIXTURES.map((fixture) => {
      const outcome = predictions[fixture.id];
      if (!outcome) return `${fixture.id}:unset`;
      return `${fixture.id}:${outcome.type}:${outcome.winner || ""}`;
    }).join(",") + `::${importedKey}::${futureKey}`;
  }

  function keyToPoints(key) {
    const values = key.split("|").map((value) => Number(value));
    return Object.fromEntries(TEAMS.map((team, index) => [team.id, values[index]]));
  }

  const finalStateCache = new Map();

  function generateFinalPointStates(predictions, importedStandings, futureFixtureIds) {
    const cacheKey = predictionKey(predictions || {}, importedStandings, futureFixtureIds);
    if (finalStateCache.has(cacheKey)) return finalStateCache.get(cacheKey);

    let states = new Map();
    states.set(pointKey(currentPointsMap(importedStandings)), true);

    for (const fixture of FUTURE_FIXTURES) {
      if (!isActiveFutureFixture(fixture.id, futureFixtureIds)) continue;
      const fixed = predictions[fixture.id];
      const outcomes = fixed
        ? [fixed]
        : [
            { type: "win", winner: fixture.teams[0] },
            { type: "win", winner: fixture.teams[1] },
            { type: "tie" },
          ];
      const nextStates = new Map();

      for (const key of states.keys()) {
        const basePoints = keyToPoints(key);
        for (const outcome of outcomes) {
          const nextPoints = { ...basePoints };
          for (const teamId of fixture.teams) {
            nextPoints[teamId] += pointsForOutcome(outcome, fixture, teamId);
          }
          nextStates.set(pointKey(nextPoints), true);
        }
      }
      states = nextStates;
    }

    const finalStates = [...states.keys()].map(keyToPoints);
    finalStateCache.set(cacheKey, finalStates);
    return finalStates;
  }

  function unresolvedFixtures(predictions, futureFixtureIds) {
    return FUTURE_FIXTURES.filter((fixture) => isActiveFutureFixture(fixture.id, futureFixtureIds) && !predictions[fixture.id]);
  }

  function cappedThresholdKey(points, threshold, capOffset) {
    const cap = threshold + capOffset;
    return TEAMS.map((team) => Math.min(points[team.id], cap)).join("|");
  }

  function canFinishWithFewerThanFourAbove(teamId, predictions, importedStandings, futureFixtureIds) {
    const basePoints = computePointsMap(predictions, importedStandings, futureFixtureIds);
    const targetPoints = basePoints[teamId];
    const fixtures = unresolvedFixtures(predictions, futureFixtureIds);
    const memo = new Map();

    function countAbove(points) {
      return TEAMS.filter((team) => team.id !== teamId && points[team.id] > targetPoints).length;
    }

    function search(index, points) {
      if (countAbove(points) >= 4) return false;
      if (index === fixtures.length) return true;
      const key = `${index}:${cappedThresholdKey(points, targetPoints, 1)}`;
      if (memo.has(key)) return memo.get(key);

      const fixture = fixtures[index];
      const outcomes = [
        { type: "win", winner: fixture.teams[0] },
        { type: "win", winner: fixture.teams[1] },
        { type: "tie" },
      ];
      for (const outcome of outcomes) {
        const nextPoints = { ...points };
        for (const fixtureTeamId of fixture.teams) {
          nextPoints[fixtureTeamId] += pointsForOutcome(outcome, fixture, fixtureTeamId);
        }
        if (search(index + 1, nextPoints)) {
          memo.set(key, true);
          return true;
        }
      }

      memo.set(key, false);
      return false;
    }

    return search(0, basePoints);
  }

  function isDefinitelyQualified(teamId, predictions, importedStandings, futureFixtureIds) {
    const basePoints = computePointsMap(predictions, importedStandings, futureFixtureIds);
    const targetPoints = basePoints[teamId];
    const fixtures = unresolvedFixtures(predictions, futureFixtureIds);
    const memo = new Map();

    function countAtOrAbove(points) {
      return TEAMS.filter((team) => team.id !== teamId && points[team.id] >= targetPoints).length;
    }

    function canBecomeUnsafe(index, points) {
      if (countAtOrAbove(points) >= 4) return true;
      if (index === fixtures.length) return false;
      const key = `${index}:${cappedThresholdKey(points, targetPoints, 0)}`;
      if (memo.has(key)) return memo.get(key);

      const fixture = fixtures[index];
      const outcomes = [
        { type: "win", winner: fixture.teams[0] },
        { type: "win", winner: fixture.teams[1] },
        { type: "tie" },
      ];
      for (const outcome of outcomes) {
        const nextPoints = { ...points };
        for (const fixtureTeamId of fixture.teams) {
          nextPoints[fixtureTeamId] += pointsForOutcome(outcome, fixture, fixtureTeamId);
        }
        if (canBecomeUnsafe(index + 1, nextPoints)) {
          memo.set(key, true);
          return true;
        }
      }

      memo.set(key, false);
      return false;
    }

    return !canBecomeUnsafe(0, basePoints);
  }

  function canPossiblyQualify(teamId, predictions, importedStandings, futureFixtureIds) {
    const controlPredictions = clonePredictions(predictions || {});
    for (const fixtureId of TEAM_FUTURE_ORDER[teamId]) {
      if (isActiveFutureFixture(fixtureId, futureFixtureIds) && !controlPredictions[fixtureId]) {
        controlPredictions[fixtureId] = { type: "win", winner: teamId };
      }
    }
    return canFinishWithFewerThanFourAbove(teamId, controlPredictions, importedStandings, futureFixtureIds);
  }

  function classifyFixtureForTeam(teamId, fixtureId, predictions, importedStandings, futureFixtureIds) {
    const fixture = fixtureById[fixtureId];
    const safePredictions = clonePredictions(predictions || {});
    if (!fixture || !fixture.teams.includes(teamId)) return "not-applicable";
    if (!isActiveFutureFixture(fixtureId, futureFixtureIds)) return "played";
    if (!canPossiblyQualify(teamId, safePredictions, importedStandings, futureFixtureIds)) return "eliminated";
    if (safePredictions[fixtureId]) return "prediction-set";

    const opponent = opponentFor(fixture, teamId);
    const lossPredictions = clonePredictions(safePredictions);
    lossPredictions[fixtureId] = { type: "win", winner: opponent };
    if (!canPossiblyQualify(teamId, lossPredictions, importedStandings, futureFixtureIds)) return "must-win";

    const controlPredictions = clonePredictions(lossPredictions);
    for (const otherFixtureId of TEAM_FUTURE_ORDER[teamId]) {
      if (otherFixtureId === fixtureId || controlPredictions[otherFixtureId] || !isActiveFutureFixture(otherFixtureId, futureFixtureIds)) continue;
      controlPredictions[otherFixtureId] = { type: "win", winner: teamId };
    }

    const allSafe = isDefinitelyQualified(teamId, controlPredictions, importedStandings, futureFixtureIds);
    return allSafe ? "not-must-win" : "needs-help";
  }

  function classifyAllFixtures(predictions, importedStandings, futureFixtureIds) {
    const labels = {};
    for (const fixture of FUTURE_FIXTURES) {
      labels[fixture.id] = {};
      for (const teamId of fixture.teams) {
        labels[fixture.id][teamId] = classifyFixtureForTeam(teamId, fixture.id, predictions || {}, importedStandings, futureFixtureIds);
      }
    }
    return labels;
  }

  return {
    TEAMS,
    FUTURE_FIXTURES,
    COMPLETED_ROWS,
    TEAM_FUTURE_ORDER,
    FALLBACK_SEASON_DATA,
    fixtureById,
    teamById,
    opponentFor,
    pointsForOutcome,
    resultForTeam,
    nextOutcomeForTeam,
    parseStandingsText,
    parseNdtvPointsTableText,
    validateStandingsImport,
    validateSeasonData,
    loadSeasonData,
    deriveFutureFixtureIds,
    computePointsMap,
    teamsWithProjectedNrr,
    computeStandings,
    buildTeamRows,
    qualificationStatus,
    playoffSeedStatus,
    generateFinalPointStates,
    canFinishWithFewerThanFourAbove,
    isDefinitelyQualified,
    canPossiblyQualify,
    classifyFixtureForTeam,
    classifyAllFixtures,
  };
});
