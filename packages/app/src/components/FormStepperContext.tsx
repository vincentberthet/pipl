import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

type FormStepperContextValue = {
	submitLabel: string;
	isSubmitting: boolean;
	currentStep: number;
	totalSteps: number;
	onNext: () => void;
	onPrevious: () => void;
};

const formStepperContext = createContext<FormStepperContextValue | null>(null);

type FormStepperContextProviderProps = {
	submitLabel: string;
	isSubmitting: boolean;
	totalSteps: number;
	children: React.ReactNode;
};

export function FormStepperContextProvider({
	submitLabel,
	isSubmitting,
	totalSteps,
	children,
}: FormStepperContextProviderProps) {
	const [currentStep, setCurrentStepStep] = useState(0);

	const onPrevious = useCallback(
		() => setCurrentStepStep((prev) => Math.max(prev - 1, 0)),
		[],
	);

	const onNext = useCallback(() => {
		setCurrentStepStep((prev) => Math.min(prev + 1, totalSteps - 1));
	}, [totalSteps]);

	const value = useMemo<FormStepperContextValue>(() => {
		return {
			submitLabel,
			isSubmitting,
			currentStep,
			totalSteps,
			onNext,
			onPrevious,
		};
	}, [submitLabel, isSubmitting, currentStep, totalSteps, onNext, onPrevious]);

	return (
		<formStepperContext.Provider value={value}>
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
