"use client";
import React, { useEffect, useState } from "react";

const useMediaQuery = (query: string): boolean | null => {
	const [matches, setMatches] = useState<boolean | null>(null);

	useEffect(() => {
		const mql = window.matchMedia(query);
		const handleChange = () => {
			setMatches(mql.matches);
		};
		mql.addEventListener("change", handleChange);
		handleChange();
		return () => mql.removeEventListener("change", handleChange);
	}, [query]);

	return matches;
};

export default useMediaQuery;
