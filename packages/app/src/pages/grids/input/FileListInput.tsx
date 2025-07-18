import { CircleX } from "lucide-react";
import { useId } from "react";
import { useFieldContext } from "../form/useGridsForm.js";

const acceptedFileTypes = [
	"application/pdf",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"text/csv",
];

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

	const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) {
			console.warn("No files selected.");
			return;
		}

		const addedFiles: File[] = Array.from(e.target.files);
		const newFiles = [...files];

		addedFiles.forEach((file: File) => {
			const isAlreadyAdded = files.some((f) => isEqual(f, file));
			if (!isAlreadyAdded) {
				if (!acceptedFileTypes.includes(file.type)) {
					console.warn(
						`"${file.name}": File type "${file.type}" is not accepted.`,
					);
				} else {
					newFiles.push(file);
					console.log(`File "${file.name}" added successfully.`);
				}
			} else {
				console.warn(`File "${file.name}" is already added, skipping.`);
			}
		});

		if (newFiles.length === files.length) {
			console.warn(
				"No new files added, all selected files are already present.",
			);
		} else {
			field.handleChange(newFiles);
			field.handleBlur();
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
			<button
				type="button"
				className={`flex flex-col justify-center items-center w-full h-28 rounded border border-gray-300 bg-gray-100 cursor-pointer ${isDirty && fieldError ? " border-red-700" : ""}`}
				onClick={() => document.getElementById(id)?.click()}
			>
				<p>Déposez des fichiers pour les télécharger,</p>
				<p>ou cliquez pour en sélectionner</p>
			</button>
			<input
				type="file"
				id={id}
				name={field.name}
				onChange={handleAddFile}
				className={`file-input h-50 hidden ${isDirty && fieldError ? " border-red-700" : ""}`}
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
			<div className="badge border-none pl-0">
				<img
					src={`/assets/${fileType}-icon.svg`}
					alt={`${fileType} Icon`}
					width={18}
				/>
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
		case "text/csv":
			return "sheet";
		default:
			return "file";
	}
};
