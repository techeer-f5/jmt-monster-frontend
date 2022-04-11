import { KakaoWindow } from '../types/kakao';

// Because it could be used only whitelisted domain, Uploading key at public git repository is not harmful.
export const KAKAO_WEB_API_KEY = '29daa1a7c34c9f6e6a213f898f1b70fd';

// To avoid window === undefined (because it uses SSR), I used globalThis property.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
export const { Kakao: KakaoSingleton, kakao: KakaoMapSingleton } =
    globalThis as unknown as KakaoWindow;
