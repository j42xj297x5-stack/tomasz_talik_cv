import { appendChildren, createElement } from '../utils/dom.js';

export function createHeroCard(hero) {
  const card = createElement('header', { className: 'hero-card' });
  const title = createElement('h1', { className: 'hero-card__name', text: hero.name });
  const headline = hero.headline ? createElement('p', { className: 'hero-card__headline', text: hero.headline }) : null;
  const description = hero.description ? createElement('p', { className: 'hero-card__description', text: hero.description }) : null;
  const profileInfo = hero.profileInfo ? createElement('p', { className: 'hero-card__profile', text: hero.profileInfo }) : null;
  const skills = createElement('ul', { className: 'hero-card__skills', attributes: { 'aria-label': 'Wyróżnione umiejętności' } });

  hero.skills.forEach((skill) => {
    skills.appendChild(createElement('li', { text: skill.name }));
  });

  appendChildren(card, [title, headline, description, skills.children.length ? skills : null, profileInfo]);
  return card;
}
