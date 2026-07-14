CREATE TABLE IF NOT EXISTS puzzles (
  puzzleId TEXT PRIMARY KEY,
  difficulty TEXT NOT NULL,
  solutionBoard TEXT NOT NULL,
  hintBoard TEXT NOT NULL,
  generatedAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_puzzles_difficulty ON puzzles (difficulty);
