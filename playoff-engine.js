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
  const teamNameAliases = new Map();
  for (const team of TEAMS) {
    teamNameAliases.set(team.name.toUpperCase(), team.id);
    teamNameAliases.set(team.shortName.toUpperCase(), team.id);
  }
  teamNameAliases.set("MUMBAI INDIANS", "MI");
  teamNameAliases.set("MUMBAIINDIANS", "MI");
  teamNameAliases.set("KOLKATA KNIGHT RIDERS", "KKR");
  teamNameAliases.set("LUCKNOW SUPER GIANTS", "LSG");
  teamNameAliases.set("ROYAL CHALLENGERS BANGALORE", "RCB");

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
    const lines = String(text || "")
      .split(/\r?\n/)
      .map((line) => line.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    for (const line of lines) {
      const upperLine = line.toUpperCase();
      const team = TEAMS.find((candidate) => upperLine.includes(candidate.name.toUpperCase()));
      if (!team) continue;

      const teamIndex = upperLine.indexOf(team.name.toUpperCase());
      const afterTeam = line.slice(teamIndex + team.name.length).trim();
      const match = afterTeam.match(/^(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(-?\d+(?:\.\d+)?)(.*)$/);
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

  function hasPredictions(predictions) {
    return Object.keys(predictions || {}).length > 0;
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
    const hasKnownNrr = TEAMS.every((team) => {
      const nrr = importedStandings && importedStandings[team.id] ? importedStandings[team.id].nrr : team.nrr;
      return Number.isFinite(nrr);
    });
    const shouldUseNrrAsResolved = hasKnownNrr && !hasPredictions(predictions);
    const standings = TEAMS.map((team) => ({
      ...team,
      nrr: importedStandings && importedStandings[team.id] ? importedStandings[team.id].nrr : team.nrr,
      points: points[team.id],
      status: qualificationStatus(points, team.id),
      seedStatus: playoffSeedStatus(points, team.id),
    })).sort((a, b) => b.points - a.points || b.nrr - a.nrr || a.rank - b.rank);

    if (shouldUseNrrAsResolved) {
      return standings.map((team, index) => ({
        ...team,
        seedStatus: rankedSeedStatus(index),
      }));
    }

    return standings;
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
    fixtureById,
    teamById,
    opponentFor,
    pointsForOutcome,
    resultForTeam,
    nextOutcomeForTeam,
    parseStandingsText,
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
