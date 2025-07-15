import * as z from "zod/v4";

export const gridFormSchema = z.object({
	jobName: z.string().min(1, "Le nom du poste est requis"),
	email: z.email("L'email doit être valide"),
	files: z.array(z.file()),
	nbJobQuestions: z.string().transform((val) => parseInt(val)),
	nbTechSkills: z.string().transform((val) => parseInt(val)),
	techNbExperienceQuestions: z.string().transform((val) => parseInt(val)),
	techNbSituationQuestions: z.string().transform((val) => parseInt(val)),
	nbBehavioralSkills: z.string().transform((val) => parseInt(val)),
	behavioralNbExperienceQuestions: z.string().transform((val) => parseInt(val)),
	behavioralNbSituationQuestions: z.string().transform((val) => parseInt(val)),
});
