import { handleFilterButton, handleFilterOption, loadFilter } from "./filter.js"
import { handleActionButton, handleMoveAction, renderTasks, handleDrag, initColumnListeners } from "./tasks.js"
import { getAllTasks, getFilter } from "./storage.js"
import { closeAllActions } from "./utils.js"


// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
  renderTasks(getAllTasks());
  loadFilter(getFilter());
  initColumnListeners();
});

// Listener global
document.addEventListener("click", (e) => {
  if (handleFilterButton(e)) return;
  if (handleFilterOption(e)) return;
  if (handleActionButton(e)) return;
  if (handleMoveAction(e)) return;
  closeAllActions();
});

document.addEventListener("dragstart", (e) => {
  if (handleDrag(e)) return;
})