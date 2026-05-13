const assert = require("assert");
const engine = require("./playoff-engine");

function byId(rows, id) {
  const row = rows.find((item) => item.id === id);
  assert.ok(row, `Expected row for ${id}`);
  return row;
}

function testCurrentPointsMatchScreenshot() {
  const standings = engine.computeStandings({});
  assert.strictEqual(byId(standings, "GT").points, 16);
  assert.strictEqual(byId(standings, "RCB").points, 14);
  assert.strictEqual(byId(standings, "SRH").points, 14);
  assert.strictEqual(byId(standings, "PBKS").points, 13);
  assert.strictEqual(byId(standings, "CSK").points, 12);
  assert.strictEqual(byId(standings, "RR").points, 12);
  assert.strictEqual(byId(standings, "DC").points, 10);
  assert.strictEqual(byId(standings, "KKR").points, 9);
  assert.strictEqual(byId(standings, "MI").points, 6);
  assert.strictEqual(byId(standings, "LSG").points, 6);
}

function testCurrentNrrMatchesScreenshot() {
  const standings = engine.computeStandings({});
  assert.strictEqual(byId(standings, "GT").nrr, 0.551);
  assert.strictEqual(byId(standings, "RCB").nrr, 1.103);
  assert.strictEqual(byId(standings, "SRH").nrr, 0.331);
  assert.strictEqual(byId(standings, "PBKS").nrr, 0.428);
  assert.strictEqual(byId(standings, "CSK").nrr, 0.185);
  assert.strictEqual(byId(standings, "RR").nrr, 0.082);
  assert.strictEqual(byId(standings, "DC").nrr, -0.993);
  assert.strictEqual(byId(standings, "KKR").nrr, -0.169);
  assert.strictEqual(byId(standings, "MI").nrr, -0.585);
  assert.strictEqual(byId(standings, "LSG").nrr, -0.907);
}

function testPredictionScoringAndReciprocalCells() {
  const predictions = { "GT-KKR": { type: "win", winner: "GT" } };
  const standings = engine.computeStandings(predictions);
  assert.strictEqual(byId(standings, "GT").points, 18);
  assert.strictEqual(byId(standings, "KKR").points, 9);

  const rows = engine.buildTeamRows(predictions);
  const gtCell = byId(rows, "GT").slots.find((slot) => slot.fixtureId === "GT-KKR");
  const kkrCell = byId(rows, "KKR").slots.find((slot) => slot.fixtureId === "GT-KKR");
  assert.strictEqual(gtCell.result, "W");
  assert.strictEqual(kkrCell.result, "L");
  assert.strictEqual(gtCell.projectedPoints, 18);
  assert.strictEqual(kkrCell.projectedPoints, 9);
}

function testPredictedResultMarksAffectedNrrTeams() {
  const affected = engine.teamsWithProjectedNrr({ "GT-KKR": { type: "win", winner: "GT" } });
  assert.deepStrictEqual([...affected].sort(), ["GT", "KKR"]);
}

function testTieAndNoResultDoNotMarkNrrStale() {
  let affected = engine.teamsWithProjectedNrr({ "GT-KKR": { type: "tie" } });
  assert.deepStrictEqual([...affected], []);

  affected = engine.teamsWithProjectedNrr({ "GT-KKR": { type: "nr" } });
  assert.deepStrictEqual([...affected], []);
}

function testTieAndNoResultGiveOnePointEach() {
  let standings = engine.computeStandings({ "GT-KKR": { type: "tie" } });
  assert.strictEqual(byId(standings, "GT").points, 17);
  assert.strictEqual(byId(standings, "KKR").points, 10);

  standings = engine.computeStandings({ "GT-KKR": { type: "nr" } });
  assert.strictEqual(byId(standings, "GT").points, 17);
  assert.strictEqual(byId(standings, "KKR").points, 10);
}

function testCutoffTieRequiresNrr() {
  const syntheticPoints = {
    GT: 20,
    RCB: 18,
    SRH: 16,
    PBKS: 14,
    CSK: 14,
    RR: 10,
    DC: 8,
    KKR: 6,
    MI: 4,
    LSG: 2,
  };
  assert.strictEqual(engine.qualificationStatus(syntheticPoints, "PBKS"), "nrr");
  assert.strictEqual(engine.qualificationStatus(syntheticPoints, "CSK"), "nrr");
  assert.strictEqual(engine.qualificationStatus(syntheticPoints, "RR"), "out");
}

function testTopTwoTieRequiresNrrForQualifierAdvantage() {
  const syntheticPoints = {
    GT: 18,
    RCB: 16,
    SRH: 16,
    PBKS: 14,
    CSK: 12,
    RR: 10,
    DC: 8,
    KKR: 6,
    MI: 4,
    LSG: 2,
  };
  assert.strictEqual(engine.playoffSeedStatus(syntheticPoints, "GT"), "top-two");
  assert.strictEqual(engine.playoffSeedStatus(syntheticPoints, "RCB"), "top-two-nrr");
  assert.strictEqual(engine.playoffSeedStatus(syntheticPoints, "SRH"), "top-two-nrr");
  assert.strictEqual(engine.playoffSeedStatus(syntheticPoints, "PBKS"), "playoff");
}

function testKnownNrrSuppressesNrrNeededInInitialStandings() {
  const standings = engine.computeStandings({});
  assert.strictEqual(byId(standings, "RCB").seedStatus, "top-two");
  assert.strictEqual(byId(standings, "SRH").seedStatus, "playoff");
}

function testUnrelatedWinKeepsKnownNrrResolvedAtTopTwoCutoff() {
  const standings = engine.computeStandings({ "GT-KKR": { type: "win", winner: "GT" } });
  assert.strictEqual(byId(standings, "GT").seedStatus, "top-two");
  assert.strictEqual(byId(standings, "RCB").seedStatus, "top-two");
  assert.strictEqual(byId(standings, "SRH").seedStatus, "playoff");
}

function testTieAndNoResultKeepKnownNrrResolvedAtTopTwoCutoff() {
  let standings = engine.computeStandings({ "GT-KKR": { type: "tie" } });
  assert.strictEqual(byId(standings, "RCB").seedStatus, "top-two");
  assert.strictEqual(byId(standings, "SRH").seedStatus, "playoff");

  standings = engine.computeStandings({ "GT-KKR": { type: "nr" } });
  assert.strictEqual(byId(standings, "RCB").seedStatus, "top-two");
  assert.strictEqual(byId(standings, "SRH").seedStatus, "playoff");
}

function testStaleNrrTieStillRequiresTiebreakerAtTopTwoCutoff() {
  const standings = engine.computeStandings({ "RCB-KKR": { type: "win", winner: "KKR" } });
  assert.strictEqual(byId(standings, "RCB").seedStatus, "top-two-nrr");
  assert.strictEqual(byId(standings, "SRH").seedStatus, "top-two-nrr");
}

function testKnownNrrResolvesProjectedTieAtFourthPlaceCutoff() {
  const standings = engine.computeStandings({
    "GT-KKR": { type: "win", winner: "GT" },
    "CSK-LSG": { type: "tie" },
  });
  assert.strictEqual(byId(standings, "PBKS").seedStatus, "playoff");
  assert.strictEqual(byId(standings, "CSK").seedStatus, "out");
}

function testCurrentPossibleQualifiersAndMustWinLabels() {
  const predictions = {};
  assert.strictEqual(engine.canPossiblyQualify("MI", predictions), false);
  assert.strictEqual(engine.canPossiblyQualify("LSG", predictions), false);
  assert.strictEqual(engine.classifyFixtureForTeam("GT", "GT-KKR", predictions), "not-must-win");
  assert.strictEqual(engine.classifyFixtureForTeam("LSG", "CSK-LSG", predictions), "eliminated");
}

function testParseStandingsImportCapturesPointsNrrAndNext() {
  const pasted = `
1 GUJARAT TITANS 12 8 4 0 0 16 0.551 W W W W W vs KKR, CSK 2111/230.4 2047/238.0
2 ROYAL CHALLENGERS BENGALURU 11 7 4 0 0 14 1.103 W W L L W vs KKR, PBKS, SRH 2026/195.1 1973/212.4
3 SUNRISERS HYDERABAD 12 7 5 0 0 14 0.331 W W L W L vs CSK, RCB 2418/237.1 2295/232.4
7 DELHI CAPITALS 12 5 7 0 0 10 -0.993 L W L L W vs RR, KKR 2159/233.2 2225/217.1
`;

  const imported = engine.parseStandingsText(pasted);
  assert.strictEqual(imported.GT.points, 16);
  assert.strictEqual(imported.GT.nrr, 0.551);
  assert.deepStrictEqual(imported.GT.next, ["KKR", "CSK"]);
  assert.strictEqual(imported.RCB.points, 14);
  assert.strictEqual(imported.RCB.nrr, 1.103);
  assert.deepStrictEqual(imported.RCB.next, ["KKR", "PBKS", "SRH"]);
  assert.strictEqual(imported.DC.nrr, -0.993);
  assert.deepStrictEqual(imported.DC.next, ["RR", "KKR"]);
}

function testParseStandingsImportHandlesWrappedOcrText() {
  const pasted = `
Teams M W L T N/R PTS NRR Series Form Next For Against
1
GUJARAT TITANS
12 8 4 0 0 16 0.551
W W W W W
vs KKR, CSK
2111/230.4 2047/238.0
2 ROYAL CHALLENGERS BENGALURU
11 7 4 0 0 14 1.103
vs KKR, PBKS, SRH 2026/195.1 1973/212.4
3 SUNRISERS HYDERABAD 12 7 5 0 0 14 0.331 vs CSK, RCB 2418/237.1 2295/232.4
4 PUNJAB KINGS 11 6 4 0 1 13 0.428 vs MI, RCB, LSG 2112/192.0 2095/198.1
5 CHENNAI SUPER KINGS 11 6 5 0 0 12 0.185 vs LSG, SRH, GT 2023/215.0 1914/207.3
6 RAJASTHAN ROYALS 11 6 5 0 0 12 0.082 vs DC, LSG, MI 1996/200.3 2057/208.2
7 DELHI CAPITALS 12 5 7 0 0 10 -0.993 vs RR, KKR 2159/233.2 2225/217.1
8 KOLKATA KNIGHT RIDERS 10 4 5 0 1 9 -0.169 vs RCB, GT, MI 1534/172.2 1622/178.5
9 MUMBAI INDIANS 11 3 8 0 0 6 -0.585 vs PBKS, KKR, RR 2026/208.5 2083/202.3
10 LUCKNOW SUPER GIANTS 11 3 8 0 0 6 -0.907 vs CSK, RR, PBKS 1910/218.5 2004/208.0
`;
  const imported = engine.parseStandingsText(pasted);
  const validation = engine.validateStandingsImport(imported);
  assert.strictEqual(validation.isComplete, true);
  assert.strictEqual(imported.GT.points, 16);
  assert.strictEqual(imported.GT.nrr, 0.551);
  assert.deepStrictEqual(imported.GT.next, ["KKR", "CSK"]);
  assert.deepStrictEqual(imported.RCB.next, ["KKR", "PBKS", "SRH"]);
}

function testParseStandingsImportHandlesFullTeamNamesInNextColumn() {
  const pasted = `
1 GUJARAT TITANS 12 8 4 0 0 16 0.551 vs KOLKATA KNIGHT RIDERS, CHENNAI SUPER KINGS 2111/230.4 2047/238.0
2 ROYAL CHALLENGERS BENGALURU 11 7 4 0 0 14 1.103 vs KOLKATA KNIGHT RIDERS, PUNJAB KINGS, SUNRISERS HYDERABAD 2026/195.1 1973/212.4
3 SUNRISERS HYDERABAD 12 7 5 0 0 14 0.331 vs CHENNAI SUPER KINGS, ROYAL CHALLENGERS BENGALURU 2418/237.1 2295/232.4
4 PUNJAB KINGS 11 6 4 0 1 13 0.428 vs MUMBAI INDIANS, ROYAL CHALLENGERS BENGALURU, LUCKNOW SUPER GIANTS 2112/192.0 2095/198.1
5 CHENNAI SUPER KINGS 11 6 5 0 0 12 0.185 vs LUCKNOW SUPER GIANTS, SUNRISERS HYDERABAD, GUJARAT TITANS 2023/215.0 1914/207.3
6 RAJASTHAN ROYALS 11 6 5 0 0 12 0.082 vs DELHI CAPITALS, LUCKNOW SUPER GIANTS, MUMBAI INDIANS 1996/200.3 2057/208.2
7 DELHI CAPITALS 12 5 7 0 0 10 -0.993 vs RAJASTHAN ROYALS, KOLKATA KNIGHT RIDERS 2159/233.2 2225/217.1
8 KOLKATA KNIGHT RIDERS 10 4 5 0 1 9 -0.169 vs ROYAL CHALLENGERS BENGALURU, GUJARAT TITANS, MUMBAI INDIANS 1534/172.2 1622/178.5
9 MUMBAI INDIANS 11 3 8 0 0 6 -0.585 vs PUNJAB KINGS, KOLKATA KNIGHT RIDERS, RAJASTHAN ROYALS 2026/208.5 2083/202.3
10 LUCKNOW SUPER GIANTS 11 3 8 0 0 6 -0.907 vs CHENNAI SUPER KINGS, RAJASTHAN ROYALS, PUNJAB KINGS 1910/218.5 2004/208.0
`;
  const imported = engine.parseStandingsText(pasted);
  const validation = engine.validateStandingsImport(imported);
  assert.strictEqual(validation.isComplete, true);
  assert.deepStrictEqual(imported.GT.next, ["KKR", "CSK"]);
  assert.deepStrictEqual(imported.PBKS.next, ["MI", "RCB", "LSG"]);
}

function testImportedNextColumnControlsFutureFixtures() {
  const imported = engine.parseStandingsText(`
2 ROYAL CHALLENGERS BENGALURU 12 8 4 0 0 16 1.203 W W L W W vs PBKS, SRH 2026/195.1 1973/212.4
8 KOLKATA KNIGHT RIDERS 11 4 6 0 1 9 -0.269 L W W W L vs GT, MI, DC 1534/172.2 1622/178.5
`);
  const futureIds = engine.deriveFutureFixtureIds(imported);
  assert.strictEqual(futureIds.has("RCB-KKR"), false);
  assert.strictEqual(futureIds.has("RCB-PBKS"), true);
  assert.strictEqual(futureIds.has("GT-KKR"), true);
}

function testStandingsImportValidationRequiresAllTeams() {
  const imported = engine.parseStandingsText(`
1 GUJARAT TITANS 12 8 4 0 0 16 0.551 vs KKR, CSK 2111/230.4 2047/238.0
2 ROYAL CHALLENGERS BENGALURU 11 7 4 0 0 14 1.103 vs KKR, PBKS, SRH 2026/195.1 1973/212.4
`);
  const validation = engine.validateStandingsImport(imported);
  assert.strictEqual(validation.isComplete, false);
  assert.strictEqual(validation.parsedCount, 2);
  assert.deepStrictEqual(validation.missingTeamIds, ["SRH", "PBKS", "CSK", "RR", "DC", "KKR", "MI", "LSG"]);
}

function ndtvSampleText() {
  return `
No | Teams | P | W | L | T | NR | PTS | NRR |
1 | Gujarat Titans GT | 12 | 8 | 4 | 0 | 0 | 16 | +0.551 |
Match 56 May 12 2026, (Ahmedabad) Point +2 vs Sunrisers Hyderabad Gujarat Titans beat Sunrisers Hyderabad by 82 runs % Chance to Win Match 60 May 16 2026, (Kolkata) vs Kolkata Knight Riders Match 66 May 21 2026, (Ahmedabad) vs Chennai Super Kings
2 | Royal Challengers Bengaluru RCB | 11 | 7 | 4 | 0 | 0 | 14 | +1.103 |
Match 54 May 10 2026, (Raipur) Point +2 vs Mumbai Indians Royal Challengers Bengaluru beat Mumbai Indians by 2 wickets % Chance to Win Match 57 May 13 2026, (Raipur) vs Kolkata Knight Riders Match 61 May 17 2026, (Dharamsala) vs Punjab Kings Match 67 May 22 2026, (Hyderabad) vs Sunrisers Hyderabad
3 | Sunrisers Hyderabad SRH | 12 | 7 | 5 | 0 | 0 | 14 | +0.331 |
Match 56 May 12 2026, (Ahmedabad) Point 0 vs Gujarat Titans Gujarat Titans beat Sunrisers Hyderabad by 82 runs % Chance to Win Match 63 May 18 2026, (Chennai) vs Chennai Super Kings Match 67 May 22 2026, (Hyderabad) vs Royal Challengers Bengaluru
4 | Punjab Kings PBKS | 11 | 6 | 4 | 0 | 1 | 13 | +0.428 |
Match 12 Apr 6 2026, (Kolkata) Point +1 vs Kolkata Knight Riders Match Abandoned % Chance to Win Match 58 May 14 2026, (Dharamsala) vs Mumbai Indians Match 61 May 17 2026, (Dharamsala) vs Royal Challengers Bengaluru Match 68 May 23 2026, (Lucknow) vs Lucknow Super Giants
5 | Chennai Super Kings CSK | 11 | 6 | 5 | 0 | 0 | 12 | +0.185 |
Match 53 May 9 2026, (Lucknow) Point +2 vs Lucknow Super Giants Chennai Super Kings beat Lucknow Super Giants by 8 wickets % Chance to Win Match 59 May 15 2026, (Lucknow) vs Lucknow Super Giants Match 63 May 18 2026, (Chennai) vs Sunrisers Hyderabad Match 66 May 21 2026, (Ahmedabad) vs Gujarat Titans
6 | Rajasthan Royals RR | 11 | 6 | 5 | 0 | 0 | 12 | +0.082 |
Match 52 May 9 2026, (Jaipur) Point 0 vs Gujarat Titans Gujarat Titans beat Rajasthan Royals by 77 runs % Chance to Win Match 62 May 17 2026, (Delhi) vs Delhi Capitals Match 64 May 19 2026, (Lucknow) vs Lucknow Super Giants Match 69 May 24 2026, (Mumbai) vs Mumbai Indians
7 | Delhi Capitals DC | 12 | 5 | 7 | 0 | 0 | 10 | -0.993 |
Match 55 May 11 2026, (Dharamsala) Point +2 vs Punjab Kings Delhi Capitals beat Punjab Kings by 3 wickets % Chance to Win Match 62 May 17 2026, (Delhi) vs Rajasthan Royals Match 70 May 24 2026, (Kolkata) vs Kolkata Knight Riders
8 | Kolkata Knight Riders KKR | 10 | 4 | 5 | 0 | 1 | 9 | -0.169 |
Match 51 May 8 2026, (Delhi) Point +2 vs Delhi Capitals Kolkata Knight Riders beat Delhi Capitals by 8 wickets % Chance to Win Match 57 May 13 2026, (Raipur) vs Royal Challengers Bengaluru Match 60 May 16 2026, (Kolkata) vs Gujarat Titans Match 65 May 20 2026, (Kolkata) vs Mumbai Indians Match 70 May 24 2026, (Kolkata) vs Delhi Capitals
9 | Mumbai Indians MI | 11 | 3 | 8 | 0 | 0 | 6 | -0.585 |
Match 54 May 10 2026, (Raipur) Point 0 vs Royal Challengers Bengaluru Royal Challengers Bengaluru beat Mumbai Indians by 2 wickets % Chance to Win Match 58 May 14 2026, (Dharamsala) vs Punjab Kings Match 65 May 20 2026, (Kolkata) vs Kolkata Knight Riders Match 69 May 24 2026, (Mumbai) vs Rajasthan Royals
10 | Lucknow Super Giants LSG | 11 | 3 | 8 | 0 | 0 | 6 | -0.907 |
Match 53 May 9 2026, (Lucknow) Point 0 vs Chennai Super Kings Chennai Super Kings beat Lucknow Super Giants by 8 wickets % Chance to Win Match 59 May 15 2026, (Lucknow) vs Chennai Super Kings Match 64 May 19 2026, (Lucknow) vs Rajasthan Royals Match 68 May 23 2026, (Lucknow) vs Punjab Kings
`;
}

function testParseNdtvPointsTableTextBuildsSeasonData() {
  const season = engine.parseNdtvPointsTableText(ndtvSampleText());
  const validation = engine.validateSeasonData(season);
  assert.strictEqual(validation.isValid, true);
  assert.strictEqual(byId(season.teams, "GT").currentPoints, 16);
  assert.strictEqual(byId(season.teams, "RCB").nrr, 1.103);
  assert.deepStrictEqual(season.teamFutureOrder.GT, ["GT-KKR", "GT-CSK"]);
  assert.deepStrictEqual(season.teamFutureOrder.RCB, ["RCB-KKR", "RCB-PBKS", "RCB-SRH"]);
  assert.deepStrictEqual(season.completedRows.PBKS[0], ["KKR", "NR", 1]);
  assert.ok(season.futureFixtures.some((fixture) => fixture.id === "RCB-KKR" && fixture.date === "May 13"));
}

function testLoadSeasonDataReplacesEngineData() {
  const season = engine.parseNdtvPointsTableText(ndtvSampleText());
  engine.loadSeasonData({
    ...season,
    teams: season.teams.map((team) => team.id === "GT" ? { ...team, currentPoints: 18, nrr: 0.777 } : team),
  });
  const standings = engine.computeStandings({});
  assert.strictEqual(byId(standings, "GT").points, 18);
  assert.strictEqual(byId(standings, "GT").nrr, 0.777);
  assert.strictEqual(engine.FUTURE_FIXTURES.length, 14);
  assert.strictEqual(engine.fixtureById["RCB-KKR"].date, "May 13");
  engine.loadSeasonData(engine.FALLBACK_SEASON_DATA);
}

testCurrentPointsMatchScreenshot();
testCurrentNrrMatchesScreenshot();
testPredictionScoringAndReciprocalCells();
testPredictedResultMarksAffectedNrrTeams();
testTieAndNoResultDoNotMarkNrrStale();
testTieAndNoResultGiveOnePointEach();
testCutoffTieRequiresNrr();
testTopTwoTieRequiresNrrForQualifierAdvantage();
testKnownNrrSuppressesNrrNeededInInitialStandings();
testUnrelatedWinKeepsKnownNrrResolvedAtTopTwoCutoff();
testTieAndNoResultKeepKnownNrrResolvedAtTopTwoCutoff();
testStaleNrrTieStillRequiresTiebreakerAtTopTwoCutoff();
testKnownNrrResolvesProjectedTieAtFourthPlaceCutoff();
testCurrentPossibleQualifiersAndMustWinLabels();
testParseStandingsImportCapturesPointsNrrAndNext();
testParseStandingsImportHandlesWrappedOcrText();
testParseStandingsImportHandlesFullTeamNamesInNextColumn();
testImportedNextColumnControlsFutureFixtures();
testStandingsImportValidationRequiresAllTeams();
testParseNdtvPointsTableTextBuildsSeasonData();
testLoadSeasonDataReplacesEngineData();

console.log("playoff-engine tests passed");
