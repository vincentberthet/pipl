import { useState } from "react";
import { FinalizeStep } from "./FinalizeStep.js";
import { FinishedStep } from "./FinishedStep.js";
import { ImportStep } from "./ImportStep.js";
import { Loading } from "./Loading.js";
import { PromptingStep } from "./PromptingStep.js";

export function GridsPage() {
	const [step, setStep] = useState<
		"import" | "prompting" | "finalize" | "loading" | "finished"
	>("import");
	return (
		<div className="w-full mt-30">
			<p className="text-4xl font-semibold text-sky-600">
				Générer une grille d'évaluation
			</p>
			{step === "import" ? (
				<ImportStep submit={() => setStep("prompting")} />
			) : step === "prompting" ? (
				<PromptingStep submit={() => setStep("finalize")} />
			) : step === "finalize" ? (
				<FinalizeStep submit={() => setStep("loading")} />
			) : step === "loading" ? (
				<Loading submit={() => setStep("finished")} />
			) : (
				<FinishedStep />
			)}
		</div>
	);
}
