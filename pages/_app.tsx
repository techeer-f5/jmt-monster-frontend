import type { AppProps } from 'next/app';
import Layout from '../components/layout';
import '../styles/globals.css';
import usePwaInstall from '../hooks/use-pwa-install';
import useKakaoApi from '../hooks/use-kakao-api';

const MyApp = ({ Component, pageProps }: AppProps) => {
    usePwaInstall();
    useKakaoApi();

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
};

export default MyApp;
