import { fillGridWithInterview } from "./audio.js";
import { extractQuestionsFromGrid } from "./question.js";

export async function runAnalyticsAgent(audioPath: string, gridPath: string) {
	const questions = await extractQuestionsFromGrid(gridPath);
	const filledGrid = await fillGridWithInterview(questions, audioPath);

	for (const question of filledGrid.questions) {
		console.log("*", question.question);
		for (const criteria of question.criterias) {
			console.log("  -", criteria.criteria, ":", criteria.passes ? "✅" : "❌");
			criteria.passes &&
				console.log(`    Réponse du candidat : `, criteria.answer?.text);
		}
		console.log();
	}

	console.log("Retranscription de l'entretien :");
	for (const line of filledGrid.interview) {
		console.log(
			`- ${line.speaker === "recruiter" ? "Recruteur" : "Candidat"} : ${line.text}`,
		);
	}
	console.log();
}
