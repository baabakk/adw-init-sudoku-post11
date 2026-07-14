import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { DifficultySelector } from "./components/DifficultySelector";
import { Board } from "./components/Board";
import { ValidationResult } from "./components/ValidationResult";
import { Leaderboard } from "./components/Leaderboard";
import { usePuzzle } from "./hooks/usePuzzle";
import { useValidation } from "./hooks/useValidation";
import { useScores } from "./hooks/useScores";
import { Difficulty } from "./types";
import type { Board as BoardType } from "./types";
import styles from "./styles/App.module.css";

function cloneBoard(board: BoardType): BoardType {
  return board.map((row) => [...row]);
}

function createEmptyBoard(): BoardType {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

export default function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [playerName, setPlayerName] = useState("");
  const [board, setBoard] = useState<BoardType>(createEmptyBoard());
  const [hintBoard, setHintBoard] = useState<BoardType>(createEmptyBoard());
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [scoreSaved, setScoreSaved] = useState(false);

  const {
    puzzle,
    loading: puzzleLoading,
    error: puzzleError,
    fetchPuzzle,
  } = usePuzzle();
  const {
    result: validationResult,
    loading: validating,
    error: validationError,
    validate,
    reset: resetValidation,
  } = useValidation();
  const {
    leaderboard,
    leaderboardLoading,
    leaderboardError,
    submitting,
    submitError,
    submitScore,
    fetchLeaderboard,
  } = useScores();

  const loadPuzzle = useCallback(
    async (nextDifficulty: Difficulty) => {
      resetValidation();
      setScoreSaved(false);
      const response = await fetchPuzzle(nextDifficulty);
      if (response) {
        setBoard(cloneBoard(response.board));
        setHintBoard(cloneBoard(response.board));
        setStartedAt(Date.now());
      }
    },
    [fetchPuzzle, resetValidation],
  );

  useEffect(() => {
    loadPuzzle(difficulty);
    fetchLeaderboard(difficulty);
    // Runs once on mount; subsequent difficulty changes go through handleDifficultyChange.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDifficultyChange(nextDifficulty: Difficulty) {
    setDifficulty(nextDifficulty);
    loadPuzzle(nextDifficulty);
    fetchLeaderboard(nextDifficulty);
  }

  function handleCellChange(row: number, col: number, value: number) {
    setBoard((previous) => {
      const next = cloneBoard(previous);
      next[row][col] = value;
      return next;
    });
  }

  async function handleSubmit() {
    if (!puzzle) {
      return;
    }
    const outcome = await validate(puzzle.puzzleId, board);
    if (outcome?.valid && startedAt !== null && !scoreSaved) {
      const timeToSolveMs = Date.now() - startedAt;
      const scoreResult = await submitScore({
        playerName: playerName.trim() || "Anonymous",
        difficulty,
        timeToSolveMs,
        puzzleId: puzzle.puzzleId,
      });
      if (scoreResult) {
        setScoreSaved(true);
        await fetchLeaderboard(difficulty);
      }
    }
  }

  function handleNewPuzzle() {
    loadPuzzle(difficulty);
  }

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Sudoku</h1>

      <div className={styles.controls}>
        <DifficultySelector
          value={difficulty}
          onChange={handleDifficultyChange}
          disabled={puzzleLoading}
        />
        <label className={styles.nameLabel}>
          Player name
          <input
            className={styles.nameInput}
            type="text"
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            placeholder="Anonymous"
            maxLength={40}
          />
        </label>
        <button
          type="button"
          className={styles.newPuzzleButton}
          onClick={handleNewPuzzle}
          disabled={puzzleLoading}
        >
          New Puzzle
        </button>
      </div>

      {puzzleLoading && <p>Loading puzzle...</p>}
      {puzzleError && <p className={styles.error}>{puzzleError}</p>}

      {!puzzleLoading && puzzle && (
        <>
          <Board
            board={board}
            hintBoard={hintBoard}
            errors={validationResult?.errors ?? []}
            onCellChange={handleCellChange}
          />
          <button
            type="button"
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={validating || submitting}
          >
            {validating ? "Checking..." : "Submit Solution"}
          </button>
          <ValidationResult
            result={validationResult}
            loading={validating}
            error={validationError}
          />
          {submitError && <p className={styles.error}>{submitError}</p>}
          {scoreSaved && (
            <p className={styles.success}>Score saved to the leaderboard!</p>
          )}
        </>
      )}

      <Leaderboard
        leaderboard={leaderboard}
        loading={leaderboardLoading}
        error={leaderboardError}
      />
    </div>
  );
}
