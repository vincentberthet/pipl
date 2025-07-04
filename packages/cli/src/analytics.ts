import { parseArgs } from "node:util";

export function runAnalytics(args: string[]) {
	const { positionals } = parseArgs({
		args,
		options: {},
		allowPositionals: true,
	});

	if (positionals.length < 2) {
		console.log("Usage: pipl-analytics analytics <files>");
		console.log("Arguments:");
		console.log(
			"  <files>  Two or more files including the audio to generate the analytics report with",
		);
		process.exit(0);
	}

	console.log({ positionals });
}
