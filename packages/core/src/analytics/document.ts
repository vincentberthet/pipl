import * as fs from "node:fs/promises";
import * as docx from "docx";
import type { FilledGrid } from "./analyseInterview.js";
import type { Transcript } from "./generateTranscript.js";

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
	.map((question) => {
		return `* ${question.question}\n${question.criterias
			.map(
				(criteria) =>
					`  * **Critère :** ${criteria.criteria} ${criteria.passes ? "✅" : "❌"}\n` +
					(criteria.passes
						? `	**Réponse du candidat :** ${criteria.answer?.text}`
						: ""),
			)
			.join("\n")}`;
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
								text: `Analyse de l'entretien de ${candidateName}`,
								bold: true,
							}),
						],
						heading: docx.HeadingLevel.HEADING_1,
					}),
					new docx.Paragraph({
						children: [
							new docx.TextRun({
								text: `Grille d'évaluation de l'entretien`,
								bold: true,
							}),
						],
						heading: docx.HeadingLevel.HEADING_2,
					}),
					...filledGrid.flatMap((question, i) => {
						return [
							new docx.Paragraph({
								children: [
									new docx.TextRun({
										text: `Question ${i + 1} : ${question.question}`,
										bold: true,
									}),
								],
								heading: docx.HeadingLevel.HEADING_3,
							}),
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
											...(criteria.passes
												? [
														new docx.TextRun({
															text: `Réponse du candidat : \n`,
															bold: true,
															break: 1,
														}),
														new docx.TextRun({
															text: `${criteria.answer?.text || "Aucune réponse"}`,
														}),
													]
												: []),
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
