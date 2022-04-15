// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export type RemoteData = {
    backend: string;
};

export async function fetchRemotes() {
    return (await (await fetch('/api/remotes')).json()) as RemoteData;
}

export default function getRemotes(
    req: NextApiRequest,
    res: NextApiResponse<RemoteData>
) {
    // FIXME: Production server handling
    res.status(200).json({
        backend: 'http://localhost:8000'
    });
}
