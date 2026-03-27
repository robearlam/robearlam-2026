export function normalizeBlogTag(tag: string): string {
  const trimmedTag = tag.trim();

  try {
    return decodeURIComponent(trimmedTag);
  } catch {
    return trimmedTag;
  }
}

export function getBlogTagHref(tag: string): string {
  return `/blog/tag/${encodeURIComponent(normalizeBlogTag(tag))}`;
}