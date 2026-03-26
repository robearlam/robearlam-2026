import { getLatestPosts } from "@/lib/blog/posts";
import { getLatestVideos } from "@/lib/videos/videos";
import { getUpcomingEngagements } from "@/lib/speaking/engagements";
import { HomepageHero } from "@/components/homepage/homepage-hero";
import { HomepageSection } from "@/components/homepage/homepage-section";
import { BlogPostCard } from "@/components/blog/blog-post-card";
import { VideoCard } from "@/components/videos/video-card";
import { EngagementItem } from "@/components/speaking/engagement-item";

export default async function Home() {
  const [latestPosts, latestVideos, upcomingEngagements] = await Promise.all([
    getLatestPosts(3),
    getLatestVideos(3),
    getUpcomingEngagements(new Date()),
  ]);

  return (
    <div>
      <HomepageHero
        name="Rob Earlam"
        lead="Engineering leader and software architect with a focus on platform engineering, developer experience, and building products that scale. Writing about the craft of software, team leadership, and lessons learned from building in the open."
        imageSrc="/img/rob.png"
        imageAlt="Profile photo of Rob Earlam"
      />
      <HomepageSection heading="Latest Writing" ctaLabel="View all posts →" ctaHref="/blog">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {latestPosts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </HomepageSection>
      <HomepageSection heading="Latest Videos" ctaLabel="View all videos →" ctaHref="/videos">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {latestVideos.map((video) => (
            <VideoCard key={video.videoId} video={video} />
          ))}
        </div>
      </HomepageSection>
      {upcomingEngagements.length > 0 && (
        <HomepageSection heading="Upcoming Speaking" ctaLabel="View all speaking →" ctaHref="/speaking">
          <div className="space-y-6">
            {upcomingEngagements.map((engagement) => (
              <EngagementItem key={`${engagement.name}-${engagement.start}`} engagement={engagement} />
            ))}
          </div>
        </HomepageSection>
      )}
    </div>
  );
}
