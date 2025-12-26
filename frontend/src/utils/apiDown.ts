const API_DOWN_EVENT = "participium:api-down";
const API_UP_EVENT = "participium:api-up";

let isApiDown = false;
let lastApiDownEmittedAtMs = 0;

export function addApiDownListener(handler: () => void): () => void {
	window.addEventListener(API_DOWN_EVENT, handler);
	return () => window.removeEventListener(API_DOWN_EVENT, handler);
}

export function addApiUpListener(handler: () => void): () => void {
	window.addEventListener(API_UP_EVENT, handler);
	return () => window.removeEventListener(API_UP_EVENT, handler);
}

function emitApiDown() {
	const now = Date.now();
	if (now - lastApiDownEmittedAtMs < 10_000) return;
	lastApiDownEmittedAtMs = now;
	isApiDown = true;
	window.dispatchEvent(new Event(API_DOWN_EVENT));
}

function emitApiUp() {
	if (!isApiDown) return;
	isApiDown = false;
	window.dispatchEvent(new Event(API_UP_EVENT));
}

function looksLikeBackendUrl(url: string): boolean {
	const configured = import.meta.env.VITE_API_ENDPOINT as string | undefined;
	const configuredBase = configured ?? "http://localhost:3000/api";
	if (url.startsWith(configuredBase)) return true;
	return url.includes("/api/");
}

function normalizeUrl(input: RequestInfo | URL): string {
	if (typeof input === "string") return input;
	if (input instanceof URL) return input.toString();
	return input.url;
}

export function installGlobalApiDownFetchAlert(): void {
	if (typeof window === "undefined" || typeof window.fetch !== "function") return;
	if ((window.fetch as unknown as { __participiumWrapped?: boolean }).__participiumWrapped)
		return;

	const originalFetch = window.fetch.bind(window);
	const wrappedFetch: typeof window.fetch = async (input, init) => {
		const url = normalizeUrl(input);
		const shouldTrack = looksLikeBackendUrl(url);
		if (!shouldTrack) return originalFetch(input, init);
		try {
			const response = await originalFetch(input, init);
			emitApiUp();
			if (response.status === 502 || response.status === 503 || response.status === 504) {
				emitApiDown();
			}
			return response;
		} catch (error) {
			const err = error as Error & { name?: string };
			// Abort is typically user-driven; don't treat it as an API outage.
			if (err?.name === "AbortError") throw error;
			emitApiDown();
			throw error;
		}
	};

	(wrappedFetch as unknown as { __participiumWrapped?: boolean }).__participiumWrapped =
		true;
	window.fetch = wrappedFetch;
}
