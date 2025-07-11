export function ImportFilesStep() {
	return (
		<>
			<legend className="fieldset-legend">
				<h2>Étape 1/2 : Importez les documents de l'entretien</h2>
			</legend>

			<label htmlFor="analytics-audio">
				Sélectionner l'enregistrement de l'entretien
			</label>
			<input
				type="file"
				className="file-input"
				id="analytics-audio"
				name="audio"
				accept=".mp3,.mp4"
			/>

			<label htmlFor="analytics-grid">Sélectionner la grille d'entretien</label>
			<input
				type="file"
				className="file-input"
				id="analytics-grid"
				name="grid"
				accept=".pdf"
			/>
		</>
	);
}
