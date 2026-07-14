import { useCallback, useState } from "react";
import {
  fetchLeaderboard as fetchLeaderboardRequest,
  submitScore as submitScoreRequest,
} from "../api/client";
import type {
  Difficulty,
  LeaderboardResponse,
  ScoreRequest,
  ScoreResponse,
} from "../types";

export interface UseScoresResult {
  leaderboard: LeaderboardResponse | null;
  leaderboardLoading: boolean;
  leaderboardError: string | null;
  submitting: boolean;
  submitError: string | null;
  submitScore: (payload: ScoreRequest) => Promise<ScoreResponse | null>;
  fetchLeaderboard: (
    difficulty: Difficulty,
  ) => Promise<LeaderboardResponse | null>;
}

/**
 * Posts a completed score to POST /scores and fetches the per-difficulty
 * leaderboard from GET /leaderboard.
 */
export function useScores(): UseScoresResult {
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(
    null,
  );
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async (difficulty: Difficulty) => {
    setLeaderboardLoading(true);
    setLeaderboardError(null);
    try {
      const response = await fetchLeaderboardRequest(difficulty);
      setLeaderboard(response);
      return response;
    } catch (err) {
      setLeaderboardError(
        err instanceof Error ? err.message : "Failed to fetch leaderboard",
      );
      return null;
    } finally {
      setLeaderboardLoading(false);
    }
  }, []);

  const submitScore = useCallback(async (payload: ScoreRequest) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      return await submitScoreRequest(payload);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to submit score",
      );
      return null;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return {
    leaderboard,
    leaderboardLoading,
    leaderboardError,
    submitting,
    submitError,
    submitScore,
    fetchLeaderboard,
  };
}
