const popupBlackout = document.querySelector('.popup__blackout');
const popup = document.querySelector('.popup');
const popupContent = document.querySelector('.popup__content');
const closeButton = document.querySelector('.popup__close');

closeButton.addEventListener('click', () => {
  popup.classList.remove('visible');
  document.body.classList.remove('lock');
});

popupBlackout.addEventListener('click', () => {
  popup.classList.remove('visible');
  document.body.classList.remove('lock');
});

function insertCard(card, data) {
  for (let i = 0; i < data.length; i++) {
    if (data[i]['name'] === card.children[0].children[1].innerText) {
      popupContent.insertAdjacentHTML('beforeend', 
      `<div class="popup__column">
          <img src="${data[i].img}" alt="${data[i].type} ${data[i].name}">
      </div>
      <div class="popup__column">
          <h2 class="popup__title">${data[i].name}</h2>
          <p class="popup__pet-type">${data[i].type} - ${data[i].breed}</p>
          <p class="popup__pet-description">${data[i].description}</p>
          <ul class="popup__list-info">
              <li class="popup__list-item"><span class="list-item__bold">Age: </span><span class="list-item__normal">${data[i].age}</span></li>
              <li class="popup__list-item"><span class="list-item__bold">Inoculations: </span><span class="list-item__normal">${data[i].inoculations}</span></li>
              <li class="popup__list-item"><span class="list-item__bold">Diseases: </span><span class="list-item__normal">${data[i].diseases}</span></li>
              <li class="popup__list-item"><span class="list-item__bold">Parasites: </span><span class="list-item__normal">${data[i].parasites}</span></li>
          </ul>
      </div>`);
      return;
    }
  }
}