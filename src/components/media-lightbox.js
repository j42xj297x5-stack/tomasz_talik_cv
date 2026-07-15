import { createElement } from '../utils/dom.js';
import { getAssetUrl } from '../utils/assets.js';

export function createMediaLightbox({ src, alt, title, openLabel, closeLabel }) {
  const assetUrl = getAssetUrl(src);
  if (!assetUrl || !alt) return null;

  const accessibleOpenLabel = title ? `${openLabel}: ${title}` : openLabel;
  const wrapper = createElement('div', { className: 'media-lightbox' });
  const trigger = createElement('button', {
    className: 'media-lightbox__trigger',
    attributes: { type: 'button', 'aria-haspopup': 'dialog', 'aria-label': accessibleOpenLabel },
  });
  const thumbnail = createElement('img', {
    className: 'media-lightbox__thumbnail',
    attributes: { src: assetUrl, alt, loading: 'lazy' },
  });
  const dialog = createElement('dialog', { className: 'media-lightbox__dialog' });
  const frame = createElement('div', { className: 'media-lightbox__frame' });
  const close = createElement('button', {
    className: 'media-lightbox__close',
    text: closeLabel,
    attributes: { type: 'button', 'aria-label': title ? `${closeLabel}: ${title}` : closeLabel },
  });
  const fullImage = createElement('img', {
    className: 'media-lightbox__image',
    attributes: { src: assetUrl, alt },
  });

  trigger.appendChild(thumbnail);
  frame.append(close, fullImage);
  dialog.appendChild(frame);
  wrapper.append(trigger, dialog);

  trigger.addEventListener('click', () => {
    if (typeof dialog.showModal === 'function') dialog.showModal();
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => trigger.focus());

  return wrapper;
}
