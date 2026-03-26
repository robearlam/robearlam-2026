# Rob Earlam Site App

This folder contains the Next.js 16 application for robearlam.com. It powers a personal editorial site focused on software engineering leadership, writing, speaking engagements, and curated video content.

The app uses the App Router, React 19, and local markdown content sources. Most of the site is built from filesystem-backed content in `data/`, with route-level server components reading and validating frontmatter before rendering.

## What The App Does

- Renders the home page and global shell for the site.
- Serves the blog, including paginated listings, tag pages, monthly archives, and individual post routes.
- Serves the speaking section, split into upcoming and past engagements.
- Serves the videos section, with a featured latest video and paginated listing for the rest.
- Exposes app-level tests and API surface under the App Router structure where needed.

## Main Routes

- `/` homepage with editorial hero and profile content.
- `/blog` paginated blog feed with sidebar navigation.
- `/blog/[slug]` individual blog posts.
- `/blog/tag/[tag]` tag-filtered blog listings.
- `/blog/archive/[year]` and `/blog/archive/[year]/[month]` archive views.
- `/speaking` upcoming and historical speaking engagements.
- `/videos` featured video plus paginated video archive.
- `/contact` contact page.

## Content Model

The application reads content directly from markdown files stored in `data/`:

- `data/blogs/` stores blog posts with validated frontmatter such as title, slug, publish date, abstract, tags, and Disqus ID.
- `data/speaking/` stores speaking engagements with event, session, location, and date metadata.
- `data/videos/` stores video entries with title, video ID, and publish date.

Content loaders in `lib/` recursively read these directories, validate frontmatter, sort entries, and prepare paginated or grouped results for the UI.

## Important Folders

- `app/` App Router routes, layouts, and route handlers.
- `components/` shared UI, editorial layout blocks, and section-specific React components.
- `data/` markdown content for blog posts, talks, and videos.
- `lib/` content parsing, validation, pagination, and section-specific helpers.
- `tests/` Playwright end-to-end tests and test setup.

## Development

From this `src` directory:

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` in the browser.

## Scripts

```bash
pnpm dev         # start the Next.js development server
pnpm build       # create a production build
pnpm start       # run the production build locally
pnpm lint        # run ESLint across the app
pnpm typecheck   # run TypeScript without emitting files
pnpm test        # run Vitest unit tests
pnpm test:watch  # run Vitest in watch mode
pnpm test:e2e    # run Playwright end-to-end tests
```

## Implementation Notes

- The app is built on Next.js 16.1 with the App Router.
- Global layout and metadata live in `app/layout.tsx`.
- Blog and video listings use server-side pagination helpers in `lib/blog/posts.ts` and `lib/videos/videos.ts`.
- Speaking data is partitioned into upcoming and past entries in `lib/speaking/engagements.ts`.
- Styling and UI primitives are composed from the local component library and shared app styles.

## When Updating Content Or Features

- Add or edit markdown files in `data/` when changing blog posts, talks, or videos.
- Update the corresponding parser or type definitions in `lib/` if frontmatter requirements change.
- Keep route behaviour and README notes aligned when new sections or major features are added.
