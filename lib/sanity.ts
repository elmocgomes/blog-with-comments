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
  heroTitle,
  heroDescription,
  heroImage
}`;

export async function getAllPosts() {
  return client.fetch(postsQuery, {});
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
