import { useEffect } from 'react';
import { KakaoMapSingleton } from '../utils/kakao';
import useCurrentLatLng from '../store/current-latlng';
import useMapState from '../store/map';

const useKakaoMapInit = () => {
    const { map, setMap } = useMapState();

    const { lat, lng, zoomLevel } = useCurrentLatLng();

    useEffect(() => {
        // If invoke this method outside callback, returns undefined because of SSR
        const container = document.getElementById('kakao-map');

        if (!container || !lat || !lng) {
            return () => {};
        }

        const options = {
            center: new KakaoMapSingleton.maps.LatLng(lat, lng),
            level: zoomLevel
        };

        setMap(new KakaoMapSingleton.maps.Map(container, options));

        return () => {
            setMap(null);
        };
    }, [lat, lng, zoomLevel]);
};

export default useKakaoMapInit;
