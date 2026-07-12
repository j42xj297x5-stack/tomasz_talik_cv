const DEFAULT_PROFILE_ID = 'default';
const COMPANY_TOKEN_PATTERN = /^[A-Za-z0-9_-]{32,128}$/;

function canUseProfile(profile) {
  return Boolean(profile && profile.profileId && Array.isArray(profile.visibleSections));
}

function trimBaseUrl(baseUrl) {
  return String(baseUrl || '/').replace(/\/+$/, '');
}

function getCompanyToken(hash = window.location.hash) {
  const fragment = String(hash || '').replace(/^#/, '');
  const params = new URLSearchParams(fragment);
  const token = params.get('p') || '';
  return COMPANY_TOKEN_PATTERN.test(token) ? token : null;
}

function canUseCompanyProfile(value, token) {
  return Boolean(
    value
      && typeof value === 'object'
      && !Array.isArray(value)
      && Object.keys(value).length === 2
      && value.id === token
      && COMPANY_TOKEN_PATTERN.test(value.id)
      && typeof value.companyName === 'string'
      && value.companyName.trim().length > 0
      && value.companyName.length <= 120,
  );
}

async function loadCompanyProfile(token, baseUrl, fetcher) {
  if (!token) return { companyProfile: null, usedFallback: false };

  try {
    const response = await fetcher(`${trimBaseUrl(baseUrl)}/profiles/${token}.json`, { cache: 'no-store' });
    if (!response.ok) return { companyProfile: null, usedFallback: true };
    const companyProfile = await response.json();
    if (!canUseCompanyProfile(companyProfile, token)) return { companyProfile: null, usedFallback: true };
    return { companyProfile, usedFallback: false };
  } catch (_error) {
    return { companyProfile: null, usedFallback: true };
  }
}

export async function resolveProfile(profiles, search = window.location.search, options = {}) {
  const params = new URLSearchParams(search);
  const requestedProfileId = params.get('p') || DEFAULT_PROFILE_ID;
  const defaultProfile = profiles[DEFAULT_PROFILE_ID];
  const requestedProfile = profiles[requestedProfileId];
  const baseResult = (() => {
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
  })();

  const token = getCompanyToken(options.hash ?? window.location.hash);
  const companyResult = await loadCompanyProfile(
    token,
    options.baseUrl ?? import.meta.env.BASE_URL,
    options.fetcher ?? window.fetch.bind(window),
  );

  return {
    ...baseResult,
    companyProfile: companyResult.companyProfile,
    usedFallback: baseResult.usedFallback || companyResult.usedFallback,
  };
}
