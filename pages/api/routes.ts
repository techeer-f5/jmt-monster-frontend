// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Icons } from '../../index';

// It is draft. every property in this type could be edited, removed or appended.
export type RouterDatum = {
    uri: string;
    name: string;
    icon?: Icons;
    visible?: boolean; // if it's undefined, implicitly considered true.
};

export type RouterData = RouterDatum[];

export default function getRoutes(
    req: NextApiRequest,
    res: NextApiResponse<RouterData>
) {
    res.status(200).json([
        {
            uri: '/maps/mine',
            name: '내 지도',
            icon: 'Map'
        },
        {
            uri: '/maps',
            name: '지도 목록',
            icon: 'ZoomInMap'
        },
        {
            uri: '/friends/management',
            name: '친구 관리',
            icon: 'People'
        },
        {
            uri: '/profile',
            name: '프로필',
            icon: 'AccountBox'
        },
        {
            uri: '/settings',
            name: '설정',
            icon: 'Settings'
        }
    ]);
}
