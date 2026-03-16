export default function AboutPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About</h1>
      <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
        This page confirms that routes under the App Router inherit the same shared header, main content container, and footer layout.
      </p>
    </section>
  );
}