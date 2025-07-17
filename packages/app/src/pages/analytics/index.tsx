import { useCallback, useMemo } from "react";
import { Form } from "../../components/Form.js";
import { FormStepper } from "../../components/FormStepper.js";
import { useAnalyticsForm } from "./form/useAnalyticsForm.js";
import { ImportFilesStep } from "./step/ImportFilesStep.js";
import { InformationStep } from "./step/InformationStep.js";

export function AnalyticsForm() {
	const { isPending, form } = useAnalyticsForm();

	const steps = useMemo(() => {
		return [
			<ImportFilesStep key="import-files" form={form} />,
			<InformationStep key="information" form={form} />,
		];
	}, [form]);

	const handleSubmit = useCallback(() => {
		form.handleSubmit();
	}, [form]);

	return (
		<Form onSubmit={handleSubmit} pageTitle="Analyser un entretien">
			<FormStepper
				isSubmitting={isPending}
				submitLabel="Analyser l'entretien"
				steps={steps}
			/>
		</Form>
	);
}
