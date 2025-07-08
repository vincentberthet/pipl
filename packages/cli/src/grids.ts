import { parseArgs } from "node:util";
import { generateGridAgent } from "@pipl-analytics/core/grid";

export async function runGrids(args: string[]) {
	const { positionals: files, values } = parseArgs({
		args,
		options: {
			jobName: {
				type: "string",
				short: "j",
				default: "Chef de chantier Ferroviaire",
				alias: "job",
				description:
					"Le nom du poste pour lequel générer la grille d'entretien",
			},
		},
		allowPositionals: true,
	});

	if (files.length === 0) {
		console.log("Usage: pipl-analytics grids <files>");
		console.log("Arguments:");
		console.log("  <files>  One or more files to generate the grids with");
		process.exit(0);
	}

	const grid = await generateGridAgent(files, values.jobName);

	if (!grid) {
		console.error("Failed to generate grid.");
		process.exit(1);
	}

	console.log(grid);

	process.exit(0);
}
