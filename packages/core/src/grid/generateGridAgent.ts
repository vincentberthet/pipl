import type { ChatCompletionContentPart } from "openai/resources";

import { geminiClient } from "../commons/client.js";
import { readFile, prompt as text } from "./utils.js";

export const generateGridAgent = async (pathToFiles: string[]) => {
	const instructions: ChatCompletionContentPart = { type: "text", text };
	const readedFils = pathToFiles.map((pathToFile) => readFile(pathToFile));
	const content: ChatCompletionContentPart[] = [instructions, ...readedFils];

	console.log("Content to send:", content);

	const response = await geminiClient.chat.completions.create({
		model: "gemini-2.0-flash",
		messages: [
			{
				role: "user",
				content,
			},
		],
	});

	// console.log("Response from Gemini:", response);
};
