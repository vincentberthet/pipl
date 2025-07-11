import z from "zod/v4";

export const analyticsFormSchema = z.object({
	candidateName: z.string().min(1, "Le nom du candidat est requis"),
	jobName: z.string().min(1, "Le poste est requis"),
	email: z.email("L'email doit être valide"),
	audio: z.file(),
	grid: z.file(),
});
