import * as z from "zod/v4";

export const filledGridSchema = z.array(
	z.object({
		category: z.string().meta({
			description: "La catégorie de la grille d'évaluation",
		}),
		questions: z
			.array(
				z.object({
					question: z.string().meta({
						description: "La question de la grille d'évaluation",
					}),
					criterias: z.array(
						z.object({
							criteria: z.string().meta({
								description: "Le critère analysé",
							}),
							passes: z.boolean().meta({
								description: "Si le candidat valide le critère",
							}),
							answer: z
								.object({
									text: z.string().meta({
										description:
											"La transcription de la réponse du candidat permettant de valider le critère",
									}),
									answerTimeCode: z.string().meta({
										description:
											"Le timecode de la réponse du candidat, sous la forme hh:mm:ss",
									}),
								})
								.nullable()
								.meta({
									description:
										"Si le candidat valide le critère, la réponse du candidat, sinon null",
								}),
						}),
					),
					questionTimeCode: z.string().nullable().meta({
						description:
							"Si la question a été posée par le recruteur, le timecode de la question du recruteur, sous la forme hh:mm:ss, sinon null",
					}),
				}),
			)
			.meta({
				description:
					"La grille d'évaluation remplie avec les réponses du candidat",
			}),
	}),
);

export type FilledGrid = z.infer<typeof filledGridSchema>;
