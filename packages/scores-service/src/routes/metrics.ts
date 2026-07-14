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

router.get("/metrics", (_req: Request, res: Response, next: NextFunction) => {
  registry
    .metrics()
    .then((metrics) => {
      res.status(200).set("Content-Type", registry.contentType).send(metrics);
    })
    .catch((error: unknown) => next(error));
});

export default router;
