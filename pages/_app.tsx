import type { AppProps } from 'next/app';
import Layout from '../components/layout';
import '../styles/globals.css';
import usePwaInstall from '../hooks/use-pwa-install';
import useKakaoApi from '../hooks/use-kakao-api';
import useHttps from '../hooks/use-https';

const MyApp = ({ Component, pageProps }: AppProps) => {
    usePwaInstall();
    useKakaoApi();
    useHttps();

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
};

export default MyApp;
