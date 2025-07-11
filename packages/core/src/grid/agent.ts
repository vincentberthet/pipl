import type { Content } from "@google/genai";
import { z } from "zod/v4";
import { gemini } from "../commons/gemini.js";
import { type GroupedData, gridSchema } from "./utils.js";

export const generateGrid = async (contents: Content) =>
	await gemini.models.generateContentStream({
		model: "gemini-2.5-flash",
		contents,
		config: {
			responseMimeType: "application/json",
			responseJsonSchema: z.toJSONSchema(gridSchema),
		},
	});

export const parseResponse = async (
	response: AsyncIterable<{ text?: string }>,
) => {
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

	return groupedData;
};
