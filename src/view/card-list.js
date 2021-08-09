import {createElement} from '../utils.js';

const createTaskListTemplate = () => '<div class="films-list__container"></div>';

export default class CardList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTaskListTemplate();
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
