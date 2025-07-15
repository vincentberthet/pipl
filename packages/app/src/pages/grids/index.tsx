import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import * as z from "zod/v4";
import { postJson } from "../../commons/http.js";
import { uploadFiles } from "../../commons/s3.js";
import { Form } from "../../components/Form.js";
import { FinalizeStep } from "./form/FinalizeStep.js";
import { gridFormSchema } from "./form/gridsFormSchema.js";
import { ImportStep } from "./form/ImportStep.js";
import { PromptingStep } from "./form/PromptingStep.js";

export function GridsPage() {
	const navigate = useNavigate();

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
		return postJson(`${import.meta.env.VITE_API_ENDPOINT}/grids`, {
			...rest,
			pathToFiles,
		});
	}, []);

	const handleSuccess = useCallback(
		({ executionArn }: { executionArn: string }) => {
			navigate(`/grids/${executionArn}`);
		},
		[navigate],
	);

	return (
		<Form
			onSubmit={handleSubmit}
			onSuccess={handleSuccess}
			steps={steps}
			pageTitle="Générer une grille d'entretien"
			submitLabel="Générer la grille"
		/>
	);
}
