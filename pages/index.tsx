import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Index: NextPage = () => {
    const router = useRouter();

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push('/maps/mine');
    }, []);

    return <></>;
};

export default Index;
