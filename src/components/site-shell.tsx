import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="relative border-b border-border bg-white">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center" aria-label="Rob Earlam home">
            <Image
              src="/img/logo.png"
              alt="Rob Earlam"
              width={32}
              height={32}
              priority
              unoptimized
              className="h-8 w-auto sm:h-9 lg:h-10"
            />
          </Link>
          <nav aria-label="Primary navigation" className="hidden md:block">
            <SiteNav variant="desktop" />
          </nav>
          <nav aria-label="Mobile primary navigation" className="md:hidden">
            <SiteNav variant="mobile" />
          </nav>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">{children}</div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-center px-4 py-6 text-sm text-muted-foreground sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Rob Earlam</p>
        </div>
      </footer>
    </div>
  );
}