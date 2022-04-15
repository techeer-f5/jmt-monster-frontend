export default function fetcherGenerator<Return>() {
    return async function fetcher(url: string): Promise<Return> {
        const res = await fetch(url);

        return (await res.json()) as Return;
    };
}
