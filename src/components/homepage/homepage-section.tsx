import Link from "next/link";
import type { ReactNode } from "react";

type HomepageSectionProps = {
  heading: string;
  ctaLabel?: string;
  ctaHref?: string;
  children: ReactNode;
};

export function HomepageSection({ heading, ctaLabel, ctaHref, children }: HomepageSectionProps) {
  return (
    <section className="mt-16 space-y-8 sm:mt-24">
      <h2 className="text-3xl font-semibold tracking-tight">{heading}</h2>
      {children}
      {ctaLabel && ctaHref ? (
        <div>
          <Link
            href={ctaHref}
            className="font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {ctaLabel}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
