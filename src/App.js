import { useState } from "react";

function Square({ value, onSquareClick, style }) {
  return (
    <button className="square" onClick={onSquareClick} style={style}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let winningSquares = [];

  if (winner) {
    winningSquares = winner.slice(1);
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  let status;
  if (winner) {
    console.log(winner[1] + " " + winner[2] + " " + winner[3]);
    status = "Winner: " + winner[0];

    // if (winner[0] === "X") {
    //   squares[winner[1]] = "X";
    //   squares[winner[2]] = "X";
    //   squares[winner[3]] = "X";
    // } else {
    //   squares[winner[1]] = "O";
    //   squares[winner[2]] = "O";
    //   squares[winner[3]] = "O";
    // }
  } else {
    status = calculateDraw(squares)
      ? "It's a draw!"
      : "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {[0, 1, 2].map((row) => (
          <div className="board-row" key={row}>
            {[0, 1, 2].map((col) => {
              const index = row * 3 + col;
              const isWinningSquare = winningSquares.includes(index);
              const squareStyle = isWinningSquare
                ? { background: "yellow" }
                : null;

              return (
                <Square
                  key={index}
                  value={squares[index]}
                  onSquareClick={() => handleClick(index)}
                  style={squareStyle}
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

function calculateDraw(squares) {
  return squares.every((square) => square !== null);
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      let currMove = move + 1;
      const [row, col] = calculateLocation(move, squares, history[move - 1]);
      description =
        "You are at move #" + currMove + " (" + row + ", " + col + ")";
    } else {
      description = "Game starts, you are at move #1";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateLocation(move, currentSquares, prevSquares) {
  const diffIndex = currentSquares.findIndex(
    (square, index) => square !== prevSquares[index]
  );
  const row = Math.floor(diffIndex / 3) + 1;
  const col = (diffIndex % 3) + 1;
  return [row, col];
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // console.log(a + " " + b + " " + c);
      return [squares[a], a, b, c];
    }
  }
  return null;
}
