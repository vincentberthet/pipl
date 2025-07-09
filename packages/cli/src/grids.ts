import { parseArgs } from "node:util";
import { generateGridAgent } from "@pipl-analytics/core/grid";

const DEFAULT_JOB_NAME = "Chef de chantier Ferroviaire";

export async function runGrids(args: string[]) {
	const { positionals: files, values } = parseArgs({
		args,
		options: {
			jobName: {
				type: "string",
				short: "j",
				default: DEFAULT_JOB_NAME,
				alias: "job",
				description:
					"Le nom du poste pour lequel générer la grille d'entretien",
			},
		},
		allowPositionals: true,
	});

	if (values.jobName === DEFAULT_JOB_NAME) {
		console.log(
			`Using default job name: "${DEFAULT_JOB_NAME}". You can change it with the --jobName or -j option.`,
		);
	}

	if (files.length === 0) {
		console.log("Usage: pipl-analytics grids <files>");
		console.log("Arguments:");
		console.log("  <files>  One or more files to generate the grids with");
		process.exit(0);
	}

	await generateGridAgent(files, values.jobName);

	process.exit(0);
}
