import { appendChildren, createElement } from '../utils/dom.js';
import { getAssetUrl } from '../utils/assets.js';

const LANGUAGES = [
  { code: 'pl', label: 'PL' },
  { code: 'en', label: 'EN' },
];

function createLanguageSwitch(currentLanguage, onLanguageChange) {
  const switcher = createElement('div', {
    className: 'hero-card__language-switch',
    attributes: { 'aria-label': 'Wybór języka CV' },
  });

  LANGUAGES.forEach((language, index) => {
    const button = createElement('button', {
      className: 'hero-card__language-button',
      text: language.label,
      attributes: {
        type: 'button',
        'aria-pressed': String(language.code === currentLanguage),
      },
    });

    button.addEventListener('click', () => onLanguageChange(language.code));
    switcher.appendChild(button);

    if (index < LANGUAGES.length - 1) {
      switcher.appendChild(createElement('span', { className: 'hero-card__language-separator', text: '|' }));
    }
  });

  return switcher;
}

export function createHeroCard(hero, options = {}) {
  const { language = 'pl', labels = {}, onLanguageChange = () => {} } = options;
  const card = createElement('header', { className: 'hero-card' });
  const content = createElement('div', { className: 'hero-card__content' });
  const media = hero.portrait?.src
    ? createElement('img', {
        className: 'hero-card__portrait',
        attributes: { src: getAssetUrl(hero.portrait.src), alt: hero.portrait.alt?.[language] || hero.portrait.alt?.pl || '' },
      })
    : null;
  const title = createElement('h1', { className: 'hero-card__name', text: hero.name });
  const headline = hero.headline ? createElement('p', { className: 'hero-card__headline', text: hero.headline }) : null;
  const description = hero.description ? createElement('p', { className: 'hero-card__description', text: hero.description }) : null;
  const profileInfo = hero.profileInfo ? createElement('p', { className: 'hero-card__profile', text: hero.profileInfo }) : null;
  const skills = createElement('ul', { className: 'hero-card__skills', attributes: { 'aria-label': labels.featuredSkills || 'Wyróżnione umiejętności' } });

  hero.skills.forEach((skill) => {
    skills.appendChild(createElement('li', { text: skill.name }));
  });

  const actions = createElement('div', { className: 'hero-card__actions' });

  if (hero.pdf?.enabled !== false) {
    const printButton = createElement('button', {
      className: 'hero-card__action',
      text: labels.print || 'Zapisz jako PDF',
      attributes: { type: 'button' },
    });

    printButton.addEventListener('click', () => window.print());
    actions.appendChild(printButton);
  }

  if (hero.contact) {
    actions.appendChild(createElement('a', {
      className: 'hero-card__action hero-card__action--secondary',
      text: hero.contact.label,
      attributes: { href: hero.contact.url },
    }));
  }

  appendChildren(content, [
    createLanguageSwitch(language, onLanguageChange),
    title,
    headline,
    description,
    skills.children.length ? skills : null,
    actions.children.length ? actions : null,
    profileInfo,
  ]);
  return appendChildren(card, [content, media]);
}
