import * as z from "zod/v4";
import { finalGroupedDataSchema } from "./utils.js";

// grid-generate-docx
export const generateGridPropsSchema = z.object({
	email: z.email(),
	jobName: z.string().min(1).max(100),
	grid: finalGroupedDataSchema,
});
export type GenerateGridProps = z.infer<typeof generateGridPropsSchema>;

// grid-agent
export const agentPropsSchema = z.object({
	pathToFiles: z.array(z.string()),
	jobName: z.string(),
	email: z.email(),
	nbJobQuestions: z.number().min(0),
	nbTechSkills: z.number().min(0),
	techNbExperienceQuestions: z.number().min(0),
	techNbSituationQuestions: z.number().min(0),
	nbBehavioralSkills: z.number().min(0),
	behavioralNbExperienceQuestions: z.number().min(0),
	behavioralNbSituationQuestions: z.number().min(0),
});
export type AgentProps = z.infer<typeof agentPropsSchema>;

// grid-endpoint
export const gridEndpointSchema = agentPropsSchema.extend({
	accessToken: z.string(),
});

export type GridEndpoint = z.infer<typeof gridEndpointSchema>;
