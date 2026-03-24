export const DISQUS_SHORTNAME = "robearlam";

export type DisqusPageConfig = {
  identifier: string;
  title: string;
  urlPath: string;
};

export function getDisqusEmbedUrl(shortname: string): string {
  return `https://${shortname}.disqus.com/embed.js`;
}
