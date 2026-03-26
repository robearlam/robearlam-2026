import type { VideoEntry } from "@/lib/videos/types";
import { VideoCard } from "@/components/videos/video-card";

type VideosGridProps = {
  videos: VideoEntry[];
};

export function VideosGrid({ videos }: VideosGridProps) {
  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6" aria-labelledby="more-videos-heading">
      <h2 id="more-videos-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
        More Videos
      </h2>
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <VideoCard key={`${video.date}-${video.videoId}`} video={video} />
        ))}
      </div>
    </section>
  );
}
