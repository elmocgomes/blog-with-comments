import type { NextApiRequest, NextApiResponse } from "next";
import { getNavPages } from "../../lib/sanity";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const pages = await getNavPages();
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
  res.status(200).json(pages ?? []);
}
