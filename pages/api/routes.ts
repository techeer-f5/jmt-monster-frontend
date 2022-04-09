// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

// It is draft. every property in this type could be edited, removed or appended.
export type RouterDatum = {
    uri: string;
    name: string;
};

export type RouterData = RouterDatum[];

export default function getRoutes(
    req: NextApiRequest,
    res: NextApiResponse<RouterData>
) {
    res.status(200).json([
        {
            uri: 'maps/mine',
            name: '내 지도'
        },
        {
            uri: 'maps/friends',
            name: '친구 지도'
        },
        {
            uri: 'maps',
            name: '지도 목록'
        },
        {
            uri: 'friends/management',
            name: '친구 관리'
        },
        {
            uri: 'profile',
            name: '프로필'
        },
        {
            uri: 'settings',
            name: '설정'
        }
    ]);
}
