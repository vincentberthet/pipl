import { useId } from "react";
import { useFieldContext } from "../form/useAnalyticsForm.js";

export function FileInput({
	label,
	accept,
	required,
}: {
	label: string;
	accept?: string;
	required?: boolean;
}) {
	const id = useId();
	const field = useFieldContext<File | null>();
	const isDirty = field.state.meta.isDirty;
	const fieldError = field.state.meta.errors?.at(0)?.message;

	return (
		<>
			<label htmlFor={id}>
				{label}
				{required ? " *" : null}
			</label>
			<input
				type="file"
				id={id}
				name={field.name}
				onChange={(e) => {
					field.handleChange(e.target.files?.[0] || null);
				}}
				className="file-input"
				accept={accept}
				required={required}
			/>
			{isDirty && fieldError ? (
				<div className="error text-red-700">{fieldError}</div>
			) : null}
		</>
	);
}
