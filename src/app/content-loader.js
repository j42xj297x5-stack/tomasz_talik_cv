import identity from '../../content/public/identity.json';
import about from '../../content/public/about.json';
import projects from '../../content/public/projects.json';
import experience from '../../content/public/experience.json';
import skills from '../../content/public/skills.json';
import links from '../../content/public/links.json';

const profileModules = import.meta.glob('../../content/profiles/*.json', {
  eager: true,
  import: 'default',
});

function normalizeProfiles(modules) {
  return Object.values(modules).reduce((profiles, profile) => {
    if (profile && typeof profile.profileId === 'string' && profile.profileId.length > 0) {
      profiles[profile.profileId] = profile;
    }
    return profiles;
  }, {});
}

export function loadContent() {
  return {
    publicContent: {
      identity,
      about,
      projects,
      experience,
      skills,
      links,
    },
    profiles: normalizeProfiles(profileModules),
  };
}
