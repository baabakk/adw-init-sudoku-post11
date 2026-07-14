import type { Board as BoardType, CellError } from "../types";
import { Cell } from "./Cell";
import styles from "../styles/Board.module.css";

export interface BoardProps {
  board: BoardType;
  hintBoard: BoardType;
  errors: CellError[];
  onCellChange: (row: number, col: number, value: number) => void;
}

export function Board({ board, hintBoard, errors, onCellChange }: BoardProps) {
  const errorPositions = new Set(errors.map((e) => `${e.row}-${e.col}`));

  return (
    <div className={styles.board}>
      {board.map((rowValues, row) =>
        rowValues.map((value, col) => (
          <Cell
            key={`${row}-${col}`}
            row={row}
            col={col}
            value={value}
            fixed={hintBoard[row][col] !== 0}
            hasError={errorPositions.has(`${row}-${col}`)}
            onChange={onCellChange}
          />
        )),
      )}
    </div>
  );
}
