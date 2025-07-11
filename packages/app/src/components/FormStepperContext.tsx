import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

type FormStepperContextValue = {
	isSubmitting: boolean;
	currentStep: number;
	totalSteps: number;
	isFirstStep: boolean;
	isLastStep: boolean;
	onNext: () => void;
	onPrevious: () => void;
};

const formStepperContext = createContext<FormStepperContextValue | null>(null);

type FormStepperContextProviderProps = {
	isSubmitting: boolean;
	totalSteps: number;
	children: React.ReactNode;
};

export function FormStepperContextProvider({
	isSubmitting,
	totalSteps,
	children,
}: FormStepperContextProviderProps) {
	const [currentStep, setCurrentStepStep] = useState(0);

	const isFirstStep = useMemo(() => currentStep === 0, [currentStep]);

	const isLastStep = useMemo(
		() => currentStep === totalSteps - 1,
		[currentStep, totalSteps],
	);

	const onPrevious = useCallback(
		() => setCurrentStepStep((prev) => Math.max(prev - 1, 0)),
		[],
	);

	const onNext = useCallback(() => {
		setCurrentStepStep((prev) => Math.min(prev + 1, totalSteps - 1));
	}, [totalSteps]);

	return (
		<formStepperContext.Provider
			value={{
				isSubmitting,
				currentStep,
				totalSteps,
				isFirstStep,
				isLastStep,
				onNext,
				onPrevious,
			}}
		>
			{children}
		</formStepperContext.Provider>
	);
}

export function useFormStepperContext() {
	const context = useContext(formStepperContext);
	if (!context) {
		throw new Error(
			"useFormStepperContext must be used within a FormStepperContextProvider",
		);
	}
	return context;
}
