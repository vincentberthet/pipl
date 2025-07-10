import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { writeDocxOutput } from "@pipl-analytics/core/analytics/document";
import {
	type Document,
	documentSchema,
} from "@pipl-analytics/core/analytics/document.schema";
import { getMimeTypeFromFileName } from "@pipl-analytics/core/commons/file";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const handler = async (event: Document) => {
	const { success, data, error } = documentSchema.safeParse(event);
	if (!success) {
		throw new Error(`Invalid input: ${JSON.stringify(error)}`);
	}

	await fs.mkdir("/tmp", { recursive: true });

	const filename = `entretien-${data.candidateName.toLocaleLowerCase().replace(/\s+/g, "-")}.docx`;
	const tmpFilePath = `/tmp/${filename}`;
	console.log(`Writing DOCX output to ${tmpFilePath}`);
	await writeDocxOutput(
		tmpFilePath,
		data.candidateName,
		data.transcript,
		data.filledGrid,
	);

	const outputKey = `tmp/${randomUUID().toString()}/${filename}`;
	console.log(`Uploading DOCX output to S3: ${outputKey}`);
	const readStream = await fs.readFile(tmpFilePath);
	await s3.send(
		new PutObjectCommand({
			Bucket: process.env.S3_BUCKET,
			Key: outputKey,
			Body: readStream,
			ContentType: getMimeTypeFromFileName(filename),
		}),
	);

	return {
		recipient: data.email,
		subject: `Analyse d'entretien pour le poste de ${data.jobName}: ${data.candidateName}`,
		body: `Voici le compte rendu de l'entretien pour le poste de ${data.jobName}.`,
		attachments: [outputKey],
	};
};
