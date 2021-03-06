import FilmsModel from './models/films-model.js';
import CommentModel from './models/comment-model.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  async getFilms() {
    const response = await this._load({
      url: 'movies',
    });

    const films = await Api.toJSON(response);

    return films.map(FilmsModel.adaptFilmToClient);
  }

  async updateFilm(film) {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(FilmsModel.adaptFilmToServer(film)),
    });

    const updatedFilm = await Api.toJSON(response);

    return FilmsModel.adaptFilmToClient(updatedFilm);
  }

  async getComments(filmId) {
    const response = await this._load({
      url: `comments/${filmId}`,
      method: Method.GET,
    });

    const comments = await Api.toJSON(response);

    return comments.map(CommentModel.adaptCommentToClient);
  }


  async addComment({ filmId, newComment }) {
    const response = await this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(CommentModel.adaptNewCommentToServer(newComment)),
    });

    const { movie, comments } = await Api.toJSON(response);

    return {
      updatedFilm: FilmsModel.adaptFilmToClient(movie),
      updatedComments: comments.map(CommentModel.adaptCommentToClient),
    };
  }

  async deleteComment(commentId) {
    await this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });
  }

  async sync(films) {
    const response = await this._load({
      url: '/movies/sync',
      method: Method.POST,
      body: JSON.stringify(films),
    });

    return await Api.toJSON(response);
  }

  async _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this._authorization);

    const fetchUrl = `${this._endPoint}/${url}`;
    const fetchOptions = { method, body, headers };
    const response = await fetch(fetchUrl, fetchOptions);

    return Api.checkStatus(response);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }
}
