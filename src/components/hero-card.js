import { appendChildren, createElement } from '../utils/dom.js';
import { getAssetUrl } from '../utils/assets.js';

const LANGUAGES = [
  { code: 'pl', label: 'PL' },
  { code: 'en', label: 'EN' },
];

function createDraftBadge(labels) {
  return createElement('span', { className: 'draft-badge', text: labels.draft || 'Szkic' });
}

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
  const card = createElement('header', { className: `hero-card${hero.avatar?.src ? '' : ' hero-card--no-avatar'}` });
  const content = createElement('div', { className: 'hero-card__content' });
  const avatarAlt = hero.avatar?.alt?.[language] || hero.avatar?.alt?.pl || '';
  const media = hero.avatar?.src
    ? createElement('div', { className: 'hero-card__media' })
    : null;

  if (media) {
    const screenAvatar = createElement('img', {
      className: 'hero-card__avatar hero-card__avatar--screen',
      attributes: { src: getAssetUrl(hero.avatar.src), alt: avatarAlt },
    });
    const printAvatar = createElement('img', {
      className: 'hero-card__avatar hero-card__avatar--print',
      attributes: { src: getAssetUrl(hero.avatar.printSrc || hero.avatar.src), alt: avatarAlt },
    });

    appendChildren(media, [screenAvatar, printAvatar]);
  }
  const title = createElement('h1', { className: 'hero-card__name', text: hero.name });
  const headline = hero.headline ? createElement('p', { className: 'hero-card__headline', text: hero.headline }) : null;
  const description = hero.description ? createElement('p', { className: 'hero-card__description', text: hero.description }) : null;
  const profileInfo = hero.profileInfo ? createElement('p', { className: 'hero-card__profile', text: hero.profileInfo }) : null;
  const company = hero.companyName
    ? createElement('p', { className: 'hero-card__company', text: `${hero.companyLabel} ${hero.companyName}` })
    : null;
  const skills = createElement('ul', { className: 'hero-card__skills', attributes: { 'aria-label': labels.featuredSkills || 'Wyróżnione umiejętności' } });

  if (description && hero.descriptionIsDraft) {
    description.appendChild(createDraftBadge(labels));
  }

  hero.skills.forEach((skill) => {
    const item = createElement('li', { text: skill.name });
    if (skill.isDraft) item.appendChild(createDraftBadge(labels));
    skills.appendChild(item);
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
    profileInfo,
  ]);

  return appendChildren(card, [
    content,
    actions.children.length ? actions : null,
    media,
    company,
  ]);
}
