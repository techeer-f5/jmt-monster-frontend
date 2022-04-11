import create from 'zustand';

export interface LatLngState {
    lat: number | null;
    lng: number | null;
    zoomLevel: number;
    changeLatLng: (lat: number, lng: number) => void;
    changeZoomLevel: (zoomLevel: number) => void;
}

const useCurrentLatLng = create<LatLngState>((set) => ({
    lat: null,
    lng: null,
    zoomLevel: 8,
    changeLatLng: (lat: number, lng: number) => set({ lat, lng }),
    changeZoomLevel: (zoomLevel: number) => set({ zoomLevel })
}));

export default useCurrentLatLng;
