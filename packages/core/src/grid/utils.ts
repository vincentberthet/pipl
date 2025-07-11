import * as fs from "node:fs/promises";
import * as docx from "docx";
import { z } from "zod/v4";
export const prompt = ({
	nbDocuments,
	jobName,
}: {
	nbDocuments: number;
	jobName: string;
}) => `Dans le recrutement, l’entretien structuré consiste à s’entretenir avec les candidats en utilisant une même grille d’entretien. Celle-ci comporte :
les connaissances (savoirs), les compétences techniques (savoir-faire), et les compétences comportementales (savoir-être) à évaluer
les questions à poser pour chacune
les critères de notation pour évaluer les réponses à chaque question

Pour évaluer les compétences, on distingue deux types de questions :
1) Les questions comportementales invitent le candidat à décrire un comportement passé dans une situation concrète. Par exemple : « Parlez-moi d’une fois où vous avez eu des difficultés à travailler avec quelqu’un (un collègue, un client, etc.) ».

2) Les questions situationnelles placent le candidat dans un scénario hypothétique, et lui demandent ce qu’il ferait. Par exemple : « Imaginez une situation où vous êtes commercial. Le mois se clôture dans 2 jours et vous êtes loin de votre objectif. Votre collègue vient vous voir parce qu’il est bloqué avec un nouvel outil. Que faites-vous ? ».

Les questions doivent être concises.
Les questions doivent avoir moins de 20 mots.

Les réponses aux questions sont évaluées suivant des critères binaires. Les réponses aux questions comportementales sont évaluées avec la méthode STAR : 
Situation : la situation décrite renvoie-t-elle bien à la question ?
Tâche : la tâche à réaliser renvoie-t-elle bien à la question ?
Action : les actions réalisées par le candidat sont-elles pertinentes ?
Résultat : les résultats obtenus par les actions réalisées sont-ils satisfaisants ?

Les critères binaires utilisés pour les questions de connaissances et les questions situationnelles sont spécifiques à chaque question.

IMPORTANT: Les questions ne doivent pas dépasser 1 phrase.
IMPORTANT: Les questions doivent être courtes et concises.
IMPORTANT: Les questions doivent faire maximum 20 mots.

Voici ${nbDocuments} documents relatifs au métier de ${jobName}. A partir de ces documents, je voudrais que tu génères une grille d’entretien pour évaluer des candidats à ce poste :
3 questions de connaissances liées à ce poste ("Connaissances liées au poste")
3 compétences techniques ("Hard skills") et 3 compétences comportementales ("Soft skills"). Pour chaque compétence, génère 2 questions comportementales et 2 questions situationnelles 
les critères de notation pour évaluer les réponses à chaque question : utilise 3 critères binaires pour les questions de connaissances et les questions situationnelles

Fais des questions concises.
Fais des questions de moins de 20 mots.
`;

const question = z
	.string()
	.meta({ description: "La question de la grille d'évaluation" });

const category = z
	.string()
	.meta({ description: "La catégorie de la question" });

const questionType = z.enum(["comportementale", "situationnelle"]).meta({
	description: "Le type de la question (comportementale ou situationnelle)",
});

const binaryCriteriaSchema = z.object({
	question,
	questionType,
	category,
	criterias: z.array(
		z.string().meta({
			description: "Un critère binaire pour évaluer une réponse",
		}),
	),
});

const STARCriteriaSchema = z.object({ question, questionType, category });

const questionSchema = z.union([binaryCriteriaSchema, STARCriteriaSchema]);
export type QuestionSchema = z.infer<typeof questionSchema>;

export const gridSchema = z
	.array(questionSchema)
	.meta({ description: "La grille d'entretien structurée" });
export type GridSchema = z.infer<typeof gridSchema>;

export const groupedDataSchema = z.array(
	z.object({
		category: z.string().meta({ description: "La catégorie de la question" }),
		questions: z.array(questionSchema).meta({
			description: "Les questions de la catégorie",
		}),
	}),
);

export type GroupedData = z.infer<typeof groupedDataSchema>;

export const printGrid = (grid: GridSchema, jobName: string) => {
	if (grid.length === 0) {
		return "Aucune question trouvée dans la grille.";
	}

	let output = `# Grille d’entretien – ${jobName}\n`;

	grid.forEach((element, index) => {
		output += `\n## Question ${index + 1}. ${element.question}\n\n`;

		if ("criterias" in element && element.criterias) {
			element.criterias.forEach((criteria, criteriaIndex) => {
				output += `- Critère ${criteriaIndex + 1} (Oui/Non): ${criteria}\n`;
			});
		} else {
			output +=
				"Critères de la méthode STAR :\n\n- Critère 1 : Situation\n- Critère 2 : Tâche\n- Critère 3 : Actions\n- Critère 4 : Résultats\n";
		}
	});

	return output;
};

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
								const questionText = `Question ${index + 1} ${questionTypeText}: ${element.question}`;
								if ("criterias" in element && element.criterias) {
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
