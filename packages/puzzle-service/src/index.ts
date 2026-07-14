import express, { type NextFunction, type Request, type Response } from "express";
import { getDb } from "./db/database.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { healthRouter } from "./routes/health.js";
import { httpRequestDuration, metricsRouter } from "./routes/metrics.js";
import { puzzleRouter } from "./routes/puzzle.js";
import { validateRouter } from "./routes/validate.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4001);

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  const stopTimer = httpRequestDuration.startTimer({ method: req.method, route: req.path });
  res.on("finish", () => {
    stopTimer({ status: String(res.statusCode) });
  });
  next();
});

app.use(healthRouter);
app.use(metricsRouter);
app.use(puzzleRouter);
app.use(validateRouter);

app.use(notFoundHandler);
app.use(errorHandler);

// Ensure the database and schema are initialized before serving traffic.
getDb();

app.listen(PORT, () => {
  console.log(`puzzle-service listening on port ${PORT}`);
});

export { app };
