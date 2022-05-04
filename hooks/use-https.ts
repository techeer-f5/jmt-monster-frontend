import { useEffect } from 'react';

const useHttps = () => {
    useEffect(() => {
        const { origin, protocol } = window.location;

        if (origin.startsWith('localhost') || origin.startsWith('127.0.0.1')) {
            // eslint-disable-next-line no-empty
        } else if (protocol.startsWith('http')) {
            window.location.href = window.location.href.replace(
                'http',
                'https'
            );
        }
    }, []);
};

export default useHttps;
