import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type NavPage = { title: string; slug: string };

export default function Header({
  siteTitle,
  navPages,
}: {
  siteTitle?: string;
  navPages?: NavPage[];
}) {
  const router = useRouter();

  // Use server-rendered navPages as fallback, but always fetch fresh data
  // client-side so the nav stays consistent across page navigations
  const { data: pages } = useSWR<NavPage[]>("/api/nav", fetcher, {
    fallbackData: navPages?.length ? navPages : undefined,
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const fixedLinks = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
  ];

  const pageLinks = (pages ?? []).map((p) => ({
    href: `/${p.slug}`,
    label: p.title,
  }));

  const allLinks = [...fixedLinks, ...pageLinks];

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-gray-900 hover:text-gray-700 transition-colors"
        >
          {siteTitle ?? "My Blog"}
        </Link>
        <nav className="flex gap-6">
          {allLinks.map(({ href, label }) => {
            const isActive =
              href === "/"
                ? router.asPath === "/"
                : router.asPath.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-gray-900 underline underline-offset-4"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
