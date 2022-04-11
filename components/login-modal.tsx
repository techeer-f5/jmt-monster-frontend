import { useRouter } from 'next/router';
import { KeyboardEventHandler, useState } from 'react';
import { Button, Dialog, Paper, TextField } from '@mui/material';
import DaumPostcode, { type Address } from 'react-daum-postcode';
import useAuth from '../store/auth';
import useSnackbarHandler from '../store/snackbar';

const googleLoginImage = '/images/google-login-btn.png';
const kakaoLoginImage = '/images/kakao-login-btn.png';

interface ExtraUserInfos {
    nickname: string;
    address: string;
}

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
    const { user } = useAuth();

    const [oAuthFinished, setOAuthFinished] = useState(false);
    const [extraInfosSubmitted, setExtraInfosSubmitted] = useState(false);

    const router = useRouter();
    const { asPath: path } = router;

    const { setMessage: setSnackbarMessage } = useSnackbarHandler();

    const performKakaoSignIn = () => {
        setSnackbarMessage(
            'info',
            '카카오 로그인이 완료되었습니다. 최초 로그인 시, 사용자 정보를 입력해 주세요.'
        );
        setOAuthFinished(true);
    };

    const performGoogleSignIn = () => {
        setSnackbarMessage(
            'info',
            '구글 로그인이 완료되었습니다. 최초 로그인 시, 사용자 정보를 입력해 주세요.'
        );
        setOAuthFinished(true);
    };

    const [extraUserInfos, setExtraUserInfos] = useState<ExtraUserInfos>({
        nickname: '',
        address: ''
    });

    const [daumPostCodeStatus, setDaumPostCodeStatus] = useState(false);

    const submit = () => {
        const { nickname, address } = extraUserInfos;

        if (!nickname || !address) {
            setSnackbarMessage(
                'error',
                '닉네임 혹은 주소가 입력되지 않았습니다.'
            );

            return;
        }

        setSnackbarMessage(
            'info',
            '사용자 정보가 입력되었습니다. 맛집 몬스터에 오신 것을 환영합니다!'
        );

        setExtraInfosSubmitted(true);
    };

    const onKeyPress: KeyboardEventHandler<HTMLDivElement> = (event) => {
        if (event.key === 'Enter') {
            submit();
        }
    };

    const onHandleAddressComplete = handleAddressCompleteGenerator(
        (address) => {
            setDaumPostCodeStatus(false);
            setExtraUserInfos({
                ...extraUserInfos,
                address
            });
        }
    );

    const openDaumPostCode = () => {
        setDaumPostCodeStatus(true);
    };

    if (path === '/') {
        return null;
    }

    if (oAuthFinished && extraInfosSubmitted) {
        return null;
    }

    if (oAuthFinished && !extraInfosSubmitted) {
        // TODO: Edit design as aesthetic
        return (
            <Dialog
                disableAutoFocus
                disableEnforceFocus
                disableEscapeKeyDown
                open
                fullWidth
                maxWidth="sm"
            >
                <Paper className="h-[100%] w-[100%] my-auto bg-white flex flex-col flex-shrink py-[17.5vh]">
                    <div className="flex flex-shrink flex-1 flex-col">
                        <div className="text-3xl font-bold text-indigo-700 text-center mb-10">
                            사용자 정보 입력
                        </div>
                        <div className="flex flex-col mb-5 space-y-4">
                            <TextField
                                className="mx-auto w-[75%]"
                                id="nickname"
                                label="닉네임"
                                variant="standard"
                                autoComplete="off"
                                onKeyPress={onKeyPress}
                                onChange={(event: any) =>
                                    setExtraUserInfos({
                                        ...extraUserInfos,
                                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
                                        nickname: event.target.value
                                    })
                                }
                            />
                            <TextField
                                className="mx-auto w-[75%]"
                                id="address"
                                label="집주소"
                                variant="standard"
                                autoComplete="off"
                                onClick={openDaumPostCode}
                                value={extraUserInfos.address}
                                disabled
                            />
                            {daumPostCodeStatus && (
                                // FIXME: Resolves that shows not available message when extend width
                                <Dialog open={daumPostCodeStatus}>
                                    <DaumPostcode
                                        onComplete={onHandleAddressComplete}
                                    />
                                </Dialog>
                            )}
                            <Button
                                onClick={submit}
                                variant="contained"
                                className="bg-blue-500 text-white mx-auto mt-10 w-[50%]"
                            >
                                입력 완료
                            </Button>
                        </div>
                    </div>
                </Paper>
            </Dialog>
        );
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
        // FIXME: google sign in image to korean
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
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
