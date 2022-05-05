import { KeyboardEventHandler, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Dialog, Paper, TextField } from '@mui/material';
import DaumPostcode from 'react-daum-postcode';
import { handleAddressCompleteGenerator } from '../../components/login-modal';
import useSnackbarHandler from '../../store/snackbar';
import useAuth from '../../store/auth';
import Mine from '../maps/mine';

export interface ExtraUserInfos {
    nickname: string;
    address: string;
}

const ExtraInfo = () => {
    const { user } = useAuth();

    const [extraUserInfos, setExtraUserInfos] = useState<ExtraUserInfos>({
        nickname: '',
        address: ''
    });

    const [daumPostCodeStatus, setDaumPostCodeStatus] = useState(false);

    const { setMessage: setSnackbarMessage } = useSnackbarHandler();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, []);

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

        // setExtraInfosSubmitted(true);

        // TODO: Integrate with API
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

    const onKeyPress: KeyboardEventHandler<HTMLDivElement> = (event) => {
        if (event.key === 'Enter') {
            submit();
        }
    };

    // TODO: Edit design as aesthetic
    return (
        <>
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
            <Mine />
        </>
    );
};

export default ExtraInfo;
