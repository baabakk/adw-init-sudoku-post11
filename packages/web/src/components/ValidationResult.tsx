import type { ValidateResponse } from "../types";
import styles from "../styles/ValidationResult.module.css";

export interface ValidationResultProps {
  result: ValidateResponse | null;
  loading: boolean;
  error: string | null;
}

export function ValidationResult({
  result,
  loading,
  error,
}: ValidationResultProps) {
  if (loading) {
    return <div className={styles.status}>Checking your solution...</div>;
  }

  if (error) {
    return (
      <div className={`${styles.status} ${styles.failure}`}>{error}</div>
    );
  }

  if (!result) {
    return null;
  }

  if (result.valid) {
    return (
      <div className={`${styles.status} ${styles.success}`}>
        Solved! Great job.
      </div>
    );
  }

  return (
    <div className={`${styles.status} ${styles.failure}`}>
      <p>Not quite right yet.</p>
      {result.errors && result.errors.length > 0 && (
        <ul className={styles.errorList}>
          {result.errors.map((cellError, index) => (
            <li key={`${cellError.row}-${cellError.col}-${index}`}>
              Row {cellError.row + 1}, Col {cellError.col + 1}:{" "}
              {cellError.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
