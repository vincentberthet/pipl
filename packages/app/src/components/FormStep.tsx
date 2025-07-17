import { ChevronLeft, ChevronRight, CircleQuestionMark } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
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
			<legend className="fieldset-legend flex flex-row items-center gap-2">
				<h2>{label}</h2>
				{tooltip ? (
					<div className="tooltip tooltip-bottom">
						<CircleQuestionMark size={14} className="text-secondary" />
						<div className="tooltip-content -translate-x-24 text-start flex flex-col gap-4 p-6">
							{tooltip}
						</div>
					</div>
				) : null}
			</legend>

			{children}

			<div className={`flex flex-row justify-between items-center mt-4`}>
				{isFirstStep ? (
					<Link
						to="/"
						className="btn btn-outline border-none text-gray-500 hover:text-gray-700"
						onClick={onPrevious}
					>
						<ChevronLeft /> Retour
					</Link>
				) : (
					<button
						type="button"
						className="btn btn-outline border-none text-gray-500 hover:text-gray-700"
						onClick={onPrevious}
					>
						<ChevronLeft /> Retour
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
						{submitLabel} <ChevronRight />
					</button>
				) : (
					<button
						type="button"
						className="btn btn-primary rounded-md"
						onClick={onNext}
						disabled={isSubmitting || !isStepValid}
					>
						Suivant <ChevronRight />
					</button>
				)}
			</div>
		</fieldset>
	);
}
