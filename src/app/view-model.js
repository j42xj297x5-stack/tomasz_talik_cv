export const DEFAULT_LANGUAGE = 'pl';
export const SUPPORTED_LANGUAGES = ['pl', 'en'];
export const PREVIEW_DRAFT = 'draft';

export function localizedText(value, language = DEFAULT_LANGUAGE) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value !== 'object') return '';
  if (typeof value[language] === 'string') return value[language];
  if (typeof value[DEFAULT_LANGUAGE] === 'string') return value[DEFAULT_LANGUAGE];
  return Object.values(value).find((item) => typeof item === 'string') || '';
}

function canRenderItem(item, previewMode) {
  if (item?.status === 'archived') return false;
  if (previewMode === PREVIEW_DRAFT) return item?.status === 'published' || item?.status === 'draft';
  return item?.status === 'published';
}

function isDraft(item) {
  return item?.status === 'draft';
}

function isPlaceholderText(value) {
  return /do uzupełnienia|wymaga uzupełnienia/i.test(value);
}

function hasSameText(a, b) {
  return a.trim().localeCompare(b.trim(), 'pl', { sensitivity: 'base' }) === 0;
}

function byProfileOrder(items = [], order = []) {
  const byId = new Map(items.map((item) => [item.id, item]));
  const ordered = order.map((id) => byId.get(id)).filter(Boolean);
  const remaining = items.filter((item) => !order.includes(item.id));
  return [...ordered, ...remaining];
}

function sectionSort(sections, sectionOrder = []) {
  const order = new Map(sectionOrder.map((id, index) => [id, index]));
  return sections.sort((a, b) => (order.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.id) ?? Number.MAX_SAFE_INTEGER));
}

export function createViewModel(publicContent, profile, language = DEFAULT_LANGUAGE, options = {}) {
  const activeLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
  const previewMode = options.previewMode === PREVIEW_DRAFT ? PREVIEW_DRAFT : null;
  const resolveText = (value) => localizedText(value, activeLanguage);
  const contentFilter = (item) => canRenderItem(item, previewMode);
  const skillItems = (publicContent.skills?.items || []).filter(contentFilter);
  const projectItems = (publicContent.projects?.items || []).filter(contentFilter);
  const experienceItems = (publicContent.experience?.items || []).filter(contentFilter);
  const linkItems = (publicContent.links?.items || []).filter(contentFilter);
  const featuredSkillIds = profile.featuredSkillIds || [];
  const visibleSections = new Set(profile.visibleSections || []);

  const skills = byProfileOrder(skillItems, profile.skillOrder)
    .filter((skill) => featuredSkillIds.length === 0 || featuredSkillIds.includes(skill.id))
    .map((skill) => ({ id: skill.id, name: resolveText(skill.name), isDraft: isDraft(skill) }))
    .filter((skill) => skill.name);

  const projects = byProfileOrder(projectItems, profile.projectOrder)
    .map((project) => ({
      id: project.id,
      title: resolveText(project.title),
      summary: resolveText(project.summary),
      isDraft: isDraft(project),
    }))
    .filter((project) => project.title || project.summary);

  const experience = experienceItems
    .map((item) => ({
      id: item.id,
      title: resolveText(item.title),
      summary: resolveText(item.summary),
      isDraft: isDraft(item),
    }))
    .filter((item) => item.title || item.summary);

  const aboutItems = (publicContent.about?.items || [])
    .filter(contentFilter)
    .map((item) => ({ id: item.id, text: resolveText(item.text), isDraft: isDraft(item) }))
    .filter((item) => item.text);

  const name = publicContent.identity?.name || '';
  const preferredHeadline = resolveText(profile.targetRole) || resolveText(profile.headline);
  const headline = preferredHeadline && !hasSameText(preferredHeadline, name) && !isPlaceholderText(preferredHeadline)
    ? preferredHeadline
    : '';
  const profileInfo = profile.profileId !== 'default'
    ? resolveText(profile.companyMessage) || resolveText(profile.company)
    : '';
  const contact = linkItems[0]
    ? { label: resolveText(linkItems[0].label), url: linkItems[0].url, isDraft: isDraft(linkItems[0]) }
    : null;
  const draftLabel = resolveText({ pl: 'Szkic', en: 'Draft' });

  const sections = sectionSort([
    visibleSections.has('about') && aboutItems.length ? { id: 'about', title: resolveText({ pl: 'O mnie', en: 'About me' }) } : null,
    visibleSections.has('projects') && projects.length ? { id: 'projects', title: resolveText({ pl: 'Projekty', en: 'Projects' }) } : null,
    visibleSections.has('experience') && experience.length ? { id: 'experience', title: resolveText({ pl: 'Doświadczenie', en: 'Experience' }) } : null,
  ].filter(Boolean), profile.sectionOrder);

  return {
    language: activeLanguage,
    previewMode,
    labels: {
      about: resolveText({ pl: 'O mnie', en: 'About me' }),
      projects: resolveText({ pl: 'Projekty', en: 'Projects' }),
      experience: resolveText({ pl: 'Doświadczenie', en: 'Experience' }),
      print: resolveText({ pl: 'Zapisz jako PDF', en: 'Save as PDF' }),
      featuredSkills: resolveText({ pl: 'Wyróżnione umiejętności', en: 'Featured skills' }),
      draft: draftLabel,
    },
    hero: {
      name,
      headline,
      description: aboutItems[0]?.text || '',
      descriptionIsDraft: aboutItems[0]?.isDraft || false,
      skills,
      profileInfo,
      portrait: publicContent.identity?.portrait || null,
      pdf: profile.pdf || {},
      contact: contact?.label && contact?.url ? contact : null,
    },
    sections,
    about: visibleSections.has('about') ? aboutItems : [],
    projects: visibleSections.has('projects') ? projects : [],
    experience: visibleSections.has('experience') ? experience : [],
  };
}
