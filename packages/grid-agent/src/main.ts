import * as fs from "node:fs/promises";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPartFromBase64, createUserContent } from "@google/genai";
import { getMimeTypeFromFileName } from "@pipl-analytics/core/commons/file";
import { generateGrid, parseResponse } from "@pipl-analytics/core/grid/agent";
import {
	type AgentProps,
	agentPropsSchema,
	type GenerateGridProps,
} from "@pipl-analytics/core/grid/document.schema";
import { prompt } from "@pipl-analytics/core/grid/utils";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const handler = async (
	event: AgentProps,
): Promise<GenerateGridProps> => {
	const { success, data, error } = agentPropsSchema.safeParse(event);
	if (!success) {
		throw new Error(`Invalid input: ${JSON.stringify(error)}`);
	}

	const { pathToFiles, jobName, email, ...nbQuestions } = data;

	const readedFiles = await Promise.all(
		pathToFiles.map(async (pathToFile) => {
			const [{ Body }] = await Promise.all([
				s3.send(
					new GetObjectCommand({
						Bucket: process.env.S3_BUCKET,
						Key: pathToFile,
					}),
				),
				fs.mkdir("/tmp", { recursive: true }),
			]);

			if (!Body) throw new Error(`File not found: ${pathToFile}`);
			return {
				body: await Body.transformToString("base64"),
				mimeType: getMimeTypeFromFileName(pathToFile),
			};
		}),
	);

	const encodedFiles = readedFiles.map((file) =>
		createPartFromBase64(file.body, file.mimeType),
	);

	const contents = createUserContent([
		...encodedFiles,
		prompt({ nbDocuments: readedFiles.length, jobName, ...nbQuestions }),
	]);

	const response = await generateGrid(contents);
	const grid = await parseResponse(response);

	return {
		email,
		jobName,
		grid,
	};
};
