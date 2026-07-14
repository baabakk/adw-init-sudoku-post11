import { Difficulty } from "../types";
import styles from "../styles/DifficultySelector.module.css";

export interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (difficulty: Difficulty) => void;
  disabled?: boolean;
}

const DIFFICULTIES: Difficulty[] = [
  Difficulty.Easy,
  Difficulty.Medium,
  Difficulty.Hard,
];

export function DifficultySelector({
  value,
  onChange,
  disabled,
}: DifficultySelectorProps) {
  return (
    <div className={styles.container} role="group" aria-label="Difficulty">
      {DIFFICULTIES.map((difficulty) => (
        <button
          key={difficulty}
          type="button"
          className={
            difficulty === value
              ? `${styles.button} ${styles.active}`
              : styles.button
          }
          onClick={() => onChange(difficulty)}
          disabled={disabled}
          aria-pressed={difficulty === value}
        >
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </button>
      ))}
    </div>
  );
}
