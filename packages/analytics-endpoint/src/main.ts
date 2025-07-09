import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import {
	type Document,
	documentSchema,
} from "@pipl-analytics/core/analytics/document.schema";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

const sfn = new SFNClient({
	region: import.meta.env.VITE_AWS_REGION,
});

export type Payload = {
	accessToken: string;
} & Document;

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
	if (!event.body) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: "missing_body" }),
		};
	}

	const parsedBody = JSON.parse(event.body) as Payload;
	const authToken = process.env.LAMBDA_ACCESS_TOKEN;
	if (!parsedBody.accessToken || parsedBody.accessToken !== authToken) {
		return { statusCode: 401, body: JSON.stringify({ error: "unauthorized" }) };
	}

	const { success, data } = documentSchema.safeParse(parsedBody);
	if (!success) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				error: "invalid_input",
			}),
		};
	}

	const { executionArn } = await sfn.send(
		new StartExecutionCommand({
			stateMachineArn: import.meta.env.VITE_STATE_MACHINE_ARM,
			input: JSON.stringify(data),
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
