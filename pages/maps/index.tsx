import type { NextPage } from 'next';
import { useEffect } from 'react';
import KakaoMap from '../../components/kakao-map';
import useMapHeader from '../../store/map-header';
import maps, { cities } from '../../static/maps';
import { KakaoMapSingleton } from '../../utils/kakao';
import useMapState from '../../store/map';
import {
    KakaoLatLngType,
    KakaoMouseEvent,
    KakaoPolygonType
} from '../../types/kakao';

// Original code from https://stackoverflow.com/a/29915728/11853111
export function pointIsInPolygon(
    point: KakaoLatLngType,
    polygon: Array<KakaoLatLngType>
): boolean {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

    const x = point.getLat();
    const y = point.getLng();

    let inside = false;
    // eslint-disable-next-line no-plusplus
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].getLat();
        const yi = polygon[i].getLng();
        const xj = polygon[j].getLat();
        const yj = polygon[j].getLng();

        const intersect =
            yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }

    return inside;
}

const Maps: NextPage = () => {
    const { map, setMap } = useMapState();
    const { changeTitle } = useMapHeader();

    useEffect(() => {
        console.log({ map });
        if (!map) {
            return () => { };
        }
        const customOverlay = new KakaoMapSingleton.maps.CustomOverlay({});

        const polygons: Array<[string, string, KakaoPolygonType]> = [];
        const siGunGuPolygons: Array<[string, string, KakaoPolygonType]> = [];

        const setPolygons = (arr1: Array<Array<number>>) => {
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

            const centerLat = (maxLat + minLat) / 2;

            const centerLng = (maxLng + minLng) / 2;

            const center = new KakaoMapSingleton.maps.LatLng(
                centerLat,
                centerLng
            );

            const polygon = new KakaoMapSingleton.maps.Polygon({
                map,
                path: arr2,
                strokeWeight: 2,
                strokeColor: '#004c80',
                strokeOpacity: 0.8,
                fillColor: '#fff',
                fillOpacity: 0.7
            });

            polygon.setMap(null);

            return {
                polygon,
                center,
                arr2
            };
        };

        // FIXME: Type errors
        // FIXME: Violates DRY
        cities.features.forEach((feature) => {
            const { SIG_KOR_NM: name, SIG_CD: id } = feature.properties;

            feature.geometry.coordinates.forEach((arr1) => {
                const { polygon, center, arr2 } = setPolygons(arr1);

                siGunGuPolygons.push([name, id, polygon]);

                function setOverLay() {
                    siGunGuPolygons.forEach((e) =>
                        e[2].setOptions({ fillColor: '#fff' })
                    );

                    polygon.setOptions({ fillColor: '#09f' });

                    customOverlay.setContent(`<div class="area">${name}</div>`);

                    customOverlay.setPosition(center);

                    customOverlay.setMap(map);
                }

                function mouseOut(mouseEvent: KakaoMouseEvent) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const { latLng } = mouseEvent;

                    const isInPolygon = pointIsInPolygon(latLng, arr2);

                    console.log({ isInPolygon });

                    siGunGuPolygons.forEach((e) =>
                        e[2].setOptions({ fillColor: '#fff' })
                    );

                    if (isInPolygon) {
                        return;
                    }

                    polygon.setOptions({ fillColor: '#fff' });
                    customOverlay.setMap(null);
                }

                KakaoMapSingleton.maps.event.addListener(
                    polygon,
                    'mouseover',
                    setOverLay
                );

                KakaoMapSingleton.maps.event.addListener(
                    polygon,
                    'mouseout',
                    mouseOut
                );
            });
        });

        console.log({
            siGunGuPolygons
        });

        maps.features.forEach((feature) => {
            const name = feature.properties.CTP_KOR_NM;
            const id = feature.properties.CTPRVN_CD;

            feature.geometry.coordinates.forEach((arr1) => {
                const { polygon, center, arr2 } = setPolygons(arr1);

                polygon.setMap(map);
                polygons.push([name, id, polygon]);

                function transition() {
                    polygons.forEach(([, , poly]) => poly.setMap(null));

                    customOverlay.setMap(null);

                    siGunGuPolygons
                        .filter((e) => e[1].startsWith(id))
                        .forEach(([, , siGunGuPolygon]) => {
                            siGunGuPolygon.setMap(map);
                        });
                }

                function setOverLay() {
                    polygons.forEach((e) =>
                        e[2].setOptions({ fillColor: '#fff' })
                    );

                    polygon.setOptions({ fillColor: '#09f' });

                    customOverlay.setContent(`<div class="area">${name}</div>`);

                    customOverlay.setPosition(center);

                    customOverlay.setMap(map);
                }

                function mouseOut(mouseEvent) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const { latLng: latLngTemp } = mouseEvent;
                    const latLng = latLngTemp as KakaoLatLngType;

                    const isInPolygon = pointIsInPolygon(latLng, arr2);

                    console.log({ isInPolygon });

                    polygons
                        .filter((e) => e[0] !== name)
                        .forEach((e) => e[2].setOptions({ fillColor: '#fff' }));

                    if (isInPolygon) {
                        return;
                    }

                    polygon.setOptions({ fillColor: '#fff' });
                    customOverlay.setMap(null);
                }

                KakaoMapSingleton.maps.event.addListener(
                    polygon,
                    'mouseover',
                    setOverLay
                );

                KakaoMapSingleton.maps.event.addListener(
                    polygon,
                    'mouseout',
                    mouseOut
                );

                KakaoMapSingleton.maps.event.addListener(
                    polygon,
                    'click',
                    transition
                );
            });
        });

        return () => {
            polygons.forEach(([, , polygon]) => polygon.setMap(null));
            customOverlay.setMap(null);
        };
    }, [map]);

    useEffect(() => {
        changeTitle('지도 목록');
    }, []);

    return <KakaoMap />;
};

export default Maps;
