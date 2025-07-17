import { useId } from "react";
import { useFieldContext } from "../form/useGridsForm.js";

type TextInputProps = {
	label: string;
	required?: boolean;
	placeholder?: string;
};

export function TextInput({ label, required, placeholder }: TextInputProps) {
	const id = useId();
	const field = useFieldContext<string>();
	const isDirty = field.state.meta.isDirty;
	const fieldError = field.state.meta.errors?.at(0)?.message;

	return (
		<>
			<label
				htmlFor={id}
				className={`${isDirty && fieldError ? " text-red-700" : ""}`}
			>
				{label}
				{required ? " *" : null}
			</label>
			<input
				type="text"
				className={`input ${isDirty && fieldError ? " border-red-700" : ""}`}
				id={id}
				name={field.name}
				value={field.state.value}
				placeholder={placeholder}
				onChange={(e) => {
					field.handleChange(e.target.value);
				}}
				required={required}
			/>
			{isDirty && fieldError ? (
				<div className="error text-red-700">{fieldError}</div>
			) : null}
		</>
	);
}
