// Create Game Board
let createGameBoard = (function () {
  const gameBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const generateGameBoard = () => {
    const X = "x";
    const O = "o";

    gameBoard = [
      ["", X, O],
      ["", X, O],
      ["", X, ""],
    ];

    return gameBoard;
  };

  const interface = (() => gameBoard)();

  return { interface, generateGameBoard };
})();

// Check for winner (logic)
const checkWinner = function (gameBoard) {
  // ----------------------------------
  let checkFor = function (conditions, arr, direction) {
    let letter = "";
    let counter = 0;
    for (let i = 0; i < 3; i++) {
      counter = 0;
      for (let j = 0; j < 2; j++) {
        if (
          (direction == "row" ? arr[i][j] != "" : arr[j][i] != "") &&
          ((direction === "row" && arr[i][j] == arr[i][j + 1]) ||
            (direction === "column" && arr[j][i] == arr[j + 1][i]))
        ) {
          conditions = true;
          counter += 1;
          letter = direction == "row" ? arr[i][j] : arr[j][i];
          if (conditions === true && counter === 2) break;
        } else {
          conditions = false;
        }
      }
      if (conditions === true && counter === 2) break;
    }
    return [conditions === true && counter === 2, letter];
  };

  let checkForRows = function () {
    let [rowConditions, letter] = checkFor(false, gameBoard, "row");

    return rowConditions && `${letter}`;
  };

  let checkForColumns = function () {
    let [columnConditions, letter] = checkFor(false, gameBoard, "column");

    return columnConditions && `${letter}`;
  };

  let checkForDiagonals = function () {
    let diagonalConditions =
      (gameBoard[0][0] === gameBoard[1][1] &&
        gameBoard[1][1] === gameBoard[2][2] &&
        gameBoard[0][0]) ||
      (gameBoard[0][2] === gameBoard[1][1] &&
        gameBoard[1][1] === gameBoard[2][0] &&
        gameBoard[0][2]);

    return diagonalConditions && `${diagonalConditions}`;
  };

  if (gameBoard instanceof Array) {
    let conditions = [checkForRows(), checkForColumns(), checkForDiagonals()];

    return conditions;
  }

  throw new Error("Gameboard is not an array!");
};

// Factory function for DOM manipulation of the game
// I create it because i want to isolate a logic from the global scope

function gameInteractive(gameBoardArray) {
  // Initializtion
  const X = "x";
  const O = "o";

  const game = document.querySelector(".game");
  const gameStart = document.querySelector(".game-start");
  const gameBoard = document.querySelector(".gameboard");
  const playerOneName = document.querySelector(".player-one-name");
  const playerTwoName = document.querySelector(".player-two-name");
  const initializtion = document.querySelector(".initialization");

  // Helper functions
  const classAdd = function (element, addClass) {
    element.classList.add(addClass);
  };
  const classRemove = function (element, removeClass) {
    element.classList.remove(removeClass);
  };
  const classContain = function (element, containClass) {
    return element.classList.contains(containClass);
  };

  //   Functions
  function createGameBoard() {
    classRemove(gameBoard, "hidden");

    gameBoardArray.forEach((array) => {
      array.forEach((cell) => {
        let letter = cell;

        let div = document.createElement("div");
        div.className = "cell";
        div.textContent = letter == "x" || letter == "y" ? letter : " ";

        gameBoard.appendChild(div);
      });
    });
  }

  function createArrayFromGameBoard(DOMGameBoard) {
    const oneDimensionGameBoard = Array.from(DOMGameBoard).map(cell => cell.textContent);
    const twoDimensionGameBoard = [[...oneDimensionGameBoard.slice(0, 3)], [...oneDimensionGameBoard.slice(3, 6)], [...oneDimensionGameBoard.slice(6)]];
    
    return twoDimensionGameBoard;
  }

  function playerTitle(firstPlayer, secondPlayer) {
    let div = document.createElement("div");
    div.className = "player";
    div.innerHTML = `
        <div class="player-one">Player(X): ${firstPlayer}</div>
        <span class="dash">-</span>
        <div class="player-two">Player(O): ${secondPlayer}</div>
    `;
    game.appendChild(div);
  }

  function displayWinner(winner) {
    let div = document.createElement('div');
    div.className = 'game-end';
    div.innerHTML = `
      <div class="win-or-lose">Winner is: ${winner == 'Draw!' ? 'No one!' : winner}</div>
      <div>Refresh the page for restart the game!</div>
    `;
    game.appendChild(div);
  }

  function gameInitialization() {
    let firstPlayer = "None",
      secondPlayer = "none";

    initializtion.addEventListener("click", function (e) {
      e.preventDefault();

      firstPlayer = playerOneName.value;
      secondPlayer = playerTwoName.value;

      if (firstPlayer && secondPlayer) {
        classAdd(gameStart, "hidden");
        createGameBoard();
        playerTitle(firstPlayer, secondPlayer);
      }
    });

    return [firstPlayer, secondPlayer];
  }

  function gameInteraction() {
    const X = "x";
    const O = "o";
    let order = true;
    let theEnd = false;

    let counter = 0;

    gameBoard.addEventListener("click", function (e) {
      let cell = e.target;

      if (!classContain(cell, "cellIsCount") && !theEnd) {
        counter += 1;
        cell.textContent = order ? X : O;
        classAdd(cell, order ? "cell-x" : "cell-o");
        classAdd(cell, "cellIsCount");
        order = !order;
        DOMGameBoard = document.querySelectorAll('.gameboard > .cell');
        let checkForWinner = checkWinner(createArrayFromGameBoard(DOMGameBoard));
        if (checkForWinner.find(cell => cell === X || cell === O)) {
          let XWin = checkForWinner.find(cell => cell === X);
          displayWinner(XWin ? document.querySelector('.player-one').textContent : document.querySelector('.player-two').textContent);
          theEnd = true;
        }
        else if (counter == 9) {
          displayWinner('Draw!');
        }
      }
    });
  }

  return { gameInitialization, gameInteraction };
}

// Factory function for control flow of the game
// I create it because i want to isolate a logic from the global scope
function game() {
  const gameBoard = createGameBoard;
  const DOMInteraction = gameInteractive(gameBoard.interface);

  DOMInteraction.gameInitialization();
  DOMInteraction.gameInteraction();
}

game();
