import { useRouter } from 'next/router';
import { CircularProgress, Dialog, Paper } from '@mui/material';
import { type Address } from 'react-daum-postcode';
import { useEffect, useState } from 'react';
import useAuth from '../store/auth';
import { fetchRemotes, RemoteData } from '../utils/remotes';

const googleLoginImage = '/images/google-login-btn.png';
const kakaoLoginImage = '/images/kakao-login-btn.png';

// Original code from https://www.npmjs.com/package/react-daum-postcode
export const handleAddressCompleteGenerator =
    // Currying
    (callback: (address: string) => void) => (data: Address) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress +=
                    extraAddress !== ''
                        ? `, ${data.buildingName}`
                        : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        callback(fullAddress);
    };

const LoginModal = () => {
    const { user, token, validateToken, signOut } = useAuth();
    const [remotes, assignRemotes] = useState<RemoteData | undefined>(
        undefined
    );

    const router = useRouter();

    useEffect(() => {
        (async () => {
            assignRemotes(await fetchRemotes());
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const validation = await validateToken();
            if (!validation) {
                await signOut();
            }
        })();
    }, [token]);

    if (user) {
        return null;
    }

    if (!remotes) {
        return (
            <CircularProgress
                className="white mx-auto my-auto"
                sx={{
                    color: 'white'
                }}
            />
        );
    }
    const { backend } = remotes;

    const performKakaoSignIn = () => {
        router.push(`${backend}/auth/kakao/login`);
    };

    const performGoogleSignIn = () => {};

    const images = [
        {
            image: kakaoLoginImage,
            onClick: performKakaoSignIn
        },
        {
            image: googleLoginImage,
            onClick: performGoogleSignIn
        }
    ].map((elem) => (
        // FIXME: google sign in image to korean
        <img
            key={elem.image}
            src={elem.image}
            className="hover:cursor-pointer w-[60%] mx-auto my-1"
            onClick={elem.onClick}
            alt="login button"
        />
    ));

    return (
        <Dialog
            className="flex flex-grow h-screen w-screen"
            disableAutoFocus
            disableEnforceFocus
            disableEscapeKeyDown
            open
            fullWidth
            maxWidth="sm"
        >
            <Paper className="h-[100%] w-[100%] mx-auto my-auto bg-white flex flex-col flex-shrink pt-[15vh] pb-[17.5vh]">
                <div className="flex flex-shrink flex-1 flex-col mx-auto">
                    <div className="flex flex-1 flex-col flex-shrink mx-auto">
                        <div className="flex-1 text-5xl font-extrabold text-center text-[#ff0000] text-opacity-50 text-red-border mb-3">
                            맛집 몬스터
                        </div>
                        <div className="flex-1 text-2xl md:text-3xl font-bold text-center text-[#252525] mb-8">
                            친구들과 만들어가는 맛집 지도
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col mx-auto my-auto">
                        {images}
                    </div>
                </div>
            </Paper>
        </Dialog>
    );
};

export default LoginModal;
