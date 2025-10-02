export const isOpen = (element) => {
  return element.classList.contains("open");
};

export const closeAllActions = () => {
  const openedMenu = document.querySelectorAll(".open");
  if (openedMenu.length > 0) {
    for (let i = 0; i < openedMenu.length; i++) {
      openedMenu[i].classList.add("hidden");
      openedMenu[i].classList.remove("open");
    }
  }
};