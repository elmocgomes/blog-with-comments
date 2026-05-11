import type { InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import { PortableText } from "@portabletext/react";
import Comment from "../../components/comment";
import Container from "../../components/container";
import distanceToNow from "../../lib/dateRelative";
import { getPostBySlug, getPostSlugs, urlFor } from "../../lib/sanity";
import Head from "next/head";
import Image from "next/image";

const portableTextComponents = {
  types: {
    image: ({ value }: { value: { asset: any; alt?: string } }) => (
      <div className="my-8">
        <Image
          src={urlFor(value).width(800).url()}
          alt={value.alt || "Post image"}
          width={800}
          height={450}
          className="rounded"
        />
      </div>
    ),
  },
};

export default function PostPage({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Container>
      <Head>
        <title>{post.title} | My awesome blog</title>
      </Head>

      {router.isFallback ? (
        <div>Loading...</div>
      ) : (
        <div>
          <article>
            <header>
              <h1 className="text-4xl font-bold">{post.title}</h1>
              {post.excerpt ? (
                <p className="mt-2 text-xl">{post.excerpt}</p>
              ) : null}
              <time className="flex mt-2 text-gray-400">
                {distanceToNow(new Date(post.date))}
              </time>
            </header>

            {post.coverImage && (
              <div className="mt-8">
                <Image
                  src={urlFor(post.coverImage).width(960).height(540).url()}
                  alt={post.title}
                  width={960}
                  height={540}
                  className="rounded"
                />
              </div>
            )}

            <div className="prose mt-10">
              <PortableText
                value={post.body || []}
                components={portableTextComponents}
              />
            </div>
          </article>

          <Comment />
        </div>
      )}
    </Container>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const slugs = await getPostSlugs();

  return {
    paths: (slugs || []).map(({ slug }: { slug: string }) => ({
      params: { slug },
    })),
    fallback: "blocking",
  };
}
