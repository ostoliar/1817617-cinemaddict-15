const PostFix = {
  ITEMS: 'items',
  SYNC_REQUIRED: 'sync-required',
};

export default class Store {
  constructor(storeKey, storage) {
    this._storage = storage;
    this._storeKey = storeKey;
    this._storeItemsKey = `${this._storeKey}-${PostFix.ITEMS}`;
    this._storeSyncKey = `${this._storeKey}-${PostFix.SYNC_REQUIRED}`;
  }

  get isSyncRequired() {
    const isSyncRequired = this._storage.getItem(this._storeSyncKey);
    return JSON.parse(isSyncRequired).isSyncRequired || false;
  }

  set isSyncRequired(required) {
    const isSyncRequired = JSON.stringify({ isSyncRequired: required });
    this._storage.setItem(this._storeSyncKey, isSyncRequired);
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeItemsKey)) || {};
    } catch (error) {
      return {};
    }
  }

  setItems(items) {
    this._storage.setItem(
      this._storeItemsKey,
      JSON.stringify(items),
    );
  }

  setItem(key, value) {
    const store = this.getItems();

    this._storage.setItem(
      this._storeItemsKey,
      JSON.stringify({
        ...store,
        [key]: value,
      }),
    );
  }
}
