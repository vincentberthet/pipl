import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { FormStepper, type FormStepperProps } from "./FormStepper.js";

export type FormProps = {
	onSubmit(data: FormData): Promise<void>;
	pageTitle: string;
} & Omit<FormStepperProps, "isSubmitting">;

export const Form = ({
	onSubmit,
	steps,
	pageTitle,
	submitLabel,
}: FormProps) => {
	const navigate = useNavigate();

	const { isPending, mutate } = useMutation<void, Error, FormData>({
		mutationFn: onSubmit,
		onSuccess: () => {
			navigate("/");
		},
		onError: (error) => {
			console.error("Form submission failed:", error);
		},
	});

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		mutate(new FormData(event.currentTarget));
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="p-2">
				<h1 className="flex flex-row justify-between items-center">
					{pageTitle}
					<Link to="/">
						<X />
					</Link>
				</h1>
			</div>

			<FormStepper
				isSubmitting={isPending}
				steps={steps}
				submitLabel={submitLabel}
			/>
		</form>
	);
};
