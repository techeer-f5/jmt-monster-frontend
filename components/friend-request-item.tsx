import { FriendRequest } from '../types/jmtapi';
import { fetchRemotes } from '../utils/remotes';

const FriendRequestItem = ({
    friendRequest
}: {
    friendRequest: FriendRequest;
}) => {
    const acceptFriendRequest = async () => {
        const { backend } = await fetchRemotes();
        const url = `${backend}/api/v1/friend-requests/${friendRequest.id}`;
        const data = { status: 'ACCEPTED' };
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            console.error(res.statusText);
        }
    };
    const onClickAcceptFriendRequest = (e: React.FormEvent) => {
        e.preventDefault();
        (async () => {
            await acceptFriendRequest();
        })();
    };

    const deleteFriendRequest = async () => {
        const { backend } = await fetchRemotes();
        const url = `${backend}/api/v1/friend-requests/${friendRequest.id}`;
        const res = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            }
        });

        if (!res.ok) {
            console.error(res.statusText);
        }
    };
    const onClickDeleteFriendRequest = (e: React.FormEvent) => {
        e.preventDefault();
        (async () => {
            await deleteFriendRequest();
        })();
    };

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
                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={onClickAcceptFriendRequest}
                        className="p-2 border-2 border-gray-800 text-white bg-blue-400"
                    >
                        수락하기
                    </button>
                    <button
                        type="button"
                        onClick={onClickDeleteFriendRequest}
                        className="p-2 border-2 border-gray-800 text-gray-800 bg-white-100"
                    >
                        삭제하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FriendRequestItem;
