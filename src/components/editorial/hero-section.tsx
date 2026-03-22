type HeroSectionProps = {
  heading: string;
  lead: string;
};

export function HeroSection({ heading, lead }: HeroSectionProps) {
  return (
    <div className="space-y-4 py-12 sm:py-16">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        {heading}
      </h1>
      <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
        {lead}
      </p>
    </div>
  );
}
