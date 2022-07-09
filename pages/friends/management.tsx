import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import qs from 'qs';
import { Pagination } from '@mui/material';

import useMapHeader from '../../store/map-header';
import useAuth from '../../store/auth';
import useSnackbarHandler from '../../store/snackbar';
import { fetchRemotes } from '../../utils/remotes';
import { Friend, Page } from '../../types/jmtapi';
import FriendRequestModal from '../../components/friend-request-modal';
import FriendItem from '../../components/friend-item';

const Management: NextPage = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { setMessage: setSnackbarMessage } = useSnackbarHandler();
    const { changeTitle, changeLocation } = useMapHeader();
    const [friends, setFriends] = useState<Page<Friend> | null>(null);
    const [page, setPage] = useState<number>(1);
    const [size] = useState<number>(5);

    const [openAddFriendModal, setOpenAddFriendModal] =
        useState<boolean>(false);
    const onClickAddFriendButton = () => {
        setOpenAddFriendModal(true);
    };
    const onClickAddFriendModalCloseButton = () => {
        setOpenAddFriendModal(false);
    };

    /**
     * Fetches friends of the logged in user from API
     *
     * @returns Paginated friends of currently logged in user
     */
    const fetchFriends = async () => {
        const { backend } = await fetchRemotes();
        const url = `${backend}/api/v1/friends?`;
        const params = qs.stringify({
            'from-user-id': user?.id,
            page: page - 1,
            size
        });
        console.log(params);
        console.log('page', page);

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

        const result = (await res.json()) as Page<Friend>;
        console.log('yo', result);
        setFriends(result);
    };

    useEffect(() => {
        changeTitle('친구 관리');
        changeLocation('');

        if (!user) {
            setSnackbarMessage(
                'error',
                '비로그인 사용자는 해당 페이지에 접근이 불가능합니다.'
            );
            router.push('/');
        }

        (async () => {
            await fetchFriends();
        })();
    }, [user, page]);

    return (
        <div className="w-full flex items-center justify-center">
            {openAddFriendModal && (
                <FriendRequestModal
                    onClickCloseButton={onClickAddFriendModalCloseButton}
                />
            )}

            <div className="flex flex-nowrap flex-col md:w-3/4 w-full md:mx-0 mx-4 h-[85vh] justify-center overflow-y-scroll">
                <div className="flex justify-end space-x-5 w-full">
                    <button
                        type="button"
                        onClick={() => {
                            router.push('/friends/requests', 'requests', {
                                shallow: true
                            });
                        }}
                        className="mb-1 py-1 px-2.5 text-lg font-bold border-2 border-gray-800 text-gray-800 bg-white"
                    >
                        친구 요청 목록 조회
                    </button>
                    <button
                        type="button"
                        onClick={onClickAddFriendButton}
                        className="mb-1 py-1 px-2.5 text-3xl font-bold border-2 border-gray-800 text-gray-800 bg-white"
                    >
                        +
                    </button>
                </div>

                <div className="flex flex-col">
                    {friends && friends?.totalElements > 0 ? (
                        friends?.content?.map((friend: Friend) => (
                            <FriendItem key={friend.id} friend={friend} />
                        ))
                    ) : (
                        <div className="text-center my-5 text-xl font-bold">
                            친구 목록이 비었습니다.
                        </div>
                    )}
                </div>

                <div className="flex justify-center mt-3 space-x-5">
                    {friends && (
                        <Pagination
                            count={friends.totalPages}
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

export default Management;
