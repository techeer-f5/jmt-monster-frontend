import React, { useState } from 'react';
import { Dialog, Paper } from '@mui/material';

import useAuth from '../store/auth';
import { fetchRemotes } from '../utils/remotes';
import { Page } from '../types/jmtapi';

interface UserResponse {
    id: string;
    name: string;
    email: string;
    nickname: string | null;
    imageUrl: string | null;
}

const FriendRequestModal = ({
    onClickCloseButton
}: {
    onClickCloseButton: () => void;
}) => {
    const { user, token } = useAuth();
    const [inputEmail, setInputEmail] = useState<string>('');
    const [foundUserId, setFoundUserId] = useState<string>('');
    const [isEmailFound, setIsEmailFound] = useState<boolean | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const setErrorMessage = (msg: string) => {
        setErrorMsg(msg);
        setTimeout(() => setErrorMsg(''), 3000);
    };

    /** 사용자 이메일로 ID 조회 */
    const searchUserByEmail = async (email: string) => {
        if (email === user?.email) {
            setErrorMessage('자기 자신에게 친구 요청을 할 수 없습니다.');
            return;
        }

        const { backend } = await fetchRemotes();
        const query = new URLSearchParams({ email }).toString();
        const res = await fetch(`${backend}/api/v1/users?${query}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
                Authorization: `Bearer ${token as string}`
            }
        });

        const result = (await res.json()) as Page<UserResponse>;

        if (result?.content.length > 0) {
            setFoundUserId(result.content[0].id);
            setIsEmailFound(true);
            setErrorMsg('');
        } else {
            setFoundUserId('');
            setIsEmailFound(false);
            setErrorMessage('존재하지 않는 이메일입니다.');
        }
    };

    /** 친구 요청 생성 */
    const createFriendRequest = async (
        fromUserId: string,
        toUserId: string
    ) => {
        if (fromUserId === toUserId) {
            setErrorMessage('자기 자신에게 친구 요청을 할 수 없습니다.');
            return;
        }

        const { backend } = await fetchRemotes();

        const res = await fetch(`${backend}/api/v1/friend-requests`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
                Authorization: `Bearer ${token as string}`
            },
            body: JSON.stringify({ fromUserId, toUserId })
        });

        if (!res.ok) {
            console.error(res.statusText);

            if (res.status === 409) {
                setErrorMessage('이미 친구 요청을 완료한 사용자입니다.');
            }
        }

        setInputEmail('');
        setIsEmailFound(null);
        setIsSuccess(true);

        setTimeout(() => {
            setIsSuccess(false);
        }, 3000);
    };

    const onClickFindFriendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        (async () => {
            await searchUserByEmail(inputEmail);
        })();
    };

    const onClickFriendRequest = (e: React.FormEvent) => {
        e.preventDefault();
        (async () => {
            await createFriendRequest(user?.id as string, foundUserId);
        })();
    };

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
            <Paper className="h-[100%] w-[100%] mx-auto my-auto bg-white flex flex-col flex-shrink pt-[5vh] pb-[5vh] text-center">
                <div className="text-3xl text-[#ff0000] text-opacity-50 text-red-border mb-3">
                    친구 추가
                </div>

                <div className="text-lg text-gray-800 mb-3">
                    추가할 친구의 이메일을 입력하세요.
                </div>

                <div className="flex flex-1 flex-col mx-auto mb-3 my-auto items-center text-lg text-gray-800">
                    <label
                        className="flex items-center mx-auto my-auto space-x-2"
                        htmlFor="friend-email"
                    >
                        <input
                            type="text"
                            name="friend-email"
                            className="border border-gray-800 rounded-sm p-1"
                            placeholder="친구 이메일"
                            value={inputEmail}
                            onChange={(e) => setInputEmail(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={onClickFindFriendEmail}
                            className="py-1 px-2.5 border-2 border-gray-800"
                        >
                            검색
                        </button>
                    </label>
                </div>

                {errorMsg === '' && isSuccess === true && (
                    <div className="items-center mb-3 space-x-2 text-green-500">
                        친구 요청 전송에 성공했습니다.
                    </div>
                )}

                {errorMsg !== '' && (
                    <div className="items-center mb-3 space-x-2 text-red-500">
                        {errorMsg}
                    </div>
                )}

                <div className="flex justify-center space-x-5 text-gray-800">
                    {isEmailFound && (
                        <button
                            type="button"
                            className="py-1 px-2.5 border-2 border-green-400"
                            onClick={onClickFriendRequest}
                        >
                            친구 요청 보내기
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onClickCloseButton}
                        className="py-1 px-2.5 border-2 border-gray-800"
                    >
                        닫기
                    </button>
                </div>
            </Paper>
        </Dialog>
    );
};

export default FriendRequestModal;
