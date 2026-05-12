# IPL Playoff Predictor Design

## Goal

Build a standalone local playoff predictor for the IPL 2026 points table shown in the supplied screenshots.

## Requirements

- Hard-code the teams, current points, completed match outcomes, and remaining fixtures from the screenshots.
- Let the user predict each remaining fixture as win, loss, tie, no result, or unset.
- When a future match cell is marked as a win for one team, the opponent cell for the same fixture must show the reciprocal loss.
- Score future outcomes as win = 2, loss = 0, tie = 1, and no result = 1.
- Update projected cumulative points and projected standings live after each prediction.
- Ignore NRR in the first pass. When equal points affect the fourth-place cutoff, show that NRR/tiebreaker is needed.
- Based on current predictions, label remaining fixtures for each team as:
  - `Must win`: losing that match makes top-four qualification impossible.
  - `Needs help if lost`: losing that match leaves qualification possible, but not fully in the team's control.
  - `Not must-win`: losing that match can still leave the team in control of qualification.
  - `Eliminated`: the team cannot reach the top four by points under any remaining outcomes.

## Architecture

The predictor will be a static HTML page backed by a small JavaScript engine. The engine owns the hard-coded data, point calculations, standings ranking, scenario enumeration, and must-win classification. The page owns rendering, click handling, and presentation.

## UI

The main view is a spreadsheet-style table with one row per team and 14 match columns. Completed matches are read-only. Future match cells are grey and clickable. A right-side or lower analysis area shows projected standings, possible qualifiers, and fixture-level must-win labels.

## Validation

Use deterministic Node tests for the engine before wiring the UI:

- current points match the screenshot data
- a predicted win gives the selected team 2 points and the opponent 0
- tie and no result give both teams 1 point
- top-four cutoff ties are flagged as NRR/tiebreaker needed
- eliminated teams are identified from the current remaining schedule
- a safe leader fixture such as GT vs KKR is not treated as must-win for GT
