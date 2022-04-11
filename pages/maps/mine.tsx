import type { NextPage } from 'next';
import { useEffect } from 'react';
import KakaoMap from '../../components/kakao-map';
import useMapHeader from '../../store/map-header';
import { gangnamLatLng } from '../../utils/sample-latlngs';
import useCurrentLatLng from '../../store/current-latlng';

const Mine: NextPage = () => {
    const { changeTitle, changeLocation } = useMapHeader();
    const { changeLatLng } = useCurrentLatLng();

    useEffect(() => {
        changeTitle('내 지도');
        changeLocation('서울특별시 강남구');

        const { lat, lng } = gangnamLatLng;

        changeLatLng(lat, lng);
    }, []);

    return <KakaoMap />;
};

export default Mine;
