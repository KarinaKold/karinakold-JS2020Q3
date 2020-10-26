const sliderTrack = document.querySelector('.slider__track');
const slides = document.querySelectorAll('.gallery__item');
const buttons = document.querySelectorAll('.slider__arrow');
const file = 'https://rolling-scopes-school.github.io/karinakold-JS2020Q3/shelter/pets.json';

let pets = [];
let previousElements = [4, 0, 2];
let newElements = [];

function insertItems(newElements) {
  let i = 0;
  newElements.forEach(element => {
    slides[i].insertAdjacentHTML('beforeend', 
    `<article class="gallery__item-article">
        <img class="article__image" src="${pets[element].img}" alt="${pets[element].type} ${pets[element].name}">
        <h3 class="article__title">${pets[element].name}</h3>
        <a href="javascript:void(0)" class="gallery__button">Learn more</a>
    </article>`);
    i += 1;
  });
  slides.forEach(slide => {
    slide.classList.add('fade');
  })
}

fetch(file)
  .then(responce => responce.json())
  .then(petsFromResponce => {
    pets = petsFromResponce;
    insertItems(previousElements);
  })

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function setNewElements() {
  let newElement;
  newElements = [];
  for (let i = 0; i < 3; i++) {
    newElement = randomInt(0, 7);
    while (previousElements.indexOf(newElement) !== -1 || newElements.indexOf(newElement) !== -1) {
      newElement = randomInt(0, 7);
    }
    newElements.push(newElement);
  }
  previousElements = newElements.slice();
}

function deletePreviousElements() {
  slides.forEach(slide => {
    slide.classList.remove('fade');
  })
  setTimeout(() => {
    slides.forEach(slide => {
      while (slide.firstChild) {
        slide.removeChild(slide.firstChild);
      }
    });
  }, 200);
}
buttons.forEach(item => {
  item.addEventListener('click', () => {
    setNewElements();
    deletePreviousElements();
    setTimeout(() => {
      insertItems(newElements);
    }, 200);
  })
})