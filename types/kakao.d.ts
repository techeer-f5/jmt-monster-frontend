export type KakaoLatLngType = {
    getLat: () => number;
    getLng: () => number;
};
export type KakaoMapType = {
    getCenter(): KakaoLatLngType;
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

export type KakaoMapSingletonType = {
    maps: {
        LatLng: {
            new (lat: number, lng: number): KakaoLatLngType;
        };
        Map: {
            new (container: HTMLElement, options: object): KakaoMapType;
        };
        services: {
            Geocoder: {
                new (): KakaoGeocoderType;
            };
        };
    };
};

export type KakaoWindow = {
    Kakao: KakaoSingletonType;
    kakao: KakaoMapSingletonType;
};
