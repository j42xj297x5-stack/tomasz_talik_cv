import { appendChildren, createElement } from '../utils/dom.js';

function createDraftBadge(labels = {}) {
  return createElement('span', { className: 'draft-badge', text: labels.draft || 'Szkic' });
}

export function createSkillsSection(skills, labels = {}) {
  const container = createElement('div', { className: 'section-content section-content--skills' });
  const heading = createElement('h2', { className: 'section-content__title', text: labels.skills || 'Umiejętności' });
  const list = createElement('ul', { className: 'skills-list' });

  skills.forEach((skill) => {
    const item = createElement('li', { className: 'skills-list__item' });
    item.appendChild(createElement('span', { text: skill.name }));
    if (skill.isDraft) item.appendChild(createDraftBadge(labels));
    list.appendChild(item);
  });

  return appendChildren(container, [heading, list]);
}
