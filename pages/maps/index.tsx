// @ts-nocheck
import type { NextPage } from 'next';
import { useEffect } from 'react';
import KakaoMap from '../../components/kakao-map';
import useMapHeader from '../../store/map-header';
import maps, { cities, districts } from '../../static/maps';
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
            return () => undefined;
        }
        const customOverlay = new KakaoMapSingleton.maps.CustomOverlay({});

        const polygons: Array<PolygonMetadata<KakaoPolygonType>> = [];
        const citiesPolygons: Array<PolygonMetadata<KakaoPolygonType>> = [];
        const districtPolygons: Array<PolygonMetadata<KakaoPolygonType>> = [];
        const levels = [polygons, citiesPolygons, districtPolygons];

        let selectedPolygons: KakaoPolygonType[][] = [[], [], []];

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

        const submit = (name: string) => {
            setMessage('success', `${name} 등록 완료!`);
        };

        const setOverLay = (
            polygons: PolygonMetadata<KakaoPolygonType>[],
            polygon: KakaoPolygonType,
            name: string,
            center: KakaoLatLngType
        ) => {
            polygons.forEach(({ polygon }) =>
                polygon.setOptions({ fillColor: '#fff' })
            );

            polygon.setOptions({ fillColor: '#09f' });

            customOverlay.setContent(`<div class="area">${name}</div>`);

            customOverlay.setPosition(center);

            customOverlay.setMap(map);
        };

        const mouseOut = (
            polygons: PolygonMetadata<KakaoPolygonType>[],
            polygon: KakaoPolygonType,
            latLngs: KakaoLatLngType[],
            id: string,
            mouseEvent: KakaoMouseEvent
        ) => {
            const { latLng: point } = mouseEvent;

            const isInPolygon = pointIsInPolygon(point, latLngs);

            polygons
                .filter(({ id: polygonId }) => polygonId !== id)
                .forEach(({ polygon }) =>
                    polygon.setOptions({ fillColor: '#fff' })
                );

            if (isInPolygon) {
                return;
            }

            polygon.setOptions({ fillColor: '#fff' });
            customOverlay.setMap(null);
        };

        const transition = (id: string, level: number) => {
            if (level > 0) {
                for (let prev = 0; prev < level; prev++) {
                    selectedPolygons[prev].forEach((e) => e.setMap(null));
                }
            }

            selectedPolygons = [[], [], []];
            customOverlay.setMap(null);

            levels[level]
                .filter(({ id: locationId, sgg }) => {
                    if (level === 3) {
                        return sgg === id;
                    }
                    return locationId.startsWith(id);
                })
                .forEach(({ polygon }) => {
                    selectedPolygons[level].push(polygon);
                });

            const selected = selectedPolygons[level];

            selected.forEach((polygon) => {
                console.log({ polygon });
                polygon.setMap(map);
            });

            function rollback(mouseEvent: KakaoMouseEvent) {
                const { latLng: point } = mouseEvent;

                selectedPolygons[level].forEach((e) => e.setMap(null));
                selectedPolygons[level] = [];

                const polys = levels[level];

                const isInPolygon = polys
                    .filter(({ id: polygonId }) => polygonId === id)
                    .map(({ latLngs }) => pointIsInPolygon(point, latLngs))
                    .reduce((a, b) => a || b, false);

                if (isInPolygon) {
                    return;
                }

                if (level < 2) {
                    selectedPolygons[level + 1] = [];
                    levels[level + 1]
                        .filter(({ id: polygonId }) => polygonId.startsWith(id))
                        .forEach(({ polygon }) => {
                            polygon.setMap(map);
                            selectedPolygons[level + 1].push(polygon);
                        });
                }

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
        };

        const addEventListeners = (
            idx: number,
            polygon: KakaoPolygonType,
            name: string,
            id: string,
            center: KakaoLatLngType,
            latLngs: KakaoLatLngType[]
        ) => {
            KakaoMapSingleton.maps.event.addListener(polygon, 'mouseover', () =>
                setOverLay(polygons, polygon, name, center)
            );

            KakaoMapSingleton.maps.event.addListener(
                polygon,
                'mouseout',
                (mouseEvent: KakaoMouseEvent) =>
                    mouseOut(polygons, polygon, latLngs, id, mouseEvent)
            );

            KakaoMapSingleton.maps.event.addListener(polygon, 'click', () => {
                if (idx < 2) {
                    transition(id, idx);
                } else {
                    submit(name);
                }
            });
        };

        [maps, cities, districts].forEach((e, idx) => {
            const { features } = e;

            features.forEach((feature) => {
                let nameKey: string;
                let idKey: string;

                if (idx === 0) {
                    nameKey = 'CTP_KOR_NM';
                    idKey = 'CTPRVN_CD';
                } else if (idx === 1) {
                    nameKey = 'SIG_KOR_NM';
                    idKey = 'SIG_CD';
                } else {
                    nameKey = 'adm_nm';
                    idKey = 'adm_cd';
                }

                const { properties } = feature;

                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const name: string = properties[nameKey];
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const id: string = properties[idKey];

                feature.geometry.coordinates.forEach((coordinates) => {
                    const { polygon, center, latLngs } =
                        setPolygons(coordinates);

                    if (idx === 0) {
                        polygon.setMap(map);
                    }

                    polygons.push({ name, id, polygon, latLngs });

                    addEventListeners(idx, polygon, name, id, center, latLngs);
                });
            });
        });

        return () => {
            citiesPolygons.forEach(({ polygon }) => polygon.setMap(null));
            polygons.forEach(({ polygon }) => polygon.setMap(null));
            districtPolygons.forEach(({ polygon }) => polygon.setMap(null));
            customOverlay.setMap(null);
        };
    }, [map]);

    useEffect(() => {
        changeTitle('지도 목록');
    }, []);

    return <KakaoMap />;
};

export default Maps;
