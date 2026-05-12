# IPL Playoff Predictor

A standalone browser-based IPL playoff predictor for exploring remaining-match scenarios.

The app lets you toggle future match outcomes, updates projected points, keeps opponent results in sync, and highlights when NRR would need to be updated after projected results.

## Features

- Hard-coded IPL 2026 standings and remaining fixtures from the current table.
- Clickable future match cells that cycle through `Win`, `Loss`, `Tie`, `No Result`, and unset.
- Reciprocal result updates for the opponent in the same fixture.
- Live projected standings with current NRR displayed.
- Italicized NRR for teams whose projected result means their NRR would need recalculation.
- Top-two and top-four cutoff notes when projected results create unresolved NRR/tiebreaker cases.
- Manual standings import from copied table text or OCR text.

## Source Standings

Use the ESPNcricinfo points table as the current standings source:

https://www.espncricinfo.com/series/ipl-2026-1510719/points-table-standings

If automatic fetching is blocked, copy the standings table text from that page or use OCR/Live Text from a screenshot, then paste it into **Import latest standings** in the app.

## Run Locally

From this directory:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/ipl-playoff-predictor.html
```

You can also open `ipl-playoff-predictor.html` directly in a browser, but a local server is more reliable for loading the JavaScript file.

## Tests

Run the engine tests with:

```bash
node playoff-engine.test.js
```

## Files

- `ipl-playoff-predictor.html` - UI, styling, and browser interactions.
- `playoff-engine.js` - standings data, scoring, scenario analysis, import parsing, and must-win logic.
- `playoff-engine.test.js` - Node tests for scoring, standings, NRR behavior, import parsing, and fixture locking.

## Notes

- Future NRR is not recalculated from projected match results because score/overs data is not collected.
- When you toggle a future result, affected teams keep their current NRR value but it is italicized to show it needs an update.
- Ties and no-results are scored as one point for each team.
