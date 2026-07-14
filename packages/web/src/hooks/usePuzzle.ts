import { useCallback, useState } from "react";
import { fetchPuzzle as fetchPuzzleRequest } from "../api/client";
import type { Difficulty, PuzzleResponse } from "../types";

export interface UsePuzzleResult {
  puzzle: PuzzleResponse | null;
  loading: boolean;
  error: string | null;
  fetchPuzzle: (difficulty: Difficulty) => Promise<PuzzleResponse | null>;
}

/**
 * Fetches a puzzle for the given difficulty from GET /puzzle.
 */
export function usePuzzle(): UsePuzzleResult {
  const [puzzle, setPuzzle] = useState<PuzzleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPuzzle = useCallback(async (difficulty: Difficulty) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchPuzzleRequest(difficulty);
      setPuzzle(response);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch puzzle");
      setPuzzle(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { puzzle, loading, error, fetchPuzzle };
}
