import { Router, type Request, type Response } from "express";
import client from "prom-client";

export const metricsRegistry = new client.Registry();
client.collectDefaultMetrics({ register: metricsRegistry });

export const puzzlesGeneratedCounter = new client.Counter({
  name: "puzzle_service_puzzles_generated_total",
  help: "Total number of puzzles generated, labeled by difficulty",
  labelNames: ["difficulty"] as const,
  registers: [metricsRegistry],
});

export const validationsCounter = new client.Counter({
  name: "puzzle_service_validations_total",
  help: "Total number of board validations performed, labeled by outcome",
  labelNames: ["result"] as const,
  registers: [metricsRegistry],
});

export const httpRequestDuration = new client.Histogram({
  name: "puzzle_service_http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"] as const,
  registers: [metricsRegistry],
});

export const metricsRouter = Router();

metricsRouter.get("/metrics", (_req: Request, res: Response) => {
  metricsRegistry
    .metrics()
    .then((body) => {
      res.setHeader("Content-Type", metricsRegistry.contentType);
      res.status(200).send(body);
    })
    .catch((err: unknown) => {
      res.status(500).send(err instanceof Error ? err.message : "metrics error");
    });
});
