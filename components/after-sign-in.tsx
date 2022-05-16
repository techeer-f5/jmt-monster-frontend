import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import useSnackbarHandler from '../store/snackbar';
import fetcherGenerator from '../fetcher-generator';
import { TokenValidation } from '../index';
import useAuth from '../store/auth';
import Mine from '../pages/maps/mine';

const fetcher = fetcherGenerator<TokenValidation>();

const AfterSignIn: React.FC<{ mode: 'kakao' | 'google' }> = ({ mode }) => {
    const { user, generateToken, validateToken, fetchUserInfo } = useAuth();
    const { setMessage: setSnackbarMessage } = useSnackbarHandler();

    const provider = mode === 'kakao' ? '카카오' : '구글';

    const router = useRouter();

    const onError = () => {
        setSnackbarMessage(
            'error',
            `${provider} 토큰 인증에서 오류가 발생했습니다.`
        );

        router.push('/');
    };

    // With code parameter
    useEffect(() => {
        if (user) {
            if (!user.extraInfoInjected) {
                router.push('/auth/extra-info');
                return;
            }
            router.push('/');
            return;
        }

        (async () => {
            const params = new URL(document.location.toString()).searchParams;
            const code: string | null = params.get('code');

            if (!code) {
                onError();
                return;
            }

            const token = await generateToken(code, mode);

            console.log({ token });

            const tokenStatus = token ? await validateToken() : false;

            console.log({ tokenStatus });

            if (!tokenStatus) {
                onError();
                return;
            }

            await fetchUserInfo();
        })();
    }, [user]);

    return <Mine />;
};

export default AfterSignIn;
