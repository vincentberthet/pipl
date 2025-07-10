import { fillGridWithInterview } from "@pipl-analytics/core/analytics/analyzeInterview";
import {
	type FillGridInput,
	fillGridInputSchema,
} from "@pipl-analytics/core/analytics/analyzeInterview.schema";

export const handler = async (event: FillGridInput) => {
	const { success, data } = fillGridInputSchema.safeParse(event);
	if (!success) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				error: "invalid_input",
			}),
		};
	}

	const { questions, ...rest } = data;

	const filledGrid = await fillGridWithInterview(questions, data.transcript);

	return JSON.stringify({
		...rest,
		filledGrid,
	});
};
