import { appendChildren, createElement } from '../utils/dom.js';

function createDraftBadge(labels = {}) {
  return createElement('span', { className: 'draft-badge', text: labels.draft || 'Szkic' });
}

export function createExperienceSection(items, labels = {}) {
  const container = createElement('div', { className: 'section-content section-content--experience' });
  const heading = createElement('h2', { className: 'section-content__title section-content-title', text: labels.experience || 'Doświadczenie' });
  const list = createElement('div', { className: 'experience-list' });

  items.forEach((item) => {
    const article = createElement('article', { className: 'experience-entry' });
    const title = item.title ? createElement('h3', { text: item.title }) : null;
    const summary = item.summary ? createElement('div', { className: 'experience-entry__summary' }) : null;
    if (summary) {
      item.summary.split(/\n{2,}/).forEach((paragraph) => {
        summary.appendChild(createElement('p', { text: paragraph }));
      });
    }
    if (item.isDraft && title) title.appendChild(createDraftBadge(labels));
    list.appendChild(appendChildren(article, [title, summary]));
  });

  return appendChildren(container, [heading, list]);
}
