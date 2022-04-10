import useSWR from 'swr';
import { ReactNode, useCallback, useMemo } from 'react';
import { Link } from '@mui/material';
import { useRouter } from 'next/router';
import { RouterData } from '../pages/api/routes';

const fetcher = async (url: string): Promise<RouterData> => {
    const res = await fetch(url);

    return (await res.json()) as RouterData;
};

const Navbar = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data: routes, error } = useSWR('/api/routes', fetcher);

    const router = useRouter();
    const { asPath: path } = router;

    const RootNavbar = useCallback(
        ({ children }: { children?: ReactNode }) => (
            <div className="flex flex-row w-screen bg-fuchsia-600 h-[7.5vh]">
                {children}
            </div>
        ),
        []
    );

    const routeDivs = useMemo(() => {
        if (!routes) {
            return [];
        }
        return routes.map((route, idx) => (
            <Link
                key={route.uri}
                className={`flex flex-1 flex-grow no-underline hover:no-underline border-gray-600 ${
                    idx > 0 ? 'border-l-[1px] ' : ' '
                }${idx < routes.length - 1 ? 'border-r-[1px]' : ' '}`}
                href={route.uri}
            >
                <div className="flex flex-1 flex-grow">
                    <div
                        className={`mx-auto my-auto text-xl ${
                            route.uri === path ? 'text-[93C5FD]' : 'text-white'
                        }`}
                    >
                        {route.name}
                    </div>
                </div>
            </Link>
        ));
    }, [routes, path]);

    if (error) {
        return (
            <RootNavbar>
                <div>API 로딩에 실패했습니다.</div>
            </RootNavbar>
        );
    }

    if (!routes) {
        return (
            <RootNavbar>
                <div>API 로딩에 실패했습니다.</div>
            </RootNavbar>
        );
    }

    return <RootNavbar>{routeDivs}</RootNavbar>;
};

export default Navbar;
