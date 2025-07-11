import { exec } from "node:child_process";
import { randomUUID } from "node:crypto";
import * as fs from "node:fs/promises";
import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { documentSchema } from "@pipl-analytics/core/analytics/document.schema";
import * as z from "zod/v4";

const s3 = new S3Client({ region: process.env.AWS_REGION });

const audioDecorderInputSchema = documentSchema
	.omit({ filledGrid: true, transcript: true })
	.extend({
		audioObjectKey: z.string().min(1).max(1000),
		gridObjectKey: z.string().min(1).max(1000),
	});

export type Input = z.infer<typeof audioDecorderInputSchema>;

export const handler = async (event: Input) => {
	const { success, data, error } = audioDecorderInputSchema.safeParse(event);
	if (!success) {
		throw new Error(`Invalid input: ${JSON.stringify(error)}`);
	}

	if (data.audioObjectKey.endsWith(".mp3")) {
		return data;
	}

	const { audioObjectKey: videoObjectKey, ...rest } = data;
	const videoExtension = videoObjectKey.split(".").pop();
	if (!videoExtension || !["mp4"].includes(videoExtension)) {
		throw new Error(`Unsupported video format: ${videoExtension}`);
	}

	const [{ Body }] = await Promise.all([
		s3.send(
			new GetObjectCommand({
				Bucket: process.env.S3_BUCKET,
				Key: videoObjectKey,
			}),
		),
		fs.mkdir("/tmp", { recursive: true }),
	]);
	if (!Body) {
		throw new Error(`Video file not found: ${videoObjectKey}`);
	}

	const fileId = randomUUID().toString();

	const videoFilePath = `/tmp/${fileId}.${videoExtension}`;
	const audioFilePath = `/tmp/${fileId}.mp3`;
	await fs.writeFile(videoFilePath, Body.transformToWebStream());

	await new Promise((resolve, reject) => {
		const childProcess = exec(
			`ffmpeg -i ${videoFilePath} -q:a 0 -vn ${audioFilePath}`,
			{
				env: {
					PATH: `${process.env.PATH}:${process.cwd()}/bin`,
				},
			},
		);

		childProcess.on("exit", (code) => {
			if (code === 0) {
				resolve(null);
			} else {
				reject(new Error(`FFmpeg exited with code ${code}`));
			}
		});
		childProcess.on("error", (err) => {
			reject(new Error(`FFmpeg execution failed: ${err.message}`));
		});
	});

	const audioObjectKey = videoObjectKey.replaceAll(
		`.${videoExtension}`,
		".mp3",
	);

	await s3.send(
		new PutObjectCommand({
			Bucket: process.env.S3_BUCKET,
			Key: audioObjectKey,
			Body: await fs.readFile(audioFilePath),
			ContentType: "audio/mpeg",
		}),
	);
	try {
		return {
			...rest,
			audioObjectKey,
		};
	} finally {
		await Promise.all([fs.unlink(videoFilePath), fs.unlink(audioFilePath)]);
	}
};
