import { randomUUID } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getMimeTypeFromExtension } from "@pipl-analytics/core/commons/file";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import * as z from "zod/v4";

const s3 = new S3Client({
	region: process.env.AWS_REGION,
});

const BUCKET_NAME = process.env.S3_BUCKET;

const presignedUrlSchema = z.object({
	accessToken: z.string(),
	fileTypes: z.array(z.enum(["pdf", "docx", "mp3"])),
});

export type Payload = z.infer<typeof presignedUrlSchema>;

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
	if (!event.body) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: "missing_body" }),
		};
	}

	const { success, data } = presignedUrlSchema.safeParse(
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

	const authToken = process.env.LAMBDA_ACCESS_TOKEN;
	if (data.accessToken !== authToken) {
		return { statusCode: 401, body: JSON.stringify({ error: "unauthorized" }) };
	}

	const taskId = randomUUID().toString();
	const objectKeys = data.fileTypes.map((fileType) => ({
		objectKey: `tmp/${taskId}/${randomUUID().toString()}.${fileType}`,
		fileType,
	}));

	try {
		const presignedUrls = await Promise.all(
			objectKeys.map(async ({ objectKey, fileType }) => {
				const presignedUrl = await getSignedUrl(
					s3,
					new PutObjectCommand({
						Bucket: BUCKET_NAME,
						Key: objectKey,
						ContentType: getMimeTypeFromExtension(`.${fileType}`),
					}),
					{
						expiresIn: 600, // 10 minutes
					},
				);

				return {
					objectKey,
					presignedUrl,
				};
			}),
		);

		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				ok: true,
				presignedUrls,
			}),
		};
	} catch (error) {
		console.error("Error generating presigned URLs:", error);
		return {
			statusCode: 500,
			body: JSON.stringify({
				error: "internal_server_error",
			}),
		};
	}
};
