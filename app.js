const inputTask = document.getElementById("task-form-input");
const form = document.getElementById("task-form");

const newTaskList = document.getElementById("task-list-new");
const scheduledTaskList = document.getElementById("task-list-scheduled");
const inProgressTaskList = document.getElementById("task-list-in-progress");
const doneTaskList = document.getElementById("task-list-done");

const filterGroup = document.getElementById("task-filter-group");

// Inicio de la aplicación

document.addEventListener("DOMContentLoaded", () => {
  renderTasks(getAllTasks());
  loadFilter(getFilter());
});

document.addEventListener("click", (e) => {
  const filterBtn = e.target.closest("#task-filter");
  const filterOption = e.target.closest(".task-filter__option");

  const actionBtn = e.target.closest(".task-action");
  const moveActions = e.target.closest(".task-action__option");

  // Abriendo el filtro de tareas en móvil

  if (filterBtn) {
    if (isOpen(filterGroup)) {
      filterGroup.classList.remove("open");
      filterGroup.classList.add("hidden");
    } else {
      closeAllActions();
      filterGroup.classList.remove("hidden");
      filterGroup.classList.add("open");
    }
  }
  // Seleccionando una columna
  else if (filterOption) {
    closeAllActions();
    filter(filterOption);
    saveFilter(filterOption.value);
  }
  //  Abriendo el menú de opciones
  else if (actionBtn) {
    const column = e.target.closest("section");
    const task = e.target.closest("li");
    const optionMenu = task.querySelector(".task-action__group");
    if (isOpen(optionMenu)) {
      optionMenu.classList.remove("open");
      optionMenu.classList.add("hidden");
      return;
    } else {
      closeAllActions();
      optionMenu.classList.add("open");
      optionMenu.classList.remove("hidden");
      updateOptions(column, optionMenu);
      return;
    }
  }

  // clickeando una opción para mover la tarea
  else if (moveActions) {
    closeAllActions();
    const columnTarget = moveActions.value;
    const task = e.target.closest("li");
    moveToCol(columnTarget, task);

    return;
  } else {
    closeAllActions();
    return;
  }
});

// Nueva tarea ______________________________________________________________________

form.addEventListener("submit", (e) => {
  e.preventDefault();
  newTask(inputTask.value.trim());
});

const newTask = (newText) => {
  const task = { taskId: idGenerator(), text: newText, state: "new" };
  saveTask(task);
  renderTasks([task]);
  inputTask.value = "";
};

const idGenerator = () => Date.now();

// Renderizar tareas ________________________________________________________________

const taskStateList = {
  "new": newTaskList,
  "scheduled": scheduledTaskList,
  "in-progress": inProgressTaskList,
  "done": doneTaskList
};

const renderTasks = (taskList) => {
  let num = 0;
  taskList.forEach((task) => {
    const taskCode = `
        <li class="task" data-task-id='${task.taskId}'>
              <span class="task-text">
                ${task.text}</span>              
              <section class="task-action__group hidden">
                <h5 class="task-action__title">Mover a tareas</h5>
                <button class="task-action__option" value="new">
                  Nuevas 1
                </button>
                <button class="task-action__option" value="scheduled">
                  Programadas 2
                </button>
                <button class="task-action__option" value="in-progress">
                  Iniciadas 3
                </button>
                <button class="task-action__option" value="done">
                  Finalizadas 4
                </button>
              </section>

              <button class="task-action">
                <span class="material-symbols-outlined"> more_vert </span>
              </button>              
            </li>
        `;
    taskStateList[task.state].insertAdjacentHTML("beforeend", taskCode);
  });
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
  "new": "task-new",
  "scheduled": "task-scheduled",
  "in-progress": "task-in-progress",
  "done": "task-done"
}

const getColumn = (selected) => {
  let columnId = columnIdList[selected];
  return document.getElementById(columnId).closest("section");
};

const columnNameList = {
  "new": " Nuevas",
  "scheduled": " Programadas",
  "in-progress": " Iniciadas",
  "done": " Finalizadas"
}

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

const loadFilter = (filterValue) => {
  const selected = document.querySelector(`[value=${filterValue}]`);
  const column = getColumn(selected.value);
  hideColumn();
  showColumn(column);
  updateMenu(selected);
  changeSelectName(selected.value);
};

// Acciones _________________________________________________________________________________

const isOpen = (element) => {
  return element.classList.contains("open");
};

const closeAllActions = () => {
  const openedMenu = document.querySelectorAll(".open");
  if (openedMenu.length > 0) {
    for (let i = 0; i < openedMenu.length; i++) {
      openedMenu[i].classList.add("hidden");
      openedMenu[i].classList.remove("open");
    }
  }
};

const valueColumList = {
  "new": newTaskList,
  "scheduled": scheduledTaskList,
  "in-progress": inProgressTaskList,
  "done": doneTaskList
}

const moveToCol = (columnTarget, task) => {
  valueColumList[columnTarget].appendChild(task) 
  const taskId = task.dataset.taskId;
  upadateTask(taskId, "state", columnTarget);
};

const updateOptions = (column, optionGroup) => {
  const allOptions = optionGroup.querySelectorAll(".task-action__option");

  allOptions.forEach((option) => {
    if (option.value != column.dataset.value) {
      option.classList.remove("hidden");
    } else {
      option.classList.add("hidden");
    }
  });
};

// LocalStorage _____________________________________________________________________________

// --- LocalStorage-Filtro

const saveFilter = (value) => {
  localStorage.setItem("filter", value);
};

const getFilter = () => {
  return localStorage.getItem("filter");
};

// --- LocalStorage-Tareas

const saveTask = (task) => {
  let allTasks = getAllTasks();
  allTasks.push(task);
  localStorage.setItem("allTasks", JSON.stringify(allTasks));
};

const getAllTasks = () => {
  return JSON.parse(localStorage.getItem("allTasks")) || [];
};

const upadateTask = (id, key, value) => {
  let allTasks = getAllTasks();

  for (let i = 0; i < allTasks.length; i++) {
    if (allTasks[i].taskId === +id) {
      allTasks[i][key] = value;
    }
  }

  localStorage.setItem("allTasks", JSON.stringify(allTasks));
};
