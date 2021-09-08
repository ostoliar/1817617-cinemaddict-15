const SHOW_TIME = 5000;

const alertContainer = document.createElement('div');
alertContainer.classList.add('alert');
document.body.append(alertContainer);

export const alert = (message) => {
  const alertItem = document.createElement('div');
  alertItem.textContent = message;
  alertItem.classList.add('alert-message');

  alertContainer.append(alertItem);

  setTimeout(() => {
    alertItem.remove();
  }, SHOW_TIME);
};
