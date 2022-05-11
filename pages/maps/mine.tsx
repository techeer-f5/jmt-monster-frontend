import type { NextPage } from 'next';
import { useEffect } from 'react';
import KakaoMap from '../../components/kakao-map';
import useMapHeader from '../../store/map-header';
import useCurrentLatLng from '../../store/current-latlng';
import useAuth from '../../store/auth';
import { KakaoMapSingleton } from '../../utils/kakao';

const Mine: NextPage = () => {
    const { user } = useAuth();
    const { changeTitle, changeLocation } = useMapHeader();
    const { changeLatLng } = useCurrentLatLng();

    useEffect(() => {
        changeTitle('내 지도');
    }, []);

    useEffect(() => {
        if (!user) {
            return;
        }

        const { address } = user;

        if (address) {
            const geocoder = new KakaoMapSingleton.maps.services.Geocoder();

            geocoder.addressSearch(address, (result, status) => {
                if (!result.length) {
                    return;
                }

                const [{ y: lat, x: lng }] = result;
                changeLatLng(lat, lng);
            });
        }
    }, [user?.address]);

    return <KakaoMap />;
};

export default Mine;
