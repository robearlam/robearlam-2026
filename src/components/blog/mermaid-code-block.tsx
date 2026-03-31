"use client";

import type { ComponentPropsWithoutRef } from "react";
import { MermaidDiagram } from "@/components/blog/mermaid-diagram";

export function MermaidCodeBlock({ children, className, ...rest }: ComponentPropsWithoutRef<"code">) {
  const isMermaid = typeof className === "string" && className.includes("language-mermaid");

  if (isMermaid) {
    const code = typeof children === "string" ? children : String(children ?? "");
    return <MermaidDiagram code={code.trim()} />;
  }

  return (
    <code className={className} {...rest}>
      {children}
    </code>
  );
}
