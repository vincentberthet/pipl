import { randomUUID } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import { documentSchema } from "@pipl-analytics/core/analytics/document.schema";
import { getMimeTypeFromExtension } from "@pipl-analytics/core/commons/file";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import * as z from "zod/v4";

const sfn = new SFNClient({
	region: process.env.AWS_REGION,
});

const s3 = new S3Client({
	region: process.env.AWS_REGION,
});

const BUCKET_NAME = process.env.S3_BUCKET;

const analyticsEndpointInputSchema = documentSchema
	.omit({ filledGrid: true, transcript: true })
	.extend({
		accessToken: z.string(),
		grid: z.object({
			type: z.enum(["pdf", "docx"]),
			data: z.string(),
		}),
		audio: z.object({
			type: z.enum(["mp3"]),
			data: z.string(),
		}),
	});

export type Payload = z.infer<typeof analyticsEndpointInputSchema>;

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
	if (!event.body) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: "missing_body" }),
		};
	}

	const { success, data } = analyticsEndpointInputSchema.safeParse(
		JSON.parse(event.body),
	);

	if (!success) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				error: "invalid_input",
			}),
		};
	}

	const { accessToken, audio, grid, ...rest } = data;
	const authToken = process.env.LAMBDA_ACCESS_TOKEN;
	if (accessToken !== authToken) {
		return { statusCode: 401, body: JSON.stringify({ error: "unauthorized" }) };
	}

	const taskId = randomUUID().toString();
	const audioObjectKey = `tmp/${taskId}/audio.${audio.type}`;
	const gridObjectKey = `tmp/${taskId}/grid.${grid.type}`;

	await Promise.all([
		s3.send(
			new PutObjectCommand({
				Bucket: BUCKET_NAME,
				Key: audioObjectKey,
				Body: Buffer.from(audio.data, "base64"),
				ContentType: getMimeTypeFromExtension(`.${audio.type}`),
			}),
		),
		s3.send(
			new PutObjectCommand({
				Bucket: BUCKET_NAME,
				Key: gridObjectKey,
				Body: Buffer.from(grid.data, "base64"),
				ContentType: getMimeTypeFromExtension(`.${grid.type}`),
			}),
		),
	]);

	const { executionArn } = await sfn.send(
		new StartExecutionCommand({
			stateMachineArn: process.env.STATE_MACHINE_ARN,
			input: JSON.stringify({
				...rest,
				audioObjectKey,
				gridObjectKey,
			}),
		}),
	);

	return {
		statusCode: 200,
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			ok: true,
			executionArn,
		}),
	};
};
