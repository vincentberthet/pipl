import { DescribeExecutionCommand, SFNClient } from "@aws-sdk/client-sfn";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import * as z from "zod/v4";

const sfn = new SFNClient({
	region: process.env.AWS_REGION,
});

const statusEndpointInputSchema = z.object({
	accessToken: z.string(),
	executionArn: z.string(),
});

export type Payload = z.infer<typeof statusEndpointInputSchema>;

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
	if (!event.body) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: "missing_body" }),
		};
	}

	const { success, data } = statusEndpointInputSchema.safeParse(
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

	const { accessToken, executionArn } = data;
	const authToken = process.env.LAMBDA_ACCESS_TOKEN;
	if (accessToken !== authToken) {
		return { statusCode: 401, body: JSON.stringify({ error: "unauthorized" }) };
	}

	const execution = await sfn.send(
		new DescribeExecutionCommand({
			executionArn,
		}),
	);

	return {
		statusCode: 200,
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			ok: true,
			status: execution.status,
		}),
	};
};
