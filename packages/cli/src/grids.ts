import { parseArgs } from "node:util";
import { generateGridAgent } from "@pipl-analytics/core/grid";

export async function runGrids(args: string[]) {
	const { positionals: files } = parseArgs({
		args,
		options: {},
		allowPositionals: true,
	});

	if (files.length === 0) {
		console.log("Usage: pipl-analytics grids <files>");
		console.log("Arguments:");
		console.log("  <files>  One or more files to generate the grids with");
		process.exit(0);
	}

	console.log("Generating grids with the following files:");
	for (const file of files) {
		console.log(`  - ${file}`);
	}

	await generateGridAgent(files);

	process.exit(0);
}
