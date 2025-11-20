import { initBoardPage } from "./boardView.js";
import { initData } from "./storage.js";
import { initBoardsList } from "./homeView.js";

// Inicialización de la aplicación
document.addEventListener("DOMContentLoaded", () => {
  initData();  
  const currentPage = document.body.dataset.page;
  if (currentPage === "home") initBoardsList();
  if (currentPage === "board") initBoardPage();
});