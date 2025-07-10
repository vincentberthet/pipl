import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getMimeTypeFromFileName } from "@pipl-analytics/core/commons/file";
import { documentSchema } from "@pipl-analytics/core/grid/document.schema";
import { printGridDocx } from "@pipl-analytics/core/grid/utils";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const handler = async ({ body }: { body: string }) => {
	const { success, data, error } = documentSchema.safeParse(JSON.parse(body));
	if (!success) {
		throw new Error(`Invalid input data, error: ${JSON.stringify(error)}`);
	}

	await fs.mkdir("/tmp", { recursive: true });

	const filename = `grid-${data.jobName.toLocaleLowerCase().replace(/\s+/g, "-")}.docx`; // TODO: condidatName
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
		subject: `Grille d'entretien structurée pour l'entretient au poste ${data.jobName}`,
		body: `Voici ci-joint la grill d'entretient structurée générée pour l'entretient au poste de ${data.jobName}.\nCette grille étant générée automatiquement, elle est à considérer comme un préliminaire à l'entretien. N'hésitez pas à la modifier pour l'adapter à vos besoins.`,
		attachments: [outputKey],
	};
};
