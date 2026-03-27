import type { Metadata } from "next";
import { HeroSection } from "@/components/editorial/hero-section";
import { UpcomingSection } from "@/components/speaking/upcoming-section";
import { PastSection } from "@/components/speaking/past-section";
import {
  getAllEngagements,
  partitionEngagements,
  sortUpcoming,
  sortPastByYear,
} from "@/lib/speaking/engagements";
import { pageMetadata } from "@/lib/seo/metadata";
import { webPageJsonLd, eventJsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/lib/seo/json-ld-script";

export const metadata: Metadata = pageMetadata({
  title: "Speaking",
  description:
    "Find Rob Earlam at upcoming conferences and browse past talks, sessions, and workshops.",
  path: "/speaking",
});

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
      <JsonLdScript
        data={webPageJsonLd({
          name: "Speaking",
          description:
            "Find Rob Earlam at upcoming conferences and browse past talks, sessions, and workshops.",
          path: "/speaking",
        })}
      />
      {allEngagements.map((engagement) => (
        <JsonLdScript
          key={`${engagement.name}-${engagement.start}`}
          data={eventJsonLd({
            name: engagement.name,
            sessionName: engagement.sessionName,
            location: engagement.location,
            start: engagement.start,
            end: engagement.end,
          })}
        />
      ))}
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
