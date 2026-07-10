import { appendChildren, createElement } from '../utils/dom.js';

export function createProjectsSection(projects) {
  const container = createElement('div', { className: 'section-content section-content--projects' });
  const heading = createElement('h2', { className: 'section-content__title', text: 'Projekty' });
  const list = createElement('div', { className: 'project-list' });

  projects.forEach((project) => {
    const article = createElement('article', { className: 'project-card' });
    const title = project.title ? createElement('h3', { text: project.title }) : null;
    const summary = project.summary ? createElement('p', { text: project.summary }) : null;
    list.appendChild(appendChildren(article, [title, summary]));
  });

  return appendChildren(container, [heading, list]);
}
