import { useCallback, useState } from "react";
import { validateBoard } from "../api/client";
import type { Board, ValidateResponse } from "../types";

export interface UseValidationResult {
  result: ValidateResponse | null;
  loading: boolean;
  error: string | null;
  validate: (
    puzzleId: string,
    board: Board,
  ) => Promise<ValidateResponse | null>;
  reset: () => void;
}

/**
 * Submits the completed board to POST /validate and reports the outcome.
 */
export function useValidation(): UseValidationResult {
  const [result, setResult] = useState<ValidateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(async (puzzleId: string, board: Board) => {
    setLoading(true);
    setError(null);
    try {
      const response = await validateBoard({ puzzleId, board });
      setResult(response);
      return response;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to validate board",
      );
      setResult(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, validate, reset };
}
