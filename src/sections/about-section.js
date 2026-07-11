import { appendChildren, createElement } from '../utils/dom.js';

function createDraftBadge(labels = {}) {
  return createElement('span', { className: 'draft-badge', text: labels.draft || 'Szkic' });
}

export function createAboutSection(items, labels = {}) {
  const container = createElement('div', { className: 'section-content section-content--about' });
  const heading = createElement('h2', { className: 'section-content__title section-content-title', text: labels.about || 'O mnie' });
  const body = createElement('div', { className: 'section-content__body' });

  items.forEach((item) => {
    const paragraph = createElement('p', { text: item.text });
    if (item.isDraft) paragraph.appendChild(createDraftBadge(labels));
    body.appendChild(paragraph);
  });

  return appendChildren(container, [heading, body]);
}
