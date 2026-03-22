import type { ReactNode } from "react";

type ContentBlockProps = {
  children: ReactNode;
  className?: string;
};

export function ContentBlock({ children, className = "" }: ContentBlockProps) {
  return (
    <div className={`space-y-4 text-base leading-7 ${className}`.trim()}>
      {children}
    </div>
  );
}
