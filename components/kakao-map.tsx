import React from 'react';
import useKakaoMapInit from '../hooks/use-kakao-map-init';

export const kakaoMapDivId = 'kakao-map';

const KakaoMap = () => {
    const map = useKakaoMapInit();

    return (
        <div
            id={kakaoMapDivId}
            // FIXME: hard-coded width, height size
            style={{
                width: '100vw',
                height: '85vh'
            }}
        />
    );
};

export default KakaoMap;
