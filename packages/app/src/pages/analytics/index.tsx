import { type FormEvent, useMemo } from "react";
import { Form } from "../../components/Form.js";
import { ImportFilesStep } from "./form/ImportFilesStep.js";
import { InformationStep } from "./form/InformationStep.js";

export function AnalyticsForm() {
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("submit", e.currentTarget);
	};

	const steps = useMemo(
		() => [
			<ImportFilesStep key="import-files" />,
			<InformationStep key="information" />,
		],
		[],
	);

	return (
		<Form
			handleSubmit={handleSubmit}
			steps={steps}
			pageTitle="Analyser un entretien"
			submitLabel="Analyser l'entretien"
		/>
	);
}
