import { actualDate, idGenerator } from "./utils.js";

// LocalStorage _____________________________________________________________________________

const STORAGE_KEY = "boardsData";

export const getData = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { boards: [] };
};

const saveData = (allData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
};

// --- Tablero actual

export const setCurrentBoard = (boardId) => {
  localStorage.setItem("currentBoard", boardId)
}

export const getCurrentBoard = () => {
  return localStorage.getItem("currentBoard")
}


// --- LocalStorage-Filtro

export const getFilter = (boardId) => {
  const data = getData();
  const board = data.boards.find(board => board.id === boardId);
  
  let filter = board.columnFilter
  if (!filter) {
    filter = board.columns[0].id;
    saveFilter(boardId, filter)
  }
  return filter;
};

export const saveFilter = (boardId, filter) => {
  const allData = getData();
  const boardIndex = allData.boards.findIndex((board) => board.id === boardId);
  allData.boards[boardIndex].columnFilter = filter
  saveData(allData)
} 

// Inicialización del local storage de los tableros

const boardTemplate = () => {
  let boardName = "Nuevo tablero"
  if (!getData().boards.length) boardName = "Mi primer tablero"
  console.log(boardName)
  
  return {
    id: idGenerator(),
    boardName: boardName,
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
    columnFilter: null,
    history: [],
  };
};

export const taskTemplate = (title, columnId, position) => {
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

export const initializeStorage = () => saveData({ boards: [boardTemplate()] });

export const initData = () => {
  console.log("Inicializando")
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!data) initializeStorage();
};

// --- Local Storage Tableros

export const newBoard = () => {
  let allBoards = getData();

  allBoards.boards.push(boardTemplate());
  console.log(allBoards);
  saveData(allBoards);
};

export const updateBoard = (boardId, boardData) => {
  const allData = getData();
  const boardIndex = allData.boards.findIndex((board) => board.id === boardId);
  if (boardIndex === -1) return;

  allData.boards[boardIndex] = { ...allData.boards[boardIndex], ...boardData };
  console.log(allData);
  saveData(allData);
};

// Para guardar columnas, tareas y etiquetas

export const saveNewData = (boardId, keyData, newData) => {
  const allData = getData();
  const board = allData.boards.find((board) => board.id === boardId);
  console.log(board[keyData])
  if (!board ) return console.log("Mal");
  board[keyData].push(newData);
  console.log(board)
  saveData(allData);
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

  saveData(allData);
};