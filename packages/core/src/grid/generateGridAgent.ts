import * as fs from "node:fs/promises";
import { createPartFromBase64, createUserContent } from "@google/genai";
import { generateGrid, parseResponse } from "./agent.js";
import { printGridDocx } from "./prindGridDocx.js";
import { prompt } from "./utils.js";

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

	const nbQuestions = {
		"nb-questions-poste": 3,
		"nb-competences-tech": 3,
		"tech-nb-questions-experience": 2,
		"tech-nb-questions-situation": 1,
		"nb-competences-comportementales": 3,
		"comportementale-nb-questions-experience": 2,
		"comportementale-nb-questions-situation": 1,
	};

	const contents = createUserContent([
		...encodedFiles,
		prompt({ nbDocuments: readedFiles.length, jobName, ...nbQuestions }),
	]);

	console.debug("Generating grid...");

	const response = await generateGrid(contents);

	console.debug("Grid generated, parsing response...");

	const grid = await parseResponse(response);

	await printGridDocx("out/grid-result.docx", grid, jobName);
};
