import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import qs from 'qs';
import { Pagination } from '@mui/material';

import useMapHeader from '../../store/map-header';
import useAuth from '../../store/auth';
import useSnackbarHandler from '../../store/snackbar';
import { fetchRemotes } from '../../utils/remotes';
import { FriendRequest, Page } from '../../types/jmtapi';
import FriendRequestItem from '../../components/friend-request-item';

const FriendRequests: NextPage = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { setMessage: setSnackbarMessage } = useSnackbarHandler();
    const { changeTitle, changeLocation } = useMapHeader();
    const [friendRequests, setFriendRequests] =
        useState<Page<FriendRequest> | null>(null);
    const [page, setPage] = useState<number>(1);
    const [size] = useState<number>(5);

    /**
     * Fetches friend requests to the logged in user from API
     *
     * @returns Paginated friend requests to currently logged in user
     */
    const fetchFriendRequests: () => Promise<void> = async () => {
        const { backend } = await fetchRemotes();
        const url = `${backend}/api/v1/friend-requests?`;

        const params = qs.stringify({
            'to-user-id': user?.id,
            status: 'PENDING',
            page: page - 1,
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
        setFriendRequests(result);
    };

    useEffect(() => {
        changeTitle('친구 요청 관리');
        changeLocation('');

        if (!user) {
            setSnackbarMessage(
                'error',
                '비로그인 사용자는 해당 페이지에 접근이 불가능합니다.'
            );
            router.push('/');
        }

        (async () => {
            await fetchFriendRequests();
        })();
    }, [user, page]);

    return (
        <div className="w-full flex items-center justify-center">
            <div className="flex flex-nowrap flex-col md:w-3/4 w-full md:mx-0 mx-4 h-[85vh] justify-center overflow-y-scroll">
                <div className="flex justify-end space-x-5 w-full">
                    <button
                        type="button"
                        onClick={() => {
                            router.push('/friends/management', 'management', {
                                shallow: true
                            });
                        }}
                        className="mb-1 py-1 px-2.5 text-lg font-bold border-2 border-gray-800 text-gray-800 bg-white"
                    >
                        친구 목록 조회
                    </button>
                </div>

                <div className="flex flex-col">
                    {friendRequests && friendRequests?.totalElements > 0 ? (
                        friendRequests?.content?.map(
                            (friendRequest: FriendRequest) => (
                                <FriendRequestItem
                                    key={friendRequest.id}
                                    friendRequest={friendRequest}
                                    fetchFriendRequests={fetchFriendRequests}
                                />
                            )
                        )
                    ) : (
                        <div className="text-center my-5 text-xl font-bold">
                            친구 요청 목록이 비었습니다.
                        </div>
                    )}
                </div>

                <div className="flex justify-center mt-3 space-x-5">
                    {friendRequests && (
                        <Pagination
                            count={friendRequests.totalPages}
                            defaultPage={1}
                            size="large"
                            shape="rounded"
                            page={page}
                            onChange={(e, newPage) => {
                                setPage(newPage);
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default FriendRequests;
