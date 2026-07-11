import { loadContent } from './content-loader.js';
import { resolveProfile } from './profile-resolver.js';
import { DEFAULT_LANGUAGE, PREVIEW_DRAFT, SUPPORTED_LANGUAGES, createViewModel } from './view-model.js';
import { createAccordion } from '../components/accordion.js';
import { createHeroCard } from '../components/hero-card.js';
import { createAboutSection } from '../sections/about-section.js';
import { createExperienceSection } from '../sections/experience-section.js';
import { createProjectsSection } from '../sections/projects-section.js';
import { appendChildren, createElement } from '../utils/dom.js';

const FALLBACK_MESSAGE = 'Nie znaleziono wskazanej wersji. Pokazuję CV podstawowe.';

function resolvePreviewMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get('preview') === PREVIEW_DRAFT ? PREVIEW_DRAFT : null;
}

function createSectionContent(section, viewModel) {
  if (section.id === 'about') return createAboutSection(viewModel.about, viewModel.labels);
  if (section.id === 'projects') return createProjectsSection(viewModel.projects, viewModel.labels);
  if (section.id === 'experience') return createExperienceSection(viewModel.experience, viewModel.labels);
  return null;
}

export function bootstrap(root) {
  try {
    const { publicContent, profiles } = loadContent();
    const { profile, usedFallback } = resolveProfile(profiles);
    const previewMode = resolvePreviewMode();
    let language = DEFAULT_LANGUAGE;

    if (!profile) {
      throw new Error('Default profile is unavailable.');
    }

    const render = () => {
      document.documentElement.lang = language;
      const viewModel = createViewModel(publicContent, profile, language, { previewMode });
      const main = createElement('main', { className: 'app-shell' });
      const notice = usedFallback
        ? createElement('p', { className: 'notice', text: FALLBACK_MESSAGE, attributes: { role: 'status' } })
        : null;
      const accordionItems = viewModel.sections
        .map((section) => ({ id: section.id, title: section.title, content: createSectionContent(section, viewModel) }))
        .filter((section) => section.content);
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
