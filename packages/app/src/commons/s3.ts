import * as Excel from "exceljs";

async function getPresignedUrls(fileTypes: string[]) {
	const response = await fetch(
		`${import.meta.env.VITE_API_ENDPOINT}/upload-urls`,
		{
			method: "POST",
			body: JSON.stringify({
				accessToken: import.meta.env.VITE_LAMBDA_ACCESS_TOKEN,
				fileTypes,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		},
	);

	if (!response.ok) {
		throw new Error("Failed to fetch presigned URLs");
	}

	return response.json() as Promise<{
		ok: boolean;
		presignedUrls: {
			objectKey: string;
			presignedUrl: string;
		}[];
	}>;
}

export async function uploadFiles(files: File[]) {
	const transformedFiles = await Promise.all(
		files.map(async (file) => {
			if (file.name.endsWith(".xlsx")) {
				return convertExcelToCSV(file);
			}
			return file;
		}),
	);

	const { presignedUrls } = await getPresignedUrls(
		transformedFiles.map((file) => {
			const extension = file.name.split(".").pop();
			if (!extension) {
				throw new Error("File must have an extension");
			}
			return extension;
		}),
	);

	return Promise.all(
		transformedFiles.map(async (file, index) => {
			const presignedUrl = presignedUrls[index];
			if (!presignedUrl) {
				throw new Error("Missing presigned URL for file upload");
			}

			await fetch(presignedUrl.presignedUrl, {
				method: "PUT",
				body: file,
			});

			return presignedUrl.objectKey;
		}),
	);
}

async function convertExcelToCSV(file: File): Promise<File> {
	const fileContent = await file.arrayBuffer();

	const workbook = new Excel.Workbook();
	await workbook.xlsx.load(fileContent);

	const worksheet = workbook.worksheets[0];
	if (!worksheet) {
		throw new Error("Feuille introuvable dans le fichier Excel.");
	}

	const csv = await workbook.csv.writeBuffer();
	const blob = new Blob([csv], { type: "text/csv" });
	return new File([blob], file.name.replace(".xlsx", ".csv"), {
		type: "text/csv",
	});
}
