import { Router, type Request, type Response } from "express";
import { metricsRegistry } from "../metrics/registry.js";

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
