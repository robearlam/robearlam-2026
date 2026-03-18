import type { IconType } from "react-icons";
import { FaBluesky, FaDev, FaGithub, FaLinkedin, FaMastodon, FaYoutube } from "react-icons/fa6";

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
    <section className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Contact</h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Reach out directly by email, or find me on the channels below for updates and writing.
        </p>
      </header>

      <section className="space-y-4" aria-labelledby="external-profiles-heading">
        <h2 id="external-profiles-heading" className="text-xl font-semibold tracking-tight">
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
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-foreground transition-colors hover:border-primary/60 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium sm:text-base">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}