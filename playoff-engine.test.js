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

testCurrentPointsMatchScreenshot();
testCurrentNrrMatchesScreenshot();
testPredictionScoringAndReciprocalCells();
testPredictedResultMarksAffectedNrrTeams();
testTieAndNoResultDoNotMarkNrrStale();
testTieAndNoResultGiveOnePointEach();
testCutoffTieRequiresNrr();
testTopTwoTieRequiresNrrForQualifierAdvantage();
testKnownNrrSuppressesNrrNeededInInitialStandings();
testCurrentPossibleQualifiersAndMustWinLabels();
testParseStandingsImportCapturesPointsNrrAndNext();
testImportedNextColumnControlsFutureFixtures();

console.log("playoff-engine tests passed");
