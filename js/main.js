import {
  handleFilterButton,
  handleFilterOption,
  
} from "./filter.js"; //loadFilter,

import { renderBoard } from "./boardView.js"

import {
  // render,
  openFormTask,
  focusInput,
  addNewTask,
  handleActionButton,
  handleMoveAction,
  renderTasks,
  initDragAndDrop,
  handleEditTask,
  handleCloseEditTask,
  editTask,
  saveEditTask,
  cancelEditTask
} from "./tasksView.js";

import { getFilter, initData, getData } from "./storage.js"; //getAllTasks,
import { closeAllActions, showOpenerForm } from "./utils.js";

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
  
  initData();
  renderBoard(getData(), "525350dd-2141-4ab3-9c6e-0f6331ee6de5");
  // renderTasks(getData());
  // render(getData())
  // loadFilter(getFilter("525350dd-2141-4ab3-9c6e-0f6331ee6de5"));
  initDragAndDrop();
});

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
