import { createElement } from './render.js';

const ALERT_TIME = 3000;

export const AlertType = {
  ERROR: 'error',
  SUCCESS: 'success',
};

const getAlertTemplate = (text, { time = ALERT_TIME, type = AlertType.ERROR } = {}) => `
  <div class="alert alert--${type}" style="animation-duration:${time}ms">
    <p class="alert__text">${text}</p>
  </div>
`;

const onAlertNodeAnimationEnd = ({ currentTarget }) => {
  currentTarget.removeEventListener('animationend', onAlertNodeAnimationEnd);
  currentTarget.remove();
};

export const alert = (text, options) => {
  const template = getAlertTemplate(text, options);
  const alertNode = createElement(template);

  alertNode.addEventListener('animationend', onAlertNodeAnimationEnd);

  document.body.appendChild(alertNode);
};
