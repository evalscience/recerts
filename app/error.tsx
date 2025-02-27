"use client";

import PageError from "@/app/components/shared/PageError";
import { useEffect } from "react";

export default function HypercertError({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Unable to fetch ecocerts", error);
	}, [error]);

	return <PageError title="We couldn't load ecocerts." />;
}
