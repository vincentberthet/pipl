import * as z from "zod/v4";

export const gridFormSchema = z.object({
	jobName: z.string().min(1, "Le nom du poste est requis"),
	email: z.email("L'email doit être valide"),
	files: z.array(z.file()),
	"nb-questions-poste": z.string().transform((val) => parseInt(val)),
	"nb-competences-tech": z.string().transform((val) => parseInt(val)),
	"tech-nb-questions-experience": z.string().transform((val) => parseInt(val)),
	"tech-nb-questions-situation": z.string().transform((val) => parseInt(val)),
	"nb-competences-comportementales": z
		.string()
		.transform((val) => parseInt(val)),
	"comportementale-nb-questions-experience": z
		.string()
		.transform((val) => parseInt(val)),
	"comportementale-nb-questions-situation": z
		.string()
		.transform((val) => parseInt(val)),
});
