// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export type RemoteData = {
    backend: string;
};

const data = {
    backend: 'http://localhost:8000'
} as RemoteData;

export async function fetchRemotes() {
    return data;
}

export default function getRemotes(
    req: NextApiRequest,
    res: NextApiResponse<RemoteData>
) {
    // FIXME: Production server handling
    res.status(200).json(data);
}
