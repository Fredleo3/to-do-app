import { isOpen, closeAllActions } from "./utils.js";
import { getCurrentBoard, saveFilter } from "./storage.js";

// Manejadores de eventos ___________________________________________________________

// Abriendo el filtro de tareas en móvil

export const handleFilterButton = (e) => {
  const filterBtn = e.target.closest("#task-filter");

  if (!filterBtn) return;

  const filterGroup = document.getElementById("task-filter-group");
  if (isOpen(filterGroup)) {
    filterGroup.classList.remove("open");
    filterGroup.classList.add("hidden");
  } else {
    closeAllActions();
    filterGroup.classList.remove("hidden");
    filterGroup.classList.add("open");
  }
  return true;
};

// Seleccionando una columna

export const handleFilterOption = (e) => {
  const filterOption = e.target.closest(".task-filter__option");
  if (!filterOption) return false;
  closeAllActions();
  filter(filterOption);
  saveFilter(getCurrentBoard(), filterOption.value);
  return true;
};

// Filtro _____________________________________________________________

const filter = (selected) => {
  const columnSelected = document.querySelector(
    `[data-column-id="${selected.value}"]`
  );
  const name = columnSelected.querySelector("h3").textContent;
  const columnActive = document.querySelector(".task-column.column-selected");
  columnActive.classList.add("hidden");
  columnActive.classList.remove("column-selected");
  columnSelected.classList.remove("hidden");
  columnSelected.classList.add("column-selected");
  updateMenu(selected);
  changeSelectName(name);
};

export const changeSelectName = (name) =>
  (document.querySelector(".task-filter__column-name").textContent = name);

const updateMenu = (selected) => {
  const option = document.querySelector(".task-filter__option.hidden");
  option.classList.remove("hidden");
  selected.classList.add("hidden");
};