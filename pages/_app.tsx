import "tailwindcss/tailwind.css";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "../components/header";
import Footer from "../components/footer";
import { Auth0Provider } from "@auth0/auth0-react";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isStudio = router.pathname.startsWith("/studio");

  if (isStudio) {
    return <Component {...pageProps} />;
  }

  const siteTitle = pageProps?.settings?.siteTitle;

  return (
    <Auth0Provider
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
    >
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{siteTitle ?? "My Blog"}</title>
      </Head>

      <Header siteTitle={siteTitle} navPages={pageProps?.navPages} />

      <main className="py-14">
        <Component {...pageProps} />
      </main>

      <Footer />
    </Auth0Provider>
  );
}
