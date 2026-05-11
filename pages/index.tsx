import type { InferGetStaticPropsType } from "next";
import Container from "../components/container";
import Image from "next/image";
import { getSiteSettings, urlFor } from "../lib/sanity";

export default function HomePage({
  settings,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Container>
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">
            {settings?.heroTitle ?? "Welcome to my blog"}
          </h1>
          {settings?.heroDescription && (
            <p>{settings.heroDescription}</p>
          )}
        </div>
      </Container>

      {settings?.heroImage && (
        <div className="container max-w-4xl m-auto px-4 mt-20">
          <Image
            src={urlFor(settings.heroImage).width(960).height(640).url()}
            alt="Hero"
            width={960}
            height={640}
          />
        </div>
      )}
    </>
  );
}

export async function getStaticProps() {
  const settings = await getSiteSettings();

  return {
    props: { settings: settings ?? null },
    revalidate: 60,
  };
}
