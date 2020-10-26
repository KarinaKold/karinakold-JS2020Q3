const header = document.querySelector('.header__inner');
const nav = document.querySelector('.nav');
const bureger = document.querySelector('.header__burger');
const overlay = document.querySelector('.header__overlay-burger');

const burgerClick = () => {
  header.classList.toggle('header__inner-burger');
  nav.classList.toggle('nav__burger-display');
  bureger.classList.toggle('header__burger-rotate');
  overlay.classList.toggle('header__overlay-burger-visible');
  document.body.classList.toggle('lock');
}

document.querySelector('.header__burger').addEventListener('click', burgerClick);
document.querySelector('.header__overlay-burger').addEventListener('click', burgerClick);