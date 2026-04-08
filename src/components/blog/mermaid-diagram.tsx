"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import {
  getServerThemeSnapshot,
  getThemeSnapshot,
  subscribeToTheme,
} from "@/lib/theme";

type MermaidDiagramProps = {
  code: string;
};

type DiagramState =
  | { status: "loading" }
  | { status: "rendered"; svg: string }
  | { status: "error" };

export function MermaidDiagram({ code }: MermaidDiagramProps) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<DiagramState>({ status: "loading" });
  const dark = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          theme: dark ? "dark" : "default",
        });

        // Mermaid requires an alphanumeric ID (no colons from useId)
        const safeId = `mermaid-${id.replace(/[^a-zA-Z0-9]/g, "")}`;
        const { svg } = await mermaid.render(safeId, code);

        if (!cancelled) {
          setState({ status: "rendered", svg });
        }
      } catch {
        if (!cancelled) {
          setState({ status: "error" });
        }
      }
    }

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [code, id, dark]);

  if (state.status === "loading") {
    return (
      <div
        className="flex min-h-[150px] items-center justify-center rounded border border-border text-sm text-muted-foreground"
        data-testid="mermaid-loading"
      >
        Loading diagram…
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div
        className="flex min-h-[150px] items-center justify-center rounded border border-border bg-muted/30 text-sm text-muted-foreground"
        data-testid="mermaid-error"
      >
        This diagram could not be rendered.
      </div>
    );
  }

  return (
    <div role="img" aria-label="Diagram" data-testid="mermaid-diagram">
      <div
        ref={containerRef}
        className="overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&>svg]:mx-auto"
        tabIndex={0}
        dangerouslySetInnerHTML={{ __html: state.svg }}
      />
    </div>
  );
}
