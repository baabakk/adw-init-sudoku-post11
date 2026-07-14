import type { ChangeEvent } from "react";
import styles from "../styles/Cell.module.css";

export interface CellProps {
  row: number;
  col: number;
  value: number;
  fixed: boolean;
  hasError: boolean;
  onChange: (row: number, col: number, value: number) => void;
}

export function Cell({ row, col, value, fixed, hasError, onChange }: CellProps) {
  const displayValue = value === 0 ? "" : String(value);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const digitsOnly = event.target.value.replace(/[^1-9]/g, "");
    const lastDigit = digitsOnly.slice(-1);
    onChange(row, col, lastDigit === "" ? 0 : Number(lastDigit));
  }

  const classNames = [
    styles.cell,
    fixed ? styles.fixed : "",
    hasError ? styles.error : "",
    col % 3 === 0 ? styles.borderLeft : "",
    col === 8 ? styles.borderRight : "",
    row % 3 === 0 ? styles.borderTop : "",
    row === 8 ? styles.borderBottom : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <input
      className={classNames}
      type="text"
      inputMode="numeric"
      pattern="[1-9]*"
      maxLength={1}
      value={displayValue}
      readOnly={fixed}
      onChange={handleChange}
      aria-label={`Row ${row + 1}, Column ${col + 1}`}
    />
  );
}
