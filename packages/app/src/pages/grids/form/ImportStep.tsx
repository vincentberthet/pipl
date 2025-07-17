import type { ChangeEvent, RefObject } from "react";

type ImportStepProps = {
	handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
	fileInputRef: RefObject<HTMLInputElement | null>;
};

export const ImportStep = ({
	handleFileChange,
	fileInputRef,
}: ImportStepProps) => (
	<>
		<legend className="fieldset-legend">
			<h2>Etape 1/3 : Importez les documents PDF relatifs au poste</h2>
			<div className="tooltip tooltip-bottom">
				<div className="border rounded-full w-5 h-5 flex justify-center text-sm font-light cursor-default">
					?
				</div>
				<div className="tooltip-content -translate-x-24 text-start flex flex-col gap-5">
					<p>
						Plus vous uploadez de documents relatifs au poste, plus l’IA dispose
						d’un contexte précis, et plus la grille d’entretien générée sera
						pertinente. Parmi ces documents, il est fortement recommandé
						d’uploader un document intitulé “Tâches clés du poste”.
					</p>
					<p>
						Exemple pour le métier de Chef de chantier Ferroviaire : “Une tâche
						importante du Chef de chantier concerne le pointage des salariés, à
						faire quotidiennement sur une tablette informatique. Les pointages
						effectués par le Chef de chantier sont ensuite directement transmis
						dans le système de paie. C’est donc une activité essentielle et
						majeure de sa mission (conditionne la rémunération des salariés).”
					</p>
				</div>
			</div>
		</legend>

		<label htmlFor="grid-files">
			Fiche de poste, offre d'emploi, fiche de compétences, tâches clés du
			poste, etc.
		</label>
		<input
			type="file"
			className="file-input h-50 rounded-md"
			id="grid-files"
			name="files"
			placeholder="Fichiers"
			accept=".pdf,.docx,.xlsx,.xls,.csv"
			multiple
			onChange={handleFileChange}
			ref={fileInputRef}
		/>
	</>
);
