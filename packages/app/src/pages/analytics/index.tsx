import { useCallback, useMemo } from "react";
import * as z from "zod/v4";
import { fireAndForget } from "../../commons/http.js";
import { uploadFiles } from "../../commons/s3.js";
import { Form } from "../../components/Form.js";
import { analyticsFormSchema } from "./form/analyticsFormSchema.js";
import { ImportFilesStep } from "./form/ImportFilesStep.js";
import { InformationStep } from "./form/InformationStep.js";

export function AnalyticsForm() {
	const handleSubmit = useCallback(async (formData: FormData) => {
		const { success, data, error } = analyticsFormSchema.safeParse(
			Object.fromEntries([...formData.entries()]),
		);

		if (!success) {
			console.error(
				"Form validation failed:",
				JSON.stringify(z.treeifyError(error)),
			);
			throw new Error("form_validation_error");
		}

		const { audio, grid, ...rest } = data;

		const [audioObjectKey, gridObjectKey] = await uploadFiles([audio, grid]);

		return fireAndForget(`${import.meta.env.VITE_API_ENDPOINT}/analytics`, {
			...rest,
			audio: audioObjectKey,
			grid: gridObjectKey,
		});
	}, []);

	const steps = useMemo(
		() => [
			<ImportFilesStep key="import-files" />,
			<InformationStep key="information" />,
		],
		[],
	);

	return (
		<Form
			onSubmit={handleSubmit}
			steps={steps}
			pageTitle="Analyser un entretien"
			submitLabel="Analyser l'entretien"
		/>
	);
}
