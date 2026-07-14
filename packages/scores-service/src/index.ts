import express from "express";
import "./database.js";
import scoresRouter from "./routes/scores.js";
import leaderboardRouter from "./routes/leaderboard.js";
import healthRouter from "./routes/health.js";
import metricsRouter from "./routes/metrics.js";
import { metricsMiddleware } from "./middleware/metrics.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4001);

app.use(express.json());
app.use(metricsMiddleware);

app.use(healthRouter);
app.use(metricsRouter);
app.use(scoresRouter);
app.use(leaderboardRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`scores-service listening on port ${PORT}`);
});
