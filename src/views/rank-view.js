import SmartView from './smart.js';


export const createRankTemplate = (statisticsData) => {
  const { rank } = statisticsData;

  return `
    <section class="statistic">
      ${rank ? `
        <p class="statistic__rank">
          Your rank
          <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          <span class="statistic__rank-label">${rank}</span>
        </p>
      ` : ''}
    </section>
  `;
};

export default class RankView extends SmartView {
  constructor() {
    super();

    this._periodChangeHandler = this._periodChangeHandler.bind(this);
  }

  getTemplate() {
    return createRankTemplate(this._data);
  }

  restoreHandlers() {
    this.setPeriodChangeHandler(this._callback.periodChange);
  }

  updateElement() {
    super.updateElement();
  }

}
