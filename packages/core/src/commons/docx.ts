import { createPartFromBase64, createUserContent } from "@google/genai";
import { extractRawText } from "mammoth";

export async function mapDocxToUserContent(
	buffer: Buffer<ArrayBuffer>,
	prompt: string,
) {
	console.log("buffer", {
		buffer,
	});
	const txt = await extractRawText({
		// We need to provide both as mammoth considers Lambda as a browser
		buffer: buffer,
		arrayBuffer: buffer,
	});

	return createUserContent([
		createPartFromBase64(
			Buffer.from(txt.value).toString("base64"),
			"text/plain",
		),
		prompt,
	]);
}
