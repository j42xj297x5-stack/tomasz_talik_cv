export const DEFAULT_LANGUAGE = 'pl';
export const SUPPORTED_LANGUAGES = ['pl', 'en'];

export function localizedText(value, language = DEFAULT_LANGUAGE) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value !== 'object') return '';
  if (typeof value[language] === 'string') return value[language];
  if (typeof value[DEFAULT_LANGUAGE] === 'string') return value[DEFAULT_LANGUAGE];
  return Object.values(value).find((item) => typeof item === 'string') || '';
}

function isPublished(item) {
  return item?.status === 'published';
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

export function createViewModel(publicContent, profile, language = DEFAULT_LANGUAGE) {
  const activeLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
  const resolveText = (value) => localizedText(value, activeLanguage);
  const skillItems = (publicContent.skills?.items || []).filter(isPublished);
  const projectItems = (publicContent.projects?.items || []).filter(isPublished);
  const linkItems = (publicContent.links?.items || []).filter(isPublished);
  const featuredSkillIds = profile.featuredSkillIds || [];
  const visibleSections = new Set(profile.visibleSections || []);

  const skills = byProfileOrder(skillItems, profile.skillOrder)
    .filter((skill) => featuredSkillIds.length === 0 || featuredSkillIds.includes(skill.id))
    .map((skill) => ({ id: skill.id, name: resolveText(skill.name) }))
    .filter((skill) => skill.name);

  const projects = byProfileOrder(projectItems, profile.projectOrder)
    .map((project) => ({
      id: project.id,
      title: resolveText(project.title),
      summary: resolveText(project.summary),
    }))
    .filter((project) => project.title || project.summary);

  const aboutItems = (publicContent.about?.items || [])
    .filter(isPublished)
    .map((item) => ({ id: item.id, text: resolveText(item.text) }))
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
    ? { label: resolveText(linkItems[0].label), url: linkItems[0].url }
    : null;

  return {
    language: activeLanguage,
    labels: {
      about: resolveText({ pl: 'O mnie', en: 'About me' }),
      projects: resolveText({ pl: 'Projekty', en: 'Projects' }),
      print: resolveText({ pl: 'Zapisz jako PDF', en: 'Save as PDF' }),
      featuredSkills: resolveText({ pl: 'Wyróżnione umiejętności', en: 'Featured skills' }),
    },
    hero: {
      name,
      headline,
      description: aboutItems[0]?.text || '',
      skills,
      profileInfo,
      portrait: publicContent.identity?.portrait || null,
      pdf: profile.pdf || {},
      contact: contact?.label && contact?.url ? contact : null,
    },
    about: visibleSections.has('about') ? aboutItems : [],
    projects: visibleSections.has('projects') ? projects : [],
  };
}
