import { SITE_URL } from "./constants";

/** Build an absolute canonical URL from a relative path. */
export function canonicalUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}
