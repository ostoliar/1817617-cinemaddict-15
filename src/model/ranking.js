import { Rank } from '../const.js';

import AbstractObserver from '../utils/abstract-observer.js';

export default class RankModel extends AbstractObserver {
  constructor(rank = Rank.NONE) {
    super();
    this._currentRank = rank;
  }

  setRank(updateType, rank) {
    this._currentRank = rank;
    this._notify(updateType, rank);
  }

  getRanking() {
    return this._currentRank;
  }
}
