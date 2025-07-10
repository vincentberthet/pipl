import * as z from "zod/v4";
import { filledGridSchema } from "./analyzeInterview.schema.js";
import { transcriptSchema } from "./generateTranscript.schema.js";

export const documentSchema = z.object({
	email: z.email(),
	jobName: z.string().min(1).max(100),
	candidateName: z.string().min(1).max(100),
	filledGrid: filledGridSchema,
	transcript: transcriptSchema,
});

export type Document = z.infer<typeof documentSchema>;
