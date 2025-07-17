import z from "zod/v4";

export const GRID_MAX_SIZE = 67108864; // 64 MB
export const AUDIO_MAX_SIZE = 536870912; // 512 MB

export const candidateNameValidator = z
	.string("Le nom du candidat est requis")
	.min(1, "Le nom du candidat est requis");
export const jobNameValidator = z
	.string("Le poste est requis")
	.min(1, "Le poste est requis");
export const emailValidator = z.email("L'email doit être valide");
export const audioValidator = z
	.file("Le fichier audio est requis")
	.mime(
		["audio/mpeg", "video/mp4"],
		"Le fichier audio doit être un mp3 ou une vidéo au format mp4",
	)
	.max(
		AUDIO_MAX_SIZE,
		`La taille maximale de la grille d'entretien est de ${AUDIO_MAX_SIZE / 1024 / 1024} Mo`,
	);
export const gridValidator = z
	.file("La grille d'entretien est requise")
	.mime(
		[
			"application/pdf",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		],
		"La grille d'entretien doit être au format PDF ou DOCX",
	)
	.max(
		GRID_MAX_SIZE,
		`La taille maximale de la grille d'entretien est de ${GRID_MAX_SIZE / 1024 / 1024} Mo`,
	);

export const analyticsFormSchema = z.object({
	candidateName: candidateNameValidator,
	jobName: jobNameValidator,
	email: emailValidator,
	audio: audioValidator,
	grid: gridValidator,
});

export type AnalyticsFormSchema = z.infer<typeof analyticsFormSchema>;

export const analyticsFormResultSchema = z.object({
	executionArn: z.string(),
});

export type AnalyticsFormResultSchema = z.infer<
	typeof analyticsFormResultSchema
>;
