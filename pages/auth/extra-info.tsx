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

const ExtraInfo = ({
    edit = false,
    completeEdit
}: {
    edit: boolean;
    completeEdit?: () => void;
}) => {
    const { user, signOut, submitExtraInfo } = useAuth();

    const [extraUserInfos, setExtraUserInfos] = useState<ExtraUserInfos>({
        nickname: user?.nickname ?? '',
        address: user?.address ?? ''
    });

    const [daumPostCodeStatus, setDaumPostCodeStatus] = useState(false);

    const { setMessage: setSnackbarMessage } = useSnackbarHandler();
    const router = useRouter();

    useEffect(() => {
        if (!user || (!edit && user && user.extraInfoInjected)) {
            router.push('/');
        }
    }, []);

    const submit = async () => {
        const { nickname, address } = extraUserInfos;

        if (!nickname || !address) {
            setSnackbarMessage(
                'error',
                '닉네임 혹은 주소가 입력되지 않았습니다.'
            );

            return;
        }

        const onFailed = async () => {
            setSnackbarMessage('error', '사용자 정보 입력에 실패했습니다.');
            await signOut();
            await router.push('/');
        };

        try {
            const result = await submitExtraInfo(extraUserInfos, edit);

            if (!result) {
                await onFailed();
                return;
            }
        } catch (e) {
            await onFailed();
            return;
        }

        const message = edit
            ? '사용자 정보가 변경되었습니다.'
            : '사용자 정보가 입력되었습니다. 맛집 몬스터에 오신 것을 환영합니다!';

        setSnackbarMessage('info', message);

        if (completeEdit) {
            completeEdit();
        } else {
            await router.push('/');
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

    const onKeyPress: KeyboardEventHandler<HTMLDivElement> = (event) => {
        if (event.key === 'Enter') {
            (async () => {
                await submit();
            })();
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
                onClose={() => {
                    if (edit && completeEdit) {
                        completeEdit();
                    }
                }}
                fullWidth
                maxWidth="sm"
            >
                <Paper className="h-[100%] w-[100%] my-auto bg-white flex flex-col flex-shrink py-[17.5vh]">
                    <div className="flex flex-shrink flex-1 flex-col">
                        <div className="text-3xl font-bold text-indigo-700 text-center mb-10">
                            {`사용자 정보 ${edit ? '수정' : '입력'}`}
                        </div>
                        <div className="flex flex-col mb-5 space-y-4 mx-2">
                            <TextField
                                className="mx-auto w-[75%]"
                                id="nickname"
                                label="닉네임"
                                variant="standard"
                                autoComplete="off"
                                onKeyPress={onKeyPress}
                                value={extraUserInfos.nickname}
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
                                <Dialog
                                    open={daumPostCodeStatus}
                                    onClick={() => setDaumPostCodeStatus(false)}
                                >
                                    <DaumPostcode
                                        onComplete={onHandleAddressComplete}
                                    />
                                </Dialog>
                            )}
                            <Button
                                onClick={() => void submit()}
                                variant="contained"
                                className="bg-blue-500 text-white mx-auto mt-10 w-[50%]"
                            >
                                {`${edit ? '수정' : '입력'} 완료`}
                            </Button>
                        </div>
                    </div>
                </Paper>
            </Dialog>
            {!edit && <Mine />}
        </>
    );
};

export default ExtraInfo;
