import { appendChildren, createElement } from '../utils/dom.js';

function createDraftBadge(labels = {}) {
  return createElement('span', { className: 'draft-badge', text: labels.draft || 'Szkic' });
}

export function createEducationSection(items, labels = {}) {
  const container = createElement('div', { className: 'section-content section-content--education' });
  const heading = createElement('h2', { className: 'section-content__title section-content-title', text: labels.education || 'Wykształcenie' });
  const list = createElement('div', { className: 'education-list' });

  items.forEach((item) => {
    const article = createElement('article', { className: 'education-entry' });
    const title = item.institution ? createElement('h3', { text: item.institution }) : null;
    if (item.isDraft && title) title.appendChild(createDraftBadge(labels));

    const meta = createElement('p', { className: 'education-entry__meta' });
    const metaParts = [item.degree, item.specialization, item.period].filter(Boolean);
    if (metaParts.length) meta.textContent = metaParts.join(' · ');

    const description = createElement('div', { className: 'education-entry__description' });
    item.description.forEach((paragraph) => {
      description.appendChild(createElement('p', { text: paragraph }));
    });

    list.appendChild(appendChildren(article, [title, metaParts.length ? meta : null, description]));
  });

  return appendChildren(container, [heading, list]);
}
