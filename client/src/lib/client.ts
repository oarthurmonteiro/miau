type Req<T = unknown> = {
	method: "GET" | "POST" | "DELETE";
	headers?: Record<string, string>;
	payload?: T;
	query?: Record<string, unknown>;
	credentials?: RequestCredentials;
};

type Resp<T = unknown> = {
	status: number;
	headers: Record<string, string>;
	body: T;
};

export async function request<T>(baseUrl: string, req: Partial<Req>) {
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

	const responsePayload = await response.json();

	const clientResp: Resp<T> = {
		status: response.status,
		headers: Object.fromEntries(response.headers),
		body: responsePayload,
	};

	if (!response.ok) {
		console.log(responsePayload);
		throw new Error(responsePayload.error.message);
	}

	return clientResp;
}
