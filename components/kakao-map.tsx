import React, { useEffect, useRef } from 'react';
import useKakaoMapInit from '../hooks/use-kakao-map-init';
import useMapState from '../store/map';
import { type KakaoMapType, RegionResponse } from '../types/kakao';
import useMapHeader from '../store/map-header';
import { KakaoMapSingleton } from '../utils/kakao';

export const kakaoMapDivId = 'kakao-map';

export const extractAddress = (result: RegionResponse) => {
    return ([1, 2, 3] as Array<1 | 2 | 3>)
        .map((idx) => {
            return result[0][`region_${idx}depth_name`];
        })
        .filter((e) => e)
        .reduce((a, b) => `${a} ${b}`, '');
};

const KakaoMap = () => {
    useKakaoMapInit();

    const { map: mapState } = useMapState();
    const mapRef = useRef<KakaoMapType>();

    const { changeLocation } = useMapHeader();

    useEffect(() => {
        if (mapState) {
            mapRef.current = mapState;
        }
    }, [mapState]);

    useEffect(() => {
        const id = setInterval(() => {
            const map = mapRef.current;

            if (!map) {
                return;
            }
            const latLng = map.getCenter();

            const geocoder = new KakaoMapSingleton.maps.services.Geocoder();

            geocoder.coord2RegionCode(
                latLng.getLng(),
                latLng.getLat(),
                (result, status) => {
                    if (!result.length) {
                        return;
                    }

                    const address = extractAddress(result);
                    changeLocation(address);
                }
            );
        }, 1000);

        return () => clearInterval(id);
    }, [mapRef]);

    return (
        <div className="w-screen flex flex-1 my-0">
            <div
                id={kakaoMapDivId}
                // FIXME: hard-coded width, height size
                className="w-[100%] h-[100%]"
            />
        </div>
    );
};

export default KakaoMap;
