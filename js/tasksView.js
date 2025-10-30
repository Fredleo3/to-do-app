import { isOpen, closeAllActions, open, close } from "./utils.js";
import { getData, saveNewData, taskTemplate, updateData } from "./storage.js";

// Nueva tarea ______________________________________________________________________

export const openFormTask = (e) => {
  const opener = e.target.closest(".task-form__opener");
  if (!opener) return false;

  closeAllActions();

  const formSection = opener.closest(".task-form__section");
  const form = formSection.querySelector(".task-form");
  if (!form) return false;

  if (isOpen(form)) close(form);
  open(form);
  close(opener);
  return true;
};

// Para mantener el formulario abierto

export const focusInput = (e) => {
  const form = e.target.closest(".task-form");
  if (!form) return false;

  open(form);
  return true;
};

export const addNewTask = (e) => {
  e.preventDefault();
  const inputTask = e.target.querySelector(".task-form__input");
  if (!inputTask) return false;

  newTask(inputTask.value.trim(), inputTask);
  return true;
};

const newTask = (newText, inputTask) => {
  const column = inputTask.closest(".task-column");
  const position = getPosition(column) + 1; // Se suma 1 para contar esta tarea que no se ha renderizado
  const task = taskTemplate(newText, column.dataset.columnId, position);

  saveNewData("525350dd-2141-4ab3-9c6e-0f6331ee6de5", "tasks", task);
  renderTasks([task]);
  inputTask.value = "";
};

// Renderizar tareas ________________________________________________________________

export const renderTasks = (allTasks) => {
  if (allTasks.length > 1) {
    allTasks.sort((a, b) => +a.position - +b.position);
  }

  allTasks.forEach((task) => {
    const column = document.querySelector(
      `[data-column-id="${task.columnId}"]`
    );
    const taskList = column.querySelector(".task-list");
    const taskCode = `
        <li class="task" data-task-id='${task.id}' data-position='${
      task.position
    }' draggable="true">
              <span class="task-text">
                ${task.text}</span>              
              <section class="task-action__group hidden">
                <h5 class="task-action__title">Mover a</h5>
                ${getMenuOptions(task.columnId)}
              </section>

              <button class="task-action">
                <span class="material-symbols-outlined"> more_vert </span>
              </button>              
            </li>
        `;
    taskList.insertAdjacentHTML("beforeend", taskCode);
  });
};

const getMenuOptions = (actualColumn) => {
  const columns = getData().boards.find(
    (board) => board.id === "525350dd-2141-4ab3-9c6e-0f6331ee6de5"
  ).columns;

  if (!columns) return;

  let buttons = ``;
  columns.forEach((column) => {
    if (column.id !== actualColumn) {
      buttons += `<button class="task-action__option" value='${column.id}'>
                  ${column.columnName}
                </button>`;
    } else {
      buttons += `<button class="task-action__option hidden" value='${column.id}'>
                  ${column.columnName}
                </button>`;
    }
  });
  return buttons;
};

// Abrir modal editar tareas ____________________________________________________________________

export const handleEditTask = (e) => {
  const taskToEdit = e.target.closest("li");
  if (!taskToEdit) return false;

  const dialog = document.querySelector(".modal-edit");
  const taskText = taskToEdit.querySelector(".task-text").textContent.trim();
  const inputText = dialog.querySelector(".modal-edit__form--text");
  inputText.value = taskText;
  dialog.dataset.taskId = taskToEdit.dataset.taskId;
  dialog.showModal();
};

export const handleCloseEditTask = (e) => {
  const closeBtn = e.target.closest(".modal-edit__close");
  if (!closeBtn) return false;

  const dialog = document.querySelector(".modal-edit");
  dialog.close();
};

// Editar tareas ____________________________________________________________________

export const editTask = (e) => {
  const inputText = e.target.closest(".modal-edit__form--text");
  const editBtn = e.target.closest(".modal-edit__form--edit");

  if (!inputText && !editBtn) return;
  e.preventDefault();
  const dialog = e.target.closest(".modal-edit");

  const textArea = inputText || dialog.querySelector(".modal-edit__form--text");
  const editButton = editBtn || dialog.querySelector(".modal-edit__form--edit");

  removeReadOnly(textArea);
  textArea.focus();

  showElement(dialog.querySelector(".modal-edit__form--btn--container"));
  hideElement(editButton);
};

export const saveEditTask = (e) => {
  const saveBtn = e.target.closest(".modal-edit__form--save");
  if (!saveBtn) return;

  const dialog = saveBtn.closest("dialog");
  const taskId = dialog.dataset.taskId;
  const modifiedText = dialog.querySelector(".modal-edit__form--text").value;

  // Actualizar tarea en la UI
  const task = document.querySelector(`[data-task-id="${taskId}"]`);
  const taskText = task.querySelector(".task-text");

  if (!modifiedText.trim()) return; // alert("El nombre de la tarea no puede estar vacío") //

  taskText.textContent = modifiedText;

  const newData = { text: modifiedText };

  // Actualiza localStrorage

  updateData("559954e3-59a0-40ea-9979-e30ee5dff274", "tasks", taskId, newData);

  // Resetear valores por defecto de la UI

  setReadOnly(dialog.querySelector(".modal-edit__form--text"));
  hideElement(dialog.querySelector(".modal-edit__form--btn--container"));
  showElement(dialog.querySelector(".modal-edit__form--edit"));
};

export const cancelEditTask = (e) => {
  const cancelBtn = e.target.closest(".modal-edit__form--cancel");
  if (!cancelBtn) return;

  e.preventDefault();
  const dialog = e.target.closest(".modal-edit");

  // Resetear texto original

  const taskId = dialog.dataset.taskId;
  const task = document.querySelector(`[data-task-id="${taskId}"]`);
  const originText = task.querySelector(".task-text").textContent;
  dialog.querySelector(".modal-edit__form--text").value = originText.trim();

  // Resetear valores por defecto de la UI
  hideElement(dialog.querySelector(".modal-edit__form--btn--container"));
  showElement(dialog.querySelector(".modal-edit__form--edit"));
  setReadOnly(dialog.querySelector(".modal-edit__form--text"));
};

const hideElement = (element) => element.classList.add("hidden");

const showElement = (element) => element.classList.remove("hidden");

const removeReadOnly = (element) => element.removeAttribute("readonly");

const setReadOnly = (element) => element.setAttribute("readonly", true);

// Manejadores de eventos ___________________________________________________________

//  Abriendo el menú de opciones
export const handleActionButton = (e) => {
  const actionBtn = e.target.closest(".task-action");

  if (!actionBtn) return false;

  const column = e.target.closest("section");
  const task = e.target.closest("li");
  const optionMenu = task.querySelector(".task-action__group");
  if (isOpen(optionMenu)) {
    close(optionMenu);
  } else {
    closeAllActions();
    open(optionMenu);
    updateOptions(column, optionMenu);
  }
  return true;
};

// clickeando una opción para mover la tarea

export const handleMoveAction = (e) => {
  const moveActions = e.target.closest(".task-action__option");
  
  if (!moveActions) return false;

  closeAllActions();
  const boardId = "559954e3-59a0-40ea-9979-e30ee5dff274" // docuement.querySelector(".bord").dataset.boardId
  const columnTarget = moveActions.value; 
  const task = e.target.closest("li");
  moveToCol(boardId, columnTarget, task);
  return true;
};

// Acciones _________________________________________________________________________________

const moveToCol = (boardId, idColumnTarget, task) => {  
  const column = document.querySelector(`[data-column-id="${idColumnTarget}"]`)
  const taskContainer = column.querySelector(".task-list")
  taskContainer.appendChild(task);
  const taskId = task.dataset.taskId;
  const number = getPosition(taskContainer);
  changePosition(task, number);
  updateData(boardId, "tasks", taskId, { columnId: idColumnTarget, position: number });
};

const updateOptions = (column, optionGroup) => {
  const allOptions = optionGroup.querySelectorAll(".task-action__option");

  allOptions.forEach((option) => {
    if (option.value != column.dataset.columnId) {
      option.classList.remove("hidden");
    } else {
      option.classList.add("hidden");
    }
  });
};

const getPosition = (column) => {
  return column.querySelectorAll(".task").length;
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

    idOriginColumn = e.target.closest(".task-column").dataset.columnId;
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

  idDestinyColumn = taskList.closest(".task-column").dataset.columnId;
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

  const origin = document.querySelector(`[data-column-id="${idOriginColumn}"]`); 
  const destiny = document.querySelector(`[data-column-id="${idDestinyColumn}"]`);

  if (!origin || !destiny) return;

  const updateColumnTask = (list, columnState) => {
    list.forEach((task, index) => {
      const position = index + 1;
      changePosition(task, position);
      updateData(
        "525350dd-2141-4ab3-9c6e-0f6331ee6de5", 
        "tasks", task.dataset.taskId, {
        columnId: columnState,
        position: position,
      });
    });
  };

  updateColumnTask(
    origin.querySelectorAll(".task"),
    origin.dataset.columnId
  );

  if (origin === destiny) return;

  updateColumnTask(
    destiny.querySelectorAll(".task"),
    destiny.dataset.columnId
  );
};