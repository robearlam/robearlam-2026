import { HeroSection } from "@/components/editorial/hero-section";
import { VideosPageContent } from "@/components/videos/videos-page-content";
import { getAllVideos, getPaginatedVideos } from "@/lib/videos/videos";

export const metadata = {
  title: "Videos",
  description: "Browse tutorials, talks, and developer videos in one editorial listing.",
};

export default async function VideosPage() {
  const allVideos = await getAllVideos();
  const featuredVideo = allVideos[0];
  const { videos: initialVideos, hasMore: initialHasMore } = await getPaginatedVideos({ limit: 6, offset: 0 });

  return (
    <div className="space-y-12">
      <HeroSection
        heading="Videos"
        lead="Tutorials, conference talks, and developer videos collected in one place, with the latest release featured first."
      />
      <VideosPageContent featuredVideo={featuredVideo} initialVideos={initialVideos} initialHasMore={initialHasMore} />
    </div>
  );
}
