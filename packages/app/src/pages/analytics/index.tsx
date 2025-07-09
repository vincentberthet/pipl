import { X } from "lucide-react";
import { type FormEvent, useMemo } from "react";
import { Link } from "react-router";
import { FormStepper } from "../../components/FormStepper.js";
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
		<form onSubmit={handleSubmit}>
			<h1 className="flex flex-row justify-between items-center">
				Analyser un entretien
				<Link to="/">
					<X />
				</Link>
			</h1>

			<FormStepper steps={steps} submitLabel="Analyser l'entretien" />
		</form>
	);
}
