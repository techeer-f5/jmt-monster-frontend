import create from 'zustand';

export interface SnackbarStatus {
    message: string;
    setMessage: (message: string) => void;
    flush: () => void;
}

const useSnackbarHandler = create<SnackbarStatus>((set) => ({
    message: '',
    setMessage: (message: string) => set({ message }),
    flush: () => set({ message: '' })
}));

export default useSnackbarHandler;
