import { VideoCard } from "@/components/videos/video-card";
import { VideosEmptyState } from "@/components/videos/videos-empty-state";
import { VideosGrid } from "@/components/videos/videos-grid";
import type { VideoEntry } from "@/lib/videos/types";

type VideosPageContentProps = {
  videos: VideoEntry[];
};

export function VideosPageContent({ videos }: VideosPageContentProps) {
  const [featuredVideo, ...remainingVideos] = videos;

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
      <VideosGrid videos={remainingVideos} />
    </div>
  );
}
