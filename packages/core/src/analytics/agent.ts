import { fillGridWithInterview } from "./analyseInterview.js";
import { generateTranscript } from "./generateTranscript.js";
import { extractQuestionsFromGrid } from "./question.js";

export async function runAnalyticsAgent(audioPath: string, gridPath: string) {
	console.warn("Extracting questions and generating transcript...");
	const [questions, transcript] = await Promise.all([
		extractQuestionsFromGrid(gridPath),
		generateTranscript(audioPath),
	]);

	console.warn("Analysing interview...");
	const filledGrid = await fillGridWithInterview(questions, transcript);

	console.log("# Analyse de l'entretien");
	console.log("## Retranscription de l'entretien :");
	for (const line of transcript) {
		console.log(
			`* **${line.speaker === "recruiter" ? "Recruteur" : "Candidat"} :** ${line.text}`,
		);
	}

	console.log();
	console.log("## Grille d'évaluation");
	for (const question of filledGrid.questions) {
		console.log("*", question.question);
		for (const criteria of question.criterias) {
			console.log(
				`  * **Critère :** ${criteria.criteria} ${criteria.passes ? "✅" : "❌"}`,
			);
			criteria.passes &&
				console.log(`    **Réponse du candidat :**`, criteria.answer?.text);
		}
		console.log();
	}
	console.log();
}
