import { renderTasks } from "./tasksView.js"

export const renderBoard = (data, boardId) => {
  
  const board = data.boards.find(board => board.id === boardId) 
  if (board === -1) return;
  // TODO Lógica para renderizar el tablero
  renderColumns(data, board);
};

const renderColumns = (data, board) => {
  const columnsContainer = document.querySelector(".task-columns__container");
  
  board.columns.map(column =>
    columnsContainer?.insertAdjacentHTML("beforeend", columnTenplate(column.id, column.columnName))
   ); 
  renderTasks(board) 
};

const columnTenplate = (columnId, columnName, selected = "") => {
  return `
    <section
          class="task-column ${selected}"
          data-column-id="${columnId}"
        >
          <h3 class="task-columns__title">${columnName}</h3>

          <ul class="task-list">
          
          </ul>

          <section class="task-form__section">
            <button class="task-form__opener">
              <span class="material-symbols-outlined">add</span
              ><span>Agregar tarea</span>
            </button>

            <form action="submit" class="task-form hidden">
              <textarea
                class="task-form__input"
                type="text"
                placeholder="Tarea nueva"
                required
                placeholder="Escribe el título de la tarea"
              ></textarea>
              <button class="task-form__submit" type="submit">Agregar</button>
            </form>
          </section>
        </section>
  `;
};

