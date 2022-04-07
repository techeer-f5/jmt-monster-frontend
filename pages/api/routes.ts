// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export type RouterDatum = {};

export type RouterData = RouterDatum[];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<RouterData>
) {
  res.status(200).json([]); // TODO: inject router data
}
