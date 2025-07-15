import * as z from "zod/v4";
import { groupedBySkillSchema } from "./utils.js";

// grid-generate-docx
export const generateGridPropsSchema = z.object({
	email: z.email(),
	jobName: z.string().min(1).max(100),
	grid: groupedBySkillSchema,
});
export type GenerateGridProps = z.infer<typeof generateGridPropsSchema>;

// grid-agent
export const agentPropsSchema = z.object({
	pathToFiles: z.array(z.string()),
	jobName: z.string(),
	email: z.email(),
	"nb-questions-poste": z.number().min(0),
	"nb-competences-tech": z.number().min(0),
	"tech-nb-questions-experience": z.number().min(0),
	"tech-nb-questions-situation": z.number().min(0),
	"nb-competences-comportementales": z.number().min(0),
	"comportementale-nb-questions-experience": z.number().min(0),
	"comportementale-nb-questions-situation": z.number().min(0),
});
export type AgentProps = z.infer<typeof agentPropsSchema>;

// grid-endpoint
export const gridEndpointSchema = agentPropsSchema.extend({
	accessToken: z.string(),
});

export type GridEndpoint = z.infer<typeof gridEndpointSchema>;
