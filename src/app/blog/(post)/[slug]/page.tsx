import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { MermaidCodeBlock } from "@/components/blog/mermaid-code-block";
import { BlogCommentsSection } from "@/components/blog/blog-comments-section";
import { BlogShareLinks } from "@/components/blog/blog-share-links";
import { BlogTagLink } from "@/components/blog/blog-tag-link";
import { getAllBlogSlugs, getBlogPostBySlug } from "@/lib/blog/posts";
import { pageMetadata } from "@/lib/seo/metadata";
import { blogPostingJsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/lib/seo/json-ld-script";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatPublishDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    ...pageMetadata({
      title: post.title,
      description: post.abstract,
      path: `/blog/${post.slug}`,
      ogImage: post.heroImage,
    }),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-10">
      <JsonLdScript
        data={blogPostingJsonLd({
          title: post.title,
          description: post.abstract,
          slug: post.slug,
          publishDate: post.publishDate,
          heroImage: post.heroImage,
        })}
      />
      <header className="space-y-4">
        <p className="text-sm text-muted-foreground">{formatPublishDate(post.publishDate)}</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{post.title}</h1>

        <ul className="flex flex-wrap gap-2" aria-label="Post tags">
          {post.tags.map((tag) => (
            <li key={tag}>
              <BlogTagLink tag={tag} />
            </li>
          ))}
        </ul>

        <div className="flex justify-center">
          <Image
            src={post.heroImage ?? "/img/blog-images/blog-placeholder.jpg"}
            alt={`Hero image for ${post.title}`}
            className="rounded-xl border border-border object-cover"
            width={600}
            height={315}
          />
        </div>
      </header>

      <section
        className="space-y-6 text-base leading-7 text-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-4 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_td]:border [&_td]:border-border [&_td]:p-2 [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:p-2 [&_ul]:list-disc [&_iframe]:block [&_iframe]:w-full [&_iframe]:aspect-video"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeRaw,
            [
              rehypeSanitize,
              {
                ...defaultSchema,
                tagNames: [...(defaultSchema.tagNames ?? []), "iframe"],
                attributes: {
                  ...defaultSchema.attributes,
                  iframe: ["src", "width", "height", "frameBorder", "allowFullScreen", "allow", "title"],
                  code: [...(defaultSchema.attributes?.code ?? []), "className"],
                },
              },
            ],
          ]}
          components={{
            code: MermaidCodeBlock,
          }}
        >
          {post.content}
        </ReactMarkdown>
      </section>

      <BlogShareLinks title={post.title} slug={post.slug} />

      <BlogCommentsSection disqusId={post.disqusId} slug={post.slug} title={post.title} />

      <footer>
        <Link
          href="/blog"
          className="inline-flex items-center rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Back to blog
        </Link>
      </footer>
    </article>
  );
}