import { YearGroupAccordion } from "@/components/speaking/year-group-accordion";
import type { SpeakingEngagementsByYear } from "@/lib/speaking/types";

type PastSectionProps = {
  yearGroups: SpeakingEngagementsByYear[];
};

export function PastSection({ yearGroups }: PastSectionProps) {
  return (
    <section className="space-y-6" aria-labelledby="past-heading">
      <h2 id="past-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Past
      </h2>
      {yearGroups.length === 0 ? (
        <p className="text-sm text-muted-foreground">No past speaking engagements available.</p>
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-md border border-border">
          {yearGroups.map(({ year, engagements }) => (
            <YearGroupAccordion key={year} year={year} engagements={engagements} />
          ))}
        </div>
      )}
    </section>
  );
}
