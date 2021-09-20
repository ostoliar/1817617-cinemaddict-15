import Abstract from '../views/abstract.js';

const RenderPlace = {
  BEFORE_END: 'beforeend',
  AFTER_BEGIN: 'afterbegin',
};

export const render = (container, element, place = RenderPlace.BEFORE_END) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (element instanceof Abstract) {
    element = element.getElement();
  }

  switch (place) {
    case RenderPlace.BEFORE_END:
      container.append(element);
      break;
    case RenderPlace.AFTER_BEGIN:
      container.prepend(element);
      break;
  }
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};

export const rerender = (newElement, oldElement, container, place = RenderPlace.BEFORE_END) => {
  if (oldElement) {
    replace(newElement, oldElement);
  } else {
    render(container, newElement, place);
  }
};

export const remove = (component) => {
  component.getElement().remove();
  component.removeElement();
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};
