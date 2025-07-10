import * as fs from "node:fs/promises";
import { createPartFromBase64, createUserContent } from "@google/genai";
import { z } from "zod/v4";
import { gemini } from "../commons/gemini.js";
import {
	type GroupedData,
	gridSchema,
	printGridDocx,
	prompt,
} from "./utils.js";

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
	const response = await gemini.models.generateContentStream({
		model: "gemini-2.5-flash",
		contents,
		config: {
			responseMimeType: "application/json",
			responseJsonSchema: z.toJSONSchema(gridSchema),
		},
	});

	console.debug("Grid generated, parsing response...");

	const chunks = [];
	for await (const chunk of response) {
		chunks.push(chunk.text ?? "");
	}

	const { data, error } = gridSchema.safeParse(
		JSON.parse(chunks.join("") || "null"),
	);

	if (!data) {
		console.error("Failed to parse model reponse", error);
		throw new Error("parse_message_error");
	}

	const categrories = data
		.map((item) => item.category || "Sans catégorie")
		.filter((category, index, self) => self.indexOf(category) === index);

	const groupedData: GroupedData = categrories.map((category) => ({
		category,
		questions: data.filter((item) => item.category === category),
	}));

	await printGridDocx("out/grid-result.docx", groupedData, jobName);
};
