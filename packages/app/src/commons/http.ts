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
