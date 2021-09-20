import AbstractView from './abstract.js';

export const createFooterStatisticsTemplate = (totalFilmsAmount) => `
  <section class="footer__statistics">
    <p> Copyright © 2021 CINEMADDICT Inc. All rights reserved.</p>
    <p>${totalFilmsAmount} movies inside</p>
  </section>
`;

export default class FooterStatisticsView extends AbstractView {
  constructor(totalFilmsAmount = 0) {
    super();

    this._totalFilmsAmount = totalFilmsAmount;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._totalFilmsAmount);
  }
}
