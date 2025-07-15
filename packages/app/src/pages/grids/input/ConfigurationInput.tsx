import { useId } from "react";
import { useFieldContext } from "../form/useGridsForm.js";

type ConfigurationInputProps = {
	label: string;
	required?: boolean;
	placeholder?: string;
	min?: number;
	max?: number;
};

export function ConfigurationInput({
	label,
	required,
	placeholder,
}: ConfigurationInputProps) {
	const id = useId();
	const field = useFieldContext<number | null>();
	const isDirty = field.state.meta.isDirty;
	const fieldError = field.state.meta.errors?.at(0)?.message;

	return (
		<div
			className={`form-inline flex items-center gap-2${isDirty && fieldError ? " text-red-700" : ""}`}
		>
			<input
				type="number"
				className={`input !w-10 ${isDirty && fieldError ? " border-red-700" : ""}`}
				id={id}
				name={field.name}
				value={field.state.value?.toString(10) ?? ""}
				placeholder={placeholder}
				onChange={(e) => {
					const value = e.target.value;
					const parsedValue = value ? parseInt(value, 10) : null;

					field.handleChange(Number.isNaN(parsedValue) ? null : parsedValue);
				}}
				required={required}
			/>

			<label htmlFor={id} className="">
				{label}
				{required ? " *" : null}
			</label>
		</div>
	);
}
