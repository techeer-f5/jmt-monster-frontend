import { useEffect } from 'react';

const useHttps = () => {
    useEffect(() => {
        const { hostname, protocol } = window.location;

        console.log({ hostname });

        if (
            hostname.startsWith('localhost') ||
            hostname.startsWith('127.0.0.1')
        ) {
            return;
        }

        if (protocol.startsWith('https')) {
            return;
        }

        window.location.href = window.location.href.replace('http', 'https');
    }, []);
};

export default useHttps;
