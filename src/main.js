import AppPresenter from './presenter/app.js';
import { END_POINT, AUTHORIZATION, OFFLINE_POSTFIX } from './const.js';
import Api from './api.js';
import Store from './store.js';
import Provider from './provider.js';
import { isOnline } from './utils/common.js';

const STORE_PREFIX = 'cinemaddict-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const provider = new Provider(api, store);

const applicationPresenter = new AppPresenter(document.body, provider);

const onWindowOffline = () => {
  document.title += OFFLINE_POSTFIX;
};

if (!isOnline()) {
  onWindowOffline();
}


applicationPresenter.init();

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/service-worker.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(OFFLINE_POSTFIX, '');
});

window.addEventListener('offline', onWindowOffline);

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/service-worker.js');
});
