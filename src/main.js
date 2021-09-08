import AppPresenter from './presenter/app.js';
import { END_POINT, AUTHORIZATION } from './const.js';
import Api from './api.js';
import Store from './store.js';
import Provider from './provider.js';

const STORE_PREFIX = 'cinemaddict-localstorage';
const STORE_VER = 'v15';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const provider = new Provider(api, store);

const applicationPresenter = new AppPresenter(document.body, provider);


applicationPresenter.init();

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});
