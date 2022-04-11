import create from 'zustand';

export interface User {
    id: string;
    nickname: string;
}

// TODO: OAuth 2.0 & Social login handling
export interface AuthState {
    user: User | null;
    token: string | null;
    provider: 'kakao' | 'google' | null;
    signOut: () => Promise<void>;
}

const useAuth = create<AuthState>((set) => ({
    user: null,
    token: null,
    provider: null,
    // TODO: implement sign out with social login
    // eslint-disable-next-line @typescript-eslint/require-await
    signOut: async () => set({ user: null, token: null })
}));

export default useAuth;
