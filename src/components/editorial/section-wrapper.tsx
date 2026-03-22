import type { ReactNode } from "react";

type SectionWrapperProps = {
  children: ReactNode;
  className?: string;
};

export function SectionWrapper({ children, className = "" }: SectionWrapperProps) {
  return (
    <section className={`py-12 sm:py-16 ${className}`.trim()}>
      {children}
    </section>
  );
}
