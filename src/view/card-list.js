import AbstractView from './abstract.js';

const createTaskListTemplate = () => '<div class="films-list__container"></div>';
export default class CardList extends AbstractView {
  getTemplate() {
    return createTaskListTemplate();
  }
}
