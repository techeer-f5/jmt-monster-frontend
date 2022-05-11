import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { type KakaoMapType } from '../types/kakao';

export interface MapState {
    map: KakaoMapType | null;
    setMap: (map_: KakaoMapType | null) => void;
}

const useMapState = create<MapState>(
    devtools((set, get) => ({
        map: null,
        setMap: (map: KakaoMapType | null) => set({ map })
    }))
);

export default useMapState;
