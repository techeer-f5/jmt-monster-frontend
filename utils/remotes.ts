// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export type RemoteData = {
    backend: string;
};

export function getBackendUrl(
    frontendHostname = window.location.hostname
): string | null {
    if (
        frontendHostname.startsWith('localhost') ||
        frontendHostname.startsWith('127.0.0.1')
    ) {
        return 'http://localhost:8000';
    }
    if (frontendHostname.startsWith('frontend.')) {
        const rootDomain = frontendHostname
            .split('.')
            .filter((_, idx) => idx >= 1)
            .reduce((a, b) => `${a}.${b}`);

        return `https://backend.${rootDomain}`;
    }
    if (frontendHostname.startsWith('jmtmonster.')) {
        return `https://backend.jmtmonster.com`;
    }

    return null;
}

// It doesn't have to be async, but this code previously existed api folder,
// Client code assumes this code async.
// For reduce extra effort and lint error, I decided to keep it async.
export async function fetchRemotes(): Promise<RemoteData> {
    return {
        backend: getBackendUrl()
    } as RemoteData;
}
