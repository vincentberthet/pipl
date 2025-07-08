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

	const grid = await generateGridAgent(files, "Chef de chantier Ferroviaire");

	if (!grid) {
		console.error("Failed to generate grid.");
		process.exit(1);
	}

	console.log(grid);

	process.exit(0);
}
