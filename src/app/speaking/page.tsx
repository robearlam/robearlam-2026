import { HeroSection } from "@/components/editorial/hero-section";
import { UpcomingSection } from "@/components/speaking/upcoming-section";
import { PastSection } from "@/components/speaking/past-section";
import {
  getAllEngagements,
  partitionEngagements,
  sortUpcoming,
  sortPastByYear,
} from "@/lib/speaking/engagements";

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export default async function SpeakingPage() {
  const allEngagements = await getAllEngagements();
  const today = getTodayString();
  const { upcoming, past } = partitionEngagements(allEngagements, today);
  const sortedUpcoming = sortUpcoming(upcoming);
  const yearGroups = sortPastByYear(past);

  return (
    <div className="space-y-12">
      <HeroSection
        heading="Speaking"
        lead="Find me at upcoming conferences and browse past talks, sessions, and workshops."
      />
      <div className="space-y-10">
        <UpcomingSection engagements={sortedUpcoming} />
        <PastSection yearGroups={yearGroups} />
      </div>
    </div>
  );
}
