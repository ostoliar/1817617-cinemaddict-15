import SiteMenuView from './view/menu.js';
import FilmFilterView from './view/filter.js';
import ProfileDetailsView from './view/profile.js';
import {generatefilmCard} from './mock/film-card.js';
import FilmQuantityView from './view/films-quantity.js';
import FilmDetailsView from './view/popup.js';
import {render, RenderPosition} from './utils/render.js';
import BoardPresenter from './presenter/movie.js';


const CARD_COUNT = 20;


export const cards = new Array(CARD_COUNT).fill().map(generatefilmCard);
const siteMainElement = document.querySelector('.main');


render(siteMainElement, new SiteMenuView().getElement(), RenderPosition.AFTERBEGIN);
render(siteMainElement, new FilmFilterView().getElement(), RenderPosition.AFTERBEGIN);

const headerElement = document.querySelector('.header');

render(headerElement, new ProfileDetailsView().getElement(), RenderPosition.BEFOREEND);

const quantityElement = document.querySelector('.footer__statistics');

render(quantityElement, new FilmQuantityView().getElement(), RenderPosition.BEFOREEND);

render(siteMainElement, new FilmDetailsView().getElement(), RenderPosition.BEFOREEND);

const popupSection = document.querySelector('.film-details');
const closePopupButton = document.querySelector('.film-details__close-btn');
const transparentButton = document.getElementsByClassName('transparent');

export const tooglePopup = () => {
  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      popupSection.style.display = 'none';
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  for (const item of transparentButton) {
    item.addEventListener('click', (evt) => {
      evt.preventDefault();
      popupSection.style.display = 'block';
      document.addEventListener('keydown', onEscKeyDown);
    });
  }

  closePopupButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    popupSection.style.display = 'none';
  });
};


const boardPresenter = new BoardPresenter(siteMainElement);

boardPresenter.init(cards);
