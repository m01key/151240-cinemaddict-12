import FilmCardView from '../view/film-card-view.js';
import FilmDetailsView from '../view/film-details-view.js';

import {render} from '../utils/render.js';
import {ActionType} from '../const.js';


export default class FilmCardPresenter {
  constructor(mainElement, filmListView, updateData, api) {
    this._filmListView = filmListView;
    this._mainElement = mainElement;
    this._updateData = updateData;
    this._callback = {};
    this._api = api;
  }

  init(film) {

    this._createFilmCardInstance(film);

    render(this._filmCardView, this._filmListView, `beforeend`);

    this._filmCardViewOld = this._filmCardView;
    this._filmDetailsViewOld = this._filmDetailsView;

  }


  updateFilmCard(film) {

    this._createFilmCardInstance(film);

    this._filmCardViewOld.getElement().replaceWith(this._filmCardView.getElement());
    this._filmDetailsViewOld.getElement().replaceWith(this._filmDetailsView.getElement());
    this._api.getComments(this._film.id).then((comments) => this._filmDetailsView.renderComments(comments));

    this._filmCardViewOld = this._filmCardView;
    this._filmDetailsViewOld = this._filmDetailsView;

  }

  abort(actionType, comment) {

    switch (actionType) {
      case ActionType.ADD_COMMENT:
        this._filmDetailsView.unblockElement();
        this._filmDetailsView.errorShake();
        break;
      case ActionType.DELETE_COMMENT:
        this._filmDetailsView.unblockComment(comment);
    }

  }


  _createFilmCardInstance(film) {

    this._film = film;

    this._filmCardView = new FilmCardView(this._film);
    this._filmDetailsView = new FilmDetailsView(this._film);

    this._filmCardView.setClickHandler(this._onFilmCardClick.bind(this));

    this._filmCardView.setClickWatchlistHandler(this._handleWatchlistClick.bind(this));
    this._filmCardView.setClickHistoryHandler(this._handleHistoryClick.bind(this));
    this._filmCardView.setClickFavoriteHandler(this._handleFavoriteClick.bind(this));

    this._filmDetailsView.setClickHandler(this._onCloseClick.bind(this));

    this._filmDetailsView.setClickWatchlistHandler(this._handleWatchlistClick.bind(this));
    this._filmDetailsView.setClickHistoryHandler(this._handleHistoryClick.bind(this));
    this._filmDetailsView.setClickFavoriteHandler(this._handleFavoriteClick.bind(this));

    this._filmDetailsView.setClickEmojiHandler();
    this._filmDetailsView.setFormSubmitHandler(this._onFormSubmit.bind(this));
    this._filmDetailsView.setCommentDeleteHandler(this._onCommentDeleteClick.bind(this));
  }

  _onCommentDeleteClick(comment, updateType, actionType) {
    this._updateData(comment, updateType, actionType);
  }

  _onFormSubmit(comment, updateType, actionType) {
    this._film.comments.push(comment);
    this._updateData(this._film, updateType, actionType);
  }

  _onEscapeDown(event) {
    if (event.key === `Escape` || event.key === `Esc`) {
      event.preventDefault();
      this._filmDetailsView.getElement().remove();
      document.removeEventListener(`keydown`, this._onEscapeDown);
    }
  }

  _onCloseClick() {
    this._filmDetailsView.getElement().remove();
    document.removeEventListener(`keydown`, this._onEscapeDown);
  }

  _onFilmCardClick(event) {
    event.preventDefault();

    this._callback.closePopup();

    render(this._filmDetailsView, this._mainElement, `afterend`);

    this._api.getComments(this._film.id).then((comments) => this._filmDetailsView.renderComments(comments));

    document.addEventListener(`keydown`, this._onEscapeDown.bind(this));
  }


  setClosePopup(callback) {
    this._callback.closePopup = callback;
  }


  closePopup() {
    this._filmDetailsView.getElement().querySelector(`.film-details__comment-input`).value = ``;
    this._filmDetailsView.getElement().querySelector(`.film-details__add-emoji-label`).innerHTML = ``;
    this._filmDetailsView.getElement().querySelectorAll(`.film-details__emoji-item`).forEach((input) => (input.checked = false));
    this._filmDetailsView.getElement().remove();
    document.removeEventListener(`keydown`, this._onEscapeDown);
  }


  _handleWatchlistClick(updateType, actionType) {
    const newFilm = Object.assign({}, this._film);
    newFilm.isWatchlist = !newFilm.isWatchlist;
    this._updateData(newFilm, updateType, actionType);
  }

  _handleHistoryClick(updateType, actionType) {
    const newFilm = Object.assign({}, this._film);
    newFilm.isWatched = !newFilm.isWatched;
    this._updateData(newFilm, updateType, actionType);
  }

  _handleFavoriteClick(updateType, actionType) {
    const newFilm = Object.assign({}, this._film);
    newFilm.isFavorite = !newFilm.isFavorite;
    this._updateData(newFilm, updateType, actionType);
  }


}