export type KakaoLatLngType = unknown;
export type KakaoMapType = unknown;

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
    };
};

export type KakaoWindow = {
    Kakao: KakaoSingletonType;
    kakao: KakaoMapSingletonType;
};
