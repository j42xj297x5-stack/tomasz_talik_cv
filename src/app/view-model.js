function localizedText(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value !== 'object') return '';
  if (typeof value.pl === 'string') return value.pl;
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

export function createViewModel(publicContent, profile) {
  const skillItems = (publicContent.skills?.items || []).filter(isPublished);
  const projectItems = (publicContent.projects?.items || []).filter(isPublished);
  const linkItems = (publicContent.links?.items || []).filter(isPublished);
  const featuredSkillIds = profile.featuredSkillIds || [];

  const skills = byProfileOrder(skillItems, profile.skillOrder)
    .filter((skill) => featuredSkillIds.length === 0 || featuredSkillIds.includes(skill.id))
    .map((skill) => ({ id: skill.id, name: localizedText(skill.name) }))
    .filter((skill) => skill.name);

  const projects = byProfileOrder(projectItems, profile.projectOrder)
    .map((project) => ({
      id: project.id,
      title: localizedText(project.title),
      summary: localizedText(project.summary),
    }))
    .filter((project) => project.title || project.summary);

  const aboutItems = (publicContent.about?.items || [])
    .filter(isPublished)
    .map((item) => ({ id: item.id, text: localizedText(item.text) }))
    .filter((item) => item.text);

  const name = publicContent.identity?.name || '';
  const preferredHeadline = localizedText(profile.targetRole) || localizedText(profile.headline);
  const headline = preferredHeadline && !hasSameText(preferredHeadline, name) && !isPlaceholderText(preferredHeadline)
    ? preferredHeadline
    : '';
  const profileInfo = profile.profileId !== 'default'
    ? localizedText(profile.companyMessage) || localizedText(profile.company)
    : '';
  const contact = linkItems[0]
    ? { label: localizedText(linkItems[0].label), url: linkItems[0].url }
    : null;

  return {
    hero: {
      name,
      headline,
      description: aboutItems[0]?.text || '',
      skills,
      profileInfo,
      portrait: publicContent.identity?.portrait || null,
      pdf: profile.pdf || '',
      contact: contact?.label && contact?.url ? contact : null,
    },
    about: aboutItems,
    projects,
  };
}
