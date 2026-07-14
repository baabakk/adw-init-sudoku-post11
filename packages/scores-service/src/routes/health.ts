import { Router, type Request, type Response } from "express";
import type { HealthResponse } from "@init-sudoku-post11/contracts";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  const response: HealthResponse = { status: "OK" };
  res.status(200).json(response);
});

export default router;
