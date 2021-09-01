export const sortByRating = (filmA, filmB) => filmB.filmInfo.rating - filmA.filmInfo.rating;

export const sortByDate = (filmA, filmB) => filmB.filmInfo.releaseDate - filmA.filmInfo.releaseDate;
