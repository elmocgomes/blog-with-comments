import type { InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { getPageBySlug, getPageSlugs, getSiteSettings, urlFor } from "../lib/sanity";

export default function DynamicPage({
  page,
  settings,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const sections = page?.sections ?? [];

  return (
    <>
      <Head>
        <title>
          {page.title} | {settings?.siteTitle ?? "My Blog"}
        </title>
      </Head>

      <div className="space-y-20">
        {sections.map((section: any, index: number) => {
          const hasImage = !!section.image;
          const imageLeft = section.imagePosition === "left";

          return (
            <section
              key={section._key ?? index}
              className="container max-w-5xl mx-auto px-4"
            >
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

        {sections.length === 0 && (
          <section className="container max-w-5xl mx-auto px-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              {page.title}
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Add sections in the Sanity Studio to fill this page.
            </p>
          </section>
        )}
      </div>
    </>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const [page, settings] = await Promise.all([
    getPageBySlug(params.slug),
    getSiteSettings(),
  ]);

  if (!page) {
    return { notFound: true };
  }

  return {
    props: { page, settings: settings ?? null },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const slugs = await getPageSlugs();

  return {
    paths: (slugs || []).map(({ slug }: { slug: string }) => ({
      params: { slug },
    })),
    fallback: "blocking",
  };
}
