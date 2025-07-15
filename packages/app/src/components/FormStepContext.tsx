import { createContext, useContext, useMemo } from "react";

export type FormStepContextValue = {
	stepIndex: number;
};

export const FormStepContext = createContext<FormStepContextValue | null>(null);

export type FormStepContextProviderProps = FormStepContextValue & {
	children: React.ReactNode;
};

export function FormStepContextProvider({
	stepIndex,
	children,
}: FormStepContextProviderProps) {
	const value = useMemo(() => {
		return {
			stepIndex,
		};
	}, [stepIndex]);

	return (
		<FormStepContext.Provider value={value}>
			{children}
		</FormStepContext.Provider>
	);
}

export function useFormStepContext() {
	const context = useContext(FormStepContext);
	if (!context) {
		throw new Error(
			"useFormStepContext must be used within a FormStepContextProvider",
		);
	}
	return context;
}
