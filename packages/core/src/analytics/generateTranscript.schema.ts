import { z } from "zod/v4";

export const transcriptSchema = z
	.array(
		z.object({
			speaker: z.enum(["recruiter", "candidate"]).meta({
				description:
					"La personne qui parle, soit le recruteur, soit le candidat",
			}),
			text: z.string().meta({
				description: "Le texte de la prise de parole",
			}),
			timeCode: z.string().meta({
				description:
					"Le timecode de la prise de parole, sous la forme hh:mm:ss",
			}),
		}),
	)
	.meta({
		description:
			"La retranscription de l'entretien, avec les timecodes et les intervenants",
	});

export type Transcript = z.infer<typeof transcriptSchema>;
