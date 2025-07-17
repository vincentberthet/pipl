import { useId } from "react";
import { useFieldContext } from "../form/useGridsForm.js";

export function FileListInput({
	label,
	accept,
	placeholder,
	required,
	size,
}: {
	label: string;
	accept?: string;
	placeholder?: string;
	required?: boolean;
	size?: number;
}) {
	const id = useId();
	const field = useFieldContext<File[] | null>();
	const isDirty = field.state.meta.isDirty;
	const fieldError = field.state.meta.errors?.at(0)?.message;

	return (
		<>
			<label
				htmlFor={id}
				className={`${isDirty && fieldError ? " text-red-700" : ""}`}
			>
				{label}&nbsp;
				{required ? "*" : null}
			</label>
			<input
				type="file"
				id={id}
				name={field.name}
				onChange={(e) => {
					field.handleChange(Array.from(e.target.files ?? []));
				}}
				className={`file-input h-50 ${isDirty && fieldError ? " border-red-700" : ""}`}
				accept={accept}
				required={required}
				placeholder={placeholder}
				multiple
				size={size}
			/>
			{isDirty && fieldError ? (
				<div className="error text-red-700">{fieldError}</div>
			) : null}
		</>
	);
}
