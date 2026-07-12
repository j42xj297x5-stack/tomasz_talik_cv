import { appendChildren, createElement } from '../utils/dom.js';
import { localizedText } from '../app/view-model.js';

const TEXT = {
  pl: {
    title: 'Dane kontaktowe',
    unavailable: 'Dane kontaktowe są obecnie niedostępne.',
    labels: { email: 'E-mail', phone: 'Telefon', location: 'Lokalizacja', workModel: 'Model pracy' },
  },
  en: {
    title: 'Contact details',
    unavailable: 'Contact details are currently unavailable.',
    labels: { email: 'Email', phone: 'Phone', location: 'Location', workModel: 'Work model' },
  },
};

function safeHref(prefix, value) {
  const text = String(value || '').trim();
  return text ? `${prefix}:${encodeURIComponent(text).replace(/%40/g, '@')}` : '';
}

function createValue(field, value) {
  if (field === 'email') {
    return createElement('a', { text: value, attributes: { href: safeHref('mailto', value) } });
  }
  if (field === 'phone') {
    return createElement('a', { text: value, attributes: { href: safeHref('tel', value) } });
  }
  return createElement('span', { text: value });
}

export function createPrivateContact(privateContact, options = {}) {
  const language = options.language === 'en' ? 'en' : 'pl';
  const copy = TEXT[language];

  if (options.status === 'error') {
    return createElement('p', {
      className: 'private-contact-status',
      text: copy.unavailable,
      attributes: { role: 'status' },
    });
  }

  if (!privateContact) return null;

  const fields = ['email', 'phone', 'location', 'workModel']
    .map((field) => ({ field, value: localizedText(privateContact[field], language).trim() }))
    .filter((item) => item.value);

  if (!fields.length) return null;

  const list = createElement('dl', { className: 'private-contact__list' });
  fields.forEach(({ field, value }) => {
    list.appendChild(createElement('dt', { text: copy.labels[field] }));
    list.appendChild(appendChildren(createElement('dd'), [createValue(field, value)]));
  });

  return appendChildren(createElement('section', { className: 'private-contact', attributes: { 'aria-labelledby': 'private-contact-title' } }), [
    createElement('h2', { className: 'private-contact__title', text: copy.title, attributes: { id: 'private-contact-title' } }),
    list,
  ]);
}
