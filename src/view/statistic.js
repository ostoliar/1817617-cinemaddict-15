import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getStatisticsChartData } from '../utils/statistic.js';
import { ClassName,
  StatisticPeriodValue, StatisticsPeriodLabel,
  STAISTICS_CHART_BAR_HEIGHT, STATISTICS_CHART_OPTIONS, STATISCTICS_CHART_TYPE
} from '../const.js';
import SmartView from './smart.js';

const createPeriodInputTemplate = ({ value, checked, label }) => `
  <input
    type="radio"
    class="statistic__filters-input visually-hidden"
    name="statistic-filter"
    id="statistic-${value}"
    value="${value}"
    ${checked ? 'checked' : ''}
  >
  <label for="statistic-${value}" class="statistic__filters-label">
   ${label}
  </label>
`;

export const createStatisticsTemplate = (statisticsData) => {
  const { rank, totalAmount, totalDuration, topGenre, genresStatistic, activePeriodValue = StatisticPeriodValue.ALL} = statisticsData;

  const periodInputsTemplate = Object.entries(StatisticPeriodValue)
    .map(([period, value]) => createPeriodInputTemplate({
      value,
      label: StatisticsPeriodLabel[period],
      checked: value === activePeriodValue,
    }))
    .join('');

  return `
    <section class="statistic">
      ${ rank ? `
        <p class="statistic__rank">
          Your rank
          <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
          <span class="statistic__rank-label">${rank}</span>
        </p>
      ` : ''}
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${periodInputsTemplate}
      </form>
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${totalAmount || 0} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">
            ${totalDuration && totalDuration.hour || 0} <span class="statistic__item-description">h</span>
            ${totalDuration && totalDuration.minute || 0} <span class="statistic__item-description">m</span>
          </p>
        </li>
        ${topGenre ? `
          <li class="statistic__text-item">
            <h4 class="statistic__item-title">Top genre</h4>
            <p class="statistic__item-text">${topGenre}</p>
          </li>
        ` : ''}
      </ul>
      ${genresStatistic ? `
        <div class="statistic__chart-wrap">
          <canvas class="statistic__chart" width="1000"></canvas>
        </div>
      ` : ''}
    </section>
  `;
};

export default class StatisticsView extends SmartView {
  constructor() {
    super();

    this._periodChangeHandler = this._periodChangeHandler.bind(this);
  }

  getTemplate() {
    return createStatisticsTemplate(this._data);
  }

  restoreHandlers() {
    this.setPeriodChangeHandler(this._callback.periodChange);
  }

  setPeriodChangeHandler(callback) {
    this._callback.periodChange = callback;

    this.getElement()
      .querySelector(`.${ClassName.STATISTICS_FILTER_FORM}`)
      .addEventListener('change', this._periodChangeHandler);
  }

  updateElement() {
    super.updateElement();
    this._focusActiveFilter();
    this._renderChart(this._data.genresStatistic);
  }

  _periodChangeHandler(evt) {
    this._callback.periodChange(evt.target.value);
  }

  _focusActiveFilter() {
    const activeFilter = this.getElement().querySelector(`.${ClassName.STATISTICS_FILTER_INPUT}:checked`);
    if (activeFilter) {
      activeFilter.focus();
    }
  }

  _renderChart(genresStatistic) {
    if (!genresStatistic) {
      return;
    }

    const statisticsContext = this.getElement().querySelector(`.${ClassName.STATISTICS_CHART}`);

    statisticsContext.height = STAISTICS_CHART_BAR_HEIGHT * genresStatistic.genres.length;

    new Chart(statisticsContext, {
      plugins: [ChartDataLabels],
      type: STATISCTICS_CHART_TYPE,
      data: getStatisticsChartData(genresStatistic),
      options: { ...STATISTICS_CHART_OPTIONS},
    });
  }
}
