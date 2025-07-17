import { useCallback, useMemo } from "react";
import { Form } from "../../components/Form.js";
import { FormStepper } from "../../components/FormStepper.js";
import { useGridsForm } from "./form/useGridsForm.js";
import { ConfigurationStep } from "./step/ConfigurationStep.js";
import { ImportStep } from "./step/ImportStep.js";
import { InformationStep } from "./step/InformationStep.js";

export function GridsPage() {
	const { isPending, form } = useGridsForm();

	const steps = useMemo(() => {
		return [
			<ImportStep key="import-files" form={form} />,
			<ConfigurationStep key="configuration" form={form} />,
			<InformationStep key="information" form={form} />,
		];
	}, [form]);

	const handleSubmit = useCallback(() => {
		form.handleSubmit();
	}, [form]);

	return (
		<Form onSubmit={handleSubmit} pageTitle="Générer une grille d'entretien">
			<FormStepper
				isSubmitting={isPending}
				submitLabel="Générer la grille"
				steps={steps}
			/>
		</Form>
	);
}
