type JsonLdScriptProps = {
  data: Record<string, unknown> | { "@context": string; "@graph": Record<string, unknown>[] };
};

/** Render a JSON-LD script tag for structured data. */
export function JsonLdScript({ data }: JsonLdScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
