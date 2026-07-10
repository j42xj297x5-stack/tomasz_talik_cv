import { appendChildren, createElement } from '../utils/dom.js';

export function createAboutSection(items) {
  const container = createElement('div', { className: 'section-content section-content--about' });
  const heading = createElement('h2', { className: 'section-content__title', text: 'O mnie' });
  const body = createElement('div', { className: 'section-content__body' });

  items.forEach((item) => {
    body.appendChild(createElement('p', { text: item.text }));
  });

  return appendChildren(container, [heading, body]);
}
