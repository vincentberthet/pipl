import { parseArgs } from "node:util";

import { runAnalyticsAgent } from "@pipl-analytics/core/analytics";

export async function runAnalytics(args: string[]) {
	const { values } = parseArgs({
		args,
		options: {
			audio: {
				type: "string",
				description: "Path to the audio file to analyze",
			},
			grid: {
				type: "string",
				description: "Path to the grid file to use for the analysis",
			},
		},
		allowPositionals: true,
	});

	if (!values.audio || !values.grid) {
		console.log(
			"Usage: pipl-analytics analytics --audio <audio_file> --grid <grid_file>",
		);
		console.log("Arguments:");
		console.log("  --audio <audio_file>  Path to the audio file to analyze");
		console.log(
			"  --grid <grid_file>    Path to the grid file to use for the analysis",
		);
		process.exit(0);
	}

	await runAnalyticsAgent(values.audio, values.grid);
}
