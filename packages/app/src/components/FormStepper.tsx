import type { ReactNode } from "react";
import { FormStepContextProvider } from "./FormStepContext.js";
import { FormStepperContextProvider } from "./FormStepperContext.js";

export type FormStepperProps = {
	steps: ReactNode[];
	submitLabel: string;
	isSubmitting: boolean;
};

export function FormStepper({
	steps,
	submitLabel,
	isSubmitting,
}: FormStepperProps) {
	return (
		<FormStepperContextProvider
			submitLabel={submitLabel}
			totalSteps={steps.length}
			isSubmitting={isSubmitting}
		>
			<div className="form-stepper">
				{steps.map((step, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: this is fine here as we do not reorder form
					<FormStepContextProvider key={i} stepIndex={i}>
						{step}
					</FormStepContextProvider>
				))}
			</div>
		</FormStepperContextProvider>
	);
}
