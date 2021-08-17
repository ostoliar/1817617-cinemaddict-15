import FilmCardView from '../view/film-card.js';
import ShowMoreButtonView from '../view/show-more.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {tooglePopup} from '../main.js';
import BoardView from '../view/board.js';
import CardListView from '../view/card-list.js';

const CARD_COUNT_PER_STEP = 5;


export default class Board {
  constructor(cardContainer) {
    this._cardContainer = cardContainer;

    this._boardComponent = new BoardView();
    this._cardListComponent = new CardListView();
  }

  init(boardCards) {
    this._boardCards = boardCards.slice();

    render(this._cardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._cardListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _renderCard(card) {
    const cardComponent = new FilmCardView(card);
    render(this._cardListComponent, cardComponent, RenderPosition.BEFOREEND);
  }

  _renderCards(from, to) {
    this._boardCards
      .slice(from, to)
      .forEach((boardCard) => this._renderCard(boardCard));
  }


  _renderLoadMoreButton() {
    let renderedCardCount = CARD_COUNT_PER_STEP;

    const loadMoreButtonComponent = new ShowMoreButtonView();

    render(this._boardComponent, loadMoreButtonComponent, RenderPosition.BEFOREEND);
    tooglePopup();

    loadMoreButtonComponent.setClickHandler(() => {
      this._boardCards
        .slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
        .forEach((boardCard) => this._renderCard(boardCard));

      renderedCardCount += CARD_COUNT_PER_STEP;

      if (renderedCardCount >= this._boardCards.length) {
        remove(loadMoreButtonComponent);
      }

      tooglePopup();

    });
  }

  _renderCardList() {
    this._renderCards(0, Math.min(this._boardCards.length, CARD_COUNT_PER_STEP));

    if (this._boardCards.length > CARD_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }

  _renderBoard() {
    this._renderCardList();
  }
}
