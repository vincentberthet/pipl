export const ImportStep = () => (
	<>
		<legend className="fieldset-legend">
			<h2>Etape 1/3 : Importez les documents PDF relatifs au poste</h2>
			<div className="tooltip tooltip-bottom">
				<div className="border rounded-full w-5 h-5 flex justify-center text-sm font-light cursor-default">
					?
				</div>
				<div className="tooltip-content -translate-x-36 text-start flex flex-col gap-1.5">
					<p>
						La grille d’entretien qui va être générée est un draft (en format
						Word) et non un document définitif. Vous devrez probablement éditer
						ce document (par exemple, modifier des questions) pour obtenir la
						grille d’entretien définitive. C’est votre expertise métier qui
						permet de valider cette grille.
					</p>
					<br />
					<p>
						Plus vous uploadez de documents relatifs au poste, plus l’IA dispose
						d’un contexte précis, et plus la grille d’entretien générée sera
						pertinente. Parmi ces documents, il est fortement recommandé
						d’uploader un document intitulé « Tâches clés du poste ».
					</p>
					<br />
					<p>Exemples pour le métier de Chef de chantier Ferroviaire :</p>
					<p>
						- Une tâche importante du Chef de chantier concerne le pointage des
						salariés, à faire quotidiennement sur une tablette informatique. Les
						pointages effectués par le Chef de chantier sont ensuite directement
						transmis dans le système de paie. C’est donc une activité
						essentielle et majeure de sa mission (conditionne la rémunération
						des salariés).
					</p>
					<p>
						- Une problématique fréquente dans le secteur des Travaux Publics et
						qui impacte directement l’équipe concerne l’absentéisme d’un salarié
						(report de l’activité sur les autres). C’est en effet au Chef de
						chantier de remettre en dynamique le groupe malgré une absence
						imprévue qui va nécessairement entrainer un surcroit d’activité pour
						les autres.
					</p>
				</div>
			</div>
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
			placeholder="Fichiers PDF"
		/>
	</>
);
