import { Router, type Request, type Response, type NextFunction } from "express";
import { Difficulty, type ScoreRequest, type ScoreResponse } from "@init-sudoku-post11/contracts";
import { insertScore } from "../database.js";
import { sanitizePlayerName } from "../sanitization.js";

const router = Router();

const VALID_DIFFICULTIES = new Set<string>(Object.values(Difficulty));

function isValidDifficulty(value: unknown): value is Difficulty {
  return typeof value === "string" && VALID_DIFFICULTIES.has(value);
}

function isValidTimeToSolveMs(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

router.post("/scores", (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body as Partial<ScoreRequest> | undefined;

    if (!body || typeof body !== "object") {
      res.status(400).json({ status: 400, error: "InvalidRequest", message: "Request body is required." });
      return;
    }

    if (!isValidDifficulty(body.difficulty)) {
      res.status(400).json({
        status: 400,
        error: "InvalidRequest",
        message: "difficulty must be one of: easy, medium, hard.",
      });
      return;
    }

    if (!isValidTimeToSolveMs(body.timeToSolveMs)) {
      res.status(400).json({
        status: 400,
        error: "InvalidRequest",
        message: "timeToSolveMs must be a positive number.",
      });
      return;
    }

    let playerName: string;
    try {
      playerName = sanitizePlayerName(body.playerName);
    } catch (error) {
      res.status(400).json({
        status: 400,
        error: "InvalidRequest",
        message: error instanceof Error ? error.message : "playerName is invalid.",
      });
      return;
    }

    const puzzleId = typeof body.puzzleId === "string" && body.puzzleId.length > 0 ? body.puzzleId : undefined;

    const record = insertScore({
      playerName,
      difficulty: body.difficulty,
      timeToSolveMs: body.timeToSolveMs,
      puzzleId,
    });

    const response: ScoreResponse = {
      id: record.id,
      stored: true,
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
