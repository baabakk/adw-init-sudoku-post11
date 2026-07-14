import { Router, type Request, type Response, type NextFunction } from "express";
import client from "prom-client";

const router = Router();

export const registry = new client.Registry();
client.collectDefaultMetrics({ register: registry });

export const httpRequestCounter = new client.Counter({
  name: "scores_service_http_requests_total",
  help: "Total number of HTTP requests received by the scores service.",
  labelNames: ["method", "route", "status"] as const,
  registers: [registry],
});

export const scoreSubmissionCounter = new client.Counter({
  name: "scores_service_score_submissions_total",
  help: "Total number of scores successfully stored.",
  labelNames: ["difficulty"] as const,
  registers: [registry],
});

export const httpRequestDurationHistogram = new client.Histogram({
  name: "scores_service_http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds, labeled by method, route, and status code.",
  labelNames: ["method", "route", "status"] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [registry],
});

export const httpErrorCounter = new client.Counter({
  name: "scores_service_http_errors_total",
  help: "Total number of HTTP requests that resulted in a 4xx or 5xx response.",
  labelNames: ["method", "route", "status"] as const,
  registers: [registry],
});

router.get("/metrics", (_req: Request, res: Response, next: NextFunction) => {
  registry
    .metrics()
    .then((metrics) => {
      res.status(200).set("Content-Type", registry.contentType).send(metrics);
    })
    .catch((error: unknown) => next(error));
});

export default router;
