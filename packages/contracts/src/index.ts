/**
 * Shared contracts for the Sudoku platform.
 * All types are exported and can be imported by any subsystem.
 * The file is compiled with TypeScript "strict": true.
 */

/**
 * Difficulty levels supported by the platform.
 */
export enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

/**
 * A 9x9 Sudoku board where a value of 0 represents an empty cell.
 */
export type Board = number[][];

/**
 * Core domain entity representing a puzzle stored by the Puzzle Service.
 */
export interface Puzzle {
  /** Unique identifier for the puzzle */
  puzzleId: string;
  /** Difficulty of the puzzle */
  difficulty: Difficulty;
  /** Fully solved board – never exposed to the client */
  solutionBoard: Board;
  /** Board with the initial clues (the hint board) */
  hintBoard: Board;
  /** ISO timestamp when the puzzle was generated */
  generatedAt: string;
}

/**
 * Core domain entity representing a score stored by the Scores Service.
 */
export interface Score {
  /** Primary key */
  id: string;
  /** Name of the player who achieved the score */
  playerName: string;
  /** Difficulty of the puzzle that was solved */
  difficulty: Difficulty;
  /** Time taken to solve the puzzle, in milliseconds */
  timeToSolveMs: number;
  /** Optional reference to the puzzle that was solved */
  puzzleId?: string;
  /** ISO timestamp when the score was recorded */
  createdAt: string;
}

/**
 * Representation of a single cell error returned by the validation endpoint.
 */
export interface CellError {
  /** Zero‑based row index (0‑8) */
  row: number;
  /** Zero‑based column index (0‑8) */
  col: number;
  /** The value that was supplied by the client */
  value: number;
  /** Human‑readable description of the problem */
  message: string;
}

/**
 * Generic error response used by all HTTP endpoints when the request is malformed.
 */
export interface ErrorResponse {
  /** HTTP status code (e.g., 400) */
  status: number;
  /** Short error identifier */
  error: string;
  /** Optional detailed message */
  message?: string;
}

/**
 * Response payload for GET /puzzle.
 */
export interface PuzzleResponse {
  /** Identifier of the generated puzzle */
  puzzleId: string;
  /** Difficulty level of the puzzle */
  difficulty: Difficulty;
  /** The board presented to the player – contains the initial clues */
  board: Board;
}

/**
 * Request payload for POST /validate.
 */
export interface ValidateRequest {
  /** Identifier of the puzzle being validated */
  puzzleId: string;
  /** The board submitted by the player */
  board: Board;
}

/**
 * Response payload for POST /validate.
 */
export interface ValidateResponse {
  /** Whether the submitted board satisfies Sudoku rules */
  valid: boolean;
  /** Optional list of cell‑level errors when the board is invalid */
  errors?: CellError[];
}

/**
 * Request payload for POST /scores.
 */
export interface ScoreRequest {
  /** Name of the player */
  playerName: string;
  /** Difficulty of the puzzle that was solved */
  difficulty: Difficulty;
  /** Time taken to solve the puzzle, in milliseconds */
  timeToSolveMs: number;
  /** Optional reference to the puzzle that was solved */
  puzzleId?: string;
}

/**
 * Response payload for POST /scores.
 */
export interface ScoreResponse {
  /** Identifier of the stored score record */
  id: string;
  /** Confirmation flag */
  stored: true;
}

/**
 * Single entry in the leaderboard.
 */
export interface LeaderboardEntry {
  /** Player name */
  playerName: string;
  /** Time taken to solve the puzzle, in milliseconds */
  timeToSolveMs: number;
  /** Optional puzzle identifier associated with the score */
  puzzleId?: string;
}

/**
 * Response payload for GET /leaderboard.
 */
export interface LeaderboardResponse {
  /** Difficulty for which the leaderboard is generated */
  difficulty: Difficulty;
  /** Top‑10 entries ordered by fastest time */
  entries: LeaderboardEntry[];
}

/**
 * Health‑check response used by every service.
 */
export interface HealthResponse {
  /** Fixed status string */
  status: "OK";
}

/**
 * Metrics endpoint returns plain‑text Prometheus exposition format.
 */
export type MetricsResponse = string;
