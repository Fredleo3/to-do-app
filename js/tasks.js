import { saveTask, updateTask, isOpen, closeAllActions } from "./main.js";

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
        <li class="task" data-task-id='${task.taskId}'>
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
