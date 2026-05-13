# IPL Playoff Predictor

A standalone browser-based IPL playoff predictor for exploring remaining-match scenarios.

The app lets you refresh standings from NDTV into local JSON, toggle future match outcomes, update projected points, keep opponent results in sync, and show when a playoff cutoff depends on NRR.

## Features

- NDTV refresh script that writes the latest parsed standings and fixtures to `data/latest-ipl-2026.json`.
- Built-in fallback IPL 2026 standings and remaining fixtures from the screenshot/table baseline.
- Clickable future match cells that cycle through `Win`, `Loss`, `Tie`, `No Result`, and unset.
- Reciprocal result updates for the opponent in the same fixture.
- Live projected standings sorted by points, then known NRR.
- Italicized NRR only for teams whose win/loss prediction means their NRR would need recalculation.
- Top-two and top-four cutoff notes only when a tied cutoff includes a stale or unknown NRR.
- Red standings cards for teams that cannot mathematically finish in the playoff places.
- Per-fixture labels for `Must win`, `Needs help`, `Not must win`, `Eliminated`, `Played`, and `Prediction set`.
- Low-friction manual standings import from copied table text or OCR/Live Text from a screenshot.
- Live import preview that highlights changed `PTS`, `NRR`, and `Next` values.
- Import validation that only enables Apply after all 10 known teams are parsed.

## Source Standings

Primary dynamic source:

https://sports.ndtv.com/ipl-2026/points-table

Manual fallback source:

https://www.espncricinfo.com/series/ipl-2026-1510719/points-table-standings

The app does not fetch NDTV directly from the browser. Instead, run the local refresh script:

```bash
node fetch-standings.js
```

On success, it writes:

```text
data/latest-ipl-2026.json
```

Then start the local server and open the app. The page loads `data/latest-ipl-2026.json` first. If the file is missing or invalid, it uses the built-in fallback data.

NDTV may block command-line requests. In that case the script exits with a clear message, and the app remains usable with fallback data or manual import.

For manual import, copy a standings table or use OCR/Live Text from a screenshot, then paste it into **Update standings** in the app.

The import preview updates as you paste. **Apply standings** stays disabled until all 10 teams are found. Applying an import resets predictions and locks already-played fixtures based on the imported `Next` column.

## Run Locally

From this directory:

```bash
node fetch-standings.js
```

If NDTV blocks the request, continue with fallback data:

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

- `fetch-standings.js` - local NDTV refresh script that writes validated latest data.
- `ipl-playoff-predictor.html` - UI, styling, and browser interactions.
- `playoff-engine.js` - fallback data, NDTV parsing, dynamic season loading, scoring, scenario analysis, import parsing, and must-win logic.
- `playoff-engine.test.js` - Node tests for scoring, standings, NRR behavior, NDTV parsing, import parsing, and fixture locking.
- `data/latest-ipl-2026.json` - ignored generated latest data file, created by `node fetch-standings.js` when refresh succeeds.
- `docs/superpowers/plans/2026-05-13-ndtv-dynamic-data.md` - implementation plan for the dynamic data refresh work.

## Notes

- The dynamic refresh path keeps only stable team IDs and aliases in code. Standings, completed rows, and future fixtures can come from generated NDTV JSON.
- The built-in fallback remains intentional so the static page works offline or when NDTV blocks automated requests.
- Future NRR is not recalculated from projected match results because score/overs data is not collected.
- When you toggle a future win/loss, only the two teams in that match keep their current NRR value italicized to show it needs an update.
- Tie and no-result predictions do not stale NRR because no win/loss margin is implied.
- Known NRR is used to resolve projected ties unless the relevant tied cutoff group includes a team with stale or unknown NRR.
- Ties and no-results are scored as one point for each team.
