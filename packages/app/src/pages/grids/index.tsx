import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import * as XLSX from "xlsx";
import * as z from "zod/v4";
import { postJson } from "../../commons/http.js";
import { uploadFiles } from "../../commons/s3.js";
import { Form } from "../../components/Form.js";
import { FinalizeStep } from "./form/FinalizeStep.js";
import { gridFormSchema } from "./form/gridsFormSchema.js";
import { ImportStep } from "./form/ImportStep.js";
import { PromptingStep } from "./form/PromptingStep.js";

export function GridsPage() {
	const navigate = useNavigate();

	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [convertedFiles, setConvertedFiles] = useState<File[]>();

	const handleFileChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
	): Promise<void> => {
		console.log("Handling file change:", e.target.files);
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const newFiles: File[] = [];

		for (const file of Array.from(files)) {
			const fileName = file.name.toLowerCase();

			if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
				try {
					const csvFile = await convertExcelToCSV(file);
					newFiles.push(csvFile);
				} catch (error) {
					console.error("Erreur de conversion Excel → CSV :", error);
				}
			} else {
				newFiles.push(file);
			}
		}
		console.log("Converted files:", newFiles);
		setConvertedFiles(newFiles);
	};

	const convertExcelToCSV = (file: File): Promise<File> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = (e) => {
				const data = e.target?.result;
				if (typeof data !== "string") {
					reject("Type de fichier non pris en charge.");
					return;
				}

				try {
					const workbook = XLSX.read(data, { type: "binary" });
					const sheetName = workbook.SheetNames[0];
					if (!sheetName) {
						reject("Aucune feuille trouvée dans le fichier Excel.");
						return;
					}
					const worksheet = workbook.Sheets[sheetName];
					if (!worksheet) {
						reject("Feuille introuvable dans le fichier Excel.");
						return;
					}
					const csv = XLSX.utils.sheet_to_csv(worksheet);

					const blob = new Blob([csv], { type: "text/csv" });
					const csvFile = new File(
						[blob],
						file.name.replace(/\.(xlsx|xls)$/i, ".csv"),
						{ type: "text/csv" },
					);

					resolve(csvFile);
				} catch (err) {
					reject(err);
				}
			};

			reader.onerror = (err) => reject(err);
			reader.readAsBinaryString(file);
		});
	};

	const handleSubmit = useCallback(
		async (formData: FormData) => {
			const { success, data, error } = gridFormSchema.safeParse({
				...Object.fromEntries([...formData.entries()]),
				files: formData.getAll("files"),
			});

			if (!success) {
				console.error(
					"Form validation failed:",
					JSON.stringify(z.treeifyError(error)),
				);
				throw new Error("form_validation_error");
			}

			const { files, ...rest } = data;
			const pathToFiles = await uploadFiles(convertedFiles ?? files);
			return postJson(`${import.meta.env.VITE_API_ENDPOINT}/grids`, {
				...rest,
				pathToFiles,
			});
		},
		[convertedFiles],
	);

	const handleSuccess = useCallback(
		({ executionArn }: { executionArn: string }) => {
			navigate(`/grids/${executionArn}`);
		},
		[navigate],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: `handleFileChange` is stable
	const steps = useMemo(
		() => [
			<ImportStep
				key="import"
				handleFileChange={handleFileChange}
				fileInputRef={fileInputRef}
			/>,
			<PromptingStep key="prompting" />,
			<FinalizeStep key="finalize" />,
		],
		[],
	);

	console.log("Converted files:", convertedFiles);

	return (
		<Form
			onSubmit={handleSubmit}
			onSuccess={handleSuccess}
			steps={steps}
			pageTitle="Générer une grille d'entretien"
			submitLabel="Générer la grille"
		/>
	);
}
