import AbstractView from './abstract.js';

export const createMainTemplate = () => '<main class="main"></main>';

export default class Main extends AbstractView {
  getTemplate() {
    return createMainTemplate();
  }
}
