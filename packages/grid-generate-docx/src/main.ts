import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getMimeTypeFromFileName } from "@pipl-analytics/core/commons/file";
import {
	type GenerateGridProps,
	generateGridPropsSchema,
} from "@pipl-analytics/core/grid/document.schema";
import { printGridDocx } from "@pipl-analytics/core/grid/prindGridDocx";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const handler = async (event: GenerateGridProps) => {
	const { success, data, error } = generateGridPropsSchema.safeParse(event);
	if (!success) {
		throw new Error(`Invalid input data, error: ${JSON.stringify(error)}`);
	}

	await fs.mkdir("/tmp", { recursive: true });

	const filename = `grid-${data.jobName.toLocaleLowerCase().replace(/\s+/g, "-")}.docx`;
	const tmpFilePath = `/tmp/${filename}`;
	console.log(`Writing DOCX output to ${tmpFilePath}`);
	await printGridDocx(tmpFilePath, data.grid, data.jobName);

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
		subject: `Grille d'entretien structuré pour le poste ${data.jobName}`,
		body: `Voici ci-joint la grille d'entretien générée pour le poste de ${data.jobName}.\nCette grille d’entretien est un draft et non un document définitif. N'hésitez pas à éditer ce document (par exemple, modifier des questions ou des critères) pour l'adapter à vos besoins.`,
		attachments: [outputKey],
	};
};
