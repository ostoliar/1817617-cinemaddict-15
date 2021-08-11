import AbstractView from './abstract.js';


const createFilmsQuantity = () => (
  '<p>130 291 movies inside</p>'
);

export default class FilmQuantity extends AbstractView {
  getTemplate() {
    return createFilmsQuantity();
  }
}
