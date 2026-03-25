"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { EngagementItem } from "@/components/speaking/engagement-item";
import type { SpeakingEngagement } from "@/lib/speaking/types";

type YearGroupAccordionProps = {
  year: string;
  engagements: SpeakingEngagement[];
};

export function YearGroupAccordion({ year, engagements }: YearGroupAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerId = `year-trigger-${year}`;
  const panelId = `year-panel-${year}`;

  return (
    <div>
      <h3>
        <button
          id={triggerId}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-center justify-between px-4 py-4 text-left text-base font-semibold tracking-tight transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span>{year}</span>
          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!isOpen}
        className="space-y-4 px-4 pb-4"
      >
        {engagements.map((engagement, index) => (
          <EngagementItem key={`${engagement.start}-${index}`} engagement={engagement} />
        ))}
      </div>
    </div>
  );
}
