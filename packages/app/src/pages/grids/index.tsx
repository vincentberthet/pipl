import { type FormEvent, useMemo } from "react";
import { Form } from "../../components/Form.js";
import { FinalizeStep } from "./form/FinalizeStep.js";
import { FinishedStep } from "./form/FinishedStep.js";
import { ImportStep } from "./form/ImportStep.js";
import { Loading } from "./form/Loading.js";
import { PromptingStep } from "./form/PromptingStep.js";

export function GridsPage() {
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("submit", e.currentTarget);
	};

	const steps = useMemo(
		() => [
			<ImportStep key="import" />,
			<PromptingStep key="prompting" />,
			<FinalizeStep key="finalize" />,
			<Loading key="loading" />,
			<FinishedStep key="finished" />,
		],
		[],
	);

	return (
		<Form
			handleSubmit={handleSubmit}
			steps={steps}
			pageTitle="Générer une grille d'évaluation"
			submitLabel="Générer la grille"
		/>
	);
}
