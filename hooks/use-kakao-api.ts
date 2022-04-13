import { initKakaoMap, initKakaoSDK } from 'kakao-yarn-sdk';
import { useEffect } from 'react';
import { KAKAO_WEB_API_KEY, KakaoSingleton } from '../utils/kakao';

const useKakaoApi = () => {
    useEffect(() => {
        initKakaoSDK();
        initKakaoMap();

        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            KakaoSingleton.init(KAKAO_WEB_API_KEY);
        } catch {
            console.error('카카오 SDK가 이미 초기화되었습니다.');
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        const isInitalized: boolean = KakaoSingleton.isInitialized();

        if (!isInitalized) {
            console.error('카카오 SDK 초기화에 실패하였습니다.');
        }
    }, []);
};

export default useKakaoApi;
