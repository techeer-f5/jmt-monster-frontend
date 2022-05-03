import { getBackendUrl } from '../utils/remotes';

describe('getBackendUrl() test', () => {
    it('check returns localhost backend url', () => {
        const result = getBackendUrl('localhost:3000');

        expect(result).toBe('http://localhost:8000');
    });

    it('check returns jmtmonster.com backend url', () => {
        const result = getBackendUrl('frontend.jmtmonster.com');

        expect(result).toBe('https://backend.jmtmonster.com');
    });

    it('if gives empty string, returns null', () => {
        const result = getBackendUrl('');

        expect(result).toBe(null);
    });
});

export {};
