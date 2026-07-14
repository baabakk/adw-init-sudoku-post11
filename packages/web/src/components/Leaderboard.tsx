import type { LeaderboardResponse } from "../types";
import styles from "../styles/Leaderboard.module.css";

export interface LeaderboardProps {
  leaderboard: LeaderboardResponse | null;
  loading: boolean;
  error: string | null;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function Leaderboard({ leaderboard, loading, error }: LeaderboardProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Leaderboard{leaderboard ? ` — ${leaderboard.difficulty}` : ""}
      </h2>
      {loading && <p>Loading leaderboard...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && leaderboard && leaderboard.entries.length === 0 && (
        <p>No scores yet. Be the first to solve this difficulty!</p>
      )}
      {!loading && !error && leaderboard && leaderboard.entries.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.entries.map((entry, index) => (
              <tr key={`${entry.playerName}-${entry.puzzleId ?? index}`}>
                <td>{index + 1}</td>
                <td>{entry.playerName}</td>
                <td>{formatTime(entry.timeToSolveMs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
