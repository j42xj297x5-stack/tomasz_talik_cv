import { createSvgTagCloud } from '../components/svg-tag-cloud.js';
import { appendChildren, createElement } from '../utils/dom.js';

let skillsViewCounter = 0;

function createDraftBadge(labels = {}) {
  return createElement('span', { className: 'draft-badge', text: labels.draft || 'Szkic' });
}

function createCategoryView(categories, labels) {
  const grid = createElement('div', { className: 'skills-category-grid' });
  categories.forEach((category) => {
    const section = createElement('section', { className: 'skills-category' });
    const title = createElement('h3', { className: 'skills-category__title', text: category.name });
    const list = createElement('ul', { className: 'skills-category__list' });
    category.skills.forEach((skill) => {
      const item = createElement('li', { className: 'skills-category__item' });
      item.appendChild(createElement('span', { text: skill.name }));
      if (skill.isDraft) item.appendChild(createDraftBadge(labels));
      list.appendChild(item);
    });
    grid.appendChild(appendChildren(section, [title, list]));
  });
  return grid;
}

export function createSkillsSection(data, labels = {}) {
  const skills = Array.isArray(data) ? data : data.skills || [];
  const skillCloud = Array.isArray(data) ? skills : data.skillCloud || [];
  const skillCategories = Array.isArray(data) ? [] : data.skillCategories || [];
  const container = createElement('div', { className: 'section-content section-content--skills' });
  const heading = createElement('h2', { className: 'section-content__title section-content-title', text: labels.skills || 'Umiejętności' });
  const switchId = `skills-view-${skillsViewCounter += 1}`;
  const tabs = [
    { id: 'cloud', label: labels.skillsCloud || 'Chmura' },
    { id: 'categories', label: labels.skillsCategories || 'Kategorie' },
  ];
  let activeIndex = 0;
  const tablist = createElement('div', { className: 'skills-view-switch', attributes: { role: 'tablist', 'aria-label': labels.skillsView || 'Widok umiejętności' } });
  const tabButtons = tabs.map((tab, index) => createElement('button', {
    className: 'skills-view-switch__tab',
    text: tab.label,
    attributes: { type: 'button', role: 'tab', id: `${switchId}-tab-${tab.id}`, 'aria-controls': `${switchId}-panel-${tab.id}` },
  }));
  tabButtons.forEach((button) => tablist.appendChild(button));

  const cloudPanel = createElement('div', { className: 'skills-view-panel skills-view-panel--cloud', attributes: { role: 'tabpanel', id: `${switchId}-panel-cloud`, 'aria-labelledby': `${switchId}-tab-cloud` } });
  const cloud = createSvgTagCloud(skillCloud, labels);
  cloudPanel.appendChild(cloud.element);
  const categoriesPanel = createElement('div', { className: 'skills-view-panel skills-view-panel--categories', attributes: { role: 'tabpanel', id: `${switchId}-panel-categories`, 'aria-labelledby': `${switchId}-tab-categories` } });
  categoriesPanel.appendChild(createCategoryView(skillCategories, labels));
  const panels = [cloudPanel, categoriesPanel];

  function activate(index, focus = false) {
    activeIndex = index;
    tabButtons.forEach((button, buttonIndex) => {
      const active = buttonIndex === activeIndex;
      button.setAttribute('aria-selected', String(active));
      button.setAttribute('tabindex', active ? '0' : '-1');
      panels[buttonIndex].hidden = !active;
    });
    cloud.setActive(activeIndex === 0);
    if (focus) tabButtons[activeIndex].focus();
  }

  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => activate(index));
    button.addEventListener('keydown', (event) => {
      const keys = { ArrowLeft: activeIndex === 0 ? tabButtons.length - 1 : activeIndex - 1, ArrowRight: (activeIndex + 1) % tabButtons.length, Home: 0, End: tabButtons.length - 1 };
      if (!(event.key in keys)) return;
      event.preventDefault();
      activate(keys[event.key], true);
    });
  });

  activate(0);
  queueMicrotask(() => cloud.setActive(true));
  return appendChildren(container, [heading, tablist, cloudPanel, categoriesPanel]);
}
