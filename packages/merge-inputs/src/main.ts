type Input = (string | Record<string, unknown>)[];

export const handler = async (event: Input) => {
	return event.reduce<Record<string, unknown>>((acc, item) => {
		const value: Record<string, unknown> =
			typeof item === "string" ? JSON.parse(item) : item;

		if (typeof value !== "object" || Array.isArray(value) || value === null) {
			throw new Error("Invalid input: all items must be JSON objects");
		}

		return {
			// biome-ignore lint/performance/noAccumulatingSpread: required for merging inputs
			...acc,
			...value,
		};
	}, {});
};
