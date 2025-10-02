import { isOpen, closeAllActions, saveFilter } from "./main.js";


// Manejadores de eventos ___________________________________________________________

// Abriendo el filtro de tareas en móvil
export const handleFilterButton = (e) => {
  const filterBtn = e.target.closest("#task-filter");

  if (!filterBtn) return false;

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
  saveFilter(filterOption.value);
  return true;
};

// Filtro _____________________________________________________________

const filter = (selected) => {
  const columnName = getColumn(selected.value);
  hideColumn();
  showColumn(columnName);
  updateMenu(selected);
  changeSelectName(selected.value);
};

const columnIdList = {
  new: "task-new",
  scheduled: "task-scheduled",
  "in-progress": "task-in-progress",
  done: "task-done",
};

const getColumn = (selected) => {
  let columnId = columnIdList[selected];
  return document.getElementById(columnId).closest("section");
};

const columnNameList = {
  new: " Nuevas",
  scheduled: " Programadas",
  "in-progress": " Iniciadas",
  done: " Finalizadas",
};

const changeSelectName = (value) => {
  let name = columnNameList[value];
  const columnName = document.querySelector(".task-filter__column-name");
  columnName.innerHTML = name;
};

const hideColumn = () => {
  const column = document.querySelector(".column-selected");
  column.classList.add("hidden");
  column.classList.remove("column-selected");
};

const showColumn = (column) => {
  column.classList.add("column-selected");
  column.classList.remove("hidden");
};

const updateMenu = (selected) => {
  const option = document.querySelector(".task-filter__option.hidden");
  option.classList.remove("hidden");
  selected.classList.add("hidden");
};

export const loadFilter = (filterValue) => {
  const selected = document.querySelector(`[value=${filterValue}]`);
  const column = getColumn(selected.value);
  hideColumn();
  showColumn(column);
  updateMenu(selected);
  changeSelectName(selected.value);
};
