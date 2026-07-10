export function getAssetUrl(logicalPath) {
  if (!logicalPath || typeof logicalPath !== 'string') {
    return '';
  }

  return `${import.meta.env.BASE_URL}${logicalPath.replace(/^\/+/, '')}`;
}
