import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { getAllBlogPostsWithContent } from "@/lib/blog/posts";
import { canonicalUrl } from "@/lib/seo/canonical";
import { SITE_URL } from "@/lib/seo/constants";

const CHANNEL_TITLE = "Rob Earlam - Blog";
const CHANNEL_DESCRIPTION =
  "Developer advocate, Software Developer, Movie Lover, Music Listener, Pizza Eater, Meat Smoker";

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(markdown);

  return String(result);
}

function cdata(text: string): string {
  return `<![CDATA[ ${text} ]]>`;
}

export async function GET(): Promise<Response> {
  const posts = await getAllBlogPostsWithContent();
  const lastBuildDate = posts.length > 0 ? new Date(posts[0].publishDate).toUTCString() : new Date().toUTCString();

  const itemsHtml = await Promise.all(
    posts.map(async (post) => {
      const url = canonicalUrl(`/blog/${post.slug}`);
      const htmlContent = await markdownToHtml(post.content);
      return `  <item>
    <title>${cdata(post.title)}</title>
    <link>${url}</link>
    <guid>${url}</guid>
    <description>${cdata(post.abstract)}</description>
    <pubDate>${new Date(post.publishDate).toUTCString()}</pubDate>
    <content:encoded>${cdata(htmlContent)}</content:encoded>
  </item>`;
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
  <channel>
    <atom:link href="${SITE_URL}/rss" rel="self" type="application/rss+xml"/>
    <title>${CHANNEL_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${CHANNEL_DESCRIPTION}</description>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${itemsHtml.join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
