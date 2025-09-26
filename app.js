const inputTask = document.getElementById("task-form-input");
const form = document.getElementById("task-form");

const newTaskList = document.getElementById("task-list-new");
const scheduledTaskList = document.getElementById("task-list-scheduled");
const inProgressTaskList = document.getElementById("task-list-in-progress");
const doneTaskList = document.getElementById("task-list-done");

const filterBtn = document.getElementById("task-filter");
const filterOptions = document.querySelectorAll(".task-filter__option");
const filterGroup = document.getElementById("task-filter-group");


// Inicio de la aplicación

document.addEventListener("DOMContentLoaded", () => {
  renderTasks(getAllTasks());
  loadFilter(getFilter())
});

// Nueva tarea ______________________________________________________________________

form.addEventListener("submit", (e) => {
  e.preventDefault();
  newTask(inputTask.value);
});

const newTask = (newText) => {
  const task = { text: newText, state: "new" };
  saveTask(task);
  renderTasks([task]);
  inputTask.value = "";
};

// Renderizar tareas ________________________________________________________________

const renderTasks = (taskList) => {
  for (let i = 0; i < taskList.length; i++) {
    const taskCode = `
        <li class="task">
              <span class="task-text">
                ${taskList[i].text}</span>              
              <section class="task-action__group hidden">
                <h5 class="task-action__title">Mover a tareas</h5>
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
    taskList[i].state === "new" ? (newTaskList.innerHTML += taskCode) : 0;
    taskList[i].state === "scheduled"
      ? (scheduledTaskList.innerHTML += taskCode)
      : 0;
    taskList[i].state === "in-progress"
      ? (inProgressTaskList.innerHTML += taskCode)
      : 0;
    taskList[i].state === "done" ? (doneTaskList.innerHTML += taskCode) : 0;
  }
};

// Filtro _____________________________________________________________

filterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  filterGroup.classList.toggle("hidden");
});

filterOptions.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    filterGroup.classList.toggle("hidden");
    const selected = e.target.closest("button");
    filter(selected)
    saveFilter(selected.value)
  });
});

const filter = (selected) => {      
    const column = getColumn(selected.value);
    hideColumn();
    showColumn(column);
    updatemenu(selected);
    changeSelectName(selected.value);
    
}

const getColumn = (selected) => {
  let columnId = "";
  selected === "new" ? (columnId = "task-new") : "";
  selected === "scheduled" ? (columnId = "task-scheduled") : "";
  selected === "in-progress" ? (columnId = "task-in-progress") : "";
  selected === "done" ? (columnId = "task-done") : "";

  return document.getElementById(columnId).closest("section");
};

const changeSelectName = (selected) => {
  let name = "";

  selected === "new" ? (name = " Nuevas") : "";
  selected === "scheduled" ? (name = " Programadas") : "";
  selected === "in-progress" ? (name = " Iniciadas") : "";
  selected === "done" ? (name = " Finalizadas") : "";

  filterBtn.children[0].children[0].innerHTML = name;
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

const updatemenu = (selected) => {
  const option = document.querySelector(".task-filter__option.hidden");
  option.classList.remove("hidden");
  selected.classList.add("hidden");
};

const loadFilter = (filterValue) => {
  const selected = document.querySelector(`[value=${filterValue}]`)
  const column = getColumn(selected.value);
  hideColumn();
  showColumn(column);
  updatemenu(selected);
  changeSelectName(selected.value);
}

// LocalStorage _____________________________________________________________________________

// --- LocalStorage-Filtro

const saveFilter = (value) => {
  localStorage.setItem('filter', value)
}

const getFilter = () => { 
  return localStorage.getItem('filter')
}

// --- LocalStorage-Tareas

const saveTask = (task) => {
  let allTasks = getAllTasks();
  allTasks.push(task);
  localStorage.setItem("allTasks", JSON.stringify(allTasks));
};

const getAllTasks = () => {
  return JSON.parse(localStorage.getItem("allTasks")) || [];
};



