import * as fs from "node:fs/promises";
import * as docx from "docx";
import type { FinalGroupedData, GroupedDataBySkill } from "./utils.js";

const printBehavioralQuestion = (questionText: string) => [
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
				text: "Critère 1 (Oui/Non): Situation: ",
				bold: true,
			}),
			new docx.TextRun({
				text: "La situation décrite renvoie-t-elle bien à la question ?",
			}),
		],
	}),
	new docx.Paragraph({
		children: [
			new docx.TextRun({
				text: "Critère 2 (Oui/Non): Tâche: ",
				bold: true,
			}),
			new docx.TextRun({
				text: "La tâche à réaliser renvoie-t-elle bien à la question ?",
			}),
		],
	}),
	new docx.Paragraph({
		children: [
			new docx.TextRun({
				text: "Critère 3 (Oui/Non): Action: ",
				bold: true,
			}),
			new docx.TextRun({
				text: "Les actions réalisées par le candidat sont-elles pertinentes ?",
			}),
		],
	}),
	new docx.Paragraph({
		children: [
			new docx.TextRun({
				text: "Critère 4 (Oui/Non): Résultat: ",
				bold: true,
			}),
			new docx.TextRun({
				text: "Les résultats obtenus par les actions réalisées sont-ils satisfaisants ?",
			}),
		],
	}),
];

const printSituationQuestion = (questionText: string, criterias: string[]) => {
	return [
		new docx.Paragraph({
			children: [
				new docx.TextRun({
					text: questionText,
				}),
			],
			heading: docx.HeadingLevel.HEADING_3,
		}),
		...criterias.flatMap((criteria, criteriaIndex) => {
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
};

const printQuestion = (
	question: GroupedDataBySkill[0]["questionsGroups"][0]["questions"][0],
	index: number,
) => {
	const isBehavioralQuestions =
		question.questionType.toLowerCase() === "comportementale" ||
		question.questionType.toLowerCase() === "comportementales";

	const questionTypeText =
		question.category === "Connaissances liées au poste"
			? ""
			: isBehavioralQuestions
				? "(retour d’expérience)"
				: "(mise en situation)";
	const questionText = `Question ${index + 1} ${questionTypeText}: ${question.question}`;

	if (isBehavioralQuestions || question.criterias === undefined)
		return printBehavioralQuestion(questionText);
	else return printSituationQuestion(questionText, question.criterias);
};

const printQuestionsGroups = (
	questionsGroups: GroupedDataBySkill[0]["questionsGroups"][0],
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

const printCategory = (category: FinalGroupedData[0]) => {
	if ("questionsGroups" in category) {
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
	} else {
		if (category.questions.length === 0) {
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
			...category.questions.flatMap(printQuestion),
		];
	}
};

export const printGridDocx = async (
	filePath: string,
	grid: FinalGroupedData,
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
