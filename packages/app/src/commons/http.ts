export async function fireAndForget(
	endpointUrl: string,
	body: Record<string, unknown>,
): Promise<void> {
	await fetch(endpointUrl, {
		method: "POST",
		body: JSON.stringify({
			...body,
			accessToken: import.meta.env.VITE_LAMBDA_ACCESS_TOKEN,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});
}

export async function postJson<T>(
	endpointUrl: string,
	data: Record<string, unknown>,
	signal?: AbortSignal,
): Promise<T> {
	const response = await fetch(endpointUrl, {
		method: "POST",
		body: JSON.stringify({
			...data,
			accessToken: import.meta.env.VITE_LAMBDA_ACCESS_TOKEN,
		}),
		headers: {
			"Content-Type": "application/json",
		},
		signal,
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json() as Promise<T>;
}
