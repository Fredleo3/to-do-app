import { getData, setCurrentBoard, newBoard } from "./storage.js";

export const initBoardsList = () => {
  let data = getData();
  const boardsSection = document.querySelector(".boards-section");

  // Limpiar el contendor
  boardsSection.innerHTML = "";

  // Redenrizar la lista de tableros
  data.boards.forEach((board) => {
    boardsSection.insertAdjacentHTML("beforeend", renderBoardList(board));
  });
  //   Renderizar el botón Agregar tablero
  boardsSection.insertAdjacentHTML("beforeend", renderAddButton());
};

const renderBoardList = (board) => {
  return `
        <button class="board-button" value="${board.id}">
            <span class="material-symbols-outlined"> view_kanban </span>
            ${board.boardName}
        </button>
    `;
};

const renderAddButton = () => {
  return `
    <button class="add-board">
        <span class="material-symbols-outlined"> add_box </span>Agregar tablero</button>
    `;
};

document.addEventListener("click", (e) => {
  if (openBoard(e)) return;
  if (addBoard(e)) return;
});

const openBoard = (e) => {
  const boardBtn = e.target.closest(".board-button");
  if (!boardBtn) return;
  const boardId = boardBtn.value;
  const page = document.body.dataset.page;
  console.log(page);

  try {
    setCurrentBoard(boardId);
  } catch {
    console.log("No existe el ID");
    return;
  }
  window.location.href = `board.html`;
};

const addBoard = (e) => {
  const addBtn = e.target.closest(".add-board");
  if (!addBtn) return;
  newBoard();
  initBoardsList();
};
