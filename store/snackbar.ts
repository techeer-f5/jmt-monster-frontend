import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { AlertColor } from '@mui/material';

export interface SnackbarStatus {
    message: string;
    severity: AlertColor;
    setMessage: (severity: AlertColor, message: string) => void;
    flush: () => void;
}

const useSnackbarHandler = create<SnackbarStatus>(
    devtools((set) => ({
        message: '',
        severity: 'info',
        setMessage: (severity: AlertColor, message: string) =>
            set({ severity, message }),
        flush: () => set({ message: '' })
    }))
);

export default useSnackbarHandler;
