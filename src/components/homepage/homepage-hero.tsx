import Image from "next/image";

type HomepageHeroProps = {
  name: string;
  lead: string;
  imageSrc: string;
  imageAlt: string;
};

export function HomepageHero({ name, lead, imageSrc, imageAlt }: HomepageHeroProps) {
  return (
    <section className="border-b border-border py-12 sm:py-20">
      <div className="flex flex-col items-center gap-10 sm:flex-row sm:items-center sm:gap-16">
        <div className="relative h-56 w-56 shrink-0 overflow-hidden rounded-full ring-4 ring-primary/25 ring-offset-4">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="224px"
            priority
            unoptimized
            className="object-cover"
          />
        </div>
        <div className="space-y-5 text-center sm:text-left">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            {name}
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">{lead}</p>
        </div>
      </div>
    </section>
  );
}
