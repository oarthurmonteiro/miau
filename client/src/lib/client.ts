type Req<T = unknown> = {
	method: "GET" | "POST";
	headers?: Record<string, string>;
	payload?: T;
	query?: Record<string, unknown>;
	credentials?: RequestCredentials;
};

export async function request(baseUrl: string, req: Req) {
	if (req.payload instanceof FormData) {
		req.payload = Object.fromEntries(req.payload);
	}

	const url = new URL(baseUrl, window.location.origin);

	// url.searchParams.

	req.credentials ??= "same-origin";
	req.headers ??= {};
	req.headers["Content-Type"] = "application/json; charset=utf-8";

	const response = await fetch(url, {
		method: req.method,
		body: JSON.stringify(req.payload),
		headers: new Headers(req.headers),
		credentials: req.credentials,
	});

	if (!response.ok) {
		throw response;
	}

	return response;
}
