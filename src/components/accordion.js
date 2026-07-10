import { appendChildren, createElement } from '../utils/dom.js';

export function createAccordion(items) {
  const root = createElement('div', { className: 'accordion' });
  let openId = null;

  const entries = items.map((item, index) => {
    const buttonId = `accordion-button-${item.id}`;
    const panelId = `accordion-panel-${item.id}`;
    const button = createElement('button', {
      className: 'accordion__button',
      text: item.title,
      attributes: {
        id: buttonId,
        type: 'button',
        'aria-expanded': 'false',
        'aria-controls': panelId,
      },
    });
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
    const section = appendChildren(createElement('section', { className: 'accordion__item' }), [button, panel]);
    root.appendChild(section);

    return { id: item.id, button, panel, index };
  });

  function setOpen(nextId) {
    openId = openId === nextId ? null : nextId;
    entries.forEach((entry) => {
      const isOpen = entry.id === openId;
      entry.button.setAttribute('aria-expanded', String(isOpen));
      entry.panel.hidden = !isOpen;
      entry.panel.dataset.open = String(isOpen);
    });
  }

  entries.forEach((entry) => {
    entry.button.addEventListener('click', () => setOpen(entry.id));
  });

  return root;
}
