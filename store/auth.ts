import create from 'zustand';
import { persist } from 'zustand/middleware';
import qs from 'qs';
import { fetchRemotes } from '../utils/remotes';

export interface User {
    id: string;
    name: string;
    email: string;
    nickname: string | null;
    address: string | null;
    imageUrl: string | null;
    emailVerified: boolean;
    extreInfoInjected: boolean;
    verified: boolean;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    generateToken: (code: string) => Promise<string | null>;
    validateToken: () => Promise<boolean>;
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
const useAuth = create<AuthState>(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            generateToken: async (code: string) => {
                // FIXME: Redundant code repetition
                // FIXME: Violates DRY
                const { backend } = await fetchRemotes();

                const url = `${backend}/auth/kakao/callback?`;
                const params = qs.stringify({
                    code
                });

                let generatedToken: GeneratedToken;

                try {
                    const res = await fetch(url + params, {
                        method: 'GET',
                        headers: {
                            'Content-type': 'application/json'
                        }
                    });
                    generatedToken = (await res.json()) as GeneratedToken;
                } catch (e) {
                    console.error(e);
                    return null;
                }

                const { id: token } = generatedToken;

                if (token) {
                    set({
                        token
                    });
                }

                return token;
            },
            validateToken: async () => {
                const { backend } = await fetchRemotes();
                const { token } = get();

                if (!token) {
                    return false;
                }

                const res = await fetch(`${backend}/auth/validate/${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json'
                    }
                });

                const { success } = (await res.json()) as TokenValid;

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
        }),
        {
            name: 'auth'
            // uses LocalStorage by default
        }
    )
);

useAuth.subscribe(console.log);

export default useAuth;
