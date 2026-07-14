import type { NextFunction, Request, Response } from "express";
import {
  httpRequestCounter,
  httpRequestDurationHistogram,
  httpErrorCounter,
} from "../routes/metrics.js";

/**
 * Records request latency and increments request/error counters for every
 * request handled by the service (ADR-007: latency histograms; ADR-008: error counters).
 * Registered before the route handlers so it observes every response, including 404s.
 */
export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTimeSeconds = process.hrtime.bigint();

  res.on("finish", () => {
    const route = req.route?.path ?? req.path;
    const method = req.method;
    const status = String(res.statusCode);

    const elapsedNanoseconds = process.hrtime.bigint() - startTimeSeconds;
    const elapsedSeconds = Number(elapsedNanoseconds) / 1e9;

    httpRequestCounter.labels(method, route, status).inc();
    httpRequestDurationHistogram.labels(method, route, status).observe(elapsedSeconds);

    if (res.statusCode >= 400) {
      httpErrorCounter.labels(method, route, status).inc();
    }
  });

  next();
}

export default metricsMiddleware;
