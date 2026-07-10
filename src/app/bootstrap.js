import { loadContent } from './content-loader.js';
import { resolveProfile } from './profile-resolver.js';
import { createViewModel } from './view-model.js';
import { createAccordion } from '../components/accordion.js';
import { createHeroCard } from '../components/hero-card.js';
import { createAboutSection } from '../sections/about-section.js';
import { createProjectsSection } from '../sections/projects-section.js';
import { appendChildren, createElement } from '../utils/dom.js';

const FALLBACK_MESSAGE = 'Nie udało się otworzyć wskazanej wersji CV. Wyświetlam wersję podstawową.';

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
    const accordion = createAccordion([
      { id: 'about', title: 'O mnie', content: createAboutSection(viewModel.about) },
      { id: 'projects', title: 'Projekty', content: createProjectsSection(viewModel.projects) },
    ]);

    root.replaceChildren(appendChildren(main, [notice, createHeroCard(viewModel.hero), accordion]));
  } catch (error) {
    console.error(error);
    const message = createElement('main', { className: 'app-shell app-shell--error' });
    message.appendChild(createElement('p', { className: 'notice notice--error', text: 'Nie udało się uruchomić strony. Spróbuj ponownie później.' }));
    root.replaceChildren(message);
  }
}
