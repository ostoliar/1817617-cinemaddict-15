import { FilterType, StatisticPeriodValue } from '../const.js';
import { remove, render } from '../utils/render.js';
import { filter, isFilmInWatchingPeriod } from '../utils/film.js';
import { getWatchedStatisticsData } from '../utils/statistic.js';
import StatisticsView from '../views/statistic.js';

export default class StatisticPresenter {
  constructor({ container, rankModel, filmsModel }) {
    this._statisticContainer = container;

    this._statiscticsView = null;

    this._rankModel = rankModel;
    this._filmsModel = filmsModel;

    this._handlePeriodChange = this._handlePeriodChange.bind(this);
  }

  init() {
    this._watchedFilms = filter[FilterType.HISTORY](this._filmsModel.getAll());

    this._statiscticsView = new StatisticsView();
    this._statiscticsView.setPeriodChangeHandler(this._handlePeriodChange);
    this._statiscticsView.updateData({
      rank: this._rankModel.getRank(),
    });
    this._handlePeriodChange(StatisticPeriodValue.ALL);

    render(this._statisticContainer, this._statiscticsView);
  }

  destroy() {
    if (this._statiscticsView) {
      remove(this._statiscticsView);
      this._statiscticsView = null;
    }
  }

  _handlePeriodChange(activePeriodValue) {
    const watchedFilms = [ ...this._watchedFilms ].filter((film) => isFilmInWatchingPeriod(film, activePeriodValue));

    this._statiscticsView.updateData({
      activePeriodValue,
      ...getWatchedStatisticsData(watchedFilms),
    });
  }
}
