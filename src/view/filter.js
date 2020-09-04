import AbstractView from './abstract.js';
import {FilterType} from '../const.js';


const createFilterMarkup = (filmMocks, filterType) => {

  const activeFilter = `main-navigation__item--active`;

  let favorite = 0;
  let watched = 0;
  let watchlist = 0;

  for (const value of filmMocks) {
    favorite = value.isFavorite ? favorite + 1 : favorite + 0;
    watched = value.isWatched ? watched + 1 : watched + 0;
    watchlist = value.isWatchlist ? watchlist + 1 : watchlist + 0;
  }

  return `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item ${filterType === FilterType.All ? activeFilter : ``}" data-filter="${FilterType.All}">All movies</a>
        <a href="#watchlist" class="main-navigation__item ${filterType === FilterType.WATCHLIST ? activeFilter : ``}" data-filter="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count" >${watchlist}</span></a>
        <a href="#history" class="main-navigation__item ${filterType === FilterType.HISTORY ? activeFilter : ``}" data-filter="${FilterType.HISTORY}">History <span class="main-navigation__item-count" >${watched}</span></a>
        <a href="#favorites" class="main-navigation__item ${filterType === FilterType.FAVORITES ? activeFilter : ``}" data-filter="${FilterType.FAVORITES}">Favorites <span class="main-navigation__item-count" >${favorite}</span></a>
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`;
};


export default class FilterView extends AbstractView {
  constructor(filmMocks, filterType) {
    super();
    this._filmMocks = filmMocks;
    this._filterType = filterType;
  }


  setFilterClick(callback) {
    this.getElement().querySelectorAll(`.main-navigation__item`).forEach((element) => element.addEventListener(`click`, () => {
      event.preventDefault();

      if (this._filterType === event.currentTarget.dataset.filter) {
        return;
      }

      callback(event.currentTarget.dataset.filter);
    }));
  }

  getMarkup() {
    return createFilterMarkup(this._filmMocks, this._filterType);
  }
}
