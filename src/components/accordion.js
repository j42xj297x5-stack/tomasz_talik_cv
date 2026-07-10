import { appendChildren, createElement } from '../utils/dom.js';

export function createAccordion(items) {
  const root = createElement('div', { className: 'accordion' });
  let openId = null;

  const entries = items.map((item) => {
    const buttonId = `accordion-button-${item.id}`;
    const panelId = `accordion-panel-${item.id}`;
    const label = createElement('span', { text: item.title });
    const chevron = createElement('span', { className: 'accordion__chevron', text: '⌄', attributes: { 'aria-hidden': 'true' } });
    const button = appendChildren(createElement('button', {
      className: 'accordion__button',
      attributes: {
        id: buttonId,
        type: 'button',
        'aria-expanded': 'false',
        'aria-controls': panelId,
      },
    }), [label, chevron]);
    const panel = createElement('div', {
      className: 'accordion__panel',
      attributes: {
        id: panelId,
        role: 'region',
        'aria-labelledby': buttonId,
        hidden: '',
      },
    });

    panel.appendChild(item.content);
    root.appendChild(appendChildren(createElement('section', { className: 'accordion__item' }), [button, panel]));

    return { id: item.id, button, panel };
  });

  function setOpen(nextId) {
    openId = openId === nextId ? null : nextId;
    entries.forEach((entry) => {
      const isOpen = entry.id === openId;
      entry.button.setAttribute('aria-expanded', String(isOpen));
      entry.panel.hidden = !isOpen;
    });
  }

  entries.forEach((entry) => {
    entry.button.addEventListener('click', () => setOpen(entry.id));
  });

  return root;
}
