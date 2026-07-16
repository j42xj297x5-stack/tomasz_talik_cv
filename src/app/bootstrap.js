import { loadContent } from './content-loader.js';
import { fetchPrivateProfile } from './private-profile-client.js';
import { getPrivateAccessToken, resolveProfile } from './profile-resolver.js';
import { DEFAULT_LANGUAGE, PREVIEW_DRAFT, SUPPORTED_LANGUAGES, createViewModel } from './view-model.js';
import { createAccordion } from '../components/accordion.js';
import { createHeroCard } from '../components/hero-card.js';
import { createPrivateContact } from '../components/private-contact.js';
import { createAboutSection } from '../sections/about-section.js';
import { createExperienceSection } from '../sections/experience-section.js';
import { createEducationSection } from '../sections/education-section.js';
import { createProjectsSection } from '../sections/projects-section.js';
import { createSkillsSection } from '../sections/skills-section.js';
import { appendChildren, createElement } from '../utils/dom.js';
import { initGeometricBackground } from '../background/geometric-background.js';

const FALLBACK_MESSAGE = 'Nie znaleziono wskazanej wersji. Pokazuję CV podstawowe.';

function resolvePreviewMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get('preview') === PREVIEW_DRAFT ? PREVIEW_DRAFT : null;
}

function createSectionContent(section, viewModel) {
  if (section.id === 'about') return createAboutSection(viewModel.about, viewModel.labels);
  if (section.id === 'projects') return createProjectsSection(viewModel.projects, viewModel.labels);
  if (section.id === 'experience') return createExperienceSection(viewModel.experience, viewModel.labels);
  if (section.id === 'education') return createEducationSection(viewModel.education, viewModel.labels);
  if (section.id === 'skills') return createSkillsSection({ skills: viewModel.skills, skillCloud: viewModel.skillCloud, skillCategories: viewModel.skillCategories }, viewModel.labels);
  return null;
}

export async function bootstrap(root) {
  try {
    initGeometricBackground();
  } catch (error) {
    console.warn('Decorative background could not be initialized.', error);
  }

  try {
    const { publicContent, profiles } = loadContent();
    const { profile, usedFallback, companyProfile } = await resolveProfile(profiles);
    const previewMode = resolvePreviewMode();
    const privateToken = getPrivateAccessToken();
    let privateContact = null;
    let privateContactStatus = privateToken ? 'loading' : 'idle';
    let language = DEFAULT_LANGUAGE;
    let openAccordionId = null;

    if (!profile) {
      throw new Error('Default profile is unavailable.');
    }

    const render = () => {
      document.documentElement.lang = language;
      const viewModel = createViewModel(publicContent, profile, language, { previewMode, companyName: companyProfile?.companyName || '' });
      const main = createElement('main', { className: 'app-shell' });
      const notice = usedFallback
        ? createElement('p', { className: 'notice', text: FALLBACK_MESSAGE, attributes: { role: 'status' } })
        : null;
      const accordionItems = viewModel.sections
        .map((section) => ({ id: section.id, title: section.title, content: createSectionContent(section, viewModel) }))
        .filter((section) => section.content);
      const accordion = accordionItems.length ? createAccordion(accordionItems) : null;
      if (accordion) {
        accordion.addEventListener('click', (event) => {
          const button = event.target.closest('.accordion__button');
          if (!button) return;
          const id = button.id.replace(/^accordion-button-/, '');
          openAccordionId = button.getAttribute('aria-expanded') === 'true' ? null : id;
        });
      }
      const onLanguageChange = (nextLanguage) => {
        if (!SUPPORTED_LANGUAGES.includes(nextLanguage) || nextLanguage === language) return;
        language = nextLanguage;
        render();
      };
      const contactBlock = createPrivateContact(privateContact, {
        language: viewModel.language,
        status: privateContactStatus === 'error' ? 'error' : privateContactStatus,
      });
      const cvCard = appendChildren(createElement('article', { className: 'cv-card' }), [
        createHeroCard(viewModel.hero, { language: viewModel.language, labels: viewModel.labels, onLanguageChange }),
        contactBlock,
        accordion,
      ]);

      root.replaceChildren(appendChildren(main, [notice, cvCard]));
      if (openAccordionId) {
        root.querySelector(`#accordion-button-${openAccordionId}`)?.click();
      }
    };

    render();
    if (privateToken) {
      fetchPrivateProfile(privateToken).then((result) => {
        if (result.status === 'ok') {
          privateContact = result.data;
          privateContactStatus = 'ok';
        } else if (result.status === 'empty') {
          privateContact = null;
          privateContactStatus = 'idle';
        } else if (result.status !== 'idle') {
          privateContact = null;
          privateContactStatus = 'error';
        }
        render();
      });
    }
  } catch (error) {
    console.error(error);
    const message = createElement('main', { className: 'app-shell app-shell--error' });
    message.appendChild(createElement('p', { className: 'notice notice--error', text: 'Nie udało się uruchomić strony. Spróbuj ponownie później.' }));
    root.replaceChildren(message);
  }
}
