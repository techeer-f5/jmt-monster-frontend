import create from 'zustand';

export interface TitleState {
    title: string;
    location: string;
    changeTitle: (title: string) => void;
    changeLocation: (location: string) => void;
}

export const defaultTitle = '내 지도';
export const defaultLocation = '서울특별시 종로구';

const useMapHeader = create<TitleState>((set) => ({
    title: defaultTitle,
    location: defaultLocation,
    changeTitle: (title: string) => set({ title }),
    changeLocation: (location: string) => set({ location })
}));

export default useMapHeader;
