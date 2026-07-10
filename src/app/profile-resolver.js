const DEFAULT_PROFILE_ID = 'default';

function canUseProfile(profile) {
  return Boolean(profile && profile.profileId && Array.isArray(profile.visibleSections));
}

export function resolveProfile(profiles, search = window.location.search) {
  const params = new URLSearchParams(search);
  const requestedProfileId = params.get('p') || DEFAULT_PROFILE_ID;
  const defaultProfile = profiles[DEFAULT_PROFILE_ID];
  const requestedProfile = profiles[requestedProfileId];

  if (requestedProfileId !== DEFAULT_PROFILE_ID && canUseProfile(requestedProfile)) {
    return { profile: requestedProfile, profileId: requestedProfile.profileId, usedFallback: false };
  }

  if (requestedProfileId === DEFAULT_PROFILE_ID && canUseProfile(defaultProfile)) {
    return { profile: defaultProfile, profileId: DEFAULT_PROFILE_ID, usedFallback: false };
  }

  if (canUseProfile(defaultProfile)) {
    return { profile: defaultProfile, profileId: DEFAULT_PROFILE_ID, usedFallback: requestedProfileId !== DEFAULT_PROFILE_ID };
  }

  return { profile: null, profileId: DEFAULT_PROFILE_ID, usedFallback: true };
}
