import { Difficulty, type Board } from "../types.js";

const SIZE = 9;
const BOX = 3;

/** Number of clues removed from a full solution, per difficulty. */
const CELLS_TO_REMOVE: Record<Difficulty, number> = {
  [Difficulty.Easy]: 36,
  [Difficulty.Medium]: 46,
  [Difficulty.Hard]: 54,
};

function createEmptyBoard(): Board {
  return Array.from({ length: SIZE }, () => new Array<number>(SIZE).fill(0));
}

function shuffledDigits(): number[] {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }
  return digits;
}

function isSafe(board: Board, row: number, col: number, value: number): boolean {
  for (let i = 0; i < SIZE; i++) {
    if (board[row][i] === value || board[i][col] === value) {
      return false;
    }
  }
  const boxRow = row - (row % BOX);
  const boxCol = col - (col % BOX);
  for (let r = 0; r < BOX; r++) {
    for (let c = 0; c < BOX; c++) {
      if (board[boxRow + r][boxCol + c] === value) {
        return false;
      }
    }
  }
  return true;
}

function findEmptyCell(board: Board): [number, number] | null {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] === 0) {
        return [row, col];
      }
    }
  }
  return null;
}

/**
 * Fills the board in place with a randomized full solution using randomized backtracking.
 */
function fillBoard(board: Board): boolean {
  const empty = findEmptyCell(board);
  if (!empty) {
    return true;
  }
  const [row, col] = empty;
  for (const digit of shuffledDigits()) {
    if (isSafe(board, row, col, digit)) {
      board[row][col] = digit;
      if (fillBoard(board)) {
        return true;
      }
      board[row][col] = 0;
    }
  }
  return false;
}

function generateSolution(): Board {
  const board = createEmptyBoard();
  fillBoard(board);
  return board;
}

function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

/**
 * Counts solutions to `board`, stopping early once `limit` is reached.
 * Used to guarantee generated puzzles have exactly one solution.
 */
function countSolutions(board: Board, limit: number): number {
  const empty = findEmptyCell(board);
  if (!empty) {
    return 1;
  }
  const [row, col] = empty;
  let count = 0;
  for (let digit = 1; digit <= 9; digit++) {
    if (isSafe(board, row, col, digit)) {
      board[row][col] = digit;
      count += countSolutions(board, limit - count);
      board[row][col] = 0;
      if (count >= limit) {
        break;
      }
    }
  }
  return count;
}

function hasUniqueSolution(board: Board): boolean {
  const working = cloneBoard(board);
  return countSolutions(working, 2) === 1;
}

/**
 * Removes `count` clues from a fully solved board, verifying after each
 * removal that the puzzle still has a unique solution. Cells whose removal
 * would break uniqueness are restored and skipped.
 */
function removeClues(solution: Board, count: number): Board {
  const puzzle = cloneBoard(solution);
  const positions: Array<[number, number]> = [];
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      positions.push([row, col]);
    }
  }
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  let removed = 0;
  for (const [row, col] of positions) {
    if (removed >= count) {
      break;
    }
    const previous = puzzle[row][col];
    if (previous === 0) {
      continue;
    }
    puzzle[row][col] = 0;
    if (hasUniqueSolution(puzzle)) {
      removed++;
    } else {
      puzzle[row][col] = previous;
    }
  }
  return puzzle;
}

export interface GeneratedPuzzle {
  solutionBoard: Board;
  hintBoard: Board;
}

/**
 * Generates a fully solved board and a uniquely-solvable hint board derived
 * from it by removing a difficulty-dependent number of clues.
 */
export function generatePuzzle(difficulty: Difficulty): GeneratedPuzzle {
  const solutionBoard = generateSolution();
  const hintBoard = removeClues(solutionBoard, CELLS_TO_REMOVE[difficulty]);
  return { solutionBoard, hintBoard };
}
