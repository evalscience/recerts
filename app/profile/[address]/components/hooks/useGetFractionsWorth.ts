import { fetchFullHypercertById } from "@/app/graphql-queries/hypercerts";
import { hypercert } from "@/app/graphql-queries/templates";
import type { Fraction } from "@/app/graphql-queries/user-fractions";
import React, { useCallback, useEffect, useRef, useState } from "react";

const useFractionsWorthInUSD = (fractions: Fraction[]) => {
	const hypercertIds = fractions.map((fraction) => fraction.hypercertId);
	const [fractionWorths, setFractionWorths] = useState<
		(number | undefined | null)[]
	>(hypercertIds.map(() => undefined));
	const fetchCountRef = useRef(0);

	const calculateWorthByHypercertId = async (
		totalFractionUnits: number,
		hypercertId: string,
	) => {
		const hypercert = await fetchFullHypercertById(hypercertId);
		const totalHypercertUnits = hypercert?.totalUnits;
		const hypercertPricePerPercentInUSD = hypercert?.pricePerPercentInUSD;
		if (
			totalHypercertUnits === undefined ||
			hypercertPricePerPercentInUSD === undefined
		)
			return null;
		const percentageFractionBought =
			(Number(totalFractionUnits) / Number(totalHypercertUnits)) * 100;
		return percentageFractionBought * hypercertPricePerPercentInUSD;
	};

	const fetch = () => {
		fetchCountRef.current += 1;
		const currentFetchCount = fetchCountRef.current;

		setFractionWorths(hypercertIds.map(() => undefined));
		const fractionWorthPromises = hypercertIds.map((hypercertID, index) => {
			const fractionUnits = fractions[index]?.units;
			if (fractionUnits === undefined || hypercertID === undefined)
				return new Promise<null>((resolve) => resolve(null));
			return calculateWorthByHypercertId(Number(fractionUnits), hypercertID);
		});

		fractionWorthPromises.forEach((promise, index) => {
			promise.then((worth) => {
				if (currentFetchCount !== fetchCountRef.current) return;
				setFractionWorths((prev) => {
					const newWorthArray = [...prev];
					newWorthArray[index] = worth;
					return newWorthArray;
				});
			});
		});
	};

	return { fractionWorths, fetch };
};

export default useFractionsWorthInUSD;
