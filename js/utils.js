export const open = (element) => {  
  element.classList.remove("hidden")
  element.classList.add("open")
}

export const close = (element) => {
  element.classList.remove("open")
  element.classList.add("hidden")
}

export const isOpen = (element) => {
  return element.classList.contains("open");
};

export const showOpenerForm = () => {
  const openers = document.querySelectorAll(".task-form__opener");
  openers.forEach(element => {
    element.classList.remove("hidden")
  });
}

export const closeAllActions = () => {
  const openedMenu = document.querySelectorAll(".open");
  if (openedMenu.length > 0) {
    for (let i = 0; i < openedMenu.length; i++) {
      openedMenu[i].classList.add("hidden");
      openedMenu[i].classList.remove("open");
    }
  }
};

export const actualDate = () => new Date().toISOString();
export const idGenerator = () => crypto.randomUUID();


export const hideElement = (element) => element.classList.add("hidden");

export const showElement = (element) => element.classList.remove("hidden");

export const removeReadOnly = (element) => element.removeAttribute("readonly");

export const setReadOnly = (element) => element.setAttribute("readonly", true);