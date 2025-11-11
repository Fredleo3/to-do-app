import { handleFilterButton, handleFilterOption } from "./filter.js";

import { renderBoard } from "./boardView.js";

import {
  openFormTask,
  focusInput,
  addNewTask,
  handleActionButton,
  handleMoveAction,
  initDragAndDrop,
  handleEditTask,
  handleCloseEditTask,
  editTask,
  saveEditTask,
  cancelEditTask,
} from "./tasksView.js";

import { initData, getData } from "./storage.js";
import { closeAllActions, showOpenerForm } from "./utils.js";

import { initBoardsList } from "./homeView.js";

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
  initData();
  initApp();
});

const initApp = () => {
  const currentPage = document.body.dataset.page;
  switch (currentPage) {
    case "home":
      initHomePage();
      break;

    case "board":
      initBoardPage();
      break;

    default:
      console.warn("Página desconocida");
  }
};

const initHomePage = () => {
  initBoardsList();
};

const initBoardPage = () => {
  renderBoard(getData(), "525350dd-2141-4ab3-9c6e-0f6331ee6de5");
  initDragAndDrop();

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
};
