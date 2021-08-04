import {createMenuTemplate} from './view/menu.js';
import {createFilterTemplate} from './view/filter.js';
import {createProfileTemplate} from './view/profile.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {generatefilmCard} from './mock/film-card.js';
import {createShowMoreButton} from './view/show-more.js';
import {createFilmsQuantity} from './view/films-quantity.js';
import {createFilmPopupTemplate} from './view/popup.js';

const CARD_COUNT = 20;
const CARD_COUNT_PER_STEP = 5;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const cards = new Array(CARD_COUNT).fill().map(generatefilmCard);

const siteMainElement = document.querySelector('.main');

render(siteMainElement, createMenuTemplate(), 'afterbegin');
render(siteMainElement, createFilterTemplate(), 'afterbegin');

const headerElement = document.querySelector('.header');

render(headerElement, createProfileTemplate(), 'beforeend');

const filmListContainer = siteMainElement.querySelector('.films-list__container');

for (let i = 0; i < CARD_COUNT_PER_STEP; i++) {
  render(filmListContainer, createFilmCardTemplate(cards[i]), 'beforeend');
}

const quantityElement = document.querySelector('.footer__statistics');

render(quantityElement, createFilmsQuantity(), 'beforeend');
render(siteMainElement, createFilmPopupTemplate(), 'beforeend');


const popupSection = document.querySelector('.film-details');
const closePopupButton = document.querySelector('.film-details__close-btn');
const transparentButton = document.getElementsByClassName('transparent');

const tooglePopup = () => {
  for (const item of transparentButton) {
    item.addEventListener('click', (evt) => {
      evt.preventDefault();
      popupSection.style.display = 'block';
    });
  }

  closePopupButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    popupSection.style.display = 'none';
  });
};


if (cards.length > CARD_COUNT_PER_STEP) {
  let renderedTaskCount = CARD_COUNT_PER_STEP;

  render(siteMainElement, createShowMoreButton(), 'beforeend');

  const loadMoreButton = document.querySelector('.films-list__show-more');

  tooglePopup();

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    cards
      .slice(renderedTaskCount, renderedTaskCount + CARD_COUNT_PER_STEP)
      .forEach((card) => render(filmListContainer, createFilmCardTemplate(card), 'beforeend'));

    renderedTaskCount += CARD_COUNT_PER_STEP;

    if (renderedTaskCount >= cards.length) {
      loadMoreButton.remove();
    }
    tooglePopup();
  });
}


