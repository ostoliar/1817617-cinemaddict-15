import AppPresenter from './presenter/app.js';
import { END_POINT, AUTHORIZATION, STORE_NAME, OFFLINE_POSTFIX } from './const.js';
import Api from './api.js';
import Store from './store.js';
import Provider from './provider.js';
import { isOnline } from './utils/common.js';
import { alert, AlertType } from './utils/alert.js';


const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const provider = new Provider(api, store);

const applicationPresenter = new AppPresenter({
  api: provider,
  container: document.body,
});

const onWindowOffline = () => {
  document.title += OFFLINE_POSTFIX;
  alert('Offline mode');
};

if (!isOnline()) {
  onWindowOffline();
}

applicationPresenter.init();

window.addEventListener('online', () => {
  document.title = document.title.replace(OFFLINE_POSTFIX, '');
  alert('Online mode', { type: AlertType.SUCCESS });
  provider.sync();
});

window.addEventListener('offline', onWindowOffline);

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});
