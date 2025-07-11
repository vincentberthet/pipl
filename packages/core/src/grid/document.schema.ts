import * as z from "zod/v4";
import { groupedDataSchema } from "./utils.js";

export const documentSchema = z.object({
	email: z.email(),
	jobName: z.string().min(1).max(100),
	grid: groupedDataSchema,
});

export type Document = z.infer<typeof documentSchema>;

export const agentPropsSchema = z.object({
	pathToFiles: z.array(z.string()),
	jobName: z.string(),
	email: z.email(),
});

export type AgentProps = z.infer<typeof agentPropsSchema>;

export const gridEndpointSchema = agentPropsSchema.extend({
	accessToken: z.string(),
});

export type GridEndpoint = z.infer<typeof gridEndpointSchema>;
