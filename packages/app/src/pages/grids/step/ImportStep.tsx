import { useStore } from "@tanstack/react-form";
import { FormStep } from "../../../components/FormStep.js";
import { filesSchema, type GridsFormSchema } from "../form/gridsFormSchema.js";
import { withForm } from "../form/useGridsForm.js";

const KEYS: (keyof GridsFormSchema)[] = ["files"];

export const ImportStep = withForm({
	defaultValues: {} as GridsFormSchema,
	render({ form }) {
		const isStepValid = useStore(form.store, (state) => {
			for (const key of KEYS) {
				const meta = state.fieldMeta[key];
				if (!meta?.isTouched || !meta?.isValid) {
					return false;
				}
			}
			return true;
		});
		return (
			<FormStep
				isStepValid={isStepValid}
				label="Étape 1/3 : Importez les documents relatifs au poste"
				tooltip={
					<>
						<p>
							Plus vous uploadez de documents relatifs au poste, plus l’IA
							dispose d’un contexte précis, et plus la grille d’entretien
							générée sera pertinente. Parmi ces documents, il est fortement
							recommandé d’uploader un document intitulé “Tâches clés du poste”.
						</p>
						<p>
							Exemple pour le métier de Chef de chantier Ferroviaire : “Une
							tâche importante du Chef de chantier concerne le pointage des
							salariés, à faire quotidiennement sur une tablette informatique.
							Les pointages effectués par le Chef de chantier sont ensuite
							directement transmis dans le système de paie. C’est donc une
							activité essentielle et majeure de sa mission (conditionne la
							rémunération des salariés).”
						</p>
					</>
				}
			>
				<form.AppField
					name="files"
					validators={{
						onChange: filesSchema,
					}}
				>
					{(field) => (
						<field.FileListInput
							label="Fiche de poste, offre d'emploi, fiche de compétences, tâches clés du
					poste, etc."
							accept=".pdf,.docx,.xlsx,.xls,.csv"
							placeholder="Fichiers PDF, DOCX, XLS, XLSX ou CSV utilisés pour générer la grille d'entretien"
							required
						/>
					)}
				</form.AppField>
			</FormStep>
		);
	},
});
