import create from 'zustand';
import qs from 'qs';
import { fetchRemotes } from '../pages/api/remotes';

export interface User {
    id: string;
    nickname: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    generateToken: (code: string) => Promise<string>;
    validateToken: (token: string) => Promise<boolean>;
    fetchUserInfo: () => Promise<boolean>;
    signOut: () => Promise<void>;
}

export interface TokenValid {
    success: true;
}

export interface GeneratedToken {
    // FIXME: change key name with backend
    id: string;
}

export interface UserInfo {
    success: boolean;
    user?: User;
}

// TODO: Persist middleware integration
const useAuth = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    generateToken: async (code: string) => {
        // FIXME: Redundant code repetition
        // FIXME: Violates DRY
        const { backend } = await fetchRemotes();

        const url = `${backend}/auth/kakao/callback`;
        const params = qs.stringify({
            code
        });

        const generatedToken = (await (
            await fetch(url + params, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            })
        ).json()) as GeneratedToken;

        const { id: token } = generatedToken;

        return token;
    },
    validateToken: async (token: string) => {
        const { backend } = await fetchRemotes();

        const { success } = (await (
            await fetch(`${backend}/token/validate`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ token })
            })
        ).json()) as TokenValid;

        if (success) {
            set({
                token
            });
        }

        return success;
    },
    fetchUserInfo: async () => {
        const { backend } = await fetchRemotes();
        const { token } = get();

        if (!token) {
            return false;
        }

        const userResponse = (await (
            await fetch(`${backend}/users/me`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
        ).json()) as UserInfo;

        let { success } = userResponse;
        const { user } = userResponse;

        success = success && !!user;

        // Typescript does not remove undefined type by writing above statement automatically..
        if (success && user) {
            set({
                user
            });
        }

        return success;
    },
    // TODO: implement signout with social login
    signOut: async () => set({ user: null, token: null })
}));

export default useAuth;
