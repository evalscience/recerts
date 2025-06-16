"use client";

import PageError from "@/app/components/shared/PageError";
import { useEffect } from "react";

export default function HypercertAttestationsError({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Unable to load hypercert attestations:", error);
	}, [error]);

	return (
		<PageError
			title="We couldn't load the attestations."
			body="Please try refreshing the page or check the URL."
		/>
	);
}
