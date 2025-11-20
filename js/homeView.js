import { getData, setCurrentBoard } from "./storage.js";

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
    <button class="board-button add-board">
        <span class="material-symbols-outlined"> add_box </span>Agregar tablero
      </button>
    `;
};

document.addEventListener("click", (e) => {
  if (!openBoard(e)) return;
});

const openBoard = (e) => {
  const boardId = e.target.value;
  if (!boardId) return;
  try {
    setCurrentBoard(boardId);
  } catch {
    console.log("No existe el ID");
    return;
  }
  window.location.href = `board.html`;
};
