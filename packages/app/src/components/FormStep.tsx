import { useEffect, useMemo, useState } from "react";
import { useFormStepContext } from "./FormStepContext.js";
import { useFormStepperContext } from "./FormStepperContext.js";

export type FormStepProps = {
	label: string;
	isStepValid: boolean;
	tooltip?: React.ReactNode;
	children?: React.ReactNode;
};

export function FormStep({
	isStepValid,
	label,
	tooltip,
	children,
}: FormStepProps) {
	const { stepIndex } = useFormStepContext();
	const {
		submitLabel,
		isSubmitting,
		currentStep,
		totalSteps,
		onNext,
		onPrevious,
	} = useFormStepperContext();

	const isFirstStep = useMemo(() => stepIndex === 0, [stepIndex]);

	const isLastStep = useMemo(
		() => stepIndex === totalSteps - 1,
		[stepIndex, totalSteps],
	);

	const style = useMemo(
		() => ({
			transform: `translateX(-${currentStep * 100}%)`,
		}),
		[currentStep],
	);

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
			<legend className="fieldset-legend">
				<h2>{label}</h2>
				{tooltip ? (
					<div className="tooltip tooltip-bottom">
						<div className="border rounded-full w-5 h-5 flex justify-center text-sm font-light cursor-default">
							?
						</div>
						<div className="tooltip-content -translate-x-24 text-start flex flex-col gap-5">
							{tooltip}
						</div>
					</div>
				) : null}
			</legend>

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
						disabled={disableSubmit || isSubmitting || !isStepValid}
					>
						{isSubmitting && (
							<span className="loading loading-spinner loading-xs text-white"></span>
						)}
						{submitLabel} &#x3E;
					</button>
				) : (
					<button
						type="button"
						className="btn btn-primary rounded-md"
						onClick={onNext}
						disabled={isSubmitting || !isStepValid}
					>
						Suivant &#x3E;
					</button>
				)}
			</div>
		</fieldset>
	);
}
