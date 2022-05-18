export type KakaoLatLngType = {
    getLat: () => number;
    getLng: () => number;
};
export type KakaoMapType = {
    getCenter(): KakaoLatLngType;
};
export type KakaoPolygonType = {
    setMap(map: KakaoMapType | null): void;
    setOptions(options: object): void;
};

export type KakaoCustomOverlayType = {
    setContent(content: string): void;
    setPosition(position: KakaoLatLngType): void;
    setMap(map: KakaoMapType | null): void;
};

export type KakaoMouseEvent = {
    latLng: KakaoLatLngType;
};

export type Status = 'OK' | 'ZERO_RESULT' | 'ERROR';

export type RegionResponse = Array<{
    region_type: string;
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    region_4depth_name: string;
    code: string;
    x: number;
    y: number;
}>;

export type AddressResponse = Array<{
    address_name: string;
    address_type: string;
    x: number;
    y: number;
}>;

export type KakaoGeocoderType = {
    coord2RegionCode: (
        lng: number,
        lat: number,
        callback: (result: RegionResponse, status: Status) => void
    ) => void;
    addressSearch: (
        address: string,
        callback: (result: AddressResponse, status: Status) => void
    ) => void;
};

export type KakaoSingletonType = {
    init: (key: string) => void;
    isInitialized: () => boolean;
};

export type PolygonOptions = {
    map: KakaoMapType;
    path: Array<KakaoLatLngType>;
    strokeWeight: number;
    strokeColor: string;
    strokeOpacity: number;
    fillColor: string;
    fillOpacity: number;
    zIndex?: number;
};

export type KakaoMapSingletonType = {
    maps: {
        event: {
            addListener(
                obj: any,
                eventType: string,
                callback: (event?: any) => void
            ): void;
            removeListener(
                obj: any,
                eventType: string,
                callback: (event?: any) => void
            ): void;
        };
        CustomOverlay: {
            new(options: object): KakaoCustomOverlayType;
        };
        Polygon: {
            new(options: PolygonOptions): KakaoPolygonType;
        };
        LatLng: {
            new(lat: number, lng: number): KakaoLatLngType;
        };
        Map: {
            new(container: HTMLElement, options: object): KakaoMapType;
        };
        services: {
            Geocoder: {
                new(): KakaoGeocoderType;
            };
        };
    };
};

export type KakaoWindow = {
    Kakao: KakaoSingletonType;
    kakao: KakaoMapSingletonType;
};
