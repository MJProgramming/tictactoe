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

const Player = (name) => {
  const hasWon = false;
  const isX = true;
  const getName = () => name;
  const makeMove = (position) => {
    if (isX) {
      GameBoard.addMarker(position, 'X');
    } else {
      GameBoard.addMarker(position, 'O');
    }
  };
  return { makeMove, hasWon, getName };
};
