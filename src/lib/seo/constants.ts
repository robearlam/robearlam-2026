/** Site-wide SEO constants — single source of truth for identity and canonical config. */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://robearlam.com";

export const SITE_NAME = "Rob Earlam";

export const SITE_DESCRIPTION =
  "Developer advocate, software developer, and speaker — writing on engineering, product execution, and lessons from building software.";

export const SITE_AUTHOR = {
  name: "Rob Earlam",
  url: SITE_URL,
} as const;

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
