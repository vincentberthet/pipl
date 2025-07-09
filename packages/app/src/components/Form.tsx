import { X } from "lucide-react";
import { Link } from "react-router";
import { FormStepper, type FormStepperProps } from "./FormStepper.js";

export type FormProps = {
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	pageTitle: string;
} & FormStepperProps;

export const Form = ({
	handleSubmit,
	steps,
	pageTitle,
	submitLabel,
}: FormProps) => (
	<form onSubmit={handleSubmit}>
		<h1 className="flex flex-row justify-between items-center">
			{pageTitle}
			<Link to="/">
				<X />
			</Link>
		</h1>

		<FormStepper steps={steps} submitLabel={submitLabel} />
	</form>
);
