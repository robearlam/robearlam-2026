import { EngagementItem } from "@/components/speaking/engagement-item";
import type { SpeakingEngagement } from "@/lib/speaking/types";

type UpcomingSectionProps = {
  engagements: SpeakingEngagement[];
};

export function UpcomingSection({ engagements }: UpcomingSectionProps) {
  return (
    <section className="space-y-6" aria-labelledby="upcoming-heading">
      <h2 id="upcoming-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Upcoming
      </h2>
      {engagements.length === 0 ? (
        <p className="text-sm text-muted-foreground">No upcoming speaking engagements scheduled.</p>
      ) : (
        <ul className="space-y-6">
          {engagements.map((engagement, index) => (
            <li key={`${engagement.start}-${index}`}>
              <EngagementItem engagement={engagement} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
