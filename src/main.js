import {createMenuTemplate} from './view/menu.js';
import {createFilterTemplate} from './view/filter.js';
import {createProfileTemplate} from './view/profile.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createShowMoreButton} from './view/show-more.js';

const CARD_COUNT = 5;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.main');

render(siteMainElement, createMenuTemplate(), 'afterbegin');
render(siteMainElement, createFilterTemplate(), 'afterbegin');

const headerElement = document.querySelector('.header');

render(headerElement, createProfileTemplate(), 'beforeend');

const filmListContainer = siteMainElement.querySelector('.films-list__container');

for (let i = 0; i < CARD_COUNT; i++) {
  render(filmListContainer, createFilmCardTemplate(), 'beforeend');
}

render(siteMainElement, createShowMoreButton(), 'beforeend');


