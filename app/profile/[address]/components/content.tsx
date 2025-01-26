"use client";
import type { Fraction } from "@/app/graphql-queries/user-fractions";
import React, { useEffect, useMemo } from "react";
import FractionsGrid from "./fractions-grid";
import useFractionsWorthInUSD from "./hooks/useGetFractionsWorth";
import StatCard from "./stat-card";

const Content = ({ fractions }: { fractions: Fraction[] }) => {
	const { fractionWorths, fetch: fetchFractionsWorth } =
		useFractionsWorthInUSD(fractions);

	// biome-ignore lint/correctness/useExhaustiveDependencies(fetchFractionsWorth, fractions): We want to update the worth of the fractions, if the fractions props update
	useEffect(() => {
		fetchFractionsWorth();
	}, [fractions]);

	const totalContributionsWorthInUSD = useMemo(
		() =>
			fractionWorths.reduce((acc: number | undefined, worth) => {
				if (worth === undefined || acc === undefined) return undefined;
				return acc + (worth ?? 0);
			}, 0),
		[fractionWorths],
	);

	return (
		<section className="flex flex-1 flex-col gap-8">
			<section className="flex items-stretch gap-4">
				<StatCard title={"Hypercerts supported"} display={fractions.length} />
				<StatCard
					title={"Total contributions"}
					display={
						totalContributionsWorthInUSD === undefined ? (
							<div className="h-10 w-40 animate-pulse rounded-lg bg-beige-muted-foreground/20" />
						) : (
							<>
								<span className="text-base">USD</span>{" "}
								{Math.floor(totalContributionsWorthInUSD * 100) / 100}
							</>
						)
					}
				/>
			</section>
			<section className="flex w-full flex-col gap-4">
				<span className="font-baskerville font-bold text-3xl">
					Recent Support Activity
				</span>
				<FractionsGrid
					fractions={fractions.map((fraction, index) => {
						return {
							...fraction,
							worthInUSD: fractionWorths[index],
						};
					})}
				/>
			</section>
		</section>
	);
};

export default Content;
