import { updateItem } from '../utils/common.js';
import { sortByRating, sortByComments, hasComments, hasRating } from '../utils/card.js';
import AbstractObserver from '../utils/abstract-observer.js';
import { Data } from '../const.js';

export default class FilmsModel extends AbstractObserver {
  constructor(films = []) {
    super();
    this._films = films;
  }

  getAll() {
    return this._films;
  }

  getTopRated() {
    return [...this._films]
      .filter(hasRating)
      .sort(sortByRating);
  }

  getMostCommented() {
    return [...this._films]
      .filter(hasComments)
      .sort(sortByComments);
  }

  setFilms(updateType, films) {
    this._films = [ ...films ];

    this._notify(updateType, films);
  }

  updateFilm(updateType, updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);

    this._notify(updateType, updatedFilm);
  }

  static adaptFilmToClient(film) {
    const clientFilm = { ... film};

    clientFilm.filmInfo = {
      ...film[Data.FILM_INFO],
      originalTitle: film[Data.FILM_INFO][Data.ALTERNATIVE_TITLE],
      genres: [ ...film[Data.FILM_INFO].genre ],
      ageRating: film[Data.FILM_INFO][Data.AGE_RATING],
      releaseDate: new Date(film[Data.FILM_INFO].release.date),
      country: film[Data.FILM_INFO].release[Data.RELEASE_COUNTRY],
      rating: film[Data.FILM_INFO][Data.TOTAL_RATING],
      poster: film[Data.FILM_INFO].poster.split('images/posters/')[1],
    };

    clientFilm.userDetails = {
      isToWatch: film[Data.USER_DETAILS].watchlist,
      isFavorite: film[Data.USER_DETAILS].favorite,
      isWatched: film[Data.USER_DETAILS][Data.ALREADY_WATCHED],
      watchingDate: film[Data.USER_DETAILS][Data.WATCHING_DATE] ? new Date(film[Data.USER_DETAILS][Data.WATCHING_DATE]) : null,
    };

    delete clientFilm[Data.FILM_INFO];

    delete clientFilm.filmInfo[Data.ALTERNATIVE_TITLE];
    delete clientFilm.filmInfo[Data.AGE_RATING];
    delete clientFilm.filmInfo[Data.TOTAL_RATING];
    delete clientFilm.filmInfo.release;
    delete clientFilm.filmInfo.genre;

    delete clientFilm[Data.USER_DETAILS];

    return clientFilm;
  }

  static adaptFilmToServer(film) {
    const serverFilm = { ... film};

    serverFilm[Data.FILM_INFO] = {
      ...film.filmInfo,
      [Data.ALTERNATIVE_TITLE]: film.filmInfo.originalTitle,
      genre: [ ...film.filmInfo.genres],
      [Data.AGE_RATING]: film.filmInfo.ageRating,
      [Data.TOTAL_RATING]: film.filmInfo.rating,
      poster: `images/posters/${film.filmInfo.poster}`,
    };

    serverFilm[Data.FILM_INFO].release = {
      date: film.filmInfo.releaseDate ? film.filmInfo.releaseDate.toISOString() : null,
      [Data.RELEASE_COUNTRY]: film.filmInfo.country,
    };

    serverFilm[Data.USER_DETAILS] = {
      watchlist: film.userDetails.isToWatch,
      favorite: film.userDetails.isFavorite,
      [Data.ALREADY_WATCHED]: film.userDetails.isWatched,
      [Data.WATCHING_DATE]: film.userDetails.watchingDate ? film.userDetails.watchingDate.toISOString(): null,
    };

    delete serverFilm.filmInfo;

    delete serverFilm[Data.FILM_INFO].originalTitle;
    delete serverFilm[Data.FILM_INFO].genres;
    delete serverFilm[Data.FILM_INFO].country;
    delete serverFilm[Data.FILM_INFO].releaseDate;
    delete serverFilm[Data.FILM_INFO].ageRating;
    delete serverFilm[Data.FILM_INFO].rating;

    delete serverFilm.userDetails;

    return serverFilm;
  }

  static adaptCommentToClient(comment) {
    const clientComment = { ...comment };

    clientComment.text = comment.comment;
    clientComment.date = new Date(comment.date);

    delete clientComment.comment;

    return clientComment;
  }
}
