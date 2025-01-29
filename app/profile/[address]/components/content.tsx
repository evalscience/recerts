"use client";
import type { Fraction } from "@/app/graphql-queries/user-fractions";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { AnimatePresence } from "framer-motion";
import type React from "react";
import { useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import CardGridWrapper from "./card-grid-wrapper";
import { FractionCardSkeleton } from "./fraction-card";
import FractionsGrid from "./fractions-grid";
import useHypercertDataFromFractions from "./hooks/useHypercertDataFromFractions";
import StatCard from "./stat-card";

const MotionContentWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<MotionWrapper
			type="section"
			className="w-full"
			initial={{ opacity: 0, filter: "blur(10px)" }}
			animate={{ opacity: 1, filter: "blur(0px)" }}
			exit={{ opacity: 0, filter: "blur(10px)" }}
			transition={{ duration: 0.5 }}
		>
			{children}
		</MotionWrapper>
	);
};

const Content = ({
	fractions,
	address,
}: {
	fractions: Fraction[];
	address: `0x${string}`;
}) => {
	const {
		fractionWorths,
		hypercertFilter,
		fetch: fetchFractionsWorth,
	} = useHypercertDataFromFractions(fractions, address);

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

	const supportedFractionsWithWorth = useMemo(() => {
		return fractions
			.map((fraction, index) => {
				if (hypercertFilter[index] === undefined) return undefined;
				if (hypercertFilter[index] === false) return null;

				return {
					...fraction,
					worthInUSD: fractionWorths[index],
				};
			})
			.filter((fraction) => fraction !== null);
	}, [fractions, fractionWorths, hypercertFilter]);

	const definedSupportedFractionsWithWorth: (Fraction & {
		worthInUSD?: number | null;
	})[] = supportedFractionsWithWorth.filter(
		(fraction) => fraction !== undefined,
	);

	return (
		<section className="flex flex-1 flex-col gap-8">
			<section className="flex items-stretch gap-4">
				<StatCard
					title={"Hypercerts supported"}
					display={definedSupportedFractionsWithWorth.length}
				/>
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
				<AnimatePresence>
					{supportedFractionsWithWorth.length === 0 ? (
						<MotionContentWrapper key={"no-support-activity"}>
							<FractionsGrid fractions={[]} />
						</MotionContentWrapper>
					) : supportedFractionsWithWorth.every(
							(fraction) => fraction === undefined,
					  ) ? (
						<MotionContentWrapper key={"loading-support-activity"}>
							<CardGridWrapper>
								<FractionCardSkeleton />
								<FractionCardSkeleton />
								<FractionCardSkeleton />
								<FractionCardSkeleton />
							</CardGridWrapper>
						</MotionContentWrapper>
					) : (
						<MotionContentWrapper key={"displaying-support-activity"}>
							<FractionsGrid fractions={definedSupportedFractionsWithWorth} />
						</MotionContentWrapper>
					)}
				</AnimatePresence>
			</section>
		</section>
	);
};

export default Content;
