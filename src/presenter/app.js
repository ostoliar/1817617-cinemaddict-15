import { render, replace, remove } from '../utils/render.js';
import { filter } from '../utils/card.js';
import { getRanking } from '../utils/statistic.js';
import EmptyBoardView from '../view/empty-board.js';
import ProfileView from '../view/profile.js';
import MainView from '../view/main.js';
import HeaderView from '../view/header.js';
import FooterStatisticsView from '../view/footer-statistics.js';
import RankModel from '../model/ranking.js';
import FilmsModel from '../model/films.js';
import FilterModel from '../model/filter.js';
import NavigationPresenter from './navigation.js';
import FilmsPresenter from './films.js';
import StatisticPresenter from './statistic.js';
import API from '../api.js';
import { Screen,UpdateType, FilterType, EmptyBoardTitle } from '../const.js';

const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';
const AUTHORIZATION = 'Basic s7fgq77r28d';

export default class ApplicationPresenter {
  constructor(applicationContainer) {
    this._api = new API(END_POINT, AUTHORIZATION);

    this._applicationContainer = applicationContainer;
    this._headerView = new HeaderView();
    this._mainView = new MainView();

    this._profileView = null;
    this._emptyBoardView = new EmptyBoardView(EmptyBoardTitle.LOADING);
    this._footerStatisticsView = new FooterStatisticsView();

    this._rankModel = new RankModel();
    this._filmsModel = new FilmsModel();
    this._filterModel = new FilterModel();

    this._renderScreen = this._renderScreen.bind(this);
    this._handleRankModelEvent = this._handleRankModelEvent.bind(this);
    this._handleFilmsModelEvent = this._handleFilmsModelEvent.bind(this);

    this._navigationPresenter = new NavigationPresenter(this._mainView, this._filterModel, this._filmsModel, this._renderScreen);
    this._filmsScreenPresenter = null;
    this._statisticsScreenPresenter = null;

    this._isBlocked = true;
    this._currentScreen = null;
  }

  async init() {
    // Рендер приложения до загрузки фильмов

    this._navigationPresenter.init();
    render(this._mainView, this._emptyBoardView);  // Рендер заглушки

    render(this._applicationContainer, this._headerView);
    render(this._applicationContainer, this._mainView);
    render(this._applicationContainer, this._footerStatisticsView);


    try {
      // Получение фильмов
      const films = await this._api.getFilms();

      if (!films.length) {
        // Ошибка при отсутствии загруженных фильмов
        throw new Error(EmptyBoardTitle.ERROR);
      }


      // Подписка на обновление профиля пользователя
      this._filmsModel.addObserver(this._handleFilmsModelEvent);
      this._rankModel.addObserver(this._handleRankModelEvent);

      // Обновление модели фильмов
      this._filmsModel.setFilms(UpdateType.MINOR, films);


      // Удаляет заглушку
      remove(this._emptyBoardView);
      this._emptyBoardView = null;


      // Создание презентеров экранов "Фильмы" и "Статистики"
      this._filmsScreenPresenter = new FilmsPresenter(this._mainView, this._filmsModel, this._filterModel, this._api);
      this._statisticsScreenPresenter = new StatisticPresenter(this._mainView, this._rankModel, this._filmsModel);


      // Рендер приложения
      this._isBlocked = false;

      this._navigationPresenter.setActiveItem(FilterType.ALL);
      this._filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
      this._renderScreen(Screen.FILMS);

      const prevFooterStatisticsView = this._footerStatisticsView;
      this._footerStatisticsView = new FooterStatisticsView(this._filmsModel.getAll().length);
      replace(this._footerStatisticsView, prevFooterStatisticsView);

    } catch (error) {
      const prevEmptyBoardView = this._emptyBoardView;
      this._emptyBoardView = new EmptyBoardView(error.message);
      replace(this._emptyBoardView, prevEmptyBoardView);
    }
  }

  _renderScreen(screen) {
    if (screen === this._currentScreen) {
      return;
    }

    if (this._isBlocked) {
      return;
    }

    this._currentScreen = screen;
    switch (screen) {
      case Screen.FILMS:
        this._statisticsScreenPresenter.destroy();
        this._filmsScreenPresenter.init();
        break;

      case Screen.STATISTICS:
        this._filmsScreenPresenter.destroy();
        this._statisticsScreenPresenter.init();
        break;
    }
  }

  _renderProfile() {
    this._profileView = new ProfileView(this._rankModel.getRanking());
  }

  _handleRankModelEvent() {
    this._renderProfile();
  }

  _handleFilmsModelEvent(updateType) {
    if (updateType !== UpdateType.PATCH) {
      const films = this._filmsModel.getAll();
      const watchedFilmsAmount = filter[FilterType.HISTORY](films).length;
      const rank = getRanking(watchedFilmsAmount);

      if (rank !== this._rankModel.getRanking()) {
        this._rankModel.setRank(UpdateType.MAJOR, rank);
      }
    }
  }
}
