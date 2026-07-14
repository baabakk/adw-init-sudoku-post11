import type { NextFunction, Request, Response } from "express";
import type { ErrorResponse } from "../types.js";

export class HttpError extends Error {
  status: number;
  errorCode: string;

  constructor(status: number, errorCode: string, message?: string) {
    super(message ?? errorCode);
    this.status = status;
    this.errorCode = errorCode;
  }
}

export function notFoundHandler(req: Request, res: Response): void {
  const body: ErrorResponse = {
    status: 404,
    error: "not_found",
    message: `No route for ${req.method} ${req.path}`,
  };
  res.status(404).json(body);
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  if (err instanceof HttpError) {
    const body: ErrorResponse = {
      status: err.status,
      error: err.errorCode,
      message: err.message,
    };
    res.status(err.status).json(body);
    return;
  }

  const message = err instanceof Error ? err.message : "Unexpected error";
  const body: ErrorResponse = {
    status: 500,
    error: "internal_error",
    message,
  };
  res.status(500).json(body);
}
