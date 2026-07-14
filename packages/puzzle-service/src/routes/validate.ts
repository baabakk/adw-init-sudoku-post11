import { Router, type NextFunction, type Request, type Response } from "express";
import { getPuzzleById } from "../db/database.js";
import { HttpError } from "../middleware/errorHandler.js";
import { validationsCounter } from "../metrics/registry.js";
import { isWellFormedBoard, validateBoard } from "../services/sudokuValidator.js";
import type { ValidateRequest, ValidateResponse } from "../types.js";

export const validateRouter = Router();

function parseValidateRequest(body: unknown): ValidateRequest {
  if (typeof body !== "object" || body === null) {
    throw new HttpError(400, "invalid_request", "Request body must be a JSON object.");
  }
  const { puzzleId, board } = body as Record<string, unknown>;
  if (typeof puzzleId !== "string" || puzzleId.length === 0) {
    throw new HttpError(400, "invalid_request", "puzzleId is required and must be a string.");
  }
  if (!isWellFormedBoard(board)) {
    throw new HttpError(
      400,
      "invalid_board",
      "board must be a 9x9 array of integers between 0 and 9."
    );
  }
  return { puzzleId, board };
}

validateRouter.post("/validate", (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = parseValidateRequest(req.body);
    const puzzle = getPuzzleById(request.puzzleId);
    if (!puzzle) {
      throw new HttpError(404, "puzzle_not_found", `No puzzle found for id ${request.puzzleId}`);
    }

    const result = validateBoard(puzzle.hintBoard, request.board);
    validationsCounter.inc({ result: result.valid ? "valid" : "invalid" });

    const response: ValidateResponse = result.valid
      ? { valid: true }
      : { valid: false, errors: result.errors };
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});
