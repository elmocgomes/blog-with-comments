import Head from "next/head";
import dynamic from "next/dynamic";

const Studio = dynamic(
  () =>
    import("next-sanity/studio").then((mod) => {
      const { NextStudio } = mod;
      return import("../../sanity.config").then((configMod) => {
        return function StudioWrapper() {
          return <NextStudio config={configMod.default} />;
        };
      });
    }),
  { ssr: false, loading: () => <div>Loading Studio...</div> }
);

export default function StudioPage() {
  return (
    <>
      <Head>
        <title>Blog CMS — Studio</title>
      </Head>
      <Studio />
    </>
  );
}
