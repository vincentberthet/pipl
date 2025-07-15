import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { postJson } from "../commons/http.js";

const completedStatuses = ["succeeded", "failed", "error"];

export function useGetStatus(executionArn: string) {
	const queryKey = useMemo(() => ["status", executionArn], [executionArn]);

	const { isPending, data, error, refetch } = useQuery({
		queryKey,
		queryFn: async (context) => {
			return postJson<{ status: string }>(
				`${import.meta.env.VITE_API_ENDPOINT}/status`,
				{
					executionArn,
				},
				context.signal,
			);
		},
		retry: false,
	});

	const status = useMemo(() => {
		if (data?.status === "SUCCEEDED") {
			return "succeeded";
		}

		if (isPending || data?.status === "RUNNING") {
			return "running";
		}

		if (error) {
			return "error";
		}

		return "failed";
	}, [isPending, data, error]);

	useEffect(() => {
		if (isPending || completedStatuses.includes(status)) {
			return;
		}

		const timer = setInterval(() => {
			refetch();
		}, 5000);

		return () => {
			clearInterval(timer);
		};
	}, [refetch, isPending, status]);

	return useMemo(() => {
		return {
			status,
		};
	}, [status]);
}
