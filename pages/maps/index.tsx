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
import useSnackbarHandler from '../../store/snackbar';

export interface PolygonMetadata<T> {
    id: string;
    name: string;
    latLngs: KakaoLatLngType[];
    polygon: T;
}

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
    const { setMessage } = useSnackbarHandler();

    useEffect(() => {
        if (!map) {
            return () => { };
        }
        const customOverlay = new KakaoMapSingleton.maps.CustomOverlay({});

        const polygons: Array<PolygonMetadata<KakaoPolygonType>> = [];
        const citiesPolygons: Array<PolygonMetadata<KakaoPolygonType>> = [];

        const cityNames = cities.features.map(
            (feature) => feature.properties.SIG_KOR_NM
        );

        const cityNameRegexes = cityNames.map(
            (cityName) => new RegExp(`^${cityName}\S+$`)
        );

        const cityRegex = /^[ㄱ-힣]{2}시[ㄱ-힣]+$/;

        cities.features.forEach((feature, idx) => {
            const originalName = feature.properties.SIG_KOR_NM;
            const name = cityNameRegexes.reduce(
                (districtName, cityNameRegex, idx) => {
                    const cityName = cityNames[idx];
                    if (cityNameRegex.test(districtName)) {
                        return districtName.replace(cityName, `${cityName} `);
                    }

                    if (cityRegex.test(districtName)) {
                        return districtName.replace(
                            /([ㄱ-힣]{2}시)([ㄱ-힣]+)/,
                            (_, p1, p2) => `${p1} ${p2}`
                        );
                    }

                    return districtName;
                },
                originalName
            );

            cities.features[idx].properties.SIG_KOR_NM = name;
        });

        const setPolygons = (arr1: Array<Array<number>>) => {
            let maxLat = 0;
            let maxLng = 0;

            let minLat = 1000;
            let minLng = 1000;

            const latLngs = arr1.map((pair) => {
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
                path: latLngs,
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
                latLngs
            };
        };

        // FIXME: Type errors
        // FIXME: Violates DRY
        cities.features.forEach((feature) => {
            const { SIG_KOR_NM: name, SIG_CD: id } = feature.properties as {
                SIG_KOR_NM: string;
                SIG_CD: string;
            };

            feature.geometry.coordinates.forEach((arr1) => {
                const { polygon, center, latLngs } = setPolygons(arr1);

                console.log({ name });

                citiesPolygons.push({ name, id, polygon, latLngs });

                function setOverLay() {
                    citiesPolygons.forEach(({ polygon }) =>
                        polygon.setOptions({ fillColor: '#fff' })
                    );

                    polygon.setOptions({ fillColor: '#09f' });

                    customOverlay.setContent(`<div class="area">${name}</div>`);

                    customOverlay.setPosition(center);

                    customOverlay.setMap(map);
                }

                function mouseOut(mouseEvent: KakaoMouseEvent) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    const { latLng } = mouseEvent;

                    const isInPolygon = pointIsInPolygon(latLng, latLngs);

                    console.log({ isInPolygon });

                    citiesPolygons.forEach(({ polygon }) =>
                        polygon.setOptions({ fillColor: '#fff' })
                    );

                    if (isInPolygon) {
                        return;
                    }

                    polygon.setOptions({ fillColor: '#fff' });
                    customOverlay.setMap(null);
                }

                function submit() {
                    console.log({ name });
                    setMessage('success', `${name} 등록 완료!`);
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
                    submit
                );
            });
        });

        maps.features.forEach((feature) => {
            const name = feature.properties.CTP_KOR_NM;
            const id = feature.properties.CTPRVN_CD;

            feature.geometry.coordinates.forEach((arr1) => {
                const { polygon, center, latLngs } = setPolygons(arr1);

                polygon.setMap(map);
                polygons.push({ name, id, polygon, latLngs });

                function transition() {
                    polygons.forEach(({ polygon }) => polygon.setMap(null));

                    customOverlay.setMap(null);

                    citiesPolygons
                        .filter(({ id: cityId }) => cityId.startsWith(id))
                        .forEach(({ polygon }) => {
                            polygon.setMap(map);
                        });

                    function rollback(mouseEvent: KakaoMouseEvent) {
                        const { latLng: point } = mouseEvent;

                        const isInPolygon = polygons
                            .filter(
                                ({ name: polygonName }) => polygonName === name
                            )
                            .map(({ latLngs }) =>
                                pointIsInPolygon(point, latLngs)
                            )
                            .reduce((a, b) => a || b, false);

                        if (isInPolygon) {
                            return;
                        }

                        citiesPolygons.forEach(({ polygon }) => {
                            polygon.setMap(null);
                        });

                        polygons.forEach(({ polygon }) => polygon.setMap(map));

                        KakaoMapSingleton.maps.event.removeListener(
                            map,
                            'click',
                            rollback
                        );
                    }

                    setTimeout(() => {
                        KakaoMapSingleton.maps.event.addListener(
                            map,
                            'click',
                            rollback
                        );
                    }, 0);
                }

                function setOverLay() {
                    polygons.forEach(({ polygon }) =>
                        polygon.setOptions({ fillColor: '#fff' })
                    );

                    polygon.setOptions({ fillColor: '#09f' });

                    customOverlay.setContent(`<div class="area">${name}</div>`);

                    customOverlay.setPosition(center);

                    customOverlay.setMap(map);
                }

                function mouseOut(mouseEvent: KakaoMouseEvent) {
                    const { latLng: point } = mouseEvent;

                    const isInPolygon = pointIsInPolygon(point, latLngs);

                    console.log({ isInPolygon });

                    polygons
                        .filter(({ name: polygonName }) => polygonName !== name)
                        .forEach(({ polygon }) =>
                            polygon.setOptions({ fillColor: '#fff' })
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

                KakaoMapSingleton.maps.event.addListener(
                    polygon,
                    'click',
                    transition
                );
            });
        });

        return () => {
            citiesPolygons.forEach(({ polygon }) => polygon.setMap(null));
            polygons.forEach(({ polygon }) => polygon.setMap(null));
            customOverlay.setMap(null);
        };
    }, [map]);

    useEffect(() => {
        changeTitle('지도 목록');
    }, []);

    return <KakaoMap />;
};

export default Maps;
