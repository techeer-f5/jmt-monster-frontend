import { useEffect } from 'react';
import { KAKAO_WEB_API_KEY } from '../utils/kakao';

export type KakaoSingleton = {
    init: (key: string) => void;
    isInitialized: () => boolean;
};

export type KakaoWindow = {
    Kakao: KakaoSingleton;
};

// To avoid window === undefined (because it uses SSR), I used globalThis property.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
const { Kakao } = globalThis as unknown as KakaoWindow;

const useKakaoApi = () => {
    useEffect(() => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            Kakao.init(KAKAO_WEB_API_KEY);
        } catch {
            console.error('카카오 SDK가 이미 초기화되었습니다.');
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        const isInitalized: boolean = Kakao.isInitialized();

        if (!isInitalized) {
            console.error('카카오 SDK 초기화에 실패하였습니다.');
        }
    }, []);
};

export default useKakaoApi;
