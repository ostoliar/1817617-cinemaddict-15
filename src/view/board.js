import AbstractView from './abstract.js';

const createBoardTemplate = () => '<section class="filmsr"></section>';

export default class Board extends AbstractView {
  getTemplate() {
    return createBoardTemplate();
  }
}
