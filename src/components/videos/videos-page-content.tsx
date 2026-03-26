import { VideoCard } from "@/components/videos/video-card";
import { VideosEmptyState } from "@/components/videos/videos-empty-state";
import { VideosGridClient } from "@/components/videos/videos-grid-client";
import type { VideoEntry } from "@/lib/videos/types";

type VideosPageContentProps = {
  featuredVideo: VideoEntry | undefined;
  initialVideos: VideoEntry[];
  initialHasMore: boolean;
};

export function VideosPageContent({ featuredVideo, initialVideos, initialHasMore }: VideosPageContentProps) {
  if (!featuredVideo) {
    return <VideosEmptyState />;
  }

  return (
    <div className="space-y-12">
      <section className="space-y-4" aria-labelledby="featured-video-heading">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Latest Video</p>
        <div className="space-y-6">
          <h2 id="featured-video-heading" className="sr-only">
            Featured video
          </h2>
          <VideoCard video={featuredVideo} featured />
        </div>
      </section>
          <VideosGridClient initialVideos={initialVideos} initialHasMore={initialHasMore} />
    </div>
  );
}
