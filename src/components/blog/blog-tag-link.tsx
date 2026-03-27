import Link from "next/link";
import { getBlogTagHref } from "@/lib/blog/tags";

type BlogTagLinkProps = {
  tag: string;
};

export function BlogTagLink({ tag }: BlogTagLinkProps) {
  return (
    <Link
      href={getBlogTagHref(tag)}
      className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/60 hover:bg-primary/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      #{tag}
    </Link>
  );
}