import * as z from "zod/v4";

export const gridFormSchema = z.object({
	jobName: z.string().min(1, "Le nom du poste est requis"),
	email: z.email("L'email doit être valide"),
	files: z.array(z.file()),
});
