import { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSnackbarHandler from '../../../store/snackbar';
import fetcherGenerator from '../../../fetcher-generator';
import { TokenValidation } from '../../../index';
import useAuth from '../../../store/auth';

export interface KakaoAuthProps {
    code?: string;
}

const fetcher = fetcherGenerator<TokenValidation>();

const AfterKakaoSignIn: NextPage<KakaoAuthProps> = ({ code }) => {
    const { user, generateToken, validateToken, fetchUserInfo } = useAuth();
    const { setMessage: setSnackbarMessage } = useSnackbarHandler();

    const router = useRouter();

    const onError = () => {
        setSnackbarMessage(
            'error',
            '카카오 토큰 인증에서 오류가 발생했습니다.'
        );

        router.push('/');
    };

    // Without code
    useEffect(() => {
        if (code) {
            return;
        }

        onError();
    }, [code, router]);

    // With code
    useEffect(() => {
        if (!code) {
            return;
        }
        (async () => {
            const token = await generateToken(code);

            const tokenStatus = await validateToken(token);

            if (!tokenStatus) {
                onError();
                return;
            }

            await fetchUserInfo();
        })();
    }, []);

    return <></>;
};

export default AfterKakaoSignIn;
