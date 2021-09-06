import { isDateInPeriod } from './date.js';
import { MAX_DESCRIPTION_LENGTH as MAX_DESCRIPTION_VALUE, StatisticPeriodValue } from '../const.js';


export const trimDescription = (description) => description.length <= MAX_DESCRIPTION_VALUE ?
  description : `${description.slice(0, MAX_DESCRIPTION_VALUE - 1)}...`;

export const formatRating = (rating) => rating.toFixed(1);

export const formatItems = (items) => items.join(', ');

export const sortByRating = (filmA, filmB) => filmB.filmInfo.rating - filmA.filmInfo.rating;

export const sortByComments = (filmA, filmB) => filmB.comments.length - filmA.comments.length;

export const sortByDate = (filmA, filmB) => filmB.filmInfo.releaseDate - filmA.filmInfo.releaseDate;

export const getTopRatedFilms = (films) => [...films].sort((a, b) => b.filmInfo.rating - a.filmInfo.rating);

export const getMostCommentedFilms = (films) => [...films].sort((a, b) => b.comments.length - a.comments.length);

export const hasComments = (film) => film.comments.length > 0;

export const hasRating = (film) => film.filmInfo.rating > 0;

export const filter = {
  ALL: (films) => [...films],
  WATCHLIST: (films) => films
    .filter((film) => film.userDetails.isToWatch),
  HISTORY: (films) => films
    .filter((film) => film.userDetails.isWatched),
  FAVORITES: (films) => films
    .filter((film) => film.userDetails.isFavorite),
};

export const isFilmInWhatcingPeriod = (film, period) => {
  if (period === StatisticPeriodValue.ALL) {
    return true;
  }

  const { watchingDate } = film.userDetails;

  return isDateInPeriod(watchingDate, period);
};

