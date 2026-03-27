import type { Metadata } from "next";
import { HeroSection } from "@/components/editorial/hero-section";
import { VideosPageContent } from "@/components/videos/videos-page-content";
import { getAllVideos, getPaginatedVideos } from "@/lib/videos/videos";
import { pageMetadata } from "@/lib/seo/metadata";
import { webPageJsonLd, videoObjectJsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/lib/seo/json-ld-script";

export const metadata: Metadata = pageMetadata({
  title: "Videos",
  description: "Browse tutorials, talks, and developer videos in one listing.",
  path: "/videos",
});

export default async function VideosPage() {
  const allVideos = await getAllVideos();
  const featuredVideo = allVideos[0];
  const { videos: initialVideos, hasMore: initialHasMore } = await getPaginatedVideos({ limit: 6, offset: 0 });

  return (
    <div className="space-y-12">
      <JsonLdScript
        data={webPageJsonLd({
          name: "Videos",
          description: "Browse tutorials, talks, and developer videos in one listing.",
          path: "/videos",
        })}
      />
      {allVideos.map((video) => (
        <JsonLdScript
          key={video.videoId}
          data={videoObjectJsonLd({
            title: video.title,
            videoId: video.videoId,
            date: video.date,
          })}
        />
      ))}
      <HeroSection
        heading="Videos"
        lead="Tutorials, conference talks, and developer videos collected in one place."
      />
      <VideosPageContent featuredVideo={featuredVideo} initialVideos={initialVideos} initialHasMore={initialHasMore} />
    </div>
  );
}
