import { useCallback } from "react";

export type FormProps = {
	pageTitle: string;
	onSubmit(): void;
	children?: React.ReactNode;
};

export function Form({ pageTitle, onSubmit, children }: FormProps) {
	const handleSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			e.stopPropagation();
			onSubmit();
		},
		[onSubmit],
	);

	return (
		<form onSubmit={handleSubmit}>
			<div className="p-2">
				<h1 className="flex flex-row justify-between items-center p-2">
					{pageTitle}
				</h1>
				{children}
			</div>
		</form>
	);
}
