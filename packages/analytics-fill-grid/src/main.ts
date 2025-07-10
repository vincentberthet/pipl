import { fillGridWithInterview } from "@pipl-analytics/core/analytics/analyzeInterview";
import {
	type FillGridInput,
	fillGridInputSchema,
} from "@pipl-analytics/core/analytics/analyzeInterview.schema";

export const handler = async (event: FillGridInput) => {
	const { success, data, error } = fillGridInputSchema.safeParse(event);
	if (!success) {
		throw new Error(`Invalid input: ${JSON.stringify(error)}`);
	}

	const { questions, ...rest } = data;

	const filledGrid = await fillGridWithInterview(questions, data.transcript);

	return {
		...rest,
		filledGrid,
	};
};
