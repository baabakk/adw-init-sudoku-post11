import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const puzzleServiceUrl = env.PUZZLE_SERVICE_URL ?? "http://localhost:4001";
  const scoresServiceUrl = env.SCORES_SERVICE_URL ?? "http://localhost:4002";

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/puzzle": { target: puzzleServiceUrl, changeOrigin: true },
        "/validate": { target: puzzleServiceUrl, changeOrigin: true },
        "/scores": { target: scoresServiceUrl, changeOrigin: true },
        "/leaderboard": { target: scoresServiceUrl, changeOrigin: true },
      },
    },
    build: {
      outDir: "build",
    },
  };
});
