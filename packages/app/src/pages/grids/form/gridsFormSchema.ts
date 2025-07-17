import * as z from "zod/v4";

export const jobNameSchema = z.string().min(1, "Le nom du poste est requis");
export const emailSchema = z.email("L'email doit être valide");
export const filesSchema = z
	.array(
		z
			.file("Au moins un fichier est requis")
			.mime(
				[
					"application/pdf",
					"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
					"application/vnd.ms-excel",
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
					"text/csv",
				],
				"Les fichiers doivent être au format PDF, DOCX, XLS, XLSX ou CSV",
			),
	)
	.min(1, "Au moins un fichier est requis");
export const nbJobQuestionsSchema = z
	.int("Le nombre de questions est requis")
	.min(0, "Le nombre de questions ne peut pas être négatif")
	.max(8, "Le nombre de questions ne peut pas dépasser 8");
export const nbTechSkillsSchema = z
	.int("Le nombre de compétences techniques est requis")
	.min(0, "Le nombre de compétences techniques ne peut pas être négatif")
	.max(4, "Le nombre de compétences techniques ne peut pas dépasser 4");
export const techNbExperienceQuestionsSchema = z
	.int("Le nombre de questions d'expérience technique est requis")
	.min(
		0,
		"Le nombre de questions d'expérience technique ne peut pas être négatif",
	)
	.max(
		8,
		"Le nombre de questions d'expérience technique ne peut pas dépasser 8",
	);
export const techNbSituationQuestionsSchema = z.int(
	"Le nombre de questions de situation est requis",
);
export const nbBehavioralSkillsSchema = z.int(
	"Le nombre de compétences comportementales est requis",
);
export const behavioralNbExperienceQuestionsSchema = z.int(
	"Le nombre de questions d'expérience comportementales est requis",
);
export const behavioralNbSituationQuestionsSchema = z.int(
	"Le nombre de questions de situation est requis",
);

export const gridsFormSchema = z.object({
	jobName: jobNameSchema,
	email: emailSchema,
	files: filesSchema,
	nbJobQuestions: nbJobQuestionsSchema,
	nbTechSkills: nbTechSkillsSchema,
	techNbExperienceQuestions: techNbExperienceQuestionsSchema,
	techNbSituationQuestions: techNbSituationQuestionsSchema,
	nbBehavioralSkills: nbBehavioralSkillsSchema,
	behavioralNbExperienceQuestions: behavioralNbExperienceQuestionsSchema,
	behavioralNbSituationQuestions: behavioralNbSituationQuestionsSchema,
});

export type GridsFormSchema = z.infer<typeof gridsFormSchema>;

export const gridsFormResultSchema = z.object({
	executionArn: z.string(),
});

export type GridsFormResultSchema = z.infer<typeof gridsFormResultSchema>;
