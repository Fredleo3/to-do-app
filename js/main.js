import {
  handleFilterButton,
  handleFilterOption,
  loadFilter,
} from "./filter.js";

import {
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
} from "./tasks.js";

import { getAllTasks, getFilter } from "./storage.js";
import { closeAllActions, showOpenerForm } from "./utils.js";

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
  renderTasks(getAllTasks());
  loadFilter(getFilter());
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
