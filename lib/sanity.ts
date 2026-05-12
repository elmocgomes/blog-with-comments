import { createClient, groq } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

export const client = createClient({
  projectId: "qsloxqh1",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

const postsQuery = groq`*[_type == "post"] | order(date desc) {
  title,
  "slug": slug.current,
  excerpt,
  date
}`;

const recentPostsQuery = groq`*[_type == "post"] | order(date desc) [0...7] {
  title,
  "slug": slug.current,
  date
}`;

const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  excerpt,
  date,
  body,
  coverImage
}`;

const postSlugsQuery = groq`*[_type == "post"] { "slug": slug.current }`;

const siteSettingsQuery = groq`*[_type == "siteSettings"][0] {
  siteTitle,
  sections[] {
    _key,
    heading,
    body,
    image,
    imagePosition
  }
}`;

export async function getAllPosts() {
  return client.fetch(postsQuery, {});
}

export async function getRecentPosts() {
  return client.fetch(recentPostsQuery, {});
}

export async function getPostBySlug(slug: string) {
  return client.fetch(postBySlugQuery, { slug });
}

export async function getPostSlugs() {
  return client.fetch(postSlugsQuery, {});
}

export async function getSiteSettings() {
  return client.fetch(siteSettingsQuery, {});
}

// Pages
const navPagesQuery = groq`*[_type == "page"] | order(menuOrder asc) {
  title,
  "slug": slug.current
}`;

const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  sections[] {
    _key,
    heading,
    body,
    image,
    imagePosition
  }
}`;

const pageSlugsQuery = groq`*[_type == "page"] { "slug": slug.current }`;

export async function getNavPages() {
  return client.fetch(navPagesQuery, {});
}

export async function getPageBySlug(slug: string) {
  return client.fetch(pageBySlugQuery, { slug });
}

export async function getPageSlugs() {
  return client.fetch(pageSlugsQuery, {});
}
