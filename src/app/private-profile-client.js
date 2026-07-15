const PRIVATE_TOKEN_PATTERN = /^[A-Za-z0-9_-]{32,128}$/;
const ALLOWED_FIELDS = ['email', 'phone', 'location', 'workModel'];
const LOCALIZED_KEYS = ['pl', 'en'];
const DEFAULT_TIMEOUT_MS = 7000;

export function canUsePrivateToken(token) {
  return PRIVATE_TOKEN_PATTERN.test(String(token || ''));
}

function trimApiBaseUrl(baseUrl) {
  return String(baseUrl || '').trim().replace(/\/+$/, '');
}

function sanitizeText(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function sanitizeLocalizedObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const keys = Object.keys(value);
  if (!keys.length || keys.some((key) => !LOCALIZED_KEYS.includes(key))) return null;

  const sanitized = {};
  keys.forEach((key) => {
    const text = sanitizeText(value[key]);
    if (text) sanitized[key] = text;
  });

  return Object.keys(sanitized).length ? sanitized : null;
}

function sanitizeContactValue(value, allowLocalized) {
  const text = sanitizeText(value);
  if (text) return text;
  if (allowLocalized) return sanitizeLocalizedObject(value);
  return null;
}

function sanitizePrivateProfile(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (Object.keys(value).some((key) => !ALLOWED_FIELDS.includes(key))) return null;

  const sanitized = {};
  const email = sanitizeContactValue(value.email, false);
  const phone = sanitizeContactValue(value.phone, false);
  const location = sanitizeContactValue(value.location, true);
  const workModel = sanitizeContactValue(value.workModel, true);

  if (email) sanitized.email = email;
  if (phone) sanitized.phone = phone;
  if (location) sanitized.location = location;
  if (workModel) sanitized.workModel = workModel;

  return Object.keys(sanitized).length ? sanitized : null;
}

export async function fetchPrivateProfile(token, options = {}) {
  if (!canUsePrivateToken(token)) return { status: 'idle', data: null };

  const apiBaseUrl = trimApiBaseUrl(options.apiBaseUrl ?? import.meta.env.VITE_PRIVATE_PROFILE_API_URL);
  if (!apiBaseUrl) return { status: 'unavailable', data: null };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  try {
    const response = await (options.fetcher ?? window.fetch.bind(window))(`${apiBaseUrl}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      credentials: 'omit',
      cache: 'no-store',
      signal: controller.signal,
    });

    if (!response.ok) return { status: 'error', data: null };
    const json = await response.json();
    if (!json || typeof json !== 'object' || Array.isArray(json) || json.ok !== true) {
      return { status: 'error', data: null };
    }
    if (!json.profile || typeof json.profile !== 'object' || Array.isArray(json.profile)) {
      return { status: 'error', data: null };
    }

    const data = sanitizePrivateProfile(json.profile);
    return data ? { status: 'ok', data } : { status: 'empty', data: null };
  } catch (_error) {
    return { status: 'error', data: null };
  } finally {
    clearTimeout(timeout);
  }
}
