import type { NextPage } from 'next';
import { useEffect } from 'react';
import KakaoMap from '../../components/kakao-map';
import useMapHeader from '../../store/map-header';
import useCurrentLatLng from '../../store/current-latlng';
import { jungLatLng } from '../../utils/sample-latlngs';
import useAuth from '../../store/auth';
import maps from '../../static/maps';
import { KakaoMapSingleton } from '../../utils/kakao';
import useMapState from '../../store/map';
import { KakaoLatLngType, KakaoPolygonType } from '../../types/kakao';

const Maps: NextPage = () => {
    const { map, setMap } = useMapState();
    const { changeTitle } = useMapHeader();

    useEffect(() => {
        console.log({ map });
        if (!map) {
            return () => { };
        }
        const customOverlay = new KakaoMapSingleton.maps.CustomOverlay({});

        const polygons: Array<KakaoPolygonType> = [];

        maps.features.forEach((feature) => {
            const name = feature.properties.CTP_KOR_NM;

            feature.geometry.coordinates.forEach((arr1) => {
                let maxLat = 0;
                let maxLng = 0;

                let minLat = 1000;
                let minLng = 1000;

                const arr2 = arr1.map((pair) => {
                    maxLat = Math.max(maxLat, pair[1]);
                    maxLng = Math.max(maxLng, pair[0]);

                    minLat = Math.min(minLat, pair[1]);
                    minLng = Math.min(minLng, pair[0]);

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call
                    return new KakaoMapSingleton.maps.LatLng(pair[1], pair[0]);
                });

                const lat = (maxLat + minLat) / 2;

                const lng = (maxLng + minLng) / 2;

                const center = new KakaoMapSingleton.maps.LatLng(lat, lng);

                const polygon = new KakaoMapSingleton.maps.Polygon({
                    map,
                    path: arr2,
                    strokeWeight: 2,
                    strokeColor: '#004c80',
                    strokeOpacity: 0.8,
                    fillColor: '#fff',
                    fillOpacity: 0.7
                });

                polygons.push(polygon);

                polygon.setMap(map);

                KakaoMapSingleton.maps.event.addListener(
                    polygon,
                    'mouseover',
                    function (mouseEvent) {
                        polygon.setOptions({ fillColor: '#09f' });

                        customOverlay.setContent(
                            `<div class="area">${name}</div>`
                        );

                        customOverlay.setPosition(center);

                        customOverlay.setMap(map);
                    }
                );

                KakaoMapSingleton.maps.event.addListener(
                    polygon,
                    'mouseout',
                    function () {
                        polygon.setOptions({ fillColor: '#fff' });
                        customOverlay.setMap(null);
                    }
                );
            });
        });

        return () => {
            polygons.forEach((polygon) => polygon.setMap(null));
            customOverlay.setMap(null);
        };
    }, [map]);

    useEffect(() => {
        changeTitle('지도 목록');
    }, []);

    return <KakaoMap />;
};

export default Maps;
