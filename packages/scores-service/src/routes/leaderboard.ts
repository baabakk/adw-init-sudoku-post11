import { Router, type Request, type Response, type NextFunction } from "express";
import { Difficulty, type LeaderboardResponse } from "@init-sudoku-post11/contracts";
import { getTopScoresForDifficulty } from "../database.js";

const router = Router();

const VALID_DIFFICULTIES = new Set<string>(Object.values(Difficulty));

function isValidDifficulty(value: unknown): value is Difficulty {
  return typeof value === "string" && VALID_DIFFICULTIES.has(value);
}

router.get("/leaderboard", (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestedDifficulty = req.query.difficulty;

    if (requestedDifficulty !== undefined && !isValidDifficulty(requestedDifficulty)) {
      res.status(400).json({
        status: 400,
        error: "InvalidRequest",
        message: "difficulty must be one of: easy, medium, hard.",
      });
      return;
    }

    const difficulty: Difficulty = isValidDifficulty(requestedDifficulty)
      ? requestedDifficulty
      : Difficulty.Easy;

    const topScores = getTopScoresForDifficulty(difficulty, 10);

    const response: LeaderboardResponse = {
      difficulty,
      entries: topScores.map((score) => ({
        playerName: score.playerName,
        timeToSolveMs: score.timeToSolveMs,
        puzzleId: score.puzzleId ?? undefined,
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
