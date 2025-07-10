import { randomUUID } from "node:crypto";
import * as fs from "node:fs/promises";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fillGridInputSchema } from "@pipl-analytics/core/analytics/analyzeInterview.schema";
import { generateTranscript } from "@pipl-analytics/core/analytics/generateTranscript";
import * as z from "zod/v4";

const s3 = new S3Client({ region: process.env.AWS_REGION });
const extractTranscriptInputSchema = fillGridInputSchema
	.omit({ questions: true, transcript: true })
	.extend({
		transcriptObjectKey: z.string(),
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

	const { transcriptObjectKey, ...rest } = data;

	const [{ Body }] = await Promise.all([
		s3.send(
			new GetObjectCommand({
				Bucket: process.env.S3_BUCKET,
				Key: data.transcriptObjectKey,
			}),
		),
		fs.mkdir("/tmp", { recursive: true }),
	]);

	if (!Body) {
		return {
			statusCode: 404,
			body: JSON.stringify({
				error: "source_audio_not_found",
			}),
		};
	}

	const extension = transcriptObjectKey.split(".").pop();
	const audioFileName = `/tmp/${randomUUID()}.${extension}`;
	try {
		await fs.writeFile(audioFileName, Body.transformToWebStream());

		const transcript = await generateTranscript(audioFileName);

		return JSON.stringify({
			...rest,
			transcript,
		});
	} finally {
		await fs
			.unlink(audioFileName)
			.catch((e) => console.error("Failed to delete temp file:", e));
	}
};
