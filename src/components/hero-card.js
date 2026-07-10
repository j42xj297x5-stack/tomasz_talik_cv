import { appendChildren, createElement } from '../utils/dom.js';
import { getAssetUrl } from '../utils/assets.js';

export function createHeroCard(hero) {
  const card = createElement('header', { className: 'hero-card' });
  const content = createElement('div', { className: 'hero-card__content' });
  const media = hero.portrait?.src
    ? createElement('img', {
        className: 'hero-card__portrait',
        attributes: { src: getAssetUrl(hero.portrait.src), alt: hero.portrait.alt?.pl || '' },
      })
    : null;
  const title = createElement('h1', { className: 'hero-card__name', text: hero.name });
  const headline = hero.headline ? createElement('p', { className: 'hero-card__headline', text: hero.headline }) : null;
  const description = hero.description ? createElement('p', { className: 'hero-card__description', text: hero.description }) : null;
  const profileInfo = hero.profileInfo ? createElement('p', { className: 'hero-card__profile', text: hero.profileInfo }) : null;
  const skills = createElement('ul', { className: 'hero-card__skills', attributes: { 'aria-label': 'Wyróżnione umiejętności' } });

  hero.skills.forEach((skill) => {
    skills.appendChild(createElement('li', { text: skill.name }));
  });

  const actions = createElement('div', { className: 'hero-card__actions' });

  if (hero.pdf) {
    actions.appendChild(createElement('a', {
      className: 'hero-card__action',
      text: 'Pobierz PDF',
      attributes: { href: getAssetUrl(hero.pdf), download: '' },
    }));
  }

  if (hero.contact) {
    actions.appendChild(createElement('a', {
      className: 'hero-card__action hero-card__action--secondary',
      text: hero.contact.label,
      attributes: { href: hero.contact.url },
    }));
  }

  appendChildren(content, [title, headline, description, skills.children.length ? skills : null, actions.children.length ? actions : null, profileInfo]);
  return appendChildren(card, [content, media]);
}
