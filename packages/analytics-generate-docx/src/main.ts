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
		subject: `Compte-rendu de l'entretien de ${data.candidateName}`,
		body: `Voici le compte-rendu de l'entretien de ${data.candidateName} pour le poste de ${data.jobName}.\nCe compte-rendu d'entretien est un draft et non un document définitif. N'hésitez pas à éditer ce document et vérifier la validation des critères d'évaluation en fonction des réponses du candidat.`,
		attachments: [outputKey],
	};
};
