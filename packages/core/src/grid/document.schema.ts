import * as z from "zod/v4";
import { groupedDataSchema } from "./utils.js";

export const documentSchema = z.object({
	email: z.email(),
	jobName: z.string().min(1).max(100),
	grid: groupedDataSchema,
});

export const agentPropsSchema = z.object({
	pathToFiles: z.array(z.string()),
	jobName: z.string(),
	email: z.email(),
});

export const gridEndpointSchema = agentPropsSchema.extend({
	accessToken: z.string(),
});
