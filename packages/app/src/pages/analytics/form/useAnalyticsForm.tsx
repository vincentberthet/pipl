import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { postJson } from "../../../commons/http.js";
import { uploadFiles } from "../../../commons/s3.js";
import { FileInput } from "../input/FileInput.js";
import { TextInput } from "../input/TextInput.js";
import {
	type AnalyticsFormResultSchema,
	type AnalyticsFormSchema,
	analyticsFormSchema,
} from "./analyticsFormSchema.js";

export const { fieldContext, formContext, useFieldContext } =
	createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		FileInput,
		TextInput,
	},
	formComponents: {},
	fieldContext,
	formContext,
});

export function useAnalyticsForm() {
	const navigate = useNavigate();

	const { isPending, mutate } = useMutation<
		AnalyticsFormResultSchema,
		Error,
		AnalyticsFormSchema
	>({
		async mutationFn({ audio, grid, ...rest }) {
			const [audioObjectKey, gridObjectKey] = await uploadFiles([audio, grid]);

			return postJson<{ success: boolean; executionArn: string }>(
				`${import.meta.env.VITE_API_ENDPOINT}/analytics`,
				{
					...rest,
					audioPath: audioObjectKey,
					gridPath: gridObjectKey,
				},
			);
		},
		onSuccess: ({ executionArn }) => {
			navigate(`/analytics/${executionArn}`);
		},
		onError: (error) => {
			console.error("Form submission failed:", error);
			toast.error(
				"Une erreur est survenue lors de l'envoi du formulaire. Veuillez réessayer plus tard.",
			);
		},
	});

	const form = useAppForm({
		defaultValues: {
			candidateName: "",
			jobName: "",
			email: "",
		} as AnalyticsFormSchema,
		validators: {
			onSubmit: analyticsFormSchema,
		},
		onSubmit({ value }) {
			return mutate(value);
		},
	});

	return useMemo(() => {
		return {
			isPending,
			form,
		};
	}, [isPending, form]);
}
