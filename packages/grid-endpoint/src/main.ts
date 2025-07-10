import { SFNClient, StartExecutionCommand } from "@aws-sdk/client-sfn";
import { gridEndpointSchema } from "@pipl-analytics/core/grid/document.schema";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

class StatusError extends Error {
	status: number;
	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}

const sfn = new SFNClient({
	region: process.env.AWS_REGION,
});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
	if (!event.body) {
		throw new StatusError("Missing body in the request", 400);
	}

	const { success, data, error } = gridEndpointSchema.safeParse(
		JSON.parse(event.body),
	);

	if (!success) {
		throw new StatusError(
			`Invalid input data, error: ${JSON.stringify(error)}`,
			400,
		);
	}

	const { accessToken, ...rest } = data;
	const authToken = process.env.LAMBDA_ACCESS_TOKEN;
	if (accessToken !== authToken) {
		throw new StatusError("Unauthorized", 401);
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
