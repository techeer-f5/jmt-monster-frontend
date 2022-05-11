import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ExtraInfo from './auth/extra-info';
import useAuth from '../store/auth';
import useSnackbarHandler from '../store/snackbar';

const Settings: NextPage = () => {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const { setMessage: setSnackbarMessage } = useSnackbarHandler();

    const [editExtrainfo, setEditExtraInfo] = useState(false);
    const completeEditExtraInfo = () => setEditExtraInfo(false);

    const [isSignOut, setIsSignOut] = useState(false);

    const handleSignOut = () => {
        setSnackbarMessage('info', '로그아웃 되었습니다.');
        setIsSignOut(true);
        signOut();
        router.push('/');
    };

    useEffect(() => {
        if (!user && !isSignOut) {
            setSnackbarMessage(
                'error',
                '비로그인 사용자는 설정 페이지에 접근이 불가능합니다.'
            );
            router.push('/');
        }
    }, [user]);

    return (
        <div className="flex flex-col">
            <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-10"
                onClick={() => setEditExtraInfo(true)}
            >
                사용자 정보 수정
            </button>
            <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleSignOut}
            >
                로그아웃
            </button>
            {editExtrainfo && (
                <ExtraInfo edit completeEdit={completeEditExtraInfo} />
            )}
        </div>
    );
};

export default Settings;
