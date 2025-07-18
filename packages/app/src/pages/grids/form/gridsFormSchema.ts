import * as z from "zod/v4";

export const QUESTIONS_MIN = 0;
export const QUESTION_MAX = 3;
export const SKILLS_MIN = 0;
export const SKILLS_MAX = 8;
export const ACCEPTED_FILE_TYPES = [
	"application/pdf",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"text/csv",
];

export const MAX_FILE_SIZE = 67108864; // 64 MB

export const jobNameSchema = z.string().min(1, "Le nom du poste est requis");
export const emailSchema = z.email("L'email doit être valide");
export const filesSchema = z
	.array(
		z
			.file("Au moins un fichier est requis")
			.mime(
				ACCEPTED_FILE_TYPES,
				"Les fichiers doivent être au format PDF, DOCX, XLSX ou CSV",
			)
			.max(
				MAX_FILE_SIZE,
				`La taille maximale d'un fichier est de ${MAX_FILE_SIZE / 1024 / 1024} Mo`,
			),
	)
	.min(1, "Au moins un fichier est requis");
export const nbJobQuestionsSchema = z
	.int("Le nombre de questions est requis")
	.min(QUESTIONS_MIN, "Le nombre de questions ne peut pas être négatif")
	.max(
		QUESTION_MAX,
		`Le nombre de questions ne peut pas dépasser ${QUESTION_MAX}`,
	);
export const nbTechSkillsSchema = z
	.int("Le nombre de compétences techniques est requis")
	.min(
		SKILLS_MIN,
		"Le nombre de compétences techniques ne peut pas être négatif",
	)
	.max(
		SKILLS_MAX,
		`Le nombre de compétences techniques ne peut pas dépasser ${SKILLS_MAX}`,
	);
export const techNbExperienceQuestionsSchema = z
	.int("Le nombre de questions d'expérience technique est requis")
	.min(
		QUESTIONS_MIN,
		"Le nombre de questions d'expérience technique ne peut pas être négatif",
	)
	.max(
		QUESTION_MAX,
		`Le nombre de questions d'expérience technique ne peut pas dépasser ${QUESTION_MAX}`,
	);
export const techNbSituationQuestionsSchema = z
	.int("Le nombre de questions de situation est requis")
	.min(
		QUESTIONS_MIN,
		"Le nombre de questions de situation ne peut pas être négatif",
	)
	.max(
		QUESTION_MAX,
		`Le nombre de questions de situation ne peut pas dépasser ${QUESTION_MAX}`,
	);
export const nbBehavioralSkillsSchema = z
	.int("Le nombre de compétences comportementales est requis")
	.min(
		SKILLS_MIN,
		"Le nombre de compétences comportementales ne peut pas être négatif",
	)
	.max(
		SKILLS_MAX,
		`Le nombre de compétences comportementales ne peut pas dépasser ${SKILLS_MAX}`,
	);
export const behavioralNbExperienceQuestionsSchema = z
	.int("Le nombre de questions d'expérience comportementales est requis")
	.min(
		QUESTIONS_MIN,
		"Le nombre de questions d'expérience comportementales ne peut pas être négatif",
	)
	.max(
		QUESTION_MAX,
		`Le nombre de questions d'expérience comportementales ne peut pas dépasser ${QUESTION_MAX}`,
	);
export const behavioralNbSituationQuestionsSchema = z
	.int("Le nombre de questions de situation est requis")
	.min(
		QUESTIONS_MIN,
		"Le nombre de questions de situation ne peut pas être négatif",
	)
	.max(
		QUESTION_MAX,
		`Le nombre de questions de situation ne peut pas dépasser ${QUESTION_MAX}`,
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
