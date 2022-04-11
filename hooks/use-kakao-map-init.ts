import { useEffect, useState } from 'react';
import { KakaoMapSingleton } from '../utils/kakao';
import { type KakaoMapType } from '../types/kakao';

export type UseKakaoMapInitResult = {
    map: KakaoMapType;
};

const useKakaoMapInit = (): UseKakaoMapInitResult => {
    const [map, setMap] = useState<KakaoMapType | null>(null);

    useEffect(() => {
        // If invoke this method outside callback, returns undefined because of SSR
        const container = document.getElementById('kakao-map');

        if (!container) {
            return;
        }

        const options = {
            center: new KakaoMapSingleton.maps.LatLng(33.450701, 126.570667),
            level: 3
        };

        setMap(new KakaoMapSingleton.maps.Map(container, options));
    }, []);

    return {
        map
    };
};

export default useKakaoMapInit;
