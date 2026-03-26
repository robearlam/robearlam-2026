import Image from "next/image";

type HomepageHeroProps = {
  name: string;
  lead: string;
  imageSrc: string;
  imageAlt: string;
};

export function HomepageHero({ name, lead, imageSrc, imageAlt }: HomepageHeroProps) {
  return (
    <section className="py-16 sm:py-24">
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-12">
        <div className="space-y-4 sm:basis-3/5">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {name}
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">{lead}</p>
        </div>
        <div className="flex justify-center sm:basis-2/5">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={171}
            height={171}
            priority
            className="rounded-2xl"
          />
        </div>
      </div>
    </section>
  );
}
