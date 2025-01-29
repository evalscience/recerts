import type { Fraction } from "@/app/graphql-queries/user-fractions";
import React, { useCallback } from "react";
import CardGridWrapper from "./card-grid-wrapper";
import FractionCard, {
	type FractionWithCountAndWorth,
	NoFractions,
} from "./fraction-card";

const FractionsGrid = ({
	fractions,
}: {
	fractions: (Fraction & { worthInUSD?: number | null })[];
}) => {
	const hypercertIdSet = new Set<string>();

	const filteredUniqueHypercertFractions: FractionWithCountAndWorth[] = [];

	const addWorths = useCallback(
		<T extends number | undefined | null>(worth1: T, worth2: T): number | T => {
			const type1 = typeof worth1;
			const type2 = typeof worth2;
			if (type1 === type2 && type1 !== "number") {
				return worth1;
			}
			if (type1 !== "number" || type2 !== "number") {
				return (worth1 ?? 0) + (worth2 ?? 0);
			}
			return Number(worth1) + Number(worth2);
		},
		[],
	);

	const filterFractionsWithSameHypercertId = () => {
		for (const fraction of fractions) {
			const hypercertId = fraction.hypercertId;
			if (!hypercertId) return;

			if (hypercertIdSet.has(hypercertId)) {
				const existingHypercertFractionIndex =
					filteredUniqueHypercertFractions.findIndex(
						(uniqueHypercert) => uniqueHypercert.hypercertId === hypercertId,
					);
				const existingHypercertFraction =
					filteredUniqueHypercertFractions[existingHypercertFractionIndex];
				const newHypercertFraction: FractionWithCountAndWorth = {
					...structuredClone(existingHypercertFraction),
					count: existingHypercertFraction.count + 1,
					worthInUSD: addWorths(
						existingHypercertFraction.worthInUSD,
						fraction.worthInUSD,
					),
				};
				filteredUniqueHypercertFractions[existingHypercertFractionIndex] =
					newHypercertFraction;
				continue;
			}

			const newFraction: FractionWithCountAndWorth = {
				...structuredClone(fraction),
				count: 1,
			};
			hypercertIdSet.add(hypercertId);
			filteredUniqueHypercertFractions.push(newFraction);
		}
	};

	filterFractionsWithSameHypercertId();

	if (filteredUniqueHypercertFractions.length === 0) return <NoFractions />;
	return (
		<CardGridWrapper>
			{filteredUniqueHypercertFractions.map((fraction) => {
				if (fraction.fractionId === undefined) return null;
				return <FractionCard key={fraction.id} fraction={fraction} />;
			})}
		</CardGridWrapper>
	);
};

export default FractionsGrid;
