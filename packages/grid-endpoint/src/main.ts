import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import { gridEndpointSchema } from "@pipl-analytics/core/grid/document.schema";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

const sfn = new SFNClient({
	region: process.env.AWS_REGION,
});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
	if (!event.body) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: "missing_body" }),
		};
	}

	const { success, data } = gridEndpointSchema.safeParse(
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
