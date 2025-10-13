import { isOpen, closeAllActions, open, close } from "./utils.js";
import { saveTask, updateTask } from "./storage.js";

const newTaskList = document.getElementById("task-list-new");
const scheduledTaskList = document.getElementById("task-list-scheduled");
const inProgressTaskList = document.getElementById("task-list-in-progress");
const doneTaskList = document.getElementById("task-list-done");

// Nueva tarea ______________________________________________________________________

export const openFormTask = (e) => {
  
  const opener = e.target.closest(".task-form__opener")
  if (!opener) return false

  closeAllActions();

  const formSection = opener.closest(".task-form__section")
  const form = formSection.querySelector(".task-form")  
  if (!form) return false

  if (isOpen(form)) close(form)
  open(form)
  close(opener)
  return true
}

// Para mantener el formulario abierto
export const focusInput = (e) => {
  const form = e.target.closest(".task-form")
  if (!form) return false

  open(form)  
  return true
}

export const addNewTask = (e) => {
  e.preventDefault();
  const inputTask = e.target.querySelector(".task-form__input")
  if (!inputTask) return false

  newTask(inputTask.value.trim(), inputTask);
  return true
}

const newTask = (newText, inputTask) => {
  const column = inputTask.closest(".task-column").dataset.value
  const number = getPosition(column) + 1 // Se suma 1 para contar esta tarea que no se ha renderizado
  const task = { taskId: idGenerator(), text: newText, state: column, position: number };
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

  if (taskList.length > 1) {
    taskList.sort((a, b) => +a.position - +b.position)
  }
  
  taskList.forEach((task) => {
    const taskCode = `
        <li class="task" data-task-id='${task.taskId}' data-position='${task.position}' draggable="true">
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


// Abrir modal editar tareas ____________________________________________________________________

export const handleEditTask = (e) => {
  const taskToEdit = e.target.closest("li")
  if (!taskToEdit) return false

  const dialog = document.querySelector(".modal-edit")
  const taskText = taskToEdit.querySelector(".task-text").textContent.trim()
  const inputText = dialog.querySelector(".modal-edit__form--text")
  inputText.value = taskText
  dialog.dataset.taskId = taskToEdit.dataset.taskId
  dialog.showModal()
}

export const handleCloseEditTask = (e) => {
  const closeBtn = e.target.closest(".modal-edit__close")
  if (!closeBtn) return false;

  const dialog = document.querySelector(".modal-edit")
  dialog.close()
}


// Editar tareas ____________________________________________________________________

export const editTask = (e) => {
  const inputText = e.target.closest(".modal-edit__form--text");
  if (!inputText) return;
  inputText.removeAttribute('readonly')
}

export const saveEditTask = (e) => {
  const saveBtn = e.target.closest(".modal-edit__form--save")
  if (!saveBtn) return;

  const dialog = saveBtn.closest("dialog")
  const taskId = dialog.dataset.taskId
  const modifiedText = dialog.querySelector(".modal-edit__form--text").value

  // Actualizar tarea en la UI
  const task = document.querySelector(`[data-task-id="${taskId}"]`) 
  const taskText = task.querySelector(".task-text")
  taskText.textContent = modifiedText

  // Actualiza localStrorage
  updateTask(taskId, {"text": modifiedText})

  dialog.querySelector(".modal-edit__form--text").setAttribute("readonly", true)

  
}

export const cancelEditTask = (e) => {

}


// Manejadores de eventos ___________________________________________________________

//  Abriendo el menú de opciones
export const handleActionButton = (e) => {
  const actionBtn = e.target.closest(".task-action");

  if (!actionBtn) return false;

  const column = e.target.closest("section");
  const task = e.target.closest("li");
  const optionMenu = task.querySelector(".task-action__group");
  if (isOpen(optionMenu)) {
    close(optionMenu)
  } else {
    closeAllActions();
    open(optionMenu)
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
  // constantes de las columnas
  new: newTaskList,
  scheduled: scheduledTaskList,
  "in-progress": inProgressTaskList,
  done: doneTaskList,
};

const moveToCol = (columnTarget, task) => {
  valueColumList[columnTarget].appendChild(task);
  const taskId = task.dataset.taskId;
  const number = getPosition(columnTarget);
  changePosition(task, number);
  updateTask(taskId, {"state": columnTarget, "position": number});
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

const getPosition = (columnId) => {
  return valueColumList[columnId].querySelectorAll(".task").length;
};

const changePosition = (task, number) => {
  return (task.dataset.position = number);
};

// Drag and Drop ____________________________________________________________________________

let idOriginColumn = null;
let idDestinyColumn = null;

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

    idOriginColumn = e.target.closest(".task-column").id;
  });
};

const handleDragEnd = () => {
  document.addEventListener("dragend", (e) => {
    const task = e.target.closest("li");
    if (!task) return;
    task.classList.remove("dragging");
    saveTaskOrder(true);
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

  idDestinyColumn = taskList.closest(".task-column").id;
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
  clonedImage.style.bottom = "120vh";
  clonedImage.style.opacity = "1";
  clonedImage.style.background = "var(--dragging)";
  clonedImage.style.boxShadow = "0 0 8px var(--shadow-color)";
  clonedImage.style.transform = "scale(1.05)";
  clonedImage.style.pointerEvents = "none";

  document.body.appendChild(clonedImage);

  const offsetX = width / 2;
  e.dataTransfer.setDragImage(clonedImage, offsetX, 10);
  setTimeout(() => clonedImage.remove(), 0);
};



const saveTaskOrder = (finished) => {
  if (!finished) return;

  const origin = document.querySelector(`#${idOriginColumn}`);
  const destiny = document.querySelector(`#${idDestinyColumn}`);

  if (!origin || !destiny) return

  const updateColumnTask = (column, list, columnState) => {
    list.forEach((task, index) => {
      const position = index + 1
      changePosition(task, position)
      updateTask(task.dataset.taskId, {"state": columnState, "position": position})
    })
  }

  updateColumnTask(origin, origin.querySelectorAll(".task"), origin.dataset.value)
  
  if (origin === destiny) return

  updateColumnTask(destiny, destiny.querySelectorAll(".task"), destiny.dataset.value)
  
};
