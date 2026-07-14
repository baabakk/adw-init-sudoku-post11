# init-sudoku-post11 — shared foundation

Generated deterministically by DevOps from the approved project-decomposition.

**Stack:** TypeScript (npm workspaces)
- install: `npm install`
- build: `npm run build`
- test: `npm test`

## Subsystems (one feature team each)
- **web-client** — Web Client: Browser-based SPA that renders an interactive 9x9 Sudoku board, allows difficulty selection, fetches puzzles from the Puzzle Service, submits completed boards for validation, and posts results to the Scores Service.
  - owns: packages/web
  - dependsOn: puzzle-service, scores-service
- **puzzle-service** — Puzzle Service: Generates valid, uniquely-solvable Sudoku puzzles per difficulty, persists them in its own SQLite database, and validates submitted boards against the original puzzle clues.
  - owns: packages/puzzle-service
  - dependsOn: none
- **scores-service** — Scores Service: Persists completed-game results in its own SQLite database and serves a per-difficulty top-10 leaderboard.
  - owns: packages/scores-service
  - dependsOn: none

## Shared contracts
- packages/contracts
