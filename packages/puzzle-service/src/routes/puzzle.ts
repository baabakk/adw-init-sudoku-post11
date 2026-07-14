import { randomUUID } from "node:crypto";
import { Router, type NextFunction, type Request, type Response } from "express";
import { insertPuzzle } from "../db/database.js";
import { HttpError } from "../middleware/errorHandler.js";
import { puzzlesGeneratedCounter } from "./metrics.js";
import { generatePuzzle } from "../services/sudokuGenerator.js";
import { Difficulty, type Puzzle, type PuzzleResponse } from "../types.js";

export const puzzleRouter = Router();

const VALID_DIFFICULTIES = new Set<string>(Object.values(Difficulty));

function parseDifficulty(raw: unknown): Difficulty {
  const value = typeof raw === "string" ? raw.toLowerCase() : Difficulty.Medium;
  if (!VALID_DIFFICULTIES.has(value)) {
    throw new HttpError(
      400,
      "invalid_difficulty",
      `difficulty must be one of: ${Array.from(VALID_DIFFICULTIES).join(", ")}`
    );
  }
  return value as Difficulty;
}

puzzleRouter.get("/puzzle", (req: Request, res: Response, next: NextFunction) => {
  try {
    const difficulty = parseDifficulty(req.query.difficulty);
    const { solutionBoard, hintBoard } = generatePuzzle(difficulty);

    const puzzle: Puzzle = {
      puzzleId: randomUUID(),
      difficulty,
      solutionBoard,
      hintBoard,
      generatedAt: new Date().toISOString(),
    };

    insertPuzzle(puzzle);
    puzzlesGeneratedCounter.inc({ difficulty });

    const response: PuzzleResponse = {
      puzzleId: puzzle.puzzleId,
      difficulty: puzzle.difficulty,
      board: puzzle.hintBoard,
    };
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});
