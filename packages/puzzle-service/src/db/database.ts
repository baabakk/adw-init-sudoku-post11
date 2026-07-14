import Database from "better-sqlite3";
import path from "node:path";
import { applySchema } from "./schema.js";
import type { Board, Difficulty, Puzzle, PuzzleRow } from "../types.js";

const DEFAULT_DB_PATH = path.join(process.cwd(), "puzzle-service.db");

let db: Database.Database | undefined;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = process.env.PUZZLE_DB_PATH ?? DEFAULT_DB_PATH;
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    applySchema(db);
  }
  return db;
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = undefined;
  }
}

function rowToPuzzle(row: PuzzleRow): Puzzle {
  return {
    puzzleId: row.puzzleId,
    difficulty: row.difficulty,
    solutionBoard: JSON.parse(row.solutionBoard) as Board,
    hintBoard: JSON.parse(row.hintBoard) as Board,
    generatedAt: row.generatedAt,
  };
}

export function insertPuzzle(puzzle: Puzzle): void {
  const statement = getDb().prepare(
    `INSERT INTO puzzles (puzzleId, difficulty, solutionBoard, hintBoard, generatedAt)
     VALUES (@puzzleId, @difficulty, @solutionBoard, @hintBoard, @generatedAt)`
  );
  statement.run({
    puzzleId: puzzle.puzzleId,
    difficulty: puzzle.difficulty,
    solutionBoard: JSON.stringify(puzzle.solutionBoard),
    hintBoard: JSON.stringify(puzzle.hintBoard),
    generatedAt: puzzle.generatedAt,
  });
}

export function getPuzzleById(puzzleId: string): Puzzle | undefined {
  const row = getDb()
    .prepare(
      `SELECT puzzleId, difficulty, solutionBoard, hintBoard, generatedAt
       FROM puzzles WHERE puzzleId = ?`
    )
    .get(puzzleId) as PuzzleRow | undefined;
  return row ? rowToPuzzle(row) : undefined;
}

export function countPuzzlesByDifficulty(difficulty: Difficulty): number {
  const result = getDb()
    .prepare(`SELECT COUNT(*) as count FROM puzzles WHERE difficulty = ?`)
    .get(difficulty) as { count: number };
  return result.count;
}
