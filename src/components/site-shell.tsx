import Link from "next/link";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="text-base font-semibold tracking-tight">
              Rob Earlam
            </Link>
            <nav aria-label="Primary navigation" className="hidden md:block">
              <SiteNav />
            </nav>
          </div>
          <nav aria-label="Mobile primary navigation" className="md:hidden">
            <SiteNav />
          </nav>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        <div className="mx-auto w-full max-w-[1100px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">{children}</div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between gap-3 px-4 py-4 text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Rob Earlam</p>
          <p>Built with Next.js</p>
        </div>
      </footer>
    </div>
  );
}