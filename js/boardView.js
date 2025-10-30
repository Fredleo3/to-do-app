import { renderTasks } from "./tasksView.js";
import { getFilter } from "./storage.js"
import { changeSelectName } from "./filter.js"

export const renderBoard = (data, boardId) => {
  const board = data.boards.find((board) => board.id === boardId);
  if (board === -1) return;
  // TODO Lógica para renderizar el tablero
  renderColumns(data, board);
};

const renderColumns = (data, board) => {
  const columnsContainer = document.querySelector(".task-columns__container");
  const filterMenu = document.querySelector(".task-filter__group")
  const filter = getFilter("525350dd-2141-4ab3-9c6e-0f6331ee6de5")
  
  board.columns.map((column) => {
    columnsContainer?.insertAdjacentHTML("beforeend", columnTemplate(column.id, column.columnName, filter))  
    filterMenu?.insertAdjacentHTML("beforeend", columnFilterTemplate(column.id, column.columnName, filter))
    }
  );
  renderTasks(board.tasks);
};

const columnTemplate = (columnId, columnName, filter) => {

  let selected = "";
  if (filter === columnId ) {
    selected =  "column-selected"
    changeSelectName(columnName)
  } else {selected = "hidden"} 

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

const columnFilterTemplate = (columnId, columnName, filter) => {
let active = ""
columnId === filter ? active = "hidden" : active = ""
  return `
          <button class="task-filter__option ${active}" value=${columnId}>
            ${columnName}
          </button>
  `;
};

