export const ImportStep = () => (
	<>
		<legend className="fieldset-legend">
			<h2>Étape 1/3 : Importez les documents relatifs au poste</h2>
		</legend>

		<label htmlFor="grid-files">
			Fiche de poste, fiches de compétences, offre d'emploi...
		</label>
		<input
			type="file"
			className="file-input h-50 rounded-md"
			id="grid-files"
			name="files"
			accept="application/pdf"
		/>
	</>
);
