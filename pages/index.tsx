import type { InferGetStaticPropsType } from "next";
import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { getSiteSettings, getRecentPosts, getNavPages, urlFor } from "../lib/sanity";
import distanceToNow from "../lib/dateRelative";

export default function HomePage({
  settings,
  recentPosts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const sections = settings?.sections ?? [];

  return (
    <div className="space-y-20">
      {/* Sections from Sanity */}
      {sections.map((section: any, index: number) => {
        const hasImage = !!section.image;
        const imageLeft = section.imagePosition === "left";

        return (
          <section key={section._key ?? index} className="container max-w-5xl mx-auto px-4">
            {hasImage ? (
              <div
                className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 ${
                  imageLeft ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1 space-y-4">
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    {section.heading}
                  </h2>
                  {section.body && (
                    <div className="prose prose-lg text-gray-600">
                      <PortableText value={section.body} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Image
                    src={urlFor(section.image).width(800).height(600).url()}
                    alt={section.heading}
                    width={800}
                    height={600}
                    className=""
                    {...(index === 0 ? { priority: true } : {})}
                  />
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-4">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  {section.heading}
                </h2>
                {section.body && (
                  <div className="prose prose-lg max-w-none text-gray-600">
                    <PortableText value={section.body} />
                  </div>
                )}
              </div>
            )}
          </section>
        );
      })}

      {/* Fallback if no sections yet */}
      {sections.length === 0 && (
        <section className="container max-w-5xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Welcome
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Add sections in the Sanity Studio to customise this page.
          </p>
        </section>
      )}

      {/* Recent blog posts */}
      {recentPosts?.length > 0 && (
        <section className="container max-w-5xl mx-auto px-4">
          <div className="border-t border-gray-200 pt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Posts
              </h2>
              <Link
                href="/blog"
                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                View all &rarr;
              </Link>
            </div>
            <ul className="space-y-4">
              {recentPosts.map((post: any) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex items-center justify-between py-2 -mx-3 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-medium text-gray-800 group-hover:text-gray-900">
                      {post.title}
                    </span>
                    <time className="text-sm text-gray-400 shrink-0 ml-4">
                      {distanceToNow(new Date(post.date))}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

export async function getStaticProps() {
  const [settings, recentPosts, navPages] = await Promise.all([
    getSiteSettings(),
    getRecentPosts(),
    getNavPages(),
  ]);

  return {
    props: {
      settings: settings ?? null,
      recentPosts: recentPosts ?? [],
      navPages: navPages ?? [],
    },
    revalidate: 60,
  };
}
