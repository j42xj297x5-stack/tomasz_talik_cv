function localizedText(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value !== 'object') return '';
  if (typeof value.pl === 'string') return value.pl;
  return Object.values(value).find((item) => typeof item === 'string') || '';
}

function byProfileOrder(items = [], order = []) {
  const byId = new Map(items.map((item) => [item.id, item]));
  const ordered = order.map((id) => byId.get(id)).filter(Boolean);
  const remaining = items.filter((item) => !order.includes(item.id));
  return [...ordered, ...remaining];
}

export function createViewModel(publicContent, profile) {
  const skillItems = publicContent.skills?.items || [];
  const projectItems = publicContent.projects?.items || [];
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
    .map((item) => ({ id: item.id, text: localizedText(item.text) }))
    .filter((item) => item.text);

  return {
    hero: {
      name: publicContent.identity?.name || '',
      headline: localizedText(profile.headline) || localizedText(profile.targetRole),
      description: aboutItems[0]?.text || '',
      skills,
      profileInfo: localizedText(profile.company) || localizedText(profile.companyMessage),
    },
    about: aboutItems,
    projects,
  };
}
