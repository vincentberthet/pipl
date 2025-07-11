import * as z from "zod/v4";
import { transcriptSchema } from "./generateTranscript.schema.js";
import { questionsSchema } from "./question.schema.js";

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
						}),
					),

					answer: z.string().nullable().meta({
						description:
							"Si le candidat valide le critère, la réponse du candidat à la question, sinon `null`",
					}),
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

export const fillGridInputSchema = z.object({
	email: z.email(),
	jobName: z.string().min(1).max(100),
	candidateName: z.string().min(1).max(100),
	questions: questionsSchema,
	transcript: transcriptSchema,
});

export type FillGridInput = z.infer<typeof fillGridInputSchema>;
