import { loadContent } from './content-loader.js';
import { resolveProfile } from './profile-resolver.js';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, createViewModel } from './view-model.js';
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
    let language = DEFAULT_LANGUAGE;

    if (!profile) {
      throw new Error('Default profile is unavailable.');
    }

    const render = () => {
      document.documentElement.lang = language;
      const viewModel = createViewModel(publicContent, profile, language);
      const main = createElement('main', { className: 'app-shell' });
      const notice = usedFallback
        ? createElement('p', { className: 'notice', text: FALLBACK_MESSAGE, attributes: { role: 'status' } })
        : null;
      const accordionItems = [
        viewModel.about.length ? { id: 'about', title: viewModel.labels.about, content: createAboutSection(viewModel.about) } : null,
        viewModel.projects.length ? { id: 'projects', title: viewModel.labels.projects, content: createProjectsSection(viewModel.projects) } : null,
      ].filter(Boolean);
      const accordion = accordionItems.length ? createAccordion(accordionItems) : null;
      const onLanguageChange = (nextLanguage) => {
        if (!SUPPORTED_LANGUAGES.includes(nextLanguage) || nextLanguage === language) return;
        language = nextLanguage;
        render();
      };
      const cvCard = appendChildren(createElement('article', { className: 'cv-card' }), [
        createHeroCard(viewModel.hero, { language: viewModel.language, labels: viewModel.labels, onLanguageChange }),
        accordion,
      ]);

      root.replaceChildren(appendChildren(main, [notice, cvCard]));
    };

    render();
  } catch (error) {
    console.error(error);
    const message = createElement('main', { className: 'app-shell app-shell--error' });
    message.appendChild(createElement('p', { className: 'notice notice--error', text: 'Nie udało się uruchomić strony. Spróbuj ponownie później.' }));
    root.replaceChildren(message);
  }
}
