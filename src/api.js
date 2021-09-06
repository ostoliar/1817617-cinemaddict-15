import FilmsModel from './model/films.js';

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
    const response = await this._load({url: 'movies'});
    const films = await Api.toJSON(response);
    return films.map(FilmsModel.adaptFilmToClient);
  }

  async updateFilm(film) {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(FilmsModel.adaptFilmToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    const updatedFilm = await Api.toJSON(response);

    return FilmsModel.adaptFilmToClient(updatedFilm);
  }

  async getComments(film) {
    const response = await this._load({
      url: `comments/${film.id}`,
      method: Method.GET,
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const comments = await Api.toJSON(response);

    return comments.map(FilmsModel.adaptCommentToClient);
  }

  async addComment(filmId, newComment) {
    const response = await this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(FilmsModel.adaptNewCommentToServer(newComment)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });
    const { movie, comments } = await Api.toJSON(response);
    const adaptedResponse = {
      updatedFilm: FilmsModel.adaptFilmToClient(movie),
      updatedComments: comments.map(FilmsModel.adaptCommentToClient),
    };
    return adaptedResponse;
  }

  async deleteComment(id) {
    await this._load({
      url: `comments/${id}`,
      method: Method.DELETE,
    });
  }

  async _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    const response = await fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    );

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

  static catchError(err) {
    throw err;
  }
}
