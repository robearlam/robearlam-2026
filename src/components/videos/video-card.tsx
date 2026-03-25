import { formatVideoDate } from "@/lib/videos/videos";
import type { VideoEntry } from "@/lib/videos/types";

type VideoCardProps = {
  video: VideoEntry;
  featured?: boolean;
};

export function VideoCard({ video, featured = false }: VideoCardProps) {
  const titleClassName = featured
    ? "text-2xl font-semibold tracking-tight sm:text-3xl"
    : "text-lg font-semibold tracking-tight";

  return (
    <article className={featured ? "space-y-5" : "space-y-4"} data-testid={featured ? "featured-video-card" : "video-card"}>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-black/5">
        <iframe
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{formatVideoDate(video.date)}</p>
        <h2 className={titleClassName}>{video.title}</h2>
      </div>
    </article>
  );
}
