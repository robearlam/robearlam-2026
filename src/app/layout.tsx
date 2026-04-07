import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteShell } from "@/components/site-shell";
import { defaultMetadata } from "@/lib/seo/metadata";
import { globalJsonLd } from "@/lib/seo/json-ld";
import { JsonLdScript } from "@/lib/seo/json-ld-script";
import { GoogleAnalytics } from "@/lib/seo/google-analytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = defaultMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark')}else if(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        <JsonLdScript data={globalJsonLd()} />
        <GoogleAnalytics />
        <SiteShell>{children}</SiteShell>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
