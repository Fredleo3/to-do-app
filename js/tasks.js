import { isOpen, closeAllActions } from "./utils.js";
import { saveTask, updateTask } from "./storage.js";

const inputTask = document.getElementById("task-form-input");
const form = document.getElementById("task-form");

const newTaskList = document.getElementById("task-list-new");
const scheduledTaskList = document.getElementById("task-list-scheduled");
const inProgressTaskList = document.getElementById("task-list-in-progress");
const doneTaskList = document.getElementById("task-list-done");

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
  new: newTaskList,
  scheduled: scheduledTaskList,
  "in-progress": inProgressTaskList,
  done: doneTaskList,
};

export const renderTasks = (taskList) => {
  taskList.forEach((task) => {
    const taskCode = `
        <li class="task" data-task-id='${task.taskId}'draggable="true">
              <span class="task-text">
                ${task.text}</span>              
              <section class="task-action__group hidden">
                <h5 class="task-action__title">Mover a tareas</h5>
                <button class="task-action__option" value="new">
                  Nuevas
                </button>
                <button class="task-action__option" value="scheduled">
                  Programadas
                </button>
                <button class="task-action__option" value="in-progress">
                  Iniciadas
                </button>
                <button class="task-action__option" value="done">
                  Finalizadas
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

// Manejadores de eventos ___________________________________________________________

//  Abriendo el menú de opciones
export const handleActionButton = (e) => {
  const actionBtn = e.target.closest(".task-action");

  if (!actionBtn) return false;

  const column = e.target.closest("section");
  const task = e.target.closest("li");
  const optionMenu = task.querySelector(".task-action__group");
  if (isOpen(optionMenu)) {
    optionMenu.classList.remove("open");
    optionMenu.classList.add("hidden");
  } else {
    closeAllActions();
    optionMenu.classList.add("open");
    optionMenu.classList.remove("hidden");
    updateOptions(column, optionMenu);
  }
  return true;
};

// clickeando una opción para mover la tarea
export const handleMoveAction = (e) => {
  const moveActions = e.target.closest(".task-action__option");

  if (!moveActions) return false;

  closeAllActions();
  const columnTarget = moveActions.value;
  const task = e.target.closest("li");
  moveToCol(columnTarget, task);
  return true;
};

// Acciones _________________________________________________________________________________

const valueColumList = {
  new: newTaskList,
  scheduled: scheduledTaskList,
  "in-progress": inProgressTaskList,
  done: doneTaskList,
};

const moveToCol = (columnTarget, task) => {
  valueColumList[columnTarget].appendChild(task);
  const taskId = task.dataset.taskId;
  updateTask(taskId, "state", columnTarget);
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

// Drag and Drop ____________________________________________________________________________

export const initDragAndDrop = () => {
  handleDragStart();
  handleDragInColumns();
  handleDragEnd();
};

const handleDragStart = () => {
  document.addEventListener("dragstart", (e) => {
    const task = e.target.closest("li");
    if (!task) return;
    setTimeout(() => task.classList.add("dragging"), 0);
    gosthImage(e, task);
  });
};

const handleDragEnd = () => {
  document.addEventListener("dragend", (e) => {
    const task = e.target.closest("li");
    if (!task) return;
    task.classList.remove("dragging");
  });
};

const handleDragInColumns = () => {
  const columnContainer = document.querySelector(".task-columns__container");

  columnContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    const list = e.target.closest(".task-list");
    if (!list) return;
    initSortableList(e, list);
  });

  columnContainer.addEventListener("dragenter", (e) => {
    e.preventDefault();
  });
};

const initSortableList = (e, taskList) => {
  const draggingtask = document.querySelector(".dragging");
  let siblings = [...taskList.querySelectorAll(".task:not(.dragging)")];
  let nextSibling = siblings.find((sibling) => {
    return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
  });
  taskList.insertBefore(draggingtask, nextSibling);
};

const gosthImage = (e, task) => {
  const width = task.offsetWidth;
  const heigth = task.offsetHeight;
  const clonedImage = task.cloneNode(true);

  clonedImage.classList.add("over");
  clonedImage.style.minWidth = width + "px";
  clonedImage.style.maxWidth = width + 10 + "px";
  clonedImage.style.minHeigth = heigth + "px";
  clonedImage.style.maxHeigth = heigth + 10 + "px";

  clonedImage.style.position = "absolute";
  clonedImage.style.bottom = "120vh"; // Muy fuera de la vista
  clonedImage.style.opacity = "1"; // opacidad total visible
  clonedImage.style.background = "var(--dragging)";
  clonedImage.style.boxShadow = "0 0 8px var(--shadow-color)";
  clonedImage.style.transform = "scale(1.05)"; // pequeño efecto visual
  clonedImage.style.pointerEvents = "none"; // evitar interferencia

  document.body.appendChild(clonedImage);

  const offsetX = width / 2;
  e.dataTransfer.setDragImage(clonedImage, offsetX, 10);
  setTimeout(() => clonedImage.remove(), 0);
};
