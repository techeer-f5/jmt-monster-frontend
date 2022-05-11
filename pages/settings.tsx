import type { NextPage } from 'next';
import { useState } from 'react';
import ExtraInfo from './auth/extra-info';

const Settings: NextPage = () => {
    const [editExtrainfo, setEditExtraInfo] = useState(false);
    const completeEditExtraInfo = () => setEditExtraInfo(false);

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
