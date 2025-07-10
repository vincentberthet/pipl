type Input = Record<string, unknown>[];

export const handler = async (event: Input) => {
	return JSON.stringify(
		event.reduce(
			(acc, item) => {
				return {
					// biome-ignore lint/performance/noAccumulatingSpread: required for merging inputs
					...acc,
					...item,
				};
			},
			{} as Record<string, unknown>,
		),
	);
};
