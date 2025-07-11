import * as fs from "node:fs/promises";
import { createPartFromBase64, createUserContent } from "@google/genai";
import { generateGrid, parseResponse } from "./agent.js";
import { printGridDocx, prompt } from "./utils.js";

export const generateGridAgent = async (
	pathToFiles: string[],
	jobName: string,
) => {
	const readedFiles = await Promise.all(
		pathToFiles.map(async (pathToFile) => await fs.readFile(pathToFile)),
	);
	const encodedFiles = readedFiles.map((file) =>
		createPartFromBase64(file.toString("base64"), "application/pdf"),
	);

	const contents = createUserContent([
		...encodedFiles,
		prompt({ nbDocuments: readedFiles.length, jobName }),
	]);

	console.debug("Generating grid...");

	const response = await generateGrid(contents);

	console.debug("Grid generated, parsing response...");

	const grid = await parseResponse(response);

	await printGridDocx("out/grid-result.docx", grid, jobName);
};
