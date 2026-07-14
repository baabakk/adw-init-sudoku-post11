import type { NextFunction, Request, Response } from "express";
import { httpErrorsCounter, httpRequestDuration } from "../metrics/registry.js";

/**
 * Records request duration and error counts for every request, per ADR-007/ADR-008.
 * Route path is read after the router matches so labels stay low-cardinality
 * (e.g. "/puzzle" rather than every distinct query string).
 */
export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const stopTimer = httpRequestDuration.startTimer({ method: req.method });

  res.on("finish", () => {
    const route = req.route?.path ?? req.path;
    const status = String(res.statusCode);

    stopTimer({ route, status });

    if (res.statusCode >= 400) {
      httpErrorsCounter.inc({ method: req.method, route, status });
    }
  });

  next();
}
