import * as fs from "node:fs/promises";
import * as docx from "docx";
import type { GroupedByCompetence } from "./utils.js";

const printQuestion = (
	question: GroupedByCompetence[0]["questionsGroups"][0]["questions"][0],
	index: number,
) => {
	const questionTypeText =
		question.category === "Connaissances liées au poste"
			? ""
			: `(question ${question.questionType}) `;
	const questionText = `Question ${index + 1} ${questionTypeText}: ${question.question}`;
	if (question.criterias) {
		return [
			new docx.Paragraph({
				children: [
					new docx.TextRun({
						text: questionText,
					}),
				],
				heading: docx.HeadingLevel.HEADING_3,
			}),
			...question.criterias.flatMap((criteria, criteriaIndex) => {
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
};

const printQuestionsGroups = (
	questionsGroups: GroupedByCompetence[0]["questionsGroups"][0],
) => {
	const questions = questionsGroups.questions.flatMap(printQuestion);

	if (
		questionsGroups.competence &&
		questionsGroups.competence !== "Sans compétence"
	)
		return [
			new docx.Paragraph({
				children: [
					new docx.TextRun({
						text: `Compétence : ${questionsGroups.competence}`,
						bold: true,
					}),
				],
				heading: docx.HeadingLevel.HEADING_3,
			}),
			...questions,
		];
	return [...questions];
};

const printCategory = (category: GroupedByCompetence[0]) => {
	if (category.questionsGroups.length === 0) {
		return [
			new docx.Paragraph({
				children: [
					new docx.TextRun({
						text: `Aucune question trouvée pour la catégorie ${category.category}.`,
					}),
				],
				heading: docx.HeadingLevel.HEADING_3,
			}),
		];
	}
	const categoryText = `Catégorie : ${category.category}`;
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
		...category.questionsGroups.flatMap(printQuestionsGroups),
	];
};

export const printGridDocx = async (
	filePath: string,
	grid: GroupedByCompetence,
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
					...grid.flatMap(printCategory),
				],
			},
		],
	});

	const buffer = await docx.Packer.toBuffer(document);
	await fs.writeFile(filePath, buffer);
};
