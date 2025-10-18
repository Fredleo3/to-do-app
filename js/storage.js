import { actualDate, idGenerator } from "./utils.js";

// LocalStorage _____________________________________________________________________________

const STORAGE_KEY = "boardsData";

const getData = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { boards: [] };
};

const saveAData = (allData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
};

// --- LocalStorage-Filtro

export const saveFilter = (value) => localStorage.setItem("filter", value);

export const getFilter = () => {
  let filter = localStorage.getItem("filter");
  if (!filter) {
    filter = "new";
    saveFilter(filter);
  }
  return filter;
};

// Inicialización del local storage de los tableros

const boardTemplate = () => {
  return {
    id: idGenerator(),
    boardName: "Nuevo tablero",
    description: "Un nuevo tablero, un nuevo proyecto",
    createdAt: actualDate(),
    updatedAt: null,
    archivedAt: null,
    touchedAt: null,
    columns: [
      {
        id: idGenerator(),
        columnName: "Tareas Nuevas",
        position: 1,
        createdAt: actualDate(),
        updatedAt: null,
        history: [],
      },
      {
        id: idGenerator(),
        columnName: "Tareas Inciadas",
        position: 2,
        createdAt: actualDate(),
        updatedAt: null,
        history: [],
      },
      {
        id: idGenerator(),
        columnName: "Tareas Finalizadas",
        position: 3,
        createdAt: actualDate(),
        updatedAt: null,
        history: [],
      },
    ],
    tasks: [],
    labels: [],
    active: true,
    favorite: false,
    history: [],
  };
};

export const newTask = (title, columnId, position) => {
  return {
    id: idGenerator(),
    text: title,
    description: "",
    columnId: columnId,
    labelIds: [], 
    priority: "Normal",
    active: true,
    position: position,
    favorite: false,
    createdAt: actualDate(),
    updatedAt: null,
    touchedAt: null,
    archivedAt: null,
    history: [],
  };
};

export const initializeStorage = () => saveAData({ boards: [boardTemplate()] });

// ---------------------

export const initData = () => {
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!data) initializeStorage();
};

// --- Local Storage Tableros

export const newBoard = () => {
  let allBoards = getData();

  allBoards.boards.push(boardTemplate());
  console.log(allBoards);
  saveAData(allBoards);
};

export const updateBoard = (boardId, boardData) => {
  const allData = getData();
  const boardIndex = allData.boards.findIndex((board) => board.id === boardId);
  if (boardIndex === -1) return;

  allData.boards[boardIndex] = { ...allData.boards[boardIndex], ...boardData };
  console.log(allData);
  saveAData(allData);
};

// newBoard()

// updateBoard("70e63738-1ac4-489f-a624-60d746ce057c", {boardName: "Trabajos"})

// Para guardar columnas, tareas y etiquetas
export const saveNewData = (boardId, keyData, newData) => {
  const allData = getData();
  const board = allData.boards.find((board) => board.id === boardId);
  if (!board || !Array.isArray(board[keyData])) return;
  board[keyData].push(newData);
  saveAData(allData);
};

export const updateData = (boardId, keyData, idData, newData) => {
  const allData = getData();
  const boardIndex = allData.boards.findIndex((board) => board.id === boardId);
  if (boardIndex === -1) return;
  const dataIndex = allData.boards[boardIndex][keyData].findIndex(
    (el) => el.id === idData
  );
  if (dataIndex === -1) return;
  allData.boards[boardIndex].updatedAt = actualDate(); // Revisar como sincronizar esta fecha de modificado con la fecha de midificado de las tareas
  allData.boards[boardIndex][keyData][dataIndex] = {
    ...allData.boards[boardIndex][keyData][dataIndex],
    ...newData,
  };

  saveAData(allData);
};

// saveNewInfo ( "4653214f-fa5f-44a6-8af4-2b7e634745e2", "tasks", {id: 1760323919811, text: "Nueva tarea 1", state: "new", position: 1} )

// updateData("4653214f-fa5f-44a6-8af4-2b7e634745e2", "tasks", 1760323919811, {state: "nuevo estado", position: 10})
