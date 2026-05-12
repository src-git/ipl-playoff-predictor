# IPL Playoff Predictor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone IPL playoff predictor page using the screenshot data.

**Architecture:** Put hard-coded IPL data and playoff calculations in `playoff-engine.js`, expose it to both Node tests and the browser, and keep `ipl-playoff-predictor.html` focused on rendering and interactions. Use scenario enumeration over remaining fixtures with point-only tie handling.

**Tech Stack:** Plain HTML, CSS, JavaScript, and Node's built-in `assert` module.

---

### Task 1: Engine Tests

**Files:**
- Create: `playoff-engine.test.js`
- Create after red: `playoff-engine.js`

- [ ] **Step 1: Write tests for scoring, standings, cutoff ties, and must-win classification.**

Run: `node playoff-engine.test.js`
Expected: FAIL because `playoff-engine.js` does not exist yet.

- [ ] **Step 2: Implement the minimal engine to pass the tests.**

Create `playoff-engine.js` with hard-coded teams, completed rows, fixtures, prediction scoring, projected rows, standings, final-state enumeration, qualification status, and fixture classification.

- [ ] **Step 3: Run the engine tests.**

Run: `node playoff-engine.test.js`
Expected: PASS with all assertions complete.

### Task 2: Static Predictor Page

**Files:**
- Create: `ipl-playoff-predictor.html`
- Modify: `playoff-engine.js` only if browser integration exposes a real issue.

- [ ] **Step 1: Build the static HTML UI.**

Render the team grid, future clickable cells, controls, projected standings, possible qualifiers, and must-win analysis from `PlayoffEngine`.

- [ ] **Step 2: Verify browser loading with a local server.**

Run: `python3 -m http.server 8000`
Expected: local server starts and serves `ipl-playoff-predictor.html`.

- [ ] **Step 3: Inspect the page in the in-app browser.**

Open: `http://localhost:8000/ipl-playoff-predictor.html`
Expected: page renders, future cells can be clicked, opponent cells update reciprocally, and points/analysis update.

### Task 3: Final Verification

**Files:**
- Read: `docs/superpowers/specs/2026-05-12-ipl-playoff-predictor-design.md`
- Read: `ipl-playoff-predictor.html`
- Read: `playoff-engine.js`

- [ ] **Step 1: Re-run tests.**

Run: `node playoff-engine.test.js`
Expected: PASS.

- [ ] **Step 2: Verify no git claims are made.**

Run: `git status --short`
Expected: failure is acceptable because the workspace is not a git repository.

- [ ] **Step 3: Report the exact files created and the local URL.**
