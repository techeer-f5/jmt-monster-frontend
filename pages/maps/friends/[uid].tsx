import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import qs from 'qs';

import KakaoMap from '../../../components/kakao-map';
import useMapHeader from '../../../store/map-header';
import useCurrentLatLng from '../../../store/current-latlng';
import { jungLatLng } from '../../../utils/sample-latlngs';
import { UserResponse } from '../../../types/jmtapi';
import useAuth from '../../../store/auth';
import { fetchRemotes } from '../../../utils/remotes';
import useSnackbarHandler from '../../../store/snackbar';

interface ExpectedQuery {
    uid: string;
}

const Friends: NextPage = () => {
    const router = useRouter();
    const { setMessage: setSnackbarMessage } = useSnackbarHandler();
    const { user } = useAuth();
    const [friendUser, setFriendUser] = useState<UserResponse | null>(null);

    const { changeTitle, changeLocation } = useMapHeader();
    const { changeLatLng } = useCurrentLatLng();

    const fetchFriendUser = async (friendUserId: string) => {
        // friendUser;
        const { backend } = await fetchRemotes();
        const url = `${backend}/api/v1/users/${friendUserId}`;

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        });

        if (!res.ok) {
            console.error(res.statusText);
            return;
        }

        const result = (await res.json()) as UserResponse;
        setFriendUser(result);

        changeTitle(`${result.nickname as string}의`);
        changeLocation('서울특별시 중구');
    };

    useEffect(() => {
        const { lat, lng } = jungLatLng;
        changeLatLng(lat, lng);

        if (!user) {
            setSnackbarMessage(
                'error',
                '비로그인 사용자는 해당 페이지에 접근이 불가능합니다.'
            );
            router.push('/');
        }

        (async () => {
            const friendUserId = router.query.uid as string;
            await fetchFriendUser(friendUserId);
        })();
    }, []);

    return <KakaoMap />;
};

export default Friends;
