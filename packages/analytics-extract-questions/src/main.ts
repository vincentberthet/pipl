import { randomUUID } from "node:crypto";
import * as fs from "node:fs/promises";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fillGridInputSchema } from "@pipl-analytics/core/analytics/analyzeInterview.schema";
import { extractQuestionsFromGrid } from "@pipl-analytics/core/analytics/question";
import * as z from "zod/v4";

const s3 = new S3Client({ region: process.env.AWS_REGION });
const extractTranscriptInputSchema = fillGridInputSchema
	.omit({ questions: true, transcript: true })
	.extend({
		gridObjectKey: z.string(),
	});

export type ExtractTranscriptInput = z.infer<
	typeof extractTranscriptInputSchema
>;

export const handler = async (event: ExtractTranscriptInput) => {
	const { success, data } = extractTranscriptInputSchema.safeParse(event);
	if (!success) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				error: "invalid_input",
			}),
		};
	}

	const { gridObjectKey, ...rest } = data;

	const [{ Body }] = await Promise.all([
		s3.send(
			new GetObjectCommand({
				Bucket: process.env.S3_BUCKET,
				Key: data.gridObjectKey,
			}),
		),
		fs.mkdir("/tmp", { recursive: true }),
	]);

	if (!Body) {
		return {
			statusCode: 404,
			body: JSON.stringify({
				error: "source_grid_not_found",
			}),
		};
	}

	const extension = gridObjectKey.split(".").pop();
	const gridFileName = `/tmp/${randomUUID()}.${extension}`;
	try {
		await fs.writeFile(gridFileName, Body.transformToWebStream());

		const questions = await extractQuestionsFromGrid(gridFileName);

		return JSON.stringify({
			...rest,
			questions,
		});
	} finally {
		await fs
			.unlink(gridFileName)
			.catch((e) => console.error("Failed to delete temp file:", e));
	}
};
