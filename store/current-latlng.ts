import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface LatLngState {
    lat: number | null;
    lng: number | null;
    zoomLevel: number;
    changeLatLng: (lat: number, lng: number) => void;
    changeZoomLevel: (zoomLevel: number) => void;
}

const useCurrentLatLng = create<LatLngState>(
    devtools(
        persist<LatLngState>(
            (set, get) => ({
                lat: null,
                lng: null,
                zoomLevel: 8,
                changeLatLng: (lat: number, lng: number) => set({ lat, lng }),
                changeZoomLevel: (zoomLevel: number) => set({ zoomLevel })
            }),
            {
                name: 'lat-lng'
                // uses LocalStorage by default
            }
        )
    )
);

export default useCurrentLatLng;
