import { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useSnackbarHandler from '../../../store/snackbar';
import fetcherGenerator from '../../../fetcher-generator';
import { TokenValidation } from '../../../index';
import useAuth from '../../../store/auth';
import Mine from '../../maps/mine';

const fetcher = fetcherGenerator<TokenValidation>();

const AfterKakaoSignIn: NextPage = () => {
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

    // With code parameter
    useEffect(() => {
        if (user) {
            if (!user.extreInfoInjected) {
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

            const token = await generateToken(code);

            console.log({ token });

            const tokenStatus = token ? await validateToken() : false;

            if (!tokenStatus) {
                onError();
                return;
            }

            await fetchUserInfo();
        })();
    }, [user]);

    return <Mine />;
};

export default AfterKakaoSignIn;
