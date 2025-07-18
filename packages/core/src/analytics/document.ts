import * as fs from "node:fs/promises";
import * as docx from "docx";
import type { FilledGrid } from "./analyzeInterview.schema.js";
import type { Transcript } from "./generateTranscript.schema.js";

export async function writeMarkdownOutput(
	filePath: string,
	transcript: Transcript,
	filledGrid: FilledGrid,
) {
	const markdownOutput = `# Analyse de l'entretien
## Retranscription de l'entretien :
${transcript
	.map(
		(line) =>
			`* **${line.speaker === "recruiter" ? "Recruteur" : "Candidat"} :** ${line.text}`,
	)
	.join("\n")}

## Grille d'évaluation
${filledGrid
	.map(({ category, questions }) => {
		return `### ${category}
		${questions
			.map(({ question, criterias, answer }, i) => {
				return `#### Question ${i + 1} : ${question}
${answer ? `\n**Réponse du candidat :**\n${answer}` : ""}
${criterias
	.map(
		({ criteria, passes }, i) =>
			`* ${passes ? "✅" : "❌"} **Critère ${i + 1} :** ${criteria}`,
	)
	.join("\n")}`;
			})
			.join("\n")}
			`;
	})
	.join("\n\n")}`;

	await fs.writeFile(filePath, markdownOutput);
}

export async function writeDocxOutput(
	filePath: string,
	candidateName: string,
	transcript: Transcript,
	filledGrid: FilledGrid,
) {
	const document = new docx.Document({
		numbering: {
			config: [
				{
					reference: "criteria",
					levels: [
						{
							level: 0,
							format: docx.LevelFormat.BULLET,
							text: "\u2022",
							alignment: docx.AlignmentType.LEFT,
							style: {
								paragraph: {
									indent: {
										left: docx.convertInchesToTwip(0.5),
										hanging: docx.convertInchesToTwip(0.25),
									},
								},
							},
						},
					],
				},
			],
		},
		sections: [
			{
				children: [
					new docx.Paragraph({
						children: [
							new docx.TextRun({
								text: `Compte-rendu de l'entretien de ${candidateName}`,
								bold: true,
							}),
						],
						heading: docx.HeadingLevel.HEADING_1,
					}),
					new docx.Paragraph({
						children: [
							new docx.TextRun({
								text: `Évaluation de l'entretien suivant la grille`,
								bold: true,
							}),
						],
						heading: docx.HeadingLevel.HEADING_2,
					}),
					...filledGrid.flatMap(({ category, isSkill, questions }) => {
						const passedCriteriaCount = questions.reduce(
							(count, question) =>
								count +
								question.criterias.filter((criteria) => criteria.passes).length,
							0,
						);
						const totalCriteriaCount = questions.reduce(
							(count, question) => count + question.criterias.length,
							0,
						);
						return [
							new docx.Paragraph({
								children: [
									new docx.TextRun({
										text: `${isSkill ? "Compétence : " : ""} ${category} (Score: ${passedCriteriaCount} / ${totalCriteriaCount})`,
										bold: true,
									}),
								],
								heading: docx.HeadingLevel.HEADING_3,
							}),
							...questions.flatMap((question, i) => {
								return [
									new docx.Paragraph({
										children: [
											new docx.TextRun({
												text: `Question ${i + 1} : ${question.question}`,
												bold: true,
											}),
										],
										heading: docx.HeadingLevel.HEADING_4,
									}),
									...(question.answer
										? [
												new docx.Paragraph({
													children: [
														new docx.TextRun({
															text: `Réponse du candidat : \n`,
															bold: true,
															break: 1,
														}),
														new docx.TextRun({
															text: `${question.answer}`,
														}),
														new docx.TextRun({
															text: "",
															break: 1,
														}),
													],
												}),
											]
										: []),
									...question.criterias.flatMap((criteria, i) => {
										return [
											new docx.Paragraph({
												numbering: {
													reference: "criteria",
													level: 0,
												},
												children: [
													new docx.TextRun({
														text: criteria.passes ? "✅" : "❌",
														bold: true,
													}),
													new docx.TextRun({
														text: ` Critère ${i + 1} : `,
														bold: true,
													}),
													new docx.TextRun({
														text: `${criteria.criteria}`,
													}),
												],
											}),
										];
									}),
									new docx.Paragraph({
										children: [
											new docx.TextRun({
												text: "",
												break: 1,
											}),
										],
									}),
								];
							}),
						];
					}),
				],
			},
			{
				children: [
					new docx.Paragraph({
						children: [
							new docx.TextRun({
								text: `Transcription de l'entretien`,
								bold: true,
							}),
						],
						heading: docx.HeadingLevel.HEADING_2,
					}),
					...transcript.map(({ speaker, text }) => {
						return new docx.Paragraph({
							children: [
								new docx.TextRun({
									text: `${speaker === "recruiter" ? "Recruteur" : "Candidat"} : `,
									bold: true,
								}),
								new docx.TextRun({
									text,
								}),
							],
						});
					}),
				],
			},
		],
	});

	const buffer = await docx.Packer.toBuffer(document);
	await fs.writeFile(filePath, buffer);
}
