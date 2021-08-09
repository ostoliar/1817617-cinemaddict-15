import SiteMenuView from './view/menu.js';
import FilmFilterView from './view/filter.js';
import ProfileDetailsView from './view/profile.js';
import FilmCardView from './view/film-card.js';
import {generatefilmCard} from './mock/film-card.js';
import ShowMoreButtonView from './view/show-more.js';
import FilmQuantityView from './view/films-quantity.js';
import FilmDetailsView from './view/popup.js';
import {render, RenderPosition} from './utils.js';
import BoardView from './view/board.js';
import CardListView from './view/card-list.js';


const CARD_COUNT = 20;
const CARD_COUNT_PER_STEP = 5;


const cards = new Array(CARD_COUNT).fill().map(generatefilmCard);
const siteMainElement = document.querySelector('.main');

const renderCard = (container, card) => {
  render(container, new FilmCardView(card).getElement(), RenderPosition.BEFOREEND);
};


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

const tooglePopup = () => {
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

const renderCards = (boardContainer, boardCards) => {
  const boardComponent = new BoardView();
  const cardListComponent = new CardListView();

  render(boardContainer, boardComponent.getElement(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), cardListComponent.getElement(), RenderPosition.BEFOREEND);


  boardCards
    .slice(0, Math.min(cards.length, CARD_COUNT_PER_STEP))
    .forEach((boardCard) => renderCard(cardListComponent.getElement(), boardCard));

  if (cards.length > CARD_COUNT_PER_STEP) {
    let renderedCardCount = CARD_COUNT_PER_STEP;

    const loadMoreButtonComponent = new ShowMoreButtonView();

    render(boardComponent.getElement(), loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);
    tooglePopup();

    loadMoreButtonComponent.getElement().addEventListener('click', (evt) => {
      evt.preventDefault();
      cards
        .slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
        .forEach((boardCard) => renderCard(cardListComponent.getElement(), boardCard));

      renderedCardCount += CARD_COUNT_PER_STEP;

      if (renderedCardCount >= cards.length) {
        loadMoreButtonComponent.getElement().remove();
        loadMoreButtonComponent.removeElement();
      }

      tooglePopup();

    });
  }
};

renderCards(siteMainElement, cards);
