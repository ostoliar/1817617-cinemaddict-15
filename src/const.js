export const bodyElement = document.body;

export const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

const TOKEN = 'Basic s7fgq77r28dlskdfji76';

export const AUTHORIZATION = TOKEN;

export const FILMS_STEP = 5;

export const EXTRA_FILMS_AMOUNT = 2;

export const MAX_DESCRIPTION_LENGTH = 140;

export const OFFLINE_POSTFIX =  ' [offline]';

export const STORE_PREFIX = 'cinemaddict-localstorage';

export const STORE_VER = 'v15';

export const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;


export const KeyCode = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
};

export const UserAction = {
  UPDATE_USER_DETAILS: 'update-user-details',
  CREATE_COMMENT: 'create-comment',
  DELETE_COMMENT: 'delete-comment',
};

export const Data = {
  FILM_INFO: 'film_info',
  ALTERNATIVE_TITLE: 'alternative_title',
  AGE_RATING: 'age_rating',
  RELEASE_COUNTRY: 'release_country',
  TOTAL_RATING: 'total_rating',
  USER_DETAILS: 'user_details',
  ALREADY_WATCHED: 'already_watched',
  WATCHING_DATE: 'watching_date',
};

export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};

export const Emotion = {
  SMILE: 'smile',
  SLEEPING: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
};

export const FilmsListOption = {
  MAIN: {
    title: 'All movies. Upcoming',
    isTitleVisiallyHidden: true,
    type: 'main',
  },
  TOP_RATED: {
    title: 'Top rated',
    isExtra: true,
    type: 'topRated',
  },
  MOST_COMMENTED: {
    title: 'Most commented',
    isExtra: true,
    type: 'mostCommented',
  },
};

export const NEW_COMMENT_DEFAULT = {
  isError: false,
  isDisabled: false,
  text: '',
  emotion: '',
};

export const FilterType = {
  ALL: 'ALL',
  WATCHLIST: 'WATCHLIST',
  HISTORY: 'HISTORY',
  FAVORITES: 'FAVORITES',
};

export const NavigationItem = {
  ...FilterType,
  STATISTICS: 'STATISTICS',
};

export const FilteredEmptyListTitle = {
  WATCHLIST: 'There ara no movies to watch now',
  HISTORY: 'There are no watched movies now',
  FAVORITES: 'There are no favorite movies now',
};

export const EmptyBoardTitle = {
  ERROR: 'There ara no movies to watch now',
  LOADING: 'Loading...',
};

export const CommentsTitle = {
  ERROR: 'was not loaded',
  LOADING: 'loading...',
};


export const UpdateType = {
  PATCH: 'patch',
  MINOR: 'minor',
  MAJOR: 'major',
  INIT: 'init',
};

export const Screen = {
  FILMS: 'films',
  STATISTICS: 'statistics',
};

export const Rank = {
  NONE: '',
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

export const rankToUpperLimit = {
  NONE: 0,
  NOVICE: 10,
  FAN: 20,
  MOVIE_BUFF: Infinity,
};

export const StatisticPeriodValue = {
  ALL: 'all',
  TODAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const StatisticsPeriodLabel = {
  ALL: 'All time',
  TODAY: 'Today',
  WEEK: 'Week',
  MONTH: 'Month',
  YEAR: 'Year',
};

export const STATISTICS_CHART_TYPE = 'horizontalBar';

export const STATISTICS_CHART_BAR_HEIGHT = 50;

export const STATISTICS_CHART_OPTIONS = {
  plugins: {
    datalabels: {
      font: {
        size: 20,
      },
      color: '#ffffff',
      anchor: 'start',
      align: 'start',
      offset: 40,
    },
  },
  scales: {
    yAxes: [{
      ticks: {
        fontColor: '#ffffff',
        padding: 100,
        fontSize: 20,
      },
      gridLines: {
        display: false,
        drawBorder: false,
      },
    }],
    xAxes: [{
      ticks: {
        display: false,
        beginAtZero: true,
      },
      gridLines: {
        display: false,
        drawBorder: false,
      },
    }],
  },
  legend: {
    display: false,
  },
  tooltips: {
    enabled: false,
  },
};

export const ClassName = {
  MAIN: 'main',
  HEADER: 'header',
  HIDE_OVERFLOW: 'hide-overflow',
  SORT_BUTTON: 'sort__button',
  SORT_BUTTON_ACTIVE: 'sort__button--active',
  FILMS_CONTAINER: 'films-list__container',
  COMMENTS_CONTAINER: 'film-details__comments-wrap',
  COMMENT: 'film-details__comment',
  COMMENT_DELETE_BUTTON: 'film-details__comment-delete',
  SHOW_MORE_BUTTON: 'films-list__show-more',
  NAVIGATION_FILTER_ITEM: 'main-navigation__items',
  NAVIGATION_STATISTICS_ITEM: 'main-navigation__additional',
  NAVIGATION_ITEM: 'main-navigation__item',
  NAVIGATION_ITEM_ACTIVE: 'main-navigation__item--active',
  FILM_CARD_CONTROL_ACTIVE: 'film-card__controls-item--active',
  FILM_CARD_CONTROL_TO_WATCH: 'film-card__controls-item--add-to-watchlist',
  FILM_CARD_CONTROL_WATCHED: 'film-card__controls-item--mark-as-watched',
  FILM_CARD_CONTROL_FAVORITE: 'film-card__controls-item--favorite',
  FILM_DETAILS_CONTROL_TO_WATCH: 'film-details__control-button--watchlist',
  FILM_DETAILS_CONTROL_WATCHED: 'film-details__control-button--watched',
  FILM_DETAILS_CONTROL_FAVORITE: 'film-details__control-button--favorite',
  FILM_DETAILS_EMOJI_ITEM: 'film-details__emoji-item',
  FILM_DETAILS_EMOJI_LIST: 'film-details__emoji-list',
  FILM_DETAILS_TEXTAREA: 'film-details__comment-input',
  FILM_CARD_POSTER: 'film-card__poster',
  FILM_CARD_TITLE: 'film-card__title',
  FILM_CARD_COMMENTS: 'film-card__comments',
  FILM_DETAILS_CLOSE_BTN: 'film-details__close-btn',
  FILM_DETAILS_CONTROL_ACTIVE: 'film-details__control-button--active',
  STATISTICS_FILTER_FORM: 'statistic__filters',
  STATISTICS_FILTER_INPUT: 'statistic__filters-input',
  STATISTICS_CHART: 'statistic__chart',
  SHAKE: 'shake',
};
