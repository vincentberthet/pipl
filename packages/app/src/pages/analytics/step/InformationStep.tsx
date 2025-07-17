import { useStore } from "@tanstack/react-form";
import { FormStep } from "../../../components/FormStep.js";
import {
	type AnalyticsFormSchema,
	candidateNameValidator,
	emailValidator,
	jobNameValidator,
} from "../form/analyticsFormSchema.js";
import { withForm } from "../form/useAnalyticsForm.js";

export const InformationStep = withForm({
	defaultValues: {} as AnalyticsFormSchema,
	render({ form }) {
		const isStepValid = useStore(form.store, (state) => {
			for (const [_, meta] of Object.entries(state.fieldMeta)) {
				if (!meta?.isTouched || !meta?.isValid) {
					return false;
				}
			}
			return true;
		});
		return (
			<FormStep
				isStepValid={isStepValid}
				label="Étape 2/2 : Précisez les informations sur l'entretien"
			>
				<form.AppField
					name="jobName"
					validators={{
						onChange: jobNameValidator,
					}}
				>
					{(field) => (
						<field.TextInput
							label="Nom du poste"
							placeholder="Ex. Maçon"
							required
						/>
					)}
				</form.AppField>

				<form.AppField
					name="candidateName"
					validators={{
						onChange: candidateNameValidator,
					}}
				>
					{(field) => (
						<field.TextInput
							label="Nom du candidat"
							placeholder="Ex. Jean Dupont"
							required
						/>
					)}
				</form.AppField>

				<form.AppField
					name="email"
					validators={{
						onChange: emailValidator,
					}}
				>
					{(field) => (
						<field.TextInput
							label="Email (pour recevoir les résultats)"
							placeholder="Ex. jeanne.martin@example.com"
							required
						/>
					)}
				</form.AppField>
			</FormStep>
		);
	},
});
