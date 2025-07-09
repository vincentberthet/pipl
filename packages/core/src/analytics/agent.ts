import { fillGridWithInterview } from "./analyzeInterview.js";
import { generateTranscript } from "./generateTranscript.js";
import { extractQuestionsFromGrid } from "./question.js";

export async function runAnalyticsAgent(audioPath: string, gridPath: string) {
	console.debug("Extracting questions and generating transcript...");
	const [questions, transcript] = await Promise.all([
		extractQuestionsFromGrid(gridPath),
		generateTranscript(audioPath),
	]);

	console.debug("Analysing interview...");
	const filledGrid = await fillGridWithInterview(questions, transcript);

	console.debug("Analytics complete");
	return {
		transcript,
		filledGrid,
		questions,
	};
}
