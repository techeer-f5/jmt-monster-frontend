import { useEffect, useRef } from 'react';

const usePwaInstall = () => {
    const deferredPrompt = useRef<Event | null>(null);

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        console.log('Listening for Install prompt');
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt.current = e;
        });
    }, []);
};

export default usePwaInstall;
