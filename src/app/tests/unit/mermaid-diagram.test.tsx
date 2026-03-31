import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type mermaidModule from "mermaid";

// Mock the mermaid library
vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn(),
  },
}));

import { MermaidDiagram } from "@/components/blog/mermaid-diagram";

let mermaid: typeof mermaidModule;

beforeEach(async () => {
  const mod = await import("mermaid");
  mermaid = vi.mocked(mod.default);
});

describe("MermaidDiagram", () => {
  it("shows a loading placeholder initially", () => {
    vi.mocked(mermaid.render).mockImplementation(() => new Promise(() => {}));

    render(<MermaidDiagram code="graph TD; A-->B;" />);

    expect(screen.getByTestId("mermaid-loading")).toBeInTheDocument();
    expect(screen.getByText("Loading diagram…")).toBeInTheDocument();
  });

  it("renders a diagram for valid mermaid source", async () => {
    vi.mocked(mermaid.render).mockResolvedValue({
      svg: '<svg class="mermaid"><text>Diagram</text></svg>',
      bindFunctions: vi.fn(),
      diagramType: "flowchart",
    });

    render(<MermaidDiagram code="graph TD; A-->B;" />);

    await waitFor(() => {
      expect(screen.getByTestId("mermaid-diagram")).toBeInTheDocument();
    });

    expect(screen.getByRole("img", { name: "Diagram" })).toBeInTheDocument();
  });

  it("displays an error message for invalid mermaid source", async () => {
    vi.mocked(mermaid.render).mockRejectedValue(new Error("Parse error"));

    render(<MermaidDiagram code="this is not valid mermaid" />);

    await waitFor(() => {
      expect(screen.getByTestId("mermaid-error")).toBeInTheDocument();
    });

    expect(screen.getByText("This diagram could not be rendered.")).toBeInTheDocument();
  });

  it("wraps the diagram in an accessible container with role=img", async () => {
    vi.mocked(mermaid.render).mockResolvedValue({
      svg: '<svg class="mermaid"><text>Diagram</text></svg>',
      bindFunctions: vi.fn(),
      diagramType: "flowchart",
    });

    render(<MermaidDiagram code="graph TD; A-->B;" />);

    await waitFor(() => {
      expect(screen.getByTestId("mermaid-diagram")).toBeInTheDocument();
    });

    const container = screen.getByRole("img");
    expect(container).toHaveAttribute("aria-label", "Diagram");
  });

  it("provides a scrollable container for wide diagrams", async () => {
    vi.mocked(mermaid.render).mockResolvedValue({
      svg: '<svg class="mermaid"><text>Wide diagram</text></svg>',
      bindFunctions: vi.fn(),
      diagramType: "flowchart",
    });

    render(<MermaidDiagram code="graph LR; A-->B-->C-->D;" />);

    await waitFor(() => {
      expect(screen.getByTestId("mermaid-diagram")).toBeInTheDocument();
    });

    const scrollContainer = screen.getByTestId("mermaid-diagram").firstElementChild;
    expect(scrollContainer).toHaveAttribute("tabindex", "0");
  });
});
