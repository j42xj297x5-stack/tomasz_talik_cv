import { appendChildren, createElement } from '../utils/dom.js';

function createDraftBadge(labels = {}) {
  return createElement('span', { className: 'draft-badge', text: labels.draft || 'Szkic' });
}

function splitParagraphs(text) {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function createAboutSection(items, labels = {}) {
  const container = createElement('div', { className: 'section-content section-content--about' });
  const heading = createElement('h2', { className: 'section-content__title section-content-title', text: labels.about || 'O mnie' });
  const body = createElement('div', { className: 'section-content__body' });

  items.forEach((item) => {
    const paragraphs = splitParagraphs(item.text);

    paragraphs.forEach((text, index) => {
      const paragraph = createElement('p', { text });
      if (item.isDraft && index === paragraphs.length - 1) paragraph.appendChild(createDraftBadge(labels));
      body.appendChild(paragraph);
    });
  });

  return appendChildren(container, [heading, body]);
}
