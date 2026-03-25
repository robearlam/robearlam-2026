import type { SpeakingEngagement } from "@/lib/speaking/types";

type EngagementItemProps = {
  engagement: SpeakingEngagement;
};

function formatDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function EngagementItem({ engagement }: EngagementItemProps) {
  const { name, sessionName, location, start, end, slides, recording } = engagement;

  return (
    <article className="space-y-1.5">
      <div className="space-y-0.5">
        <p className="font-semibold text-foreground">{name}</p>
        <p className="text-sm italic text-muted-foreground">{sessionName}</p>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
        <span>{location}</span>
        <span>
          {formatDate(start)}
          {end ? <> &ndash; {formatDate(end)}</> : null}
        </span>
      </div>
      {(slides ?? recording) ? (
        <div className="flex flex-wrap gap-3 pt-0.5">
          {slides ? (
            <a
              href={slides}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Slides for ${sessionName} at ${name}`}
              className="text-sm font-medium text-primary underline decoration-primary underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Slides
            </a>
          ) : null}
          {recording ? (
            <a
              href={recording}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Recording of ${sessionName} at ${name}`}
              className="text-sm font-medium text-primary underline decoration-primary underline-offset-4 hover:decoration-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Recording
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
