import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { FormStepper, type FormStepperProps } from "./FormStepper.js";

export type FormProps<T> = {
	onSubmit(data: FormData): Promise<T>;
	onSuccess?(data: T): void;
	pageTitle: string;
} & Omit<FormStepperProps, "isSubmitting">;

export function Form<T>({
	onSubmit,
	onSuccess,
	steps,
	pageTitle,
	submitLabel,
}: FormProps<T>) {
	const navigate = useNavigate();

	const { isPending, mutate } = useMutation<T, Error, FormData>({
		mutationFn: onSubmit,
		onSuccess:
			onSuccess ??
			(() => {
				navigate("/");
			}),
		onError: (error) => {
			console.error("Form submission failed:", error);
			toast.error(
				"Une erreur est survenue lors de l'envoi du formulaire. Veuillez réessayer plus tard.",
			);
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
}
