import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import { documentSchema } from "@pipl-analytics/core/analytics/document.schema";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import * as z from "zod/v4";

const sfn = new SFNClient({
	region: process.env.AWS_REGION,
});

const analyticsEndpointInputSchema = documentSchema
	.omit({ filledGrid: true, transcript: true })
	.extend({
		accessToken: z.string(),
		gridObjectKey: z.string(),
		transcriptObjectKey: z.string(),
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

	const { accessToken, ...rest } = data;
	const authToken = process.env.LAMBDA_ACCESS_TOKEN;
	if (accessToken !== authToken) {
		return { statusCode: 401, body: JSON.stringify({ error: "unauthorized" }) };
	}

	const { executionArn } = await sfn.send(
		new StartExecutionCommand({
			stateMachineArn: process.env.STATE_MACHINE_ARM,
			input: JSON.stringify(rest),
		}),
	);

	return {
		statusCode: 200,
		body: JSON.stringify({
			ok: true,
			executionArn,
		}),
	};
};
