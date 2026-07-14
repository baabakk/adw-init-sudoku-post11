import type { NextFunction, Request, Response } from "express";
import type { ErrorResponse } from "@init-sudoku-post11/contracts";

/**
 * Express error-handling middleware (must be registered last, after all routes).
 * Normalizes any thrown/forwarded error into the shared ErrorResponse shape.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const message = err instanceof Error ? err.message : "An unexpected error occurred.";

  const response: ErrorResponse = {
    status: 500,
    error: "InternalServerError",
    message,
  };

  res.status(500).json(response);
}

export default errorHandler;
