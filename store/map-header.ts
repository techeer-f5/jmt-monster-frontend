import create from 'zustand';
import { devtools } from 'zustand/middleware';

export interface TitleState {
    title: string;
    location: string;
    changeTitle: (title: string) => void;
    changeLocation: (location: string) => void;
}

export const defaultTitle = '내 지도';
export const defaultLocation = '서울특별시 강남구';

const useMapHeader = create<TitleState>(
    devtools((set) => ({
        title: defaultTitle,
        location: defaultLocation,
        changeTitle: (title: string) => set({ title }),
        changeLocation: (location: string) => set({ location })
    }))
);

export default useMapHeader;
