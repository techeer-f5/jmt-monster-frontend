import { Friend } from '../types/jmtapi';

const FriendItem = ({ friend }: { friend: Friend }) => {
    return (
        <div className="flex my-2 w-full items-center border-2 border-gray-800 text-gray-800 bg-white">
            <div className="w-20">
                <img
                    alt={`${friend.toUser.email} profile`}
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

export default FriendItem;
