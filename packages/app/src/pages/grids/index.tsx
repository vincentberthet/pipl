import { useCallback, useMemo } from "react";
import * as z from "zod/v4";
import { fireAndForget } from "../../commons/http.js";
import { uploadFiles } from "../../commons/s3.js";
import { Form } from "../../components/Form.js";
import { FinalizeStep } from "./form/FinalizeStep.js";
import { gridFormSchema } from "./form/gridsFormSchema.js";
import { ImportStep } from "./form/ImportStep.js";
import { PromptingStep } from "./form/PromptingStep.js";

export function GridsPage() {
	const steps = useMemo(
		() => [
			<ImportStep key="import" />,
			<PromptingStep key="prompting" />,
			<FinalizeStep key="finalize" />,
		],
		[],
	);

	const handleSubmit = useCallback(async (formData: FormData) => {
		const { success, data, error } = gridFormSchema.safeParse({
			...Object.fromEntries([...formData.entries()]),
			files: formData.getAll("files"),
		});

		if (!success) {
			console.error(
				"Form validation failed:",
				JSON.stringify(z.treeifyError(error)),
			);
			throw new Error("form_validation_error");
		}

		const { files, ...rest } = data;
		const pathToFiles = await uploadFiles(files);
		return fireAndForget(`${import.meta.env.VITE_API_ENDPOINT}/grids`, {
			...rest,
			pathToFiles,
		});
	}, []);

	return (
		<Form
			onSubmit={handleSubmit}
			steps={steps}
			pageTitle="Générer une grille d'entretien"
			submitLabel="Générer la grille"
		/>
	);
}
