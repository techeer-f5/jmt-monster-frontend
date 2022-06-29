import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import qs from 'qs';

import useMapHeader from '../../store/map-header';
import useAuth from '../../store/auth';
import useSnackbarHandler from '../../store/snackbar';
import { fetchRemotes } from '../../utils/remotes';
import { Page } from '../../types/jmtapi';
import FriendRequestModal from '../../components/friend-request-modal';

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

const FriendItem = ({ friend }: { friend: Friend }) => {
    return (
        <div className="flex my-2 w-full items-center border-2 border-gray-800 text-gray-800 bg-white">
            <div className="w-20">
                <img
                    alt={`${friend.toUser.nickname} profile`}
                    src={
                        friend.toUser.imageUrl ??
                        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                    }
                    width="100%"
                />
            </div>
            <div className="flex justify-between items-center w-full mx-6">
                <div>{friend.toUser.name}</div>
                <div>
                    <button
                        type="button"
                        className="p-2 border-2 text-gray-800 border-gray-800 bg-green-100"
                    >
                        놀러가기
                    </button>
                </div>
            </div>
        </div>
    );
};

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

const Management: NextPage = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { setMessage: setSnackbarMessage } = useSnackbarHandler();
    const { changeTitle, changeLocation } = useMapHeader();
    const [friends, setFriends] = useState<Page<Friend> | null>(null);

    const [openAddFriendModal, setOpenAddFriendModal] =
        useState<boolean>(false);
    const onClickAddFriendButton = () => {
        setOpenAddFriendModal(true);
    };
    const onClickAddFriendModalCloseButton = () => {
        setOpenAddFriendModal(false);
    };

    /**
     * Retrieves friends of the logged in user from API
     *
     * @returns Paginated friends of currently logged in user
     */
    const getFriends = async () => {
        const { backend } = await fetchRemotes();
        const url = `${backend}/api/v1/friends?`;
        console.log('user.id=', user?.id);

        const params = qs.stringify({
            'from-user-id': user?.id
        });

        try {
            const res = await fetch(url + params, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            });
            const result: Page<Friend> = (await res.json()) as Page<Friend>;
            console.debug(result);
            return result;
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    useEffect(() => {
        changeTitle('친구 목록');
        changeLocation('');

        (async () => {
            setFriends(await getFriends());
        })();

        if (!user) {
            setSnackbarMessage(
                'error',
                '비로그인 사용자는 해당 페이지에 접근이 불가능합니다.'
            );
            router.push('/');
        }
    }, [user]);

    return (
        <div className="md:w-3/5 md:mx-0 w-full mx-4">
            {openAddFriendModal && (
                <FriendRequestModal
                    onClickCloseButton={onClickAddFriendModalCloseButton}
                />
            )}

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={onClickAddFriendButton}
                    className="mb-1 py-1 px-2.5 text-3xl font-bold border-2 border-gray-800 text-gray-800 bg-white"
                >
                    +
                </button>
            </div>

            <div className="flex flex-col">
                {friends?.content?.map((friend: Friend) => (
                    <FriendItem key={friend.id} friend={friend} />
                ))}
            </div>
        </div>
    );
};

export default Management;
