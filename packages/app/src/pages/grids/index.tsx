import { useCallback, useMemo } from "react";
import * as z from "zod/v4";
import { toBase64 } from "../../commons/file.js";
import { fireAndForget } from "../../commons/http.js";

import { Form } from "../../components/Form.js";
import { FinalizeStep } from "./form/FinalizeStep.js";
import { gridFormSchema } from "./form/gridsFormSchema.js";
import { ImportStep } from "./form/ImportStep.js";

export function GridsPage() {
	const steps = useMemo(
		() => [<ImportStep key="import" />, <FinalizeStep key="finalize" />],
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

		const encodedFiles = await Promise.all(
			files.map(async (file) => ({
				type: file.name.split(".").pop(),
				data: await toBase64(file),
			})),
		);

		return fireAndForget(`${import.meta.env.VITE_API_ENDPOINT}/grids`, {
			...rest,
			files: encodedFiles,
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
