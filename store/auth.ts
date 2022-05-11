import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import qs from 'qs';
import { fetchRemotes } from '../utils/remotes';
import { ExtraUserInfos } from '../pages/auth/extra-info';

export interface User {
    id: string;
    name: string;
    email: string;
    nickname: string | null;
    address: string | null;
    imageUrl: string | null;
    emailVerified: boolean;
    extraInfoInjected: boolean;
    verified: boolean;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    generateToken: (
        code: string,
        provider: 'kakao' | 'google'
    ) => Promise<string | null>;
    validateToken: () => Promise<boolean>;
    submitExtraInfo: (
        extraUserInfo: ExtraUserInfos,
        edit: boolean
    ) => Promise<boolean>;
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

const useAuth = create(
    devtools(
        persist<AuthState>(
            (set, get) => ({
                user: null,
                token: null,
                generateToken: async (
                    code: string,
                    provider: 'kakao' | 'google'
                ) => {
                    // FIXME: Redundant code repetition
                    // FIXME: Violates DRY
                    const { backend } = await fetchRemotes();

                    const url = `${backend}/auth/${provider}/callback?`;
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

                    const res = await fetch(
                        `${backend}/auth/validate/${token}`,
                        {
                            method: 'GET',
                            headers: {
                                Accept: 'application/json'
                            }
                        }
                    );

                    const { success } = (await res.json()) as TokenValid;

                    if (success) {
                        set({
                            token
                        });
                    }

                    return success;
                },
                submitExtraInfo: async (
                    extraUserInfos: ExtraUserInfos,
                    edit: boolean
                ) => {
                    const { backend } = await fetchRemotes();
                    const { token } = get();

                    if (!token) {
                        return false;
                    }

                    const res = await fetch(`${backend}/users/me/extra-info`, {
                        method: edit ? 'PUT' : 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            imageUrl: null,
                            ...extraUserInfos
                        })
                    });

                    const result = (await res.json()) as UserInfo;

                    if (result.success && result.user) {
                        set({ user: result.user });
                    }

                    return result.success;
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
    )
);

export default useAuth;
