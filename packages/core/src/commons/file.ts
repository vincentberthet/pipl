export function getExtensionFromFileName(fileName: string): string {
	const extension = fileName.slice(fileName.lastIndexOf("."));
	if (!extension) {
		throw new Error(`File name does not have an extension: ${fileName}`);
	}
	return extension;
}

export function getMimeTypeFromExtension(extension: string): string {
	switch (extension.toLowerCase()) {
		case ".pdf":
			return "application/pdf";
		case ".doc":
			return "application/msword";
		case ".docx":
			return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
		case ".csv":
			return "text/csv";
		case ".mp3":
			return "audio/mpeg";
		case ".mp4":
			return "video/mp4";
		default:
			throw new Error(`Unsupported file extension: ${extension}`);
	}
}

export function getMimeTypeFromFileName(fileName: string): string {
	const extension = getExtensionFromFileName(fileName);
	return getMimeTypeFromExtension(extension);
}
