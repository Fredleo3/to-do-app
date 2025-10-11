// LocalStorage _____________________________________________________________________________

// --- LocalStorage-Filtro

export const saveFilter = (value) => {
  localStorage.setItem("filter", value);
};

export const getFilter = () => {
  let filter = localStorage.getItem("filter");
  if (!filter) {
    filter = "new"
    saveFilter(filter)
  }
  return filter
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

export const updateTask = (id, stateKey, stateValue, posKey, posValue) => {
  const allTasks = getAllTasks().map(task => {
    if (task.taskId === +id) {
      return {...task, [stateKey]: stateValue, [posKey]: posValue}
    }
    return task
  });

  localStorage.setItem("allTasks", JSON.stringify(allTasks));
};
