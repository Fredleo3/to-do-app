import { handleFilterButton, handleFilterOption, loadFilter } from "./filter.js"
import { handleActionButton, handleMoveAction, renderTasks } from "./tasks.js"
import { getAllTasks, getFilter } from "./storage.js"
import { closeAllActions } from "./utils.js"

// Listener global
document.addEventListener("DOMContentLoaded", () => {
  renderTasks(getAllTasks());
  loadFilter(getFilter());
});

document.addEventListener("click", (e) => {
  if (handleFilterButton(e)) return;
  if (handleFilterOption(e)) return;
  if (handleActionButton(e)) return;
  if (handleMoveAction(e)) return;
  closeAllActions();
});