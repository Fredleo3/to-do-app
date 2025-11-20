import {
  renderTasks,
  openFormTask,
  focusInput,
  addNewTask,
  handleActionButton,
  handleMoveAction,
  handleEditTask,
  handleCloseEditTask,
  editTask,
  saveEditTask,
  cancelEditTask,
} from "./tasksView.js";

import { handleFilterButton, handleFilterOption } from "./filter.js";

import { closeAllActions, showOpenerForm } from "./utils.js";

import { getFilter, getData, getCurrentBoard } from "./storage.js";

import { changeSelectName } from "./filter.js";

import { initDragAndDrop } from "./tasksView.js";

export const initBoardPage = () => {
  renderBoard(getData(), getCurrentBoard());
  initDragAndDrop();
};

const renderBoard = (data, boardId) => {
  const board = data.boards.find((board) => board.id === boardId);
  if (board === -1) return;
  // TODO Lógica para renderizar el tablero
  renderColumns(board, boardId);
};

const renderColumns = (board, boardId) => {
  const columnsContainer = document.querySelector(".task-columns__container");
  const filterMenu = document.querySelector(".task-filter__group");
  const filter = getFilter(boardId);

  board.columns.map((column) => {
    columnsContainer?.insertAdjacentHTML(
      "beforeend",
      columnTemplate(column.id, column.columnName, filter)
    );
    filterMenu?.insertAdjacentHTML(
      "beforeend",
      columnFilterTemplate(column.id, column.columnName, filter)
    );
  });
  renderTasks(board.tasks);
};

const columnTemplate = (columnId, columnName, filter) => {
  let selected = "";
  if (filter === columnId) {
    selected = "column-selected";
    changeSelectName(columnName);
  } else {
    selected = "hidden";
  }

  return `
    <section
          class="task-column ${selected}"
          data-column-id="${columnId}"
        >
          <h3 class="task-columns__title">${columnName}</h3>

          <ul class="task-list">
          
          </ul>

          <section class="task-form__section">
            <button class="task-form__opener">
              <span class="material-symbols-outlined">add</span
              ><span>Agregar tarea</span>
            </button>

            <form action="submit" class="task-form hidden">
              <textarea
                class="task-form__input"
                type="text"
                placeholder="Tarea nueva"
                required
                placeholder="Escribe el título de la tarea"
              ></textarea>
              <button class="task-form__submit" type="submit">Agregar</button>
            </form>
          </section>
        </section>
  `;
};

const columnFilterTemplate = (columnId, columnName, filter) => {
  let active = "";
  columnId === filter ? (active = "hidden") : (active = "");
  return `
          <button class="task-filter__option ${active}" value=${columnId}>
            ${columnName}
          </button>
  `;
};

// Listener global
document.addEventListener("click", (e) => {
  if (openFormTask(e)) return;
  if (focusInput(e)) return;
  if (handleFilterButton(e)) return;
  if (handleFilterOption(e)) return;
  if (handleActionButton(e)) return;
  if (handleMoveAction(e)) return;
  if (handleEditTask(e)) return;
  if (handleCloseEditTask(e)) return;
  if (editTask(e)) return;
  if (saveEditTask(e)) return;
  if (cancelEditTask(e)) return;
  closeAllActions();
  showOpenerForm();
});

document.addEventListener("submit", (e) => {
  if (addNewTask(e)) return;
});
