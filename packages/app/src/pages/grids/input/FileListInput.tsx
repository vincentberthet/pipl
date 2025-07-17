import { CircleX } from "lucide-react";
import { useId } from "react";
import { shallowEqual } from "../../../commons/shallowEqual.js";
import { useFieldContext } from "../form/useGridsForm.js";

const isEqual = (a: File, b: File) =>
	a.type === b.type &&
	a.size === b.size &&
	a.name === b.name &&
	a.lastModified === b.lastModified;

export function FileListInput({
	label,
	accept,
	placeholder,
	required,
}: {
	label: string;
	accept?: string;
	placeholder?: string;
	required?: boolean;
}) {
	const id = useId();
	const field = useFieldContext<File[] | null>();
	const isDirty = field.state.meta.isDirty;
	const fieldError = field.state.meta.errors?.at(0)?.message;

	const files: File[] = field.form.getFieldValue(field.name);

	// TODO: fix this type
	// TODO: allow to add same file multiple times
	const handleAddFile = (e: any) => {
		if (!e.target.files || e.target.files.length === 0) {
			console.warn("No files selected.");
			return;
		}
		console.log("Adding files:", e.target.files);
		console.log("Current files:", files);

		const newFile = e.target.files[0];
		const isAlreadyAdded = files.some((file) => isEqual(file, newFile));

		if (!isAlreadyAdded) {
			const newFiles = [...files, newFile];
			field.handleChange(newFiles);
			field.handleBlur();
			console.log("New files added:", newFiles);
		}
	};

	const handleRemoveFile = (file: File) => {
		const filteredFiles = files.filter((f) => !isEqual(f, file));

		field.handleChange(filteredFiles);
		field.handleBlur();
	};

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
				type="file"
				id={id}
				name={field.name}
				onChange={handleAddFile}
				className={`file-input h-50 ${isDirty && fieldError ? " border-red-700" : ""}`}
				accept={accept}
				required={required}
				placeholder={placeholder}
				multiple
			/>
			{isDirty && fieldError ? (
				<div className="error text-red-700">{fieldError}</div>
			) : null}
			{files && files.length > 0 ? (
				<div className="flex flex-col mt-2 gap-1.5">
					{files.map((file) => (
						<FilePreview
							file={file}
							key={`${file.name}-${file.size}-${file.lastModified}`}
							handleAddFile={handleAddFile}
							handleRemoveFile={() => handleRemoveFile(file)}
						/>
					))}
				</div>
			) : null}
		</>
	);
}

const FilePreview = ({
	file,
	handleRemoveFile,
}: {
	file: File;
	handleAddFile: React.FormEventHandler<HTMLButtonElement>;
	handleRemoveFile: () => void;
}) => {
	const fileType = getFileType(file.type);
	return (
		<div className="flex items-center gap-2">
			<button
				type="button"
				className="cursor-pointer"
				title="Supprimer le fichier"
				onClick={handleRemoveFile}
			>
				<CircleX size={18} />
			</button>
			<div
				className={`badge badge-ghost ${fileType === "other" ? "error text-red-700" : ""}`}
			>
				<FileIcon fileType={fileType} />
				{file.name} ({(file.size / 1024).toFixed(2)} KB)
			</div>
		</div>
	);
};

const getFileType = (type: string) => {
	switch (type.split(".").pop()) {
		case "document":
			return "docx";
		case "application/pdf":
			return "pdf";
		case "sheet":
			return "xlsx";
		case "text/csv":
			return "csv";
		default:
			return "other";
	}
};

const FileIcon = ({
	fileType,
}: {
	fileType: ReturnType<typeof getFileType>;
}) => {
	switch (fileType) {
		case "docx":
			return <span className="icon-docx">📘</span>;
		case "pdf":
			return <span className="icon-pdf">📕</span>;
		case "xlsx":
		case "csv":
			return <span className="icon-xlsx">📊</span>;
		default:
			return <span className="icon-file">📄</span>;
	}
};
