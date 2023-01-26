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

const Game = (() => {
  let currPlayer;
  const player1 = Player('X');
  const player2 = Player('O');
  const move = (pos) => {
    if (currPlayer === undefined || currPlayer.toLowerCase() === 'o') {
      player1.makeMove(pos);
      currPlayer = player1.player;
    } else {
      player2.makeMove(pos);
      currPlayer = player2.player;
    }
  };
  const listenForMoves = () => {
    const fields = document.querySelectorAll('.field');
    fields.forEach((field) => {
      field.addEventListener('click', (e) => {
        move(e.target.getAttribute('data-index'));
      });
    });
  };
  return { listenForMoves };
})();

GameBoard.renderNewBoard();
Game.listenForMoves();
