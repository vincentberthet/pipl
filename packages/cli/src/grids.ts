import { parseArgs } from "node:util";

export function runGrids(args: string[]) {
	const { positionals } = parseArgs({
		args,
		options: {},
		allowPositionals: true,
	});

	if (positionals.length === 0) {
		console.log("Usage: pipl-analytics grids <files>");
		console.log("Arguments:");
		console.log("  <files>  One or more files to generate the grids with");
		process.exit(0);
	}

	console.log({ positionals });
}
