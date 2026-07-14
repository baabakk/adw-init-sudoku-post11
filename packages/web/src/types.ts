/**
 * Local re-export of the shared platform contracts consumed by the web client.
 * Keeping a single import surface makes it easy to see exactly which shapes
 * this package depends on from `@init-sudoku-post11/contracts`.
 */
export { Difficulty } from "@init-sudoku-post11/contracts";

export type {
  Board,
  Puzzle,
  Score,
  CellError,
  ErrorResponse,
  PuzzleResponse,
  ValidateRequest,
  ValidateResponse,
  ScoreRequest,
  ScoreResponse,
  LeaderboardEntry,
  LeaderboardResponse,
} from "@init-sudoku-post11/contracts";
