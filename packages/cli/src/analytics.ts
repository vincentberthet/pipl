import * as fs from "node:fs/promises";
import { parseArgs } from "node:util";

import {
	runAnalyticsAgent,
	writeDocxOutput,
	writeMarkdownOutput,
} from "@pipl-analytics/core/analytics";

export async function runAnalytics(args: string[]) {
	const { values, positionals } = parseArgs({
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
			emulate: {
				type: "boolean",
				default: false,
				description:
					"Emulate the agent without actually running the analysis. Useful for testing.",
			},
		},
		allowPositionals: true,
	});

	const candidateName = positionals.join(" ").trim();

	if (!values.audio || !values.grid || !candidateName) {
		console.log(
			"Usage: pipl-analytics analytics --audio <audio_file> --grid <grid_file> <candidate_name>",
		);
		console.log("Arguments:");
		console.log("  --audio <audio_file>  Path to the audio file to analyze");
		console.log(
			"  --grid <grid_file>    Path to the grid file to use for the analysis",
		);
		console.log(
			"  --emulate		Emulate the agent without running the analysis (default: false)",
		);
		process.exit(0);
	}

	const outputBaseName = candidateName.replace(/\s+/g, "_").toLocaleLowerCase();
	const jsonOutFile = `out/${outputBaseName}.json`;

	const { transcript, filledGrid, questions } = values.emulate
		? await fs
				.readFile(jsonOutFile)
				.then(
					(content) =>
						JSON.parse(content.toString()) as ReturnType<
							typeof runAnalyticsAgent
						>,
				)
		: await runAnalyticsAgent(values.audio, values.grid);

	await Promise.all([
		fs.writeFile(
			jsonOutFile,
			JSON.stringify({ questions, transcript, filledGrid }, null, 2),
		),
		writeMarkdownOutput(`out/${outputBaseName}.md`, transcript, filledGrid),
		writeDocxOutput(
			`out/${outputBaseName}.docx`,
			candidateName,
			transcript,
			filledGrid,
		),
	]);

	process.exit(0);
}
