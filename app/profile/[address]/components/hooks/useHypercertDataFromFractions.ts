import {
	type FullHypercert,
	fetchFullHypercertById,
} from "@/app/graphql-queries/hypercerts";
import { hypercert } from "@/app/graphql-queries/templates";
import type { Fraction } from "@/app/graphql-queries/user-fractions";
import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * This hook takes the fractions, and calculatates their worths
 * by fetching the hypercert, and calculating the prices. Optional argument
 * `creatorAddressToIgnore` is used to ignore hypercerts that were created
 * by a particular address (useful when you only want to calculate the
 * worth of fractions that were bought, not created.) `hypercertFilter` is
 * an array that is also returned which has boolean values depicting if
 * the hypercert is NOT ignored for calculation.  */
const useHypercertDataFromFractions = (
	fractions: Fraction[],
	creatorAddressToIgnore?: string,
) => {
	const hypercertIds = fractions.map((fraction) => fraction.hypercertId);
	const [fractionWorths, setFractionWorths] = useState<
		(number | undefined | null)[]
	>(hypercertIds.map(() => undefined));
	const [hypercertFilter, setHypercertFilter] = useState<
		(boolean | undefined)[]
	>(hypercertIds.map(() => undefined));
	const fetchCountRef = useRef(0);

	const calculateWorthByHypercert = (
		totalFractionUnits: number,
		hypercert: FullHypercert,
	) => {
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
		setHypercertFilter(hypercertIds.map(() => undefined));

		hypercertIds.map((hypercertID, index) => {
			const fractionUnits = fractions[index]?.units;
			if (fractionUnits === undefined || hypercertID === undefined)
				return new Promise<null>((resolve) => resolve(null));

			fetchFullHypercertById(hypercertID).then((hypercert) => {
				if (currentFetchCount !== fetchCountRef.current) return;
				if (hypercert.creatorAddress === creatorAddressToIgnore) {
					setFractionWorths((prev) => {
						const newWorthArray = [...prev];
						newWorthArray[index] = null;
						return newWorthArray;
					});
					setHypercertFilter((prev) => {
						const newFilterArray = [...prev];
						newFilterArray[index] = false;
						return newFilterArray;
					});
				} else {
					const worth = calculateWorthByHypercert(
						Number(fractionUnits),
						hypercert,
					);
					setFractionWorths((prev) => {
						const newWorthArray = [...prev];
						newWorthArray[index] = worth;
						return newWorthArray;
					});
					setHypercertFilter((prev) => {
						const newFilterArray = [...prev];
						newFilterArray[index] = true;
						return newFilterArray;
					});
				}
			});
		});
	};

	return { fractionWorths, hypercertFilter, fetch };
};

export default useHypercertDataFromFractions;
