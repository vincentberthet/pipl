import { z } from "zod/v4";

export const questionsSchema = z.array(
	z.object({
		category: z.string().meta({
			description: "La catégorie de la question",
		}),
		isSkill: z.boolean().meta({
			description:
				"Si la catégorie extraite est une compétence (true) sinon (false)",
		}),
		questions: z
			.array(
				z.object({
					question: z.string().meta({
						description: "La question",
					}),
					criterias: z.array(z.string()).meta({
						description: "Les critères de validation de la question",
					}),
				}),
			)
			.meta({
				description:
					"Les questions de la catégorie et leurs critères de validation",
			}),
	}),
);

export type Questions = z.infer<typeof questionsSchema>;
