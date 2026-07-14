/**
 * Schema for the puzzle-service SQLite database (puzzle-service.db), per ADR-006.
 * Mirrors db/migrations/001_create_puzzles_table.sql.
 */
export const PUZZLES_TABLE = "puzzles";

export const CREATE_PUZZLES_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS ${PUZZLES_TABLE} (
    puzzleId TEXT PRIMARY KEY,
    difficulty TEXT NOT NULL,
    solutionBoard TEXT NOT NULL,
    hintBoard TEXT NOT NULL,
    generatedAt TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_puzzles_difficulty ON ${PUZZLES_TABLE} (difficulty);
`;

export function applySchema(db: { exec: (sql: string) => unknown }): void {
  db.exec(CREATE_PUZZLES_TABLE_SQL);
}
