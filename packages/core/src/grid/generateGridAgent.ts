import * as fs from "node:fs/promises";
import { createPartFromBase64, createUserContent } from "@google/genai";
import { gemini } from "../commons/gemini.js";
import { prompt } from "./utils.js";

export const generateGridAgent = async (pathToFiles: string[]) => {
	const readedFiles = await Promise.all(
		pathToFiles.map(async (pathToFile) => await fs.readFile(pathToFile)),
	);
	const encodedFiles = readedFiles.map((file) =>
		createPartFromBase64(file.toString("base64"), "application/pdf"),
	);

	const contents = createUserContent([
		...encodedFiles,
		prompt({
			nbDocuments: readedFiles.length,
			jobName: "Chef de chantier Ferroviaire",
		}),
	]);

	const response = await gemini.models.generateContent({
		model: "gemini-2.0-flash",
		contents,
	});

	return response.text;
};
