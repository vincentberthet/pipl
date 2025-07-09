import { X } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Form } from "../../components/Form.js";
import { FinalizeStep } from "./form/FinalizeStep.js";
import { FinishedStep } from "./form/FinishedStep.js";
import { ImportStep } from "./form/ImportStep.js";
import { Loading } from "./form/Loading.js";
import { PromptingStep } from "./form/PromptingStep.js";

export function GridsPage() {
	const [step, setStep] = useState<"form" | "loading" | "finished">("form");

	// TODO: remove this effect when the form is connected to the backend
	useEffect(() => {
		if (step !== "loading") {
			return;
		}
		// Simulate a loading state for demonstration purposes
		const timer = setTimeout(() => {
			setStep("finished");
		}, 2000); // Change to 2000ms for a realistic loading time

		return () => clearTimeout(timer);
	}, [step]);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("submit", e.currentTarget);
		setStep("loading"); // FIXME: fix the bad handleSubmit call on "suivant" click
	};

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
			handleSubmit={handleSubmit}
			steps={steps}
			pageTitle="Générer une grille d'évaluation"
			submitLabel="Générer la grille &#x3E;"
		/>
	) : (
		<form>
			<h1 className="flex flex-row justify-between items-center">
				<div />
				Générer une grille d'évaluation
				<Link to="/">
					<X />
				</Link>
			</h1>
			{step === "loading" ? <Loading /> : <FinishedStep />}
		</form>
	);
}
