export const ImportStep = ({ submit }: { submit: () => void }) => {
	return (
		<div className="flex flex-col items-center justify-center h-full">
			<h1 className="text-2xl font-bold mb-4">Import Step</h1>
			<p className="text-gray-600">
				This is the import step of the grid creation process.
			</p>
			<button type="button" onClick={submit} className="btn">
				next step
			</button>
		</div>
	);
};
