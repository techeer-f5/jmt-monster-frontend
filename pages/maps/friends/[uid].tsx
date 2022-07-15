import type { NextPage } from 'next';
import { useEffect } from 'react';
import KakaoMap from '../../../components/kakao-map';
import useMapHeader from '../../../store/map-header';
import useCurrentLatLng from '../../../store/current-latlng';
import { jungLatLng } from '../../../utils/sample-latlngs';

const Friends: NextPage = () => {
    const { changeTitle, changeLocation } = useMapHeader();
    const { changeLatLng } = useCurrentLatLng();

    useEffect(() => {
        changeTitle('오션의');
        changeLocation('서울특별시 중구');

        const { lat, lng } = jungLatLng;

        changeLatLng(lat, lng);
    }, []);

    return <KakaoMap />;
};

export default Friends;
