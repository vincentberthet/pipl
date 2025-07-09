import type { ReactNode } from "react";
import {
	FormStepperContextProvider,
	useFormStepperContext,
} from "./FormStepperContext.js";

export type FormStepperProps = {
	steps: ReactNode[];
	submitLabel: string;
};

export function FormStepper({ steps, submitLabel }: FormStepperProps) {
	return (
		<FormStepperContextProvider totalSteps={steps.length}>
			<div className="form-stepper">
				{steps.map((step, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: This is fine here
					<FormStepperFieldset key={i} submitLabel={submitLabel}>
						{step}
					</FormStepperFieldset>
				))}
			</div>
		</FormStepperContextProvider>
	);
}

type FormStepperFieldsetProps = {
	submitLabel: string;
	children?: ReactNode;
};

function FormStepperFieldset({
	children,
	submitLabel,
}: FormStepperFieldsetProps) {
	const { currentStep, isFirstStep, isLastStep, onPrevious, onNext } =
		useFormStepperContext();
	const style = {
		transform: `translateX(-${currentStep * 100}%)`,
	};

	return (
		<fieldset className="fieldset" style={style}>
			{children}

			<div
				className={`flex flex-row ${isFirstStep ? "justify-end" : "justify-between"} items-center mt-4`}
			>
				{!isFirstStep && (
					<button type="button" className="btn" onClick={onPrevious}>
						Précédent
					</button>
				)}

				{isLastStep ? (
					<button type="submit" className="btn btn-primary">
						{submitLabel}
					</button>
				) : (
					<button type="button" className="btn" onClick={onNext}>
						Suivant
					</button>
				)}
			</div>
		</fieldset>
	);
}
