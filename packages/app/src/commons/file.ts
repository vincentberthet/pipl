export const toBase64 = (file: File): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			const base64Data = reader.result as string;
			resolve(base64Data.split("base64,").at(1) ?? ""); // Extract base64 part
		};
		reader.onerror = (error) => reject(error);
	});
