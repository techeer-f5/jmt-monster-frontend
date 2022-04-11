import { useEffect, useState } from 'react';
import { KakaoMapSingleton } from '../utils/kakao';
import { type KakaoMapType } from '../types/kakao';
import useCurrentLatLng from '../store/current-latlng';

export type UseKakaoMapInitResult = {
    map: KakaoMapType;
};

const useKakaoMapInit = (): UseKakaoMapInitResult => {
    const [map, setMap] = useState<KakaoMapType | null>(null);
    const { lat, lng, zoomLevel } = useCurrentLatLng();

    useEffect(() => {
        // If invoke this method outside callback, returns undefined because of SSR
        const container = document.getElementById('kakao-map');

        if (!container || !lat || !lng) {
            return;
        }

        const options = {
            center: new KakaoMapSingleton.maps.LatLng(lat, lng),
            level: zoomLevel
        };

        setMap(new KakaoMapSingleton.maps.Map(container, options));
    }, [lat, lng, zoomLevel]);

    return {
        map
    };
};

export default useKakaoMapInit;
