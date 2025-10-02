// LocalStorage _____________________________________________________________________________

// --- LocalStorage-Filtro

export const saveFilter = (value) => {
  localStorage.setItem("filter", value);
};

export const getFilter = () => {
  return localStorage.getItem("filter");
};

// --- LocalStorage-Tareas

export const saveTask = (task) => {
  let allTasks = getAllTasks();
  allTasks.push(task);
  localStorage.setItem("allTasks", JSON.stringify(allTasks));
};

export const getAllTasks = () => {
  return JSON.parse(localStorage.getItem("allTasks")) || [];
};

export const updateTask = (id, key, value) => {
  let allTasks = getAllTasks();

  for (let i = 0; i < allTasks.length; i++) {
    if (allTasks[i].taskId === +id) {
      allTasks[i][key] = value;
    }
  }
  localStorage.setItem("allTasks", JSON.stringify(allTasks));
};