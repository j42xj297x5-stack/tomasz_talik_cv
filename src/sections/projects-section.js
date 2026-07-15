import { createMediaLightbox } from '../components/media-lightbox.js';
import { appendChildren, createElement } from '../utils/dom.js';

function createDraftBadge(labels = {}) {
  return createElement('span', { className: 'draft-badge', text: labels.draft || 'Szkic' });
}

export function createProjectsSection(projects, labels = {}) {
  const container = createElement('div', { className: 'section-content section-content--projects' });
  const heading = createElement('h2', { className: 'section-content__title section-content-title', text: labels.projects || 'Projekty' });
  const list = createElement('div', { className: 'project-list' });

  projects.forEach((project) => {
    const article = createElement('article', { className: 'project-card' });
    const title = project.title ? createElement('h3', { text: project.title }) : null;
    const summary = project.summary ? createElement('p', { text: project.summary }) : null;
    const demo = project.demoMedia
      ? createMediaLightbox({
        src: project.demoMedia.src,
        alt: project.demoMedia.alt,
        title: project.title,
        openLabel: labels.enlargeDemo || 'Powiększ demonstrację',
        closeLabel: labels.closeDemo || 'Zamknij demonstrację',
      })
      : null;
    if (project.isDraft && title) title.appendChild(createDraftBadge(labels));
    list.appendChild(appendChildren(article, [title, summary, demo]));
  });

  return appendChildren(container, [heading, list]);
}
