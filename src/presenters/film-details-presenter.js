
import { UpdateType, CommentsTitle, UserAction } from '../const.js';
import { getCurrentDate } from '../utils/date.js';
import { isEsc, isEnter, isOnline } from '../utils/common.js';
import { render, rerender, remove } from '../utils/render.js';
import FilmDetailsView from '../views/film-details.js';
import FilmDetailsBottomView from '../views/film-details-bottom.js';
import CommentsContainerView from '../views/comments-container.js';
import CommentsTitleView from '../views/comments-title.js';
import CommentsListView from '../views/comments-list.js';
import CommentView from '../views/comment-view.js';
import NewCommentView from '../views/new-comment-view.js';
import CommentModel from '../models/comment-model.js';
import { alert } from '../utils/alert.js';


export default class FilmDetailsPresenter {
  constructor({ container, filmsModel, changeFilm, hideFilmDetails, api }) {
    this._filmDetailsContainer = container;
    this._filmsModel = filmsModel;
    this._changeFilm = changeFilm;
    this._hideFilmDetails = hideFilmDetails;
    this._api = api;

    this._film = null;
    this._isLoading = true;
    this._isError = false;
    this._prevScrollTop = 0;

    this._commentsModel = new CommentModel();

    this._filmDetailsView = null;
    this._filmDetailsBottomView = null;
    this._commentsContainerView = null;
    this._commentsTitleView = null;
    this._commentsListView = null;
    this._commentViews = new Map();
    this._newCommentView = null;

    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._handleDocumentKeydown = this._handleDocumentKeydown.bind(this);

    this._handleAddToWatchButtonClick = this._handleAddToWatchButtonClick.bind(this);
    this._handleAddWatchedButtonClick = this._handleAddWatchedButtonClick.bind(this);
    this._handleAddFavoriteButtonClick = this._handleAddFavoriteButtonClick.bind(this);

    this._handleDeleteButtonClick = this._handleDeleteButtonClick.bind(this);
    this._handleNewCommentFormSubmit = this._handleNewCommentFormSubmit.bind(this);
    this._handleCommentsViewAction = this._handleCommentsViewAction.bind(this);

    this._handleFilmsModelEvent = this._handleFilmsModelEvent.bind(this);
    this._handleCommentsModelEvent = this._handleCommentsModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleFilmsModelEvent);
    this._commentsModel.addObserver(this._handleCommentsModelEvent);
  }

  init(film, { isLoadComments = true } = {}) {
    this._film = film;
    this._isLoading = isLoadComments;

    this._commentsTitleView = null;
    this._commentsListView = null;
    this._commentViews = new Map();

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

  get _isSuccess() {
    return !this._isLoading && !this._isError;
  }

  _handleCloseButtonClick() {
    this._hideFilmDetails();
  }

  _handleDocumentKeydown(evt) {
    if ((isEnter(evt) && evt.ctrlKey)) {
      this._handleNewCommentFormSubmit();
      return;
    }

    if (isEsc(evt)) {
      evt.preventDefault();
      this._hideFilmDetails();
    }
  }

  async _handleAddToWatchButtonClick() {
    const updatedFilm = {
      ...this._film,
      userDetails: {
        ...this._film.userDetails,
        isToWatch: !this._film.userDetails.isToWatch,
      },
    };

    this._changeFilm(UserAction.UPDATE_USER_DETAILS, UpdateType.MINOR, updatedFilm);
  }

  async _handleAddWatchedButtonClick() {
    const updatedFilm ={
      ...this._film,
      userDetails: {
        ...this._film.userDetails,
        isWatched: !this._film.userDetails.isWatched,
        watchingDate: !this._film.userDetails.isWatched ? getCurrentDate() : '',
      },
    };

    this._changeFilm(UserAction.UPDATE_USER_DETAILS, UpdateType.MINOR, updatedFilm);
  }

  async _handleAddFavoriteButtonClick() {
    const updatedFilm ={
      ...this._film,
      userDetails: {
        ...this._film.userDetails,
        isFavorite: !this._film.userDetails.isFavorite,
      },
    };

    this._changeFilm(UserAction.UPDATE_USER_DETAILS, UpdateType.MINOR, updatedFilm);
  }

  async _handleDeleteButtonClick(commentId) {
    if (!isOnline()) {
      alert('You can not delete comment in offline mode');
      return;
    }

    try {
      this._commentViews.get(commentId).setDeletingStatus();
      await this._handleCommentsViewAction(UserAction.DELETE_COMMENT, UpdateType.PATCH, commentId);

    } catch (error) {
      this._commentViews.get(commentId).resetDeletingStatus();
    }

  }

  async _handleNewCommentFormSubmit() {
    if (!isOnline()) {
      this._newCommentView.setErrorState();
      alert('You can not add comment in offline mode');
      return;
    }


    try {
      this._newCommentView.disable();
      this._newCommentView.clearErrorState();

      await this._handleCommentsViewAction(
        UserAction.CREATE_COMMENT,
        UpdateType.PATCH,
        {
          filmId: this._film.id,
          newComment: this._newCommentView.getData(),
        });

      this._newCommentView.reset();

    } catch (error) {
      this._newCommentView.setErrorState();
    }

    this._newCommentView.enable();
  }

  async _handleCommentsViewAction(updateAction, updateType, payload) {
    let response = null;
    let updatedFilm = null;

    switch (updateAction) {
      case UserAction.CREATE_COMMENT:
        response = await this._api.addComment(payload);

        await this._changeFilm(updateAction, updateType, response.updatedFilm);

        this._commentsModel.setComments(updateType, response.updatedComments);
        break;

      case UserAction.DELETE_COMMENT:
        await this._api.deleteComment(payload);

        updatedFilm = {
          ...this._film,
          comments: this._film.comments.filter((id) => id !== payload),
        };

        await Promise.all([
          this._changeFilm(updateAction, updateType, updatedFilm),
          this._api.updateFilm(updatedFilm, { isServerUpdate: false }),
        ]);

        this._commentsModel.deleteComment(updateType, payload);
        break;
    }
  }

  _handleFilmsModelEvent(updateType, updatedFilm) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._film = updatedFilm;
        break;
      case UpdateType.MINOR:
        this.init(updatedFilm, { isLoadComments: false });
        break;
    }
  }

  _handleCommentsModelEvent(updateType, payload) {
    switch (updateType) {
      case UpdateType.INIT:
        this._renderCommentsTitle();
        this._renderCommentsList();
        this._renderNewComment();
        break;

      case UpdateType.PATCH:
        this._renderCommentsTitle();

        if (Array.isArray(payload)) {
          this._renderCommentsList();
        } else {
          remove(this._commentViews.get(payload));
          this._commentViews.delete(payload);
        }

        break;
    }
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
    this._renderCommentsTitle();
    this._renderCommentsList();
    this._renderNewComment();

    render(this._filmDetailsView, this._filmDetailsBottomView);
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

    return this._commentsModel.getAll().length;
  }

  _renderCommentsTitle() {
    const prevCommentsTitleView = this._commentsTitleView;
    this._commentsTitleView =  new CommentsTitleView(this._getCommentsTitle());
    rerender(this._commentsTitleView, prevCommentsTitleView, this._commentsContainerView);
  }

  _renderCommentsList() {
    if (!this._isSuccess) {
      return;
    }

    const prevCommentsListView = this._commentsListView;
    this._commentsListView = new CommentsListView();
    rerender(this._commentsListView, prevCommentsListView, this._commentsContainerView);

    this._commentsModel.getAll().forEach((comment) => {
      const commentView = new CommentView(comment);
      this._commentViews.set(comment.id, commentView);
      commentView.setDeleteButtonClickHandler(this._handleDeleteButtonClick);
      render(this._commentsListView, commentView);
    });
  }

  _renderNewComment() {
    if (this._isSuccess) {
      this._newCommentView = this._newCommentView || new NewCommentView();
      this._newCommentView.clearErrorState();
      render(this._commentsContainerView, this._newCommentView);
    }
  }

  async _renderFilmDetails() {
    this._prevScrollTop = this._filmDetailsView ? this._filmDetailsView.scrollTop : 0;

    this._renderFilmInfo();
    this._renderFilmsBottom();

    this._filmDetailsView.scrollTop = this._prevScrollTop;

    if (!this._isLoading) {
      return;
    }

    let comments = [];
    try {
      this._isError = false;
      comments = await this._api.getComments(this._film.id);
    } catch (error) {
      this._isError = true;
    } finally {
      this._isLoading = false;
      this._commentsModel.setComments(UpdateType.INIT, comments);
    }
  }
}
