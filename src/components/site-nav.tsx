"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

function isCurrentRoute(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <>
      <ul className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="Primary">
        {navLinks.map((link) => {
          const current = isCurrentRoute(pathname, link.href);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`rounded-sm px-1.5 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  current
                    ? "text-primary font-semibold underline decoration-2 decoration-primary underline-offset-4"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <ul className="grid w-full gap-1 border-t border-border pt-3 text-sm font-medium md:hidden" aria-label="Primary mobile">
        {navLinks.map((link) => {
          const current = isCurrentRoute(pathname, link.href);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`block rounded-md px-2.5 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  current
                    ? "bg-primary text-primary-foreground font-semibold underline decoration-2 decoration-primary-foreground underline-offset-4"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}