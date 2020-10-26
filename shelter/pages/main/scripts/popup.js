const popupBlackout = document.querySelector('.popup__blackout');
const popup = document.querySelector('.popup');
const popupContent = document.querySelector('.popup__content');
const closeButton = document.querySelector('.popup__close');

document.querySelectorAll('.gallery__item').forEach(item => {
  item.addEventListener('click', () => {
    popupContent.innerHTML = '';
    insertCard(item);
    popup.classList.add('visible');
    document.body.classList.add('lock');
  });
});

closeButton.addEventListener('click', () => {
  popup.classList.remove('visible');
  document.body.classList.remove('lock');
});

popupBlackout.addEventListener('click', () => {
  popup.classList.remove('visible');
  document.body.classList.remove('lock');
});

function insertCard(card) {
  pets.forEach(pet => {
    if (pet['name'] === card.children[0].children[1].innerText) {
      popupContent.insertAdjacentHTML('beforeend', 
      `<div class="popup__column">
          <img src="${pet.img}" alt="${pet.type} ${pet.name}">
      </div>
      <div class="popup__column">
          <h2 class="popup__title">${pet.name}</h2>
          <p class="popup__pet-type">${pet.type} - ${pet.breed}</p>
          <p class="popup__pet-description">${pet.description}</p>
          <ul class="popup__list-info">
              <li class="popup__list-item"><span class="list-item__bold">Age: </span><span class="list-item__normal">${pet.age}</span></li>
              <li class="popup__list-item"><span class="list-item__bold">Inoculations: </span><span class="list-item__normal">${pet.inoculations}</span></li>
              <li class="popup__list-item"><span class="list-item__bold">Diseases: </span><span class="list-item__normal">${pet.diseases}</span></li>
              <li class="popup__list-item"><span class="list-item__bold">Parasites: </span><span class="list-item__normal">${pet.parasites}</span></li>
          </ul>
      </div>`);
    }
  })
}