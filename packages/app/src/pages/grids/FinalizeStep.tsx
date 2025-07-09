export const FinalizeStep = ({ submit }: { submit: () => void }) => {
	return (
		<div className="flex flex-col items-center justify-center h-full">
			<h1 className="text-2xl font-bold mb-4">Finalize Step</h1>
			<p className="text-gray-600">
				This is the final step of the grid creation process. Here you can review
				and finalize your grid before submission.
			</p>
			<button type="button" onClick={submit} className="btn">
				next step
			</button>
		</div>
	);
};
