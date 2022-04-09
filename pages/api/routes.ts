// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

// It is draft. every property in this type could be edited, removed or appended.
export type RouterDatum = {
    uri: string;
    name: string;
};

export type RouterData = RouterDatum[];

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<RouterData>
) {
    res.status(200).json([]); // TODO: inject router data
}
