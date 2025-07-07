import { OpenAI } from "openai";

export const geminiClient = new OpenAI({
	apiKey: "GEMINI_API_KEY",
	baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
