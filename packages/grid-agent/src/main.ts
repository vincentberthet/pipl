// import { randomUUID } from "node:crypto";
import * as fs from "node:fs/promises";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPartFromBase64, createUserContent } from "@google/genai";
import { generateGrid, parseResponse } from "@pipl-analytics/core/grid/agent";
import { agentPropsSchema } from "@pipl-analytics/core/grid/document.schema";
import { prompt } from "@pipl-analytics/core/grid/utils";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const handler = async ({ body }: { body: string }) => {
	const { success, data, error } = agentPropsSchema.safeParse(body);
	if (!success) {
		throw new Error(`Invalid input: ${JSON.stringify(error)}`);
	}

	const { pathToFiles, jobName, email } = data;

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
			return Body.transformToString("base64");
		}),
	);

	// TODO: remove those logs
	console.log("readedFiles");
	console.log(readedFiles);

	const encodedFiles = readedFiles.map((file) =>
		createPartFromBase64(file, "application/pdf"),
	);

	// TODO: remove those logs
	console.log("encodedFiles");
	console.log(encodedFiles);

	const contents = createUserContent([
		...encodedFiles,
		prompt({ nbDocuments: readedFiles.length, jobName }),
	]);

	const response = await generateGrid(contents);
	const grid = await parseResponse(response);

	return {
		statusCode: 200,
		body: JSON.stringify({
			email,
			jobName,
			grid,
		}),
	};
};
