import { CircleX } from "lucide-react";
import { useId } from "react";
import { toast } from "react-toastify";
import { ACCEPTED_FILE_TYPES } from "../form/gridsFormSchema.js";
import { useFieldContext } from "../form/useGridsForm.js";

const areFilesEqual = (a: File, b: File) => {
	return (
		a.type === b.type &&
		a.size === b.size &&
		a.name === b.name &&
		a.lastModified === b.lastModified
	);
};

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
		if (!e.target.files || e.target.files.length === 0) return;

		const addedFiles: File[] = Array.from(e.target.files);
		const newFiles = [...files];

		addedFiles.forEach((file: File) => {
			const isAlreadyAdded = files.some((f) => areFilesEqual(f, file));

			if (isAlreadyAdded) return;

			if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
				toast.error(
					`Le fichier "${file.name}" n'a pas été ajouté car le format n'est pas valide. Veuillez sélectionner un fichier avec un type "docx", "pdf", "xlsx" ou "csv".`,
					{
						autoClose: 10000,
					},
				);
			} else {
				newFiles.push(file);
			}
		});

		if (newFiles.length === files.length) return;

		field.handleChange(newFiles);
		field.handleBlur();
	};

	const handleRemoveFile = (file: File) => {
		field.handleChange(files.filter((f) => !areFilesEqual(f, file)));
		field.handleBlur();
	};

	const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		const input = document.getElementById(id) as HTMLInputElement;
		if (input && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			input.files = e.dataTransfer.files;
			const event = new Event("change", { bubbles: true });
			input.dispatchEvent(event);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
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
				onDrop={handleDrop}
				onDragOver={handleDragOver}
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
