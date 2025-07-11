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
	const { presignedUrls } = await getPresignedUrls(
		files.map((file) => {
			const extension = file.name.split(".").pop();
			if (!extension) {
				throw new Error("File must have an extension");
			}
			return extension;
		}),
	);

	return Promise.all(
		files.map(async (file, index) => {
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
