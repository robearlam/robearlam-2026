import { HeroSection } from "@/components/editorial/hero-section";
import { ContentBlock } from "@/components/editorial/content-block";
import { SectionWrapper } from "@/components/editorial/section-wrapper";

export default function Home() {
  return (
    <div className="space-y-12">
      <HeroSection
        heading="Rob Earlam"
        lead="Engineering leader and software architect with a focus on platform engineering, developer experience, and building products that scale. Writing about the craft of software, team leadership, and lessons learned from building in the open."
      />

      <SectionWrapper>
        <ContentBlock>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What I Do</h2>
          <p className="text-muted-foreground">
            I work at the intersection of engineering leadership and hands-on technical delivery. Over the years I have built platforms, led distributed teams, and shipped products across a range of industries. My current interests centre on platform engineering, developer tooling, and the practices that help teams deliver reliably at scale.
          </p>
        </ContentBlock>
      </SectionWrapper>

      <SectionWrapper>
        <ContentBlock>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Writing</h2>
          <p className="text-muted-foreground">
            I write about software engineering, technical architecture, and the human side of building technology. You can find my latest posts on the blog, covering topics from roadmap prioritisation to continuous delivery pipelines and everything in between.
          </p>
        </ContentBlock>
      </SectionWrapper>
    </div>
  );
}
