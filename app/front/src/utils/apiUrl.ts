export async function getRestApiUrl(): Promise<string> {
    const response = await fetch('/api/url');
    const data = await response.json();
    return data.url as string;
}