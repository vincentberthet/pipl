import { fillGridWithInterview } from "./audio.js";
import { extractQuestionsFromGrid } from "./question.js";

export async function runAnalyticsAgent(audioPath: string, gridPath: string) {
	const questions = await extractQuestionsFromGrid(gridPath);
	const filledGrid = await fillGridWithInterview(questions, audioPath);

	for (const question of filledGrid.questions) {
		console.log("*", question.question, `${question.questionTimeCode ?? ""}`);
		for (const criteria of question.criterias) {
			console.log("  -", criteria.criteria, ":", criteria.passes);
			criteria.passes &&
				console.log(
					`    [${criteria.answer?.answerTimeCode}]`,
					criteria.answer?.text,
				);
		}
		console.log();
	}
}
