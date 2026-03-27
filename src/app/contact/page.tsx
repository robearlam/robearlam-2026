import type { Metadata } from "next";
import type { IconType } from "react-icons";
import { FaBluesky, FaDev, FaGithub, FaLinkedin, FaMastodon, FaYoutube } from "react-icons/fa6";
import { HeroSection } from "@/components/editorial/hero-section";
import { SectionWrapper } from "@/components/editorial/section-wrapper";
import { pageMetadata } from "@/lib/seo/metadata";
import { webPageJsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/lib/seo/json-ld-script";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Get in touch with Rob Earlam — find, social profiles, and community links.",
  path: "/contact",
});

type ProfileLink = {
  href: string;
  label: string;
  Icon: IconType;
};

const profileLinks: ProfileLink[] = [
  {
    href: "https://bsky.app/profile/robearlam.com",
    label: "BlueSky",
    Icon: FaBluesky,
  },
  {
    href: "https://mastodon.social/@RobEarlam",
    label: "Mastodon",
    Icon: FaMastodon,
  },
  {
    href: "https://github.com/robearlam",
    label: "GitHub",
    Icon: FaGithub,
  },
  {
    href: "https://www.linkedin.com/in/rob-earlam/",
    label: "LinkedIn",
    Icon: FaLinkedin,
  },
  {
    href: "https://www.youtube.com/playlist?list=PLmTNwpFzRErCW5ibZAkSO8HFSW0Rkiplj",
    label: "YouTube",
    Icon: FaYoutube,
  },
  {
    href: "https://dev.to/robearlam",
    label: "Dev.to",
    Icon: FaDev,
  },
];

export default function ContactPage() {
  return (
    <div className="space-y-12">
      <JsonLdScript
        data={webPageJsonLd({
          name: "Contact",
          description:
            "Get in touch with Rob Earlam — find social profiles, and community links.",
          path: "/contact",
        })}
      />
      <HeroSection
        heading="Contact"
        lead="Reach out directly by email, or find me on the channels below for updates and writing."
      />

      <SectionWrapper>
        <section className="space-y-4" aria-labelledby="external-profiles-heading">
          <h2 id="external-profiles-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            External Profiles
          </h2>

          <ul className="grid gap-3 sm:grid-cols-2" aria-label="Social profiles">
            {profileLinks.map(({ href, label, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} profile`}
                  className="flex items-center gap-3 border-b border-border px-2 py-3 text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium sm:text-base">{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </SectionWrapper>
    </div>
  );
}