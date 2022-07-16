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
    isSuccess: boolean;
}

export interface GeneratedToken {
    // FIXME: change key name with backend
    id: string;
}

export interface UserInfo {
    isSuccess: boolean;
    user?: User;
}

export interface HomeResponse {
    name: string;
    code: string;
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

                    const { isSuccess } = (await res.json()) as TokenValid;

                    if (isSuccess) {
                        set({
                            token
                        });
                    }

                    return isSuccess;
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

                    let res = await fetch(`${backend}/users/me/extra-info`, {
                        method: edit ? 'PUT' : 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            nickname: extraUserInfos.nickname
                        })
                    });

                    const result = (await res.json()) as UserInfo;

                    if (result.isSuccess && result.user) {
                        set({ user: result.user });
                    }

                    res = await fetch(`${backend}/api/v1/home`, {
                        method: 'PUT',
                        headers: {
                            Accept: 'application/json',
                            'Content-type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            name: extraUserInfos.addressName,
                            code: extraUserInfos.addressCode
                        })
                    });

                    const user = result?.user ?? null;

                    if (user) {
                        user.address = extraUserInfos.addressName;
                    }

                    set({
                        user
                    });

                    return result.isSuccess;
                },
                fetchUserInfo: async () => {
                    const { backend } = await fetchRemotes();
                    const { token } = get();

                    if (!token) {
                        return false;
                    }

                    let response;

                    try {
                        response = await fetch(`${backend}/users/me`, {
                            method: 'GET',
                            headers: {
                                'Content-type': 'application/json',
                                Authorization: `Bearer ${token}`
                            }
                        });
                    } catch (err) {
                        return false;
                    }

                    const userResponse = (await response.json()) as UserInfo;

                    let { isSuccess } = userResponse;
                    const { user } = userResponse;

                    isSuccess = isSuccess && !!user;

                    const homeResponse = await fetch(`${backend}/api/v1/home`, {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    });

                    const homeData =
                        (await homeResponse.json()) as HomeResponse;

                    if (homeData.name && user) {
                        user.address = homeData.name ?? null;
                    }

                    // Typescript does not remove undefined type by writing above statement automatically..
                    if (isSuccess && user) {
                        set({
                            user
                        });
                    }

                    return isSuccess;
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
