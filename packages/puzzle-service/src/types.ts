import { Difficulty } from "@init-sudoku-post11/contracts";
import type {
  Board,
  CellError,
  ErrorResponse,
  Puzzle,
  PuzzleResponse,
  ValidateRequest,
  ValidateResponse,
} from "@init-sudoku-post11/contracts";

export { Difficulty };
export type {
  Board,
  CellError,
  ErrorResponse,
  Puzzle,
  PuzzleResponse,
  ValidateRequest,
  ValidateResponse,
};

/**
 * Row shape as persisted in the SQLite `puzzles` table.
 * Board fields are stored as JSON text and must be (de)serialized at the DB boundary.
 */
export interface PuzzleRow {
  puzzleId: string;
  difficulty: Difficulty;
  solutionBoard: string;
  hintBoard: string;
  generatedAt: string;
}

/**
 * Result of grading a submitted board against the stored puzzle.
 */
export interface ValidationResult {
  valid: boolean;
  errors: CellError[];
}
