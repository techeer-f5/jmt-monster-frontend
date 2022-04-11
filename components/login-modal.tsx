import { useRouter } from 'next/router';
import { useState } from 'react';
import { Dialog } from '@mui/material';
import useAuth from '../store/auth';
import useSnackbarHandler from '../store/snackbar';

const googleLoginImage = '/images/google-login-btn.png';
const kakaoLoginImage = '/images/kakao-login-btn.png';

const LoginModal = () => {
    const { user } = useAuth();

    const [oAuthFinished, setOAuthFinished] = useState(false);
    const [extraInfosSubmitted, SetExtraInfosSubmitted] = useState(false);

    const router = useRouter();
    const { asPath: path } = router;

    const { setMessage: setSnackbarMessage } = useSnackbarHandler();

    const performKakaoSignIn = () => {
        setSnackbarMessage('카카오 로그인이 완료되었습니다.');
        setOAuthFinished(true);
    };

    const performGoogleSignIn = () => {
        setSnackbarMessage('구글 로그인이 완료되었습니다.');
        setOAuthFinished(true);
    };

    if (path === '/') {
        return null;
    }

    if (oAuthFinished && extraInfosSubmitted) {
        return null;
    }

    if (oAuthFinished && !extraInfosSubmitted) {
        // input extra info TODO
        return null;
    }

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
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <img
            key={elem.image}
            src={elem.image}
            className="hover:cursor-pointer w-[15vw] mx-auto my-auto"
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
        >
            <div className="h-[50vh] w-[25vw] mx-auto my-auto bg-white flex flex-col flex-shrink py-[17.5vh]">
                <div className="flex flex-shrink flex-1 flex-col">{images}</div>
            </div>
        </Dialog>
    );
};

export default LoginModal;
