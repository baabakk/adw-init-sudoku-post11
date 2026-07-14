import type { Board, CellError, ValidationResult } from "../types.js";

const SIZE = 9;
const BOX = 3;

function isValidCellValue(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 9;
}

/**
 * Validates the shape of a submitted board: 9x9 array of integers in [0, 9].
 */
export function isWellFormedBoard(board: unknown): board is Board {
  if (!Array.isArray(board) || board.length !== SIZE) {
    return false;
  }
  return board.every(
    (row) => Array.isArray(row) && row.length === SIZE && row.every(isValidCellValue)
  );
}

/**
 * Validates a submitted board against the puzzle's original clues (hint
 * board) and standard Sudoku rules (no repeated digit in any row, column,
 * or 3x3 box). Empty cells (0) never produce an error on their own.
 */
export function validateBoard(hintBoard: Board, submitted: Board): ValidationResult {
  const errors: CellError[] = [];

  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      const clue = hintBoard[row][col];
      const value = submitted[row][col];
      if (clue !== 0 && value !== clue) {
        errors.push({
          row,
          col,
          value,
          message: `Cell does not match the original clue (${clue}).`,
        });
      }
    }
  }

  for (let row = 0; row < SIZE; row++) {
    checkGroupForDuplicates(
      submitted,
      errors,
      Array.from({ length: SIZE }, (_, col) => [row, col] as [number, number])
    );
  }

  for (let col = 0; col < SIZE; col++) {
    checkGroupForDuplicates(
      submitted,
      errors,
      Array.from({ length: SIZE }, (_, row) => [row, col] as [number, number])
    );
  }

  for (let boxRow = 0; boxRow < SIZE; boxRow += BOX) {
    for (let boxCol = 0; boxCol < SIZE; boxCol += BOX) {
      const cells: Array<[number, number]> = [];
      for (let r = 0; r < BOX; r++) {
        for (let c = 0; c < BOX; c++) {
          cells.push([boxRow + r, boxCol + c]);
        }
      }
      checkGroupForDuplicates(submitted, errors, cells);
    }
  }

  const seen = new Set<string>();
  const dedupedErrors = errors.filter((error) => {
    const key = `${error.row}:${error.col}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });

  return {
    valid: dedupedErrors.length === 0,
    errors: dedupedErrors,
  };
}

function checkGroupForDuplicates(
  board: Board,
  errors: CellError[],
  cells: Array<[number, number]>
): void {
  const seenAt = new Map<number, [number, number]>();
  for (const [row, col] of cells) {
    const value = board[row][col];
    if (value === 0) {
      continue;
    }
    const firstSeen = seenAt.get(value);
    if (firstSeen) {
      errors.push({
        row,
        col,
        value,
        message: `Duplicate value ${value} conflicts with row ${firstSeen[0]}, col ${firstSeen[1]}.`,
      });
    } else {
      seenAt.set(value, [row, col]);
    }
  }
}
