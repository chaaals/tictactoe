const xTeam = "x";
const oTeam = "o";
let oTurn;
const winningMessageTextElement = document.querySelector(
  "[data-winning-message-text]"
);
const winningMessageElement = document.getElementById("winningMessage");
const allCells = document.querySelectorAll("[data-cell]");
const restartButton = document.getElementById("restart-button");

let prevButton = document.getElementById("previous");
let nextButton = document.getElementById("next");

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let boardHistory = [];
let currentHistoryIndex;

let boardState = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

startGame();

restartButton.addEventListener("click", startGame);

function startGame() {
  oTurn = false;
  resetCells();
  winningMessageElement.style.display = "none";

  boardState = [
    [
      { cellnumber: 0, hidden: true },
      { cellnumber: 1, hidden: true },
      { cellnumber: 2, hidden: true },
    ],
    [
      { cellnumber: 3, hidden: true },
      { cellnumber: 4, hidden: true },
      { cellnumber: 5, hidden: true },
    ],
    [
      { cellnumber: 6, hidden: true },
      { cellnumber: 7, hidden: true },
      { cellnumber: 8, hidden: true },
    ],
  ];

  boardHistory = [];
}

//event handler for every click
//for every turn, check winningCombinations for winner
function handleClick(e) {
  const cell = e.target;
  const currentTurn = oTurn ? oTeam : xTeam;
  placeMark(cell, currentTurn);
  if (checkWin(currentTurn)) {
    endGame(false);
    prevButton.removeAttribute("disabled");
    nextButton.removeAttribute("disabled");
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
  }

  //putting x or o in boardState
  const cellValue = parseInt(cell.dataset.cell);
  if (cellValue < 3) {
    //row 1 of board state
    boardState[0][cellValue] = {
      cellnumber: cellValue,
      marker: currentTurn,
      hidden: false,
    };
  } else if (cellValue >= 3 && cellValue < 6) {
    //row 2 of board state
    boardState[1][cellValue - 3] = {
      cellnumber: cellValue,
      marker: currentTurn,
      hidden: false,
    };
  } else {
    // row 3 of boardState
    boardState[2][cellValue - 6] = {
      cellnumber: cellValue,
      marker: currentTurn,
      hidden: false,
    };
  }

  //saving boardState to boardHistory
  boardHistory.push(JSON.parse(JSON.stringify(boardState)));
  currentHistoryIndex = boardHistory.length - 1;
  //console.log(boardHistory)
  index = boardHistory.length - 1;
}

function isDraw() {
  return [...allCells].every((cell) => {
    return cell.classList.contains(xTeam) || cell.classList.contains(oTeam);
  });
}

//function for placing X or o in board (not connected to boardState)
function placeMark(cell, currentTurn) {
  console.log(cell);
  cell.classList.add(currentTurn);
}

//swap turns function
function swapTurns() {
  oTurn = !oTurn;
}

//check combinations every turn
function checkWin(currentTurn) {
  return winningCombinations.some((combination) => {
    return combination.every((index) => {
      return allCells[index].classList.contains(currentTurn);
    });
  });
}

//endgame message function
function endGame(draw) {
  if (draw) {
    winningMessageElement.innerText = `Draw!`;
  } else {
    winningMessageTextElement.innerText = `${oTurn ? "O " : "X "} wins!`;
  }
  winningMessageElement.style.display = "flex";
}

//rendering to previous and next
let index = boardHistory.length - 1;

function previousMove() {
  if (currentHistoryIndex <= 0) return;
  currentHistoryIndex--;
  renderBoardState(boardHistory);
  console.log(boardHistory);
}

function nextMove() {
  if (currentHistoryIndex === boardHistory.length - 1) return;
  currentHistoryIndex++;
  renderBoardState(boardHistory);
}

function renderBoardState(state) {
  //console.log(state, allCells)
  state[currentHistoryIndex].forEach((row, rowIndex) => {
    row.forEach((rowItem) => {
      const cell = document.querySelector(
        `[data-cell="${rowItem?.cellnumber}"]`
      );

      if (rowItem.hidden) {
        if (cell.classList.contains("x")) {
          cell.classList.remove("x");
        }
        if (cell.classList.contains("o")) {
          cell.classList.remove("o");
        }
      }

      if (rowItem?.cellnumber && rowItem?.marker) {
        cell.classList.add(rowItem.marker);
      }
    });
  });
  //iterate through the DOM board
  //remove last classlist
  //if cell is not equal to classlist of x or o, disable classlist.add
  // for (let i = 0; i < state.length; i++) {
  // }
}

function resetCells() {
  allCells.forEach((cell) => {
    cell.classList.remove(xTeam);
    cell.classList.remove(oTeam);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
}
