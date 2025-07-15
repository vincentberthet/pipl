import { useStore } from "@tanstack/react-form";
import { FormStep } from "../../../components/FormStep.js";
import {
	type AnalyticsFormSchema,
	audioValidator,
	gridValidator,
} from "../form/analyticsFormSchema.js";
import { withForm } from "../form/useAnalyticsForm.js";

const KEYS: (keyof AnalyticsFormSchema)[] = ["audio", "grid"];

export const ImportFilesStep = withForm({
	defaultValues: {} as AnalyticsFormSchema,
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
				label="Étape 1/2 : Importez les documents de l'entretien"
			>
				<form.AppField
					name="audio"
					validators={{
						onChange: audioValidator,
					}}
				>
					{(field) => (
						<field.FileInput
							label="Sélectionner l'enregistrement de l'entretien"
							accept=".mp3,.mp4"
							required
						/>
					)}
				</form.AppField>

				<form.AppField
					name="grid"
					validators={{
						onChange: gridValidator,
					}}
				>
					{(field) => (
						<field.FileInput
							label="Sélectionner la grille d'entretien"
							accept=".pdf,.docx"
							required
						/>
					)}
				</form.AppField>
			</FormStep>
		);
	},
});
