import { type ReactNode, useEffect, useState } from "react";
import {
	FormStepperContextProvider,
	useFormStepperContext,
} from "./FormStepperContext.js";

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
			totalSteps={steps.length}
			isSubmitting={isSubmitting}
		>
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
	const {
		isSubmitting,
		currentStep,
		isFirstStep,
		isLastStep,
		onPrevious,
		onNext,
	} = useFormStepperContext();

	const style = {
		transform: `translateX(-${currentStep * 100}%)`,
	};

	const [disableSubmit, setDisableSubmit] = useState(true);
	useEffect(() => {
		if (!isLastStep) {
			setDisableSubmit(true);
			return;
		}

		const timer = setTimeout(() => {
			setDisableSubmit(false);
		}, 1);

		return () => {
			clearTimeout(timer);
			setDisableSubmit(true);
		};
	}, [isLastStep]);

	return (
		<fieldset className="fieldset" style={style}>
			{children}

			<div
				className={`flex flex-row ${isFirstStep ? "justify-end" : "justify-between"} items-center mt-4`}
			>
				{!isFirstStep && (
					<button
						type="button"
						className="btn btn-outline border-none text-gray-500 hover:text-gray-700"
						onClick={onPrevious}
					>
						&#x3C; Retour
					</button>
				)}

				{isLastStep ? (
					<button
						type="submit"
						className="btn btn-primary"
						disabled={disableSubmit || isSubmitting}
					>
						{isSubmitting && (
							<span className="loading loading-spinner loading-xs text-white"></span>
						)}
						{submitLabel}
					</button>
				) : (
					<button
						type="button"
						className="btn btn-primary rounded-md"
						onClick={onNext}
					>
						Suivant &#x3E;
					</button>
				)}
			</div>
		</fieldset>
	);
}
