const GameBoard = (() => {
  const board = Array(9);

  const getBoard = () => board;

  const renderNewBoard = () => {
    const div = document.getElementById('board');
    for (let i = 0; i < board.length; i += 1) {
      const btn = document.createElement('button');
      btn.classList.add('field');
      btn.setAttribute('data-index', `${i}`);
      btn.textContent = board[i];
      div.appendChild(btn);
    }
  };

  const isFull = () => {
    const fields = Array.from(document.querySelectorAll('.field'));
    return fields.every((field) => field.textContent !== '');
  };

  const addToDOM = (position, marker) => {
    const btn = document.querySelector(`.field[data-index='${position}']`);
    btn.textContent = marker;
  };

  const addMarker = (position, marker) => {
    addToDOM(position, marker);
    board[position] = marker;
  };

  const resetBoard = () => {
    const fields = document.querySelectorAll('.field');
    for (let i = 0; i < board.length; i += 1) {
      delete board[i];
    }
    fields.forEach((field) => {
      const curr = field;
      curr.textContent = '';
    });
  };

  return {
    getBoard,
    resetBoard,
    renderNewBoard,
    addMarker,
    isFull,
  };
})();

const Player = (player) => {
  const isX = String(player).toLowerCase() === 'x';
  const makeMove = (position) => {
    if (isX) {
      GameBoard.addMarker(position, 'X');
    } else {
      GameBoard.addMarker(position, 'O');
    }
  };
  return { makeMove, player };
};

const DisplayControl = (() => {
  const p = document.getElementById('player-info');
  const displayWinner = (player) => {
    p.textContent = `Player ${player} won!`;
  };

  const displayDraw = () => {
    p.textContent = 'It\'s a draw!';
  };

  const displayCurrentPlayer = (player) => {
    p.textContent = `Player ${player}'s turn`;
  };
  const displayReplayButton = () => {
    const div = document.getElementById('playing-field');
    const button = document.createElement('button');
    button.classList.add('replay');
    button.textContent = 'Replay';
    div.appendChild(button);
  };
  return {
    displayCurrentPlayer,
    displayWinner,
    displayReplayButton,
    displayDraw,
  };
})();

const Game = (() => {
  let currPlayer;
  let gameHasEnded = false;
  const playerX = Player('X');
  const playerO = Player('O');
  const playerXMoves = [];
  const playerOMoves = [];

  const winningConditions = [
    [0, 1, 2],
    [1, 4, 7],
    [3, 4, 5],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [2, 5, 8],
    [6, 7, 8],
  ];

  const toggleControls = () => {
    const fields = document.querySelectorAll('.field');
    fields.forEach((field) => {
      const btn = field;
      if (btn.disabled === true) {
        btn.disabled = false;
      } else {
        btn.disabled = true;
      }
    });
  };

  const listenForReplay = () => {
    const replay = document.querySelector('.replay');
    replay.addEventListener('click', () => {
      toggleControls();
      DisplayControl.displayCurrentPlayer(playerX.player);
      GameBoard.resetBoard();
      replay.remove();
      gameHasEnded = false;
      currPlayer = undefined;
    });
  };

  const resetMoveArray = (playerArray) => {
    playerArray.splice(0, playerArray.length);
  };

  const checkIfWinner = (playerArray) => {
    for (let i = 0; i < winningConditions.length; i += 1) {
      const check = winningConditions[i].every((mv) => playerArray.includes(mv));
      if (check === true) {
        return true;
      }
    }
    return false;
  };

  const endGame = () => {
    gameHasEnded = true;
    resetMoveArray(playerXMoves);
    resetMoveArray(playerOMoves);
    toggleControls();
    DisplayControl.displayReplayButton();
    listenForReplay();
  };

  const checkEndOfGame = () => {
    if (checkIfWinner(playerXMoves) || checkIfWinner(playerOMoves)) {
      if (checkIfWinner(playerXMoves)) {
        DisplayControl.displayWinner(playerX.player);
      } else {
        DisplayControl.displayWinner(playerO.player);
      }
      endGame();
    } else if (GameBoard.isFull()) {
      endGame();
      DisplayControl.displayDraw();
    }
  };

  const move = (pos) => {
    if (currPlayer === undefined || currPlayer.toLowerCase() === 'o') {
      playerXMoves.push(parseInt(pos, 10));
      playerX.makeMove(pos);
      if (!gameHasEnded) {
        DisplayControl.displayCurrentPlayer(`${playerO.player}`);
      }
      currPlayer = playerX.player;
    } else {
      playerOMoves.push(parseInt(pos, 10));
      playerO.makeMove(pos);
      if (!gameHasEnded) {
        DisplayControl.displayCurrentPlayer(`${playerX.player}`);
      }
      currPlayer = playerO.player;
    }
  };

  const checkIfEmpty = (pos) => {
    const field = document.querySelector(`.field[data-index='${pos}']`);
    if (field.textContent === '') {
      move(pos);
    }
  };

  const listenForMoves = () => {
    const fields = document.querySelectorAll('.field');
    fields.forEach((field) => {
      field.addEventListener('click', (e) => {
        checkIfEmpty(e.target.getAttribute('data-index'));
        checkEndOfGame();
      });
    });
  };

  return { listenForMoves };
})();

GameBoard.renderNewBoard();
Game.listenForMoves();
