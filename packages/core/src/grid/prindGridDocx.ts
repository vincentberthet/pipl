import * as fs from "node:fs/promises";
import * as docx from "docx";
import type { GroupedData } from "./utils.js";

export const printGridDocx = async (
	filePath: string,
	grid: GroupedData,
	jobName: string,
) => {
	const document = new docx.Document({
		sections: [
			{
				children: [
					new docx.Paragraph({
						children: [
							new docx.TextRun({
								text: `Grille d’entretien – ${jobName}`,
								bold: true,
							}),
						],
						heading: docx.HeadingLevel.HEADING_1,
					}),
					...grid.flatMap((element) => {
						if (element.questions.length === 0) {
							return [
								new docx.Paragraph({
									children: [
										new docx.TextRun({
											text: `Aucune question trouvée pour la catégorie ${element.category}.`,
											bold: true,
										}),
									],
									heading: docx.HeadingLevel.HEADING_3,
								}),
							];
						}
						const categoryText = `Catégorie : ${element.category}`;
						return [
							new docx.Paragraph({
								children: [
									new docx.TextRun({
										text: categoryText,
										bold: true,
									}),
								],
								heading: docx.HeadingLevel.HEADING_2,
							}),
							...element.questions.flatMap((element, index) => {
								const questionTypeText =
									element.category === "Connaissances liées au poste"
										? ""
										: `(question ${element.questionType}) `;
								const questionText = `Question ${index + 1} ${questionTypeText}${element.competence ? `: ${element.competence}` : ""}: ${element.question}`;
								if (element.criterias) {
									return [
										new docx.Paragraph({
											children: [
												new docx.TextRun({
													text: questionText,
												}),
											],
											heading: docx.HeadingLevel.HEADING_3,
										}),
										...element.criterias.flatMap((criteria, criteriaIndex) => {
											return new docx.Paragraph({
												children: [
													new docx.TextRun({
														text: `Critère ${criteriaIndex + 1} (Oui/Non): `,
														bold: true,
													}),
													new docx.TextRun({
														text: criteria,
													}),
												],
											});
										}),
									];
								} else {
									return [
										new docx.Paragraph({
											children: [
												new docx.TextRun({
													text: questionText,
												}),
											],
											heading: docx.HeadingLevel.HEADING_3,
										}),
										new docx.Paragraph({
											children: [
												new docx.TextRun({
													text: "Critères de la méthode STAR :",
													bold: true,
												}),
											],
										}),
										new docx.Paragraph({
											children: [
												new docx.TextRun({
													text: "Critère 1 : ",
													bold: true,
												}),
												new docx.TextRun({
													text: "S (Situation) : le candidat décrit-il une situation professionnelle pertinente ?",
												}),
											],
										}),
										new docx.Paragraph({
											children: [
												new docx.TextRun({
													text: "Critère 2 : ",
													bold: true,
												}),
												new docx.TextRun({
													text: "T (Tâche) : le candidat décrit-il son rôle et ses responsabilités dans la situation en question ?",
												}),
											],
										}),
										new docx.Paragraph({
											children: [
												new docx.TextRun({
													text: "Critère 3 : ",
													bold: true,
												}),
												new docx.TextRun({
													text: "A (Action) : le candidat décrit-il les actions qu’il a entreprises pour atteindre un objectif ou pour résoudre un problème ?",
												}),
											],
										}),
										new docx.Paragraph({
											children: [
												new docx.TextRun({
													text: "Critère 4 : ",
													bold: true,
												}),
												new docx.TextRun({
													text: "R (Résultat) : le candidat décrit-il les résultats ou l’impact obtenus, idéalement avec des données chiffrées",
												}),
											],
										}),
									];
								}
							}),
						];
					}),
				],
			},
		],
	});

	const buffer = await docx.Packer.toBuffer(document);
	await fs.writeFile(filePath, buffer);
};
