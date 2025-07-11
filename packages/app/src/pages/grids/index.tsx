import { X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import { Form } from "../../components/Form.js";
import { FinalizeStep } from "./form/FinalizeStep.js";
import { FinishedStep } from "./form/FinishedStep.js";
import { ImportStep } from "./form/ImportStep.js";
import { Loading } from "./form/Loading.js";
import { PromptingStep } from "./form/PromptingStep.js";

export function GridsPage() {
	const [step, setStep] = useState<"form" | "loading" | "finished">("form");

	const handleSubmit = useCallback(async () => {
		// TODO: change the content of this function once the backend is connected to the frontend
		setStep("loading");
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setStep("finished");
		await new Promise((resolve) => setTimeout(resolve, 2000));
	}, []);

	const steps = useMemo(
		() => [
			<ImportStep key="import" />,
			<PromptingStep key="prompting" />,
			<FinalizeStep key="finalize" />,
		],
		[],
	);

	return step === "form" ? (
		<Form
			onSubmit={handleSubmit}
			steps={steps}
			pageTitle="Générer une grille d'entretien"
			submitLabel="Générer la grille"
		/>
	) : (
		<form>
			<h1 className="flex flex-row justify-between items-center">
				<div />
				Générer une grille d'entretien
				<Link to="/">
					<X />
				</Link>
			</h1>
			{step === "loading" ? <Loading /> : <FinishedStep />}
		</form>
	);
}
