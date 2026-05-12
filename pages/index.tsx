import type { InferGetStaticPropsType } from "next";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { getSiteSettings, urlFor } from "../lib/sanity";

export default function HomePage({
  settings,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <section className="container max-w-5xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            {settings?.heroTitle ?? "Welcome to my blog"}
          </h1>
          {settings?.heroDescription && (
            <div className="prose prose-lg text-gray-600">
              <PortableText value={settings.heroDescription} />
            </div>
          )}
        </div>

        {settings?.heroImage && (
          <div className="flex-1">
            <Image
              src={urlFor(settings.heroImage).width(800).height(600).url()}
              alt={settings?.heroTitle ?? "Hero"}
              width={800}
              height={600}
              className="rounded-xl shadow-lg"
              priority
            />
          </div>
        )}
      </div>
    </section>
  );
}

export async function getStaticProps() {
  const settings = await getSiteSettings();

  return {
    props: { settings: settings ?? null },
    revalidate: 60,
  };
}
