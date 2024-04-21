let createGameBoard = (function() {
    let gameBoard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    let generateGameBoard = () => {
        const X = 'x';
        const O = 'o'; 

        gameBoard = [
            ['', X, O],
            ['', X, O],
            ['', X, '']
        ];

        return gameBoard;
    };

    let interface = () => gameBoard;

    return { interface, generateGameBoard };
})();

let checkWinner = (function(gameBoard) {
    // ----------------------------------
    let checkFor = function(conditions, arr, direction) {
        let letter = '';
        let counter = 0;
        for (let i = 0; i < 3; i++) {
            counter = 0; 
            for (let j = 0; j < 2; j++) {
                if (((direction == 'row') ? arr[i][j] != '' : arr[j][i] != '') && ((direction === 'row' && arr[i][j] == arr[i][j+1]) || (direction === 'column') && arr[j][i] == arr[j+1][i])) {
                    conditions = true;
                    counter += 1;
                    letter = (direction == 'row') ? arr[i][j] : arr[j][i];
                    if (conditions === true && counter === 2) break;
                }
                else {
                    conditions = false;
                }
            }
            if (conditions === true && counter === 2) break;
        }
        return [conditions === true && counter === 2, letter];
    }

    let checkForRows = function() {
        let [rowConditions, letter] = checkFor(false, gameBoard, 'row');
        
        return rowConditions && `${letter} is winner!`;
    }

    let checkForColumns = function() {
        let [columnConditions, letter] = checkFor(false, gameBoard, 'column');

        return columnConditions && `${letter} is winner!`;
    }

    let checkForDiagonals = function() {
        let diagonalConditions = (((gameBoard[0][0] === gameBoard[1][1]) && (gameBoard[1][1] === gameBoard[2][2])) && gameBoard[0][0]) || ((gameBoard[0][2] === gameBoard[1][1]) && (gameBoard[1][1] === gameBoard[2][0]) && gameBoard[0][2]);

        return diagonalConditions && `${diagonalConditions} is winner!`; 
    }

    if (gameBoard instanceof Array) {
        let conditions = [checkForRows(), checkForColumns(), checkForDiagonals()];;

        return conditions;
    }

    throw new Error("Gameboard is not an array!");
});

// Factory function for control flow of the game
// I create it because i want to isolate a logic from the global scope
function game() {
    let gameBoard = createGameBoard;

    createGameBoard.generateGameBoard();

    console.log(checkWinner(createGameBoard.interface()));
}

game();