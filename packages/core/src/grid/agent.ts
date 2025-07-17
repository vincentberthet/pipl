import type { Content } from "@google/genai";
import { z } from "zod/v4";
import { gemini } from "../commons/gemini.js";
import {
	type GridSchema,
	type GroupedBySkill,
	type GroupedData,
	gridSchema,
	type QuestionSchema,
} from "./utils.js";

export const generateGrid = async (contents: Content) => {
	return gemini.models.generateContentStream({
		model: "gemini-2.5-flash",
		contents,
		config: {
			responseMimeType: "application/json",
			responseJsonSchema: z.toJSONSchema(gridSchema),
		},
	});
};

export const parseResponse = async (
	response: AsyncIterable<{ text?: string }>,
): Promise<GroupedBySkill> => {
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

	const groupedData = groupByCategory(data);
	const groupedQuestionsByCompetence = groupQuestionsByCompetence(groupedData);

	return groupedQuestionsByCompetence;
};

const groupByCategory = (grid: GridSchema): GroupedData => {
	const categrories = grid
		.map((item) => item.category || "Sans catégorie")
		.filter((category, index, self) => self.indexOf(category) === index);

	const groupedData = categrories.map((category) => ({
		category,
		questions: grid.filter((item) => item.category === category),
	}));

	return groupedData;
};

const groupQuestionsByCompetence = (
	groupedData: GroupedData,
): GroupedBySkill => {
	const groupedBySkill: GroupedBySkill = groupedData.map((categoryGroup) => {
		const questionsGroups = categoryGroup.questions.reduce(
			(acc, question) => {
				const competence = question.competence || "Sans compétence";
				if (!acc[competence]) {
					acc[competence] = [];
				}
				acc[competence].push(question);
				return acc;
			},
			{} as Record<string, QuestionSchema[]>,
		);

		return {
			category: categoryGroup.category,
			questionsGroups: Object.entries(questionsGroups).map(
				([competence, questions]) => ({
					competence,
					questions,
				}),
			),
		};
	});

	return groupedBySkill;
};
