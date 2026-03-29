import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteShell } from "@/components/site-shell";
import { defaultMetadata } from "@/lib/seo/metadata";
import { globalJsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/lib/seo/json-ld-script";
import { GoogleAnalytics } from "@/lib/seo/google-analytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = defaultMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen antialiased`}>
        <JsonLdScript data={globalJsonLd()} />
        <GoogleAnalytics />
        <SiteShell>{children}</SiteShell>
        <SpeedInsights />
      </body>
    </html>
  );
}
