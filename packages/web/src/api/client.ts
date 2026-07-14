import type {
  Difficulty,
  ErrorResponse,
  LeaderboardResponse,
  PuzzleResponse,
  ScoreRequest,
  ScoreResponse,
  ValidateRequest,
  ValidateResponse,
} from "../types";

/**
 * Requests are issued as relative paths so that the Vite dev server proxy
 * (see vite.config.ts) and any same-origin production reverse proxy can
 * route them to the Puzzle Service and Scores Service without further
 * configuration in this module.
 */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Request to ${path} failed with status ${response.status}`;
    try {
      const errorBody = (await response.json()) as ErrorResponse;
      message = errorBody.message ?? errorBody.error ?? message;
    } catch {
      // Response body was not JSON; fall back to the generic message.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export function fetchPuzzle(difficulty: Difficulty): Promise<PuzzleResponse> {
  return request<PuzzleResponse>(
    `/puzzle?difficulty=${encodeURIComponent(difficulty)}`,
  );
}

export function validateBoard(
  payload: ValidateRequest,
): Promise<ValidateResponse> {
  return request<ValidateResponse>("/validate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function submitScore(payload: ScoreRequest): Promise<ScoreResponse> {
  return request<ScoreResponse>("/scores", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchLeaderboard(
  difficulty: Difficulty,
): Promise<LeaderboardResponse> {
  return request<LeaderboardResponse>(
    `/leaderboard?difficulty=${encodeURIComponent(difficulty)}`,
  );
}
