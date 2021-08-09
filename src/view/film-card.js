import {createElement} from '../utils.js';

const createFilmCardTemplate = (card) => {
  const {name, description, poster, rating, year, duration, genre, comments} = card;

  return `<article class="film-card">
    <button class="transparent">
      <h3 class="film-card__title">${name}</h3>
    </button>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${year}</span>
      <span class="film-card__duration">${duration}m</span>
      <span class="film-card__genre">${genre}</span>
    </p>
    <button class="transparent"><img src="${poster}" alt="" class="film-card__poster"></button>
    <p class="film-card__description">${description}</p>
    <button class="transparent">
      <a href="#"  class="film-card__comments">${comments} comments</a>
    </button>
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist film-card__controls-item--active" type="button">Add to watchlist</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched film-card__controls-item--active" type="button">Mark as watched</button>
      <button class="film-card__controls-item film-card__controls-item--favorite film-card__controls-item--active" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard {
  constructor(card) {
    this._card = card;

    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._card);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
