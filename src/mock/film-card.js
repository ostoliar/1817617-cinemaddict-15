import {getRandomInteger} from '../utils/common.js';

const generateFilmName = () => {
  const films = [
    'The Dance of Life',
    'Sagebrush Trail', 'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'The Great Flamarion',
    'Santa Claus Conquers the Martians',
    'Made for Each Other',
  ];

  const randomIndex = getRandomInteger(0, films.length - 1);

  return films[randomIndex];
};

const generatePoster = () => {
  const posters = new Array(
    './images/posters/made-for-each-other.png',
    './images/posters/popeye-meets-sinbad.png',
    './images/posters/sagebrush-trail.jpg',
    './images/posters/santa-claus-conquers-the-martians.jpg',
    './images/posters/the-dance-of-life.jpg',
    './images/posters/the-great-flamarion.jpg',
    './images/posters/the-man-with-the-golden-arm.jpg',
  );

  const randomIndex = getRandomInteger(0, posters.length - 1);

  return posters[randomIndex];
};

const generateDescription = () => {
  const descriptions = new Array(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.',
    'In rutrum ac purus sit amet tempus.',
  );

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};

const generateRating = () => getRandomInteger(0, 10);

const generateFilmYear = () => getRandomInteger(1936, 2021);

const generateFilmDuration = () => getRandomInteger(16, 200);

const generateFilmGenre = () => {
  const genres = [
    'Cartoon',
    'Comedy',
    'Drama',
    'Western',
    'Musical',
    'Mystery',
  ];

  const randomIndex = getRandomInteger(0, genres.length - 1);

  return genres[randomIndex];
};

const generateFilmComments = () => getRandomInteger(0, 5);


export const generatefilmCard = () => ({
  name: generateFilmName(),
  poster: generatePoster(),
  description: generateDescription(),
  rating: generateRating(),
  year: generateFilmYear(),
  duration: generateFilmDuration(),
  genre: generateFilmGenre(),
  comments: generateFilmComments(),
});
