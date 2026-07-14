import path from "node:path";
import Database from "better-sqlite3";
import { randomUUID } from "node:crypto";
import { Difficulty } from "@init-sudoku-post11/contracts";

const DB_PATH = process.env.SCORES_DB_PATH ?? path.join(__dirname, "..", "scores-service.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id TEXT PRIMARY KEY,
    playerName TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    timeToSolveMs INTEGER NOT NULL,
    puzzleId TEXT,
    createdAt TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_scores_difficulty_time
    ON scores (difficulty, timeToSolveMs);
`);

export interface ScoreRecord {
  id: string;
  playerName: string;
  difficulty: Difficulty;
  timeToSolveMs: number;
  puzzleId: string | null;
  createdAt: string;
}

export interface InsertScoreInput {
  playerName: string;
  difficulty: Difficulty;
  timeToSolveMs: number;
  puzzleId?: string;
}

const insertScoreStatement = db.prepare<{
  id: string;
  playerName: string;
  difficulty: Difficulty;
  timeToSolveMs: number;
  puzzleId: string | null;
  createdAt: string;
}>(`
  INSERT INTO scores (id, playerName, difficulty, timeToSolveMs, puzzleId, createdAt)
  VALUES (@id, @playerName, @difficulty, @timeToSolveMs, @puzzleId, @createdAt)
`);

/**
 * Inserts a completed-game score and returns the persisted record.
 */
export function insertScore(input: InsertScoreInput): ScoreRecord {
  const record: ScoreRecord = {
    id: randomUUID(),
    playerName: input.playerName,
    difficulty: input.difficulty,
    timeToSolveMs: input.timeToSolveMs,
    puzzleId: input.puzzleId ?? null,
    createdAt: new Date().toISOString(),
  };

  insertScoreStatement.run(record);

  return record;
}

const topScoresByDifficultyStatement = db.prepare<{ difficulty: Difficulty; limit: number }>(`
  SELECT id, playerName, difficulty, timeToSolveMs, puzzleId, createdAt
  FROM scores
  WHERE difficulty = @difficulty
  ORDER BY timeToSolveMs ASC
  LIMIT @limit
`);

/**
 * Returns the top-N scores for a given difficulty, sorted ascending by solve time.
 */
export function getTopScoresForDifficulty(difficulty: Difficulty, limit = 10): ScoreRecord[] {
  return topScoresByDifficultyStatement.all({ difficulty, limit }) as ScoreRecord[];
}

export default db;
