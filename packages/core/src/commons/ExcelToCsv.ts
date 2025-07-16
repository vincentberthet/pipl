/**
 * Read a XLSX or a XLS uploaded file and convert it to CSV
 * @param filePath - The path to the XLSX file to be converted
 * @returns The converted CSV file path
 */
export const ExcelToCsv = async (filePath: string): Promise<string> => {
	console.log("filePath", filePath);

	await new Promise((resolve) => setTimeout(resolve, 1000));
	return "toto/tata.csv";
};
