// Generating
const file = 'https://rolling-scopes-school.github.io/karinakold-JS2020Q3/shelter/pets.json';
let pets = [];
let startElements = [4, 0, 2, 1, 5, 7, 3, 6];

fetch(file)
  .then(responce => responce.json())
  .then(petsFromResponce => {
    pets = generateItemsSequence(petsFromResponce);
    checkWindowSize();
    displayList(pets, elementsList, elementsToShow, currentPage);
    setupPagination(pets, elementsList, elementsToShow);
  })

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function generateIndexesSequence() {
  let indexSequence = [];
  let uniqueIndex;
  for (let i = 0; i < 8; i++) {
    uniqueIndex = randomInt(0, 7);
    while (indexSequence.indexOf(uniqueIndex) !== -1) {
      uniqueIndex = randomInt(0, 7);
    }
    indexSequence.push(uniqueIndex);
  }
  return indexSequence;
}

function generateItemsSequence(items) {
  let itemsSequence = [];
  let indexes= [];
  startElements.forEach(element => {
    itemsSequence.push(items[element]);
  })
  for (let i = 0; i < 5; i++) {
    indexes = generateIndexesSequence();
    indexes.forEach(element => {
      itemsSequence.push(items[element]);
    });
  }
  return itemsSequence;
}

//
const elementsList = document.querySelector('.friends__list');
const currentButton = document.querySelector('.button__current');
const prevButton = document.querySelector('.button__skip-to-previous');
const nextButton = document.querySelector('.button__skip-to-next');
const firstPageButton = document.querySelector('.button__skip-to-first');
const lastPageButton = document.querySelector('.button__skip-to-last');

let currentPage = 1;
let elementsToShow;
let amountOfPages;
let currentPosition = 0;

function checkWindowSize() {
  if (document.body.offsetWidth >= 1280) {
    elementsToShow = 8;
  } else if (document.body.offsetWidth >= 768) {
    elementsToShow = 6;
  } else {
    elementsToShow = 3;
  }
  amountOfPages = Math.ceil(pets.length / elementsToShow);
  currentPosition = Math.floor(currentPosition / elementsToShow) * elementsToShow;
  currentPage = currentPosition / elementsToShow + 1;
}

function displayList(items, wrapper, itemsToShow, page) {
  wrapper.innerHTML = '';
  page--;

  let start = currentPosition;
  let end = start + itemsToShow;
  let paginatedItems = items.slice(start, end);

  for (let i = 0; i < paginatedItems.length; i++) {
    let item = paginatedItems[i];
    wrapper.insertAdjacentHTML('beforeend', 
    `<li class="friends__item">
      <article class="friends__item-article">
        <img class="article__image" src="${item.img}" alt="${item.type} ${item.name}">
        <h3 class="article__title">${item.name}</h3>
        <a href = "javascript:void(0)" class="friends__item-button">Learn more</a>
      </article>
    </li>`);
  }

  document.querySelectorAll('.friends__item').forEach(item => {
    item.addEventListener('click', () => {
      popupContent.innerHTML = '';
      insertCard(item, pets);
      popup.classList.add('visible');
      document.body.classList.add('lock');
    });
  });

  setTimeout(() => {
    document.querySelectorAll('.friends__item').forEach(element => {
      element.classList.add('fade');
    });
  }, 200);
}

function setupPagination(wrapper) {
  wrapper.innerHTML = '';
  if (currentPage === 1) {
    prevButton.removeEventListener('click', prevPage);
    firstPageButton.removeEventListener('click', firstPage);
    prevButton.classList.add('pagination__unactive');
    firstPageButton.classList.add('pagination__unactive');
    currentPosition = 0;
  } else {
    prevButton.addEventListener('click', prevPage);
    firstPageButton.addEventListener('click', firstPage);
    prevButton.classList.remove('pagination__unactive');
    firstPageButton.classList.remove('pagination__unactive');
  }

  if (currentPage >= amountOfPages) {
    nextButton.removeEventListener('click', nextPage);
    lastPageButton.removeEventListener('click', lastPage);
    nextButton.classList.add('pagination__unactive');
    lastPageButton.classList.add('pagination__unactive');
    if (pets.length % elementsToShow === 0) {
      currentPosition = pets.length - elementsToShow;
    } else {
      currentPosition = pets.length - (pets.length % elementsToShow);
    }
  } else {
    nextButton.addEventListener('click', nextPage);
    lastPageButton.addEventListener('click', lastPage);
    nextButton.classList.remove('pagination__unactive');
    lastPageButton.classList.remove('pagination__unactive');
  }

  if (currentPage > amountOfPages) {
    currentPage = amountOfPages;
  }

  currentButton.innerText = currentPage;
}

// eventlisteners functions
function prevPage() {
  currentPage -= 1;
  currentPosition -= elementsToShow;
  setupPagination(elementsList);
  displayList(pets, elementsList, elementsToShow, currentPage);
}

function nextPage() {
  currentPage += 1;
  currentPosition += elementsToShow;
  setupPagination(elementsList);
  displayList(pets, elementsList, elementsToShow, currentPage);
}

function firstPage() {
  currentPage = 1;
  currentPosition += elementsToShow;
  setupPagination(elementsList);
  displayList(pets, elementsList, elementsToShow, currentPage);
}

function lastPage() {
  currentPage = amountOfPages;
  currentPosition += elementsToShow;
  setupPagination(elementsList);
  displayList(pets, elementsList, elementsToShow, currentPage);
}

// eventlisteners
prevButton.addEventListener('click', prevPage);
nextButton.addEventListener('click', nextPage);
firstPageButton.addEventListener('click', firstPage);
lastPageButton.addEventListener('click', lastPage);

window.addEventListener('resize', function() {
  const previousElementsToShow = elementsToShow;
  checkWindowSize();
  if (previousElementsToShow !== elementsToShow) {    
    setupPagination(elementsList);
    displayList(pets, elementsList, elementsToShow, currentPage);
  }
});