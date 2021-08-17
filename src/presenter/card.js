import FilmCardView from '../view/film-card.js';
import {render, RenderPosition} from '../utils/render.js';


export default class Card {
  constructor(cardListContainer) {
    this._cardListContainer = cardListContainer;

    this._cardComponent = null;
  }


  init(card) {
    this._card = card;

    this._cardComponent = new FilmCardView(card);

    render(this._cardListContainer, this._cardComponent, RenderPosition.BEFOREEND);
  }
}
