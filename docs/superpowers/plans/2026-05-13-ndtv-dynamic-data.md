# Dynamic NDTV Data Refresh for IPL Playoff Predictor

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

## Purpose / Big Picture

After this change, the predictor can be refreshed from NDTV's IPL 2026 points-table page instead of relying only on manually maintained standings. A user can run a local refresh command, start the static server, and see the app load the generated latest-data JSON. If the refresh fails or the JSON is missing, the built-in screenshot data remains available as a fallback.

## Progress

- [x] (2026-05-13) Inspected the current hardcoded engine, UI import flow, and README.
- [x] (2026-05-13) Confirmed direct `curl` to NDTV can return Access Denied, so the implementation must keep fallback data and make the refresh command explicit.
- [x] (2026-05-13) Added failing tests for parsing NDTV-style points-table text into standings, completed rows, and future fixtures.
- [x] (2026-05-13) Implemented the NDTV parser and season-data loader.
- [x] (2026-05-13) Added a refresh script that fetches NDTV and writes `data/latest-ipl-2026.json`.
- [x] (2026-05-13) Updated the browser page to load latest JSON when served over HTTP and fall back cleanly.
- [x] (2026-05-13) Updated README with the dynamic refresh workflow and fallback behavior.
- [x] (2026-05-13) Ran tests and a local HTTP smoke check.

## Surprises & Discoveries

- Observation: NDTV may block direct command-line fetching with an Access Denied page.
  Evidence: `curl -L https://sports.ndtv.com/ipl-2026/points-table` returned an HTML Access Denied response on 2026-05-13.

- Observation: The Node refresh script is correctly wired but NDTV rejected this environment with HTTP 403.
  Evidence: `node fetch-standings.js` outside the sandbox returned `NDTV fetch failed with HTTP 403. The app can still use its fallback data.`

## Decision Log

- Decision: Use NDTV as a local refresh source instead of making the static HTML page fetch NDTV directly.
  Rationale: A browser-only static page is likely to hit cross-origin restrictions, and NDTV may block command-line clients. A local refresh script plus fallback JSON is more reliable for personal use.
  Date/Author: 2026-05-13 / Codex.

- Decision: Keep fallback data in `playoff-engine.js` and add a dynamic `loadSeasonData` path instead of deleting all built-in data.
  Rationale: The app should still work offline and when the source site changes or blocks fetches.
  Date/Author: 2026-05-13 / Codex.

## Outcomes & Retrospective

Completed. The parser and loader are covered by `node playoff-engine.test.js`, the README documents `node fetch-standings.js` followed by `python3 -m http.server 8000`, and local HTTP checks confirmed the app page serves while missing generated JSON returns 404 for the fallback path.

## Context and Orientation

The current app is plain HTML and JavaScript. `playoff-engine.js` owns teams, fixtures, completed match rows, scoring, standings, import parsing, and must-win classification. `ipl-playoff-predictor.html` renders the page and calls `window.PlayoffEngine`. `playoff-engine.test.js` is a Node test file using the built-in `assert` module. The new source is NDTV's IPL 2026 points-table page, which exposes rows containing team statistics and per-team match history. The parser will normalize that source into the same engine shape: teams, future fixtures, completed rows, and per-team future fixture order.

## Plan of Work

First add tests that describe the desired parser output from representative NDTV-style text. Then implement parser helpers in `playoff-engine.js` so the same functions are available to Node tests, the refresh script, and the browser. Add `loadSeasonData(data)` to mutate the existing exported arrays and maps in place, preserving the current browser API. Add `fetch-standings.js` to fetch NDTV, parse the response, validate it, and write `data/latest-ipl-2026.json`. Finally, update the HTML boot flow to attempt loading that JSON from the local server before rendering, and update README.

## Concrete Steps

From `/Users/sirampur/Desktop/buildspace/Personal`, run `node playoff-engine.test.js` after adding tests and expect the new tests to fail before implementation. After implementation, run `node playoff-engine.test.js` and expect `playoff-engine tests passed`. To refresh live data, run `node fetch-standings.js`; success should write `data/latest-ipl-2026.json`. If NDTV blocks the request, the command should fail with a clear message and leave the app fallback usable.

## Validation and Acceptance

Acceptance requires that NDTV-style sample text parses into all ten teams, recognizes completed rows and future fixtures, and that `loadSeasonData` changes projected standings from supplied data. Browser acceptance is that loading `http://127.0.0.1:8000/ipl-playoff-predictor.html` uses `data/latest-ipl-2026.json` when present and otherwise says it is using fallback data.

## Idempotence and Recovery

The refresh script is safe to run repeatedly; it overwrites only `data/latest-ipl-2026.json` after validation succeeds. If refresh fails, delete or ignore `data/latest-ipl-2026.json` and the app uses the built-in fallback data. No destructive git commands are part of this plan.

## Artifacts and Notes

The NDTV command-line request may fail with Access Denied. The parser tests use checked-in sample text so test outcomes remain deterministic and do not depend on live network access.

## Interfaces and Dependencies

No package dependencies are required. Use Node's built-in `fetch`, `fs`, and `assert`. New public engine functions should include `parseNdtvPointsTableText(text)`, `validateSeasonData(data)`, and `loadSeasonData(data)`.
