import { UserAction, UpdateType, CommentsTitle } from '../const.js';
import { getCurrentDate } from '../utils/date.js';
import { isEsc, isEnter } from '../utils/common.js';
import { render, rerender, remove } from '../utils/render.js';

import FilmDetailsView from '../view/film-details.js';
import FilmDetailsBottomView from '../view/film-details-bottom.js';
import CommentsContainerView from '../view/comments-container.js';
import CommentsTitleView from '../view/comments-title.js';
import CommentsListView from '../view/comments-list.js';
import CommentView from '../view/comment.js';
import NewCommentView from '../view/new-comment.js';

export default class FilmDetailsPresenter {
  constructor(filmDetailsContainer, filmsModel, changeFilm, hideFilmDetails, api) {
    this._filmDetailsContainer = filmDetailsContainer;
    this._filmsModel = filmsModel;
    this._changeFilm = changeFilm;
    this._hideFilmDetails = hideFilmDetails;
    this._api = api;

    this._film = null;
    this._filmComments = [];
    this._isLoading = true;
    this._isError = false;
    this._prevScrollTop = 0;

    this._filmDetailsView = null;
    this._filmDetailsBottomView = null;
    this._commentsContainerView = null;
    this._commentsTitleView = null;
    this._commentsListView = null;
    this._newCommentView = null;

    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._handleDocumentKeydown = this._handleDocumentKeydown.bind(this);

    this._handleAddToWatchButtonClick = this._handleAddToWatchButtonClick.bind(this);
    this._handleAddWatchedButtonClick = this._handleAddWatchedButtonClick.bind(this);
    this._handleAddFavoriteButtonClick = this._handleAddFavoriteButtonClick.bind(this);

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteButtonClick = this._handleDeleteButtonClick.bind(this);

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init(film, { loadComments = true } = {}) {
    this._film = film;
    this._isLoading = loadComments;

    this._commentsTitleView = null;
    this._commentsListView = null;

    this._renderFilmDetails();
  }

  destroy() {
    remove(this._filmDetailsView);
    this._filmsModel.removeObserver(this._handleModelEvent);
    document.removeEventListener('keydown', this._handleDocumentKeydown);
  }

  get filmId() {
    if (this._film) {
      return this._film.id;
    }

    throw new Error('Film Presenter has not been initialized');
  }

  _handleCloseButtonClick() {
    this._hideFilmDetails();
  }

  _handleDocumentKeydown(evt) {
    if ((isEnter(evt) && evt.ctrlKey)) {
      this._handleFormSubmit();
      return;
    }

    if (isEsc(evt)) {
      evt.preventDefault();
      this._hideFilmDetails();
    }
  }

  async _handleAddToWatchButtonClick() {
    let updatedFilm = {
      ...this._film,
      userDetails: {
        ...this._film.userDetails,
        isToWatch: !this._film.userDetails.isToWatch,
      },
    };

    updatedFilm = await this._api.updateFilm(updatedFilm);

    this._changeFilm(UserAction.UPDATE_FILM_DETAILS, UpdateType.MINOR, updatedFilm);
  }

  async _handleAddWatchedButtonClick() {
    let updatedFilm ={
      ...this._film,
      userDetails: {
        ...this._film.userDetails,
        isWatched: !this._film.userDetails.isWatched,
        watchingDate: !this._film.userDetails.isWatched ? getCurrentDate() : '',
      },
    };

    updatedFilm = await this._api.updateFilm(updatedFilm);

    this._changeFilm(UserAction.UPDATE_FILM_DETAILS, UpdateType.MINOR, updatedFilm);
  }

  async _handleAddFavoriteButtonClick() {
    let updatedFilm ={
      ...this._film,
      userDetails: {
        ...this._film.userDetails,
        isFavorite: !this._film.userDetails.isFavorite,
      },
    };

    updatedFilm = await this._api.updateFilm(updatedFilm);

    this._changeFilm(UserAction.UPDATE_USER_DETAILS, UpdateType.MINOR, updatedFilm);
  }

  _handleDeleteButtonClick(id) {
    const payload = {
      commentId: id,
      film: this._film,
    };
    this._changeFilm(UserAction.DELETE_COMMENT, UpdateType.PATCH, payload);
  }

  _handleFormSubmit() {
    const newComment = this._newCommentView.getData();

    if (!newComment.text || !newComment.emotion) {
      return;
    }

    const payload = {
      newComment,
      film: this._film,
    };

    this._changeFilm(UserAction.CREATE_COMMENT, UpdateType.PATCH, payload);
    this._newCommentView.reset();
  }

  _handleModelEvent(updateType, updatedFilm) {
    if (updateType === UpdateType.MAJOR) {
      return;
    }

    const loadComments = updateType !== UpdateType.MINOR;

    this.init(updatedFilm, { loadComments });
  }

  _renderFilmInfo() {
    const prevFilmDetailsView = this._filmDetailsView;

    this._filmDetailsView = new FilmDetailsView(this._film);

    this._filmDetailsView.setCloseButtonClickHandler(this._handleCloseButtonClick);

    this._filmDetailsView.setAddToWatchButtonClickHandler(this._handleAddToWatchButtonClick);
    this._filmDetailsView.setAddWatchedButtonClickHandler(this._handleAddWatchedButtonClick);
    this._filmDetailsView.setAddFavoriteButtonClickHandler(this._handleAddFavoriteButtonClick);

    rerender(this._filmDetailsView, prevFilmDetailsView, this._filmDetailsContainer);

    if (!prevFilmDetailsView) {
      document.addEventListener('keydown', this._handleDocumentKeydown);
    }
  }

  _renderFilmsBottom() {
    this._filmDetailsBottomView = new FilmDetailsBottomView();

    this._renderCommentsContainer();
    this._renderComments();
    this._renderNewComment();

    render(this._filmDetailsView, this._filmDetailsBottomView);
  }

  _renderComment(comment) {
    render(this._commentsContainerView, new CommentView(comment));
  }

  _renderCommentsContainer() {
    this._commentsContainerView = new CommentsContainerView();
    render(this._filmDetailsBottomView, this._commentsContainerView);
  }

  _getCommentsTitle() {
    if (this._isLoading) {
      return CommentsTitle.LOADING;
    }

    if (this._isError) {
      return CommentsTitle.ERROR;
    }

    return this._filmComments.length;
  }

  _renderComments() {
    const prevCommentsTitleView = this._commentsTitleView;
    const prevCommentsListView = this._commentsListView;

    this._commentsTitleView =  new CommentsTitleView(this._getCommentsTitle());
    this._commentsListView = new CommentsListView();

    rerender(this._commentsTitleView, prevCommentsTitleView, this._commentsContainerView);
    rerender(this._commentsListView, prevCommentsListView, this._commentsContainerView);

    if (this._isLoading || this._isError) {
      return;
    }

    this._filmComments.forEach((comment) => {
      const commentsView = new CommentView(comment);
      commentsView.setDeleteButtonClickHandler(this._handleDeleteButtonClick);
      render(this._commentsListView, commentsView);
    });
  }

  _renderNewComment() {
    this._newCommentView = this._newCommentView || new NewCommentView();
    render(this._commentsContainerView, this._newCommentView);
  }

  async _renderFilmDetails() {
    this._prevScrollTop = this._filmDetailsView ? this._filmDetailsView.scrollTop : 0;

    this._renderFilmInfo();
    this._renderFilmsBottom();

    this._filmDetailsView.scrollTop = this._prevScrollTop;

    if (!this._isLoading) {
      return;
    }

    try {
      this._isError = false;
      this._filmComments = await this._api.getComments(this._film);
    } catch (error) {
      this._isError = true;
    } finally {
      this._isLoading = false;
      this._prevScrollTop = this._filmDetailsView.scrollTop;
      this._renderComments();
      this._filmDetailsView.scrollTop = this._prevScrollTop;
    }
  }
}
