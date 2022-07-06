import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import qs from 'qs';

import useMapHeader from '../../store/map-header';
import useAuth from '../../store/auth';
import useSnackbarHandler from '../../store/snackbar';
import { fetchRemotes } from '../../utils/remotes';
import { Page } from '../../types/jmtapi';

interface FriendUser {
    id: string;
    name: string;
    email: string;
    nickname: string;
    imageUrl: string | null;
}

export interface Friend {
    id: string;
    fromUser: FriendUser;
    toUser: FriendUser;
}

export interface FriendRequest {
    id: string;
    fromUser: FriendUser;
    toUser: FriendUser;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

const FriendRequestItem = ({
    friendRequest
}: {
    friendRequest: FriendRequest;
}) => {
    return (
        <div className="flex my-2 w-full items-center border-2 border-gray-800 text-gray-800 bg-white">
            <div className="w-20">
                <img
                    alt={`${friendRequest.fromUser.email} profile`}
                    src={
                        friendRequest.fromUser.imageUrl ??
                        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                    }
                    width="100%"
                />
            </div>
            <div className="flex justify-between items-center w-full mx-6">
                <div>{friendRequest.fromUser.name}</div>
                <button
                    type="button"
                    className="p-2 border-2 text-gray-800 border-gray-800 bg-gray-100"
                >
                    수락하기
                </button>
            </div>
        </div>
    );
};

const FriendRequests: NextPage = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { setMessage: setSnackbarMessage } = useSnackbarHandler();
    const { changeTitle, changeLocation } = useMapHeader();
    const [friendRequests, setFriendRequests] =
        useState<Page<FriendRequest> | null>(null);
    const [page, setPage] = useState<number>(0);
    const [size] = useState<number>(5);

    /**
     * Fetches friend requests to the logged in user from API
     *
     * @returns Paginated friend requests to currently logged in user
     */
    const fetchFriendRequests = async () => {
        const { backend } = await fetchRemotes();
        const url = `${backend}/api/v1/friend-requests?`;

        console.log('fetching friend requests');
        console.log(page);
        const params = qs.stringify({
            'to-user-id': user?.id,
            status: 'PENDING',
            offset: page,
            size
        });

        const res = await fetch(url + params, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        });

        if (!res.ok) {
            console.error(res.statusText);
            return;
        }

        const result = (await res.json()) as Page<FriendRequest>;
        console.log(result);
        setFriendRequests(result);
    };

    useEffect(() => {
        changeTitle('친구 요청 관리');
        changeLocation('');

        (async () => {
            await fetchFriendRequests();
        })();

        if (!user) {
            setSnackbarMessage(
                'error',
                '비로그인 사용자는 해당 페이지에 접근이 불가능합니다.'
            );
            router.push('/');
        }
    }, [user, page]);

    return (
        <div className="w-full flex items-center justify-center">
            <div className="flex flex-nowrap flex-col md:w-3/4 w-full md:mx-0 mx-4 h-[85vh] justify-center overflow-y-scroll">
                <div className="flex justify-end space-x-5 w-full">
                    <button
                        type="button"
                        onClick={() => {
                            router.push(
                                '/friends/management',
                                'friends-management',
                                {
                                    shallow: true
                                }
                            );
                        }}
                        className="mb-1 py-1 px-2.5 text-lg font-bold border-2 border-gray-800 text-gray-800 bg-white"
                    >
                        친구 목록 조회
                    </button>
                </div>

                <div className="flex flex-col">
                    {friendRequests?.content?.map(
                        (friendRequest: FriendRequest) => (
                            <FriendRequestItem
                                key={friendRequest.id}
                                friendRequest={friendRequest}
                            />
                        )
                    )}
                </div>

                <div className="flex justify-center mt-3 space-x-5">
                    <button
                        type="button"
                        onClick={() => {}}
                        className="py-1 px-2.5 text-3xl font-bold border-2 border-gray-800 text-gray-800 bg-white"
                    >
                        {`<`}
                    </button>
                    <div
                        className="py-1 px-2.5 text-3xl font-bold border-2
                        border-gray-800 text-gray-800 bg-white"
                    >
                        {friendRequests?.pageable.pageNumber ?? 0 + 1}
                    </div>
                    <button
                        type="button"
                        onClick={() => {}}
                        className="py-1 px-2.5 text-3xl font-bold border-2 border-gray-800 text-gray-800 bg-white"
                    >
                        {`>`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FriendRequests;
