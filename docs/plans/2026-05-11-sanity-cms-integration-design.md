# Sanity CMS Integration Design

## Goal

Replace static markdown blog posts and hardcoded homepage content with Sanity CMS, giving the site owner an embedded editing experience at `/studio`.

## Approach: Embedded Sanity Studio

Sanity Studio hosted inside the Next.js app at `/studio`. Content fetched via GROQ queries in `getStaticProps`. Single repo, single deploy.

## Sanity Project

- Project ID: `qsloxqh1`
- Dataset: `production`

## Schema

### `post`
- `title` (string, required)
- `slug` (slug, sourced from title)
- `excerpt` (text)
- `body` (block content / Portable Text)
- `date` (datetime)
- `coverImage` (image, optional)

### `siteSettings` (singleton)
- `heroTitle` (string)
- `heroDescription` (text)
- `heroImage` (image)

## Architecture

- Content source: Sanity CDN via GROQ (replaces `_posts/*.md` + remark pipeline)
- Post body: Rendered via `@portabletext/react` (replaces `dangerouslySetInnerHTML`)
- Studio: Embedded at `pages/studio/[[...index]].tsx`
- Comments: Auth0 + Redis — unchanged

## File Changes

| Action | File | Purpose |
|--------|------|---------|
| Add | `sanity.config.ts` | Studio config |
| Add | `sanity/schemas/post.ts` | Post document schema |
| Add | `sanity/schemas/siteSettings.ts` | Singleton settings schema |
| Add | `lib/sanity.ts` | Client + GROQ queries |
| Add | `pages/studio/[[...index]].tsx` | Embedded studio |
| Modify | `pages/index.tsx` | Fetch siteSettings |
| Modify | `pages/posts/index.tsx` | Fetch posts from Sanity |
| Modify | `pages/posts/[slug].tsx` | Fetch post + Portable Text |
| Modify | `package.json` | Add deps |
| Delete | `_posts/*.md` | Replaced by Sanity |
| Delete | `lib/getPost.ts` | Replaced by lib/sanity.ts |
| Delete | `lib/markdownToHtml.ts` | Replaced by Portable Text |

## Dependencies

- `sanity` — Studio framework
- `next-sanity` — Next.js integration helpers
- `@sanity/image-url` — Image URL builder
- `@portabletext/react` — Portable Text renderer
