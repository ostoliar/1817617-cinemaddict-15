import {createElement} from '../utils.js';


const createFilmsQuantity = () => (
  '<p>130 291 movies inside</p>'
);

export default class FilmQuantity {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsQuantity();
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
