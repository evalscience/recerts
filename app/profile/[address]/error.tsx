"use client";

import PageError from "@/app/components/shared/PageError";
import { useEffect } from "react";

export default function ProfileError({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Unable to load profile page:", error);
	}, [error]);

	return (
		<PageError
			title="We couldn't load the user data."
			body="Please try refreshing the page or check the URL."
		/>
	);
}
