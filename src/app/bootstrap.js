import { loadContent } from './content-loader.js';
import { resolveProfile } from './profile-resolver.js';
import { createViewModel } from './view-model.js';
import { createAccordion } from '../components/accordion.js';
import { createHeroCard } from '../components/hero-card.js';
import { createAboutSection } from '../sections/about-section.js';
import { createProjectsSection } from '../sections/projects-section.js';
import { appendChildren, createElement } from '../utils/dom.js';

const FALLBACK_MESSAGE = 'Nie znaleziono wskazanej wersji. Pokazuję CV podstawowe.';

export function bootstrap(root) {
  try {
    const { publicContent, profiles } = loadContent();
    const { profile, usedFallback } = resolveProfile(profiles);

    if (!profile) {
      throw new Error('Default profile is unavailable.');
    }

    const viewModel = createViewModel(publicContent, profile);
    const main = createElement('main', { className: 'app-shell' });
    const notice = usedFallback
      ? createElement('p', { className: 'notice', text: FALLBACK_MESSAGE, attributes: { role: 'status' } })
      : null;
    const accordionItems = [
      viewModel.about.length ? { id: 'about', title: 'O mnie', content: createAboutSection(viewModel.about) } : null,
      viewModel.projects.length ? { id: 'projects', title: 'Projekty', content: createProjectsSection(viewModel.projects) } : null,
    ].filter(Boolean);
    const accordion = accordionItems.length ? createAccordion(accordionItems) : null;
    const cvCard = appendChildren(createElement('article', { className: 'cv-card' }), [
      createHeroCard(viewModel.hero),
      accordion,
    ]);

    root.replaceChildren(appendChildren(main, [notice, cvCard]));
  } catch (error) {
    console.error(error);
    const message = createElement('main', { className: 'app-shell app-shell--error' });
    message.appendChild(createElement('p', { className: 'notice notice--error', text: 'Nie udało się uruchomić strony. Spróbuj ponownie później.' }));
    root.replaceChildren(message);
  }
}
