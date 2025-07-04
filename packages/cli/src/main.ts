import { runAnalytics } from "./analytics.js";
import { runGrids } from "./grids.js";

const argv = process.argv.slice(2);

function printHelp() {
	console.log("Usage: pipl-analytics <command> [options]");
	console.log("Commands:");
	console.log("  analytics <files>  	Generate an analytics report");
	console.log("  grids <files>      	Generate a new grid");
	console.log("Options:");
	console.log("  --help, -h           Show this help message");
	process.exit(0);
}

export async function main() {
	if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
		printHelp();
	}

	if (argv[0] === "analytics") {
		runAnalytics(argv.slice(1));
		return;
	}

	if (argv[0] === "grids") {
		runGrids(argv.slice(1));
		return;
	}

	console.log(`Error: unknown command: ${argv[0]}`);
	printHelp();
}
