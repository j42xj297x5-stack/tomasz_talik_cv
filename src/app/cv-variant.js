export const DEFAULT_CV_VARIANT = 'gamedev';
export const CV_VARIANTS = ['gamedev', 'it-ai'];

export function normalizeCvVariant(value) {
  return CV_VARIANTS.includes(value) ? value : DEFAULT_CV_VARIANT;
}

// Overlay by stable ID before localization/filtering; publication state is always inherited.
function overlayItems(section, patches = []) {
  const byId = new Map(patches.map(({ id, ...patch }) => [id, patch]));
  return { ...section, items: (section?.items || []).map((item) => ({ ...item, ...byId.get(item.id) })) };
}

export function resolveVariantContent(content, profile, options = {}) {
  const cvVariant = normalizeCvVariant(options.cvVariant);
  const variant = content.variants?.[cvVariant];
  if (!variant) return { content, profile, cvVariant };
  const resolvedContent = { ...content };
  for (const section of ['about', 'projects', 'experience', 'skills']) {
    resolvedContent[section] = overlayItems(content[section], variant[section]);
  }
  // Repository profiles retain their presentation settings unless the company explicitly selects a variant.
  const variantSettings = profile.profileId === 'default' || options.hasCompanyVariant === true;
  const resolvedProfile = variantSettings
    ? { ...profile, targetRole: variant.headline, projectOrder: variant.projectOrder,
      skillOrder: variant.skillOrder, featuredSkillIds: variant.featuredSkillIds }
    : { ...profile, targetRole: profile.targetRole || variant.headline };
  return { content: resolvedContent, profile: resolvedProfile, cvVariant };
}
