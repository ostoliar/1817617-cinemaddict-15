import ShowMoreButtonView from '../view/show-more.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {sortByDate, sortByRating} from '../utils/card.js';
import {tooglePopup} from '../main.js';
import BoardView from '../view/board.js';
import CardListView from '../view/card-list.js';
import SortView from '../view/filter.js';
import CardPresenter from './card.js';
import {SortType, CARD_COUNT_PER_STEP, siteMainElement} from '../const.js';

export default class Board {
  constructor(cardContainer) {
    this._cardContainer = cardContainer;
    this._renderedCardCount = CARD_COUNT_PER_STEP;
    this._boardComponent = new BoardView();
    this._sortComponent = new SortView();
    this._cardListComponent = new CardListView();
    this._loadMoreButtonComponent = new ShowMoreButtonView();
    this._currentSortType = SortType.DEFAULT;
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
  }

  init(boardCards) {
    this._boardCards = boardCards.slice();
    this._sourcedBoardCards = boardCards.slice();

    render(this._cardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._cardListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
    this._renderSort();
  }


  _sortTasks(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._boardCards.sort(sortByDate);
        break;
      case SortType.RATING:
        this._boardCards.sort(sortByRating);
        break;
      default:
        this._boardCards = this._sourcedBoardCards.slice();
    }

    this._currentSortType = sortType;
  }

  _renderSort() {
    render(siteMainElement, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderCard(card) {
    const cardPresenter = new CardPresenter(this._cardListComponent);
    cardPresenter.init(card);
  }

  _renderCards(from, to) {
    this._boardCards
      .slice(from, to)
      .forEach((boardCard) => this._renderCard(boardCard));
  }


  _handleLoadMoreButtonClick() {
    this._renderCards(this._renderedCardCount, this._renderedCardCount + CARD_COUNT_PER_STEP);
    this._renderedCardCount += CARD_COUNT_PER_STEP;

    tooglePopup();

    if (this._renderedCardCount >= this._boardCards.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._boardComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);

    tooglePopup();

    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
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
