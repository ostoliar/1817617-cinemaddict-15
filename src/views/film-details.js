import { ClassName } from '../const.js';
import { formatRating, formatItems } from '../utils/film.js';
import { getReleaseDate, getRuntime } from '../utils/date.js';

import AbstractView from './abstract.js';

const setActiveClassName = (condition) => condition ? ClassName.FILM_DETAILS_CONTROL_ACTIVE : '';

const getGenreTermTextContent = (genres) => genres.length > 1 ? 'Genres' : 'Genre';

const createGenreTemplate = (genre) => `<span class="film-details__genre">${genre}</span>`;

export const createFilmDetailsTemplate = (film) => {
  const { filmInfo, userDetails, id } = film;
  const { isWatched, isFavorite, isToWatch } = userDetails;
  const {
    title,
    originalTitle,
    rating,
    description,
    genres,
    poster,
    releaseDate,
    country,
    runtime,
    director,
    writers,
    actors,
    ageRating,
  } = filmInfo;

  const genresTemplate = genres.map((genre) => createGenreTemplate(genre)).join('');

  return `
    <section class="film-details" data-film-id=${id}>
      <form class="film-details__inner" action="" method="get">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">
              <p class="film-details__age">${ageRating}+</p>
            </div>
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${originalTitle}</p>
                </div>
                <div class="film-details__rating">
                  <p class="film-details__total-rating">${formatRating(rating)}</p>
                </div>
              </div>
              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${formatItems(writers)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${formatItems(actors)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${getReleaseDate(releaseDate)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${getRuntime(runtime)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${getGenreTermTextContent(genres)}</td>
                  <td class="film-details__cell">${genresTemplate}</td>
                </tr>
              </table>
              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>
          <section class="film-details__controls">
            <button type="button" class="film-details__control-button film-details__control-button--watchlist ${setActiveClassName(isToWatch)}" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button film-details__control-button--watched ${setActiveClassName(isWatched)}"
            id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button film-details__control-button--favorite  ${setActiveClassName(isFavorite)}" id="favorite" name="favorite">Add to favorites</button>
          </section>
        </div>
      </form>
    </section>
  `;
};

export default class FilmDetailsView extends AbstractView {
  constructor(film) {
    super();

    this._film = film;

    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);

    this._addToWatchButtonClickHandler = this._addToWatchButtonClickHandler.bind(this);
    this._addWatchedButtonClickHandler = this._addWatchedButtonClickHandler.bind(this);
    this._addFavoriteButtonClickHandler = this._addFavoriteButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film);
  }

  get scrollTop() {
    return this.getElement().scrollTop;
  }

  set scrollTop(value) {
    this.getElement().scrollTop = value;
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeButtonclick();
  }

  _addToWatchButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.addToWatchButtonClick();
  }

  _addWatchedButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.addWatchedButtonClick();
  }

  _addFavoriteButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.addFavoriteButtonClick();
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonclick = callback;
    this.getElement().querySelector(`.${ClassName.FILM_DETAILS_CLOSE_BTN}`)
      .addEventListener('click', this._closeButtonClickHandler);
  }

  setAddToWatchButtonClickHandler(callback) {
    this._callback.addToWatchButtonClick = callback;
    this.getElement().querySelector(`.${ClassName.FILM_DETAILS_CONTROL_TO_WATCH}`)
      .addEventListener('click', this._addToWatchButtonClickHandler);
  }

  setAddWatchedButtonClickHandler(callback) {
    this._callback.addWatchedButtonClick = callback;
    this.getElement().querySelector(`.${ClassName.FILM_DETAILS_CONTROL_WATCHED}`)
      .addEventListener('click', this._addWatchedButtonClickHandler);
  }

  setAddFavoriteButtonClickHandler(callback) {
    this._callback.addFavoriteButtonClick = callback;
    this.getElement().querySelector(`.${ClassName.FILM_DETAILS_CONTROL_FAVORITE}`)
      .addEventListener('click', this._addFavoriteButtonClickHandler);
  }
}
