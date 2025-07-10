import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
	type Attachment,
	SESv2Client,
	SendEmailCommand,
} from "@aws-sdk/client-sesv2";

const ses = new SESv2Client({ region: process.env.AWS_REGION });
const s3 = new S3Client({ region: process.env.AWS_REGION });

type MailEvent = {
	recipient: string;
	subject: string;
	body: string;
	attachments?: string[];
};

export const handler = async (event: MailEvent) => {
	const attachments = await Promise.all(
		(event.attachments || []).map(
			async (attachment): Promise<Attachment | null> => {
				const filename = attachment.split("/").pop();
				/** @todo(jonathan): support more file types */
				if (!filename || !filename.endsWith(".docx")) {
					return null;
				}

				const { Body } = await s3.send(
					new GetObjectCommand({
						Bucket: process.env.S3_BUCKET,
						Key: attachment,
					}),
				);

				if (!Body) {
					return null;
				}

				const rawContent = Buffer.from(await Body.transformToByteArray());
				console.log({
					filename,
					rawContentLength: rawContent.length,
				});

				return {
					FileName: filename,
					ContentDisposition: "ATTACHMENT",
					ContentTransferEncoding: "BASE64",
					RawContent: rawContent,
					ContentType:
						"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
				};
			},
		),
	);

	const command = new SendEmailCommand({
		Destination: { ToAddresses: [event.recipient] },
		Content: {
			Simple: {
				Subject: {
					Data: event.subject,
				},
				Body: {
					Text: {
						Data: event.body,
					},
				},
				Attachments: attachments.filter(
					(attachment): attachment is Attachment => attachment !== null,
				),
			},
		},
		FromEmailAddress: process.env.SOURCE_ADDRESS,
	});

	try {
		await ses.send(command);
		return {
			statusCode: 200,
			body: JSON.stringify({
				ok: true,
			}),
		};
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({
				error: "Failed to send email",
				details: error instanceof Error ? error.message : "Unknown error",
			}),
		};
	}
};
