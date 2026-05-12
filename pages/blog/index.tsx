import type { InferGetStaticPropsType } from "next";
import Link from "next/link";
import Container from "../../components/container";
import distanceToNow from "../../lib/dateRelative";
import { getAllPosts, getNavPages, getSiteSettings } from "../../lib/sanity";

export default function PostsPage({
  allPosts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Container>
      {allPosts.length ? (
        allPosts.map((post) => (
          <article key={post.slug} className="mb-10">
            <Link
              href={`/blog/${post.slug}`}
              className="text-lg leading-6 font-bold"
            >
              {post.title}
            </Link>
            <p>{post.excerpt}</p>
            <div className="text-gray-400">
              <time>{distanceToNow(new Date(post.date))}</time>
            </div>
          </article>
        ))
      ) : (
        <p>No blog posted yet :/</p>
      )}
    </Container>
  );
}

export async function getStaticProps() {
  const [allPosts, settings, navPages] = await Promise.all([
    getAllPosts(),
    getSiteSettings(),
    getNavPages(),
  ]);

  return {
    props: { allPosts, settings: settings ?? null, navPages: navPages ?? [] },
    revalidate: 60,
  };
}
