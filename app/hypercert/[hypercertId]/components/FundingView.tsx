"use client";

import CreateListingDialog from "@/app/components/create-listing-dialog";
import Progress from "@/app/components/shared/progress";
import useFullHypercert from "@/app/contexts/full-hypercert";
import type { FullHypercert } from "@/app/graphql-queries/hypercerts";
import { Button } from "@/components/ui/button";
import QuickTooltip from "@/components/ui/quicktooltip";
import { calculateBigIntPercentage } from "@/lib/calculateBigIntPercentage";
import { convertCurrencyPriceToUSD, formatDecimals } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BadgeDollarSign, CircleAlert, Clock } from "lucide-react";
import React, { useEffect } from "react";
import { useAccount } from "wagmi";
import PaymentFlow from "./PaymentFlow";

const ProgressIndicator = ({
	percentage,
	tooltipText,
	tooltipWidth,
	direction,
}: {
	percentage: number;
	tooltipText: string;
	tooltipWidth?: number;
	direction: "top" | "bottom";
}) => {
	return (
		<div
			className={cn(
				"relative mb-1 h-[12px] w-full",
				direction === "top" ? "mb-1" : "mt-1",
			)}
		>
			<div
				className="-translate-x-1/2 absolute top-0 left-[-50%]"
				style={{
					left: `${percentage}%`,
				}}
			>
				<div
					className={cn(
						"relative mx-auto h-0 w-0 scale-75 border-x-[8px] border-x-transparent transition-all duration-300 group-hover:scale-100",
						direction === "top"
							? "origin-bottom border-t-[12px] border-t-beige-muted-foreground"
							: "origin-top border-b-[12px] border-b-primary/70",
					)}
				>
					<div
						className={cn(
							"-translate-x-1/2 pointer-events-none absolute left-1/2 scale-0 rounded-full bg-background px-2 py-0.5 text-center font-bold text-sm opacity-0 shadow-md blur-xl transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-hover:blur-none",
							direction === "top"
								? "bottom-[14px] mb-1 origin-bottom text-beige-muted-foreground"
								: "top-[14px] mt-1 origin-top text-primary",
						)}
						style={{
							width: tooltipWidth ? `${tooltipWidth}px` : undefined,
						}}
					>
						{tooltipText}
					</div>
				</div>
			</div>
		</div>
	);
};

const OpenVariant = ({
	totalSalesInUSD,
	percentageUnitsSold,
	goalInUSD,
}: {
	totalSalesInUSD: number;
	percentageUnitsSold: number;
	goalInUSD: number;
}) => {
	const goalPercentageOnBar =
		totalSalesInUSD <= goalInUSD ? 100 : (goalInUSD / totalSalesInUSD) * 100;

	return (
		<div className="flex h-full w-full flex-col justify-between font-sans">
			<div className="group flex w-full flex-col">
				<div className="flex flex-col items-center">
					<span className="font-bold text-3xl text-primary">
						${totalSalesInUSD}
					</span>
					<span className="font-bold text-beige-muted-foreground text-xl">
						out of ${goalInUSD}
					</span>
					<span className="font-bold text-muted-foreground text-sm">
						sold so far.
					</span>
				</div>
				<div className="mt-4 flex w-full flex-col items-center">
					<div className="relative w-full">
						<Progress
							percentage={Math.min((totalSalesInUSD * 100) / goalInUSD, 100)}
							className="h-6 rounded-sm bg-beige-muted"
						/>
						{goalPercentageOnBar < 99 && (
							<div
								className="-translate-x-[2px] absolute top-1 bottom-1 w-[4px] rounded-full bg-white shadow-md"
								style={{
									left: `${goalPercentageOnBar}%`,
								}}
							/>
						)}
					</div>
					<ProgressIndicator
						percentage={goalPercentageOnBar}
						tooltipText={"Goal"}
						direction="bottom"
					/>
				</div>
			</div>
			<div className="mt-2 flex items-center justify-end">
				<PaymentFlow>
					<Button className="gap-2" size={"sm"}>
						Buy <ArrowRight size={16} />
					</Button>
				</PaymentFlow>
			</div>
		</div>
	);
};

const ComingVariant = () => {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-2">
			<div className="flex flex-col items-center justify-center gap-2 text-beige-muted-foreground">
				<Clock size={40} />
				<span className="font-bold text-xl">
					This hypercert is not listed for sale.
				</span>
			</div>
			<span className="text-balance text-center text-muted-foreground">
				Stay tuned for updates.
			</span>
		</div>
	);
};

const ListingOptionVariant = () => {
	const hypercert = useFullHypercert();
	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-2">
			<div className="flex flex-col items-center justify-center gap-2 text-beige-muted-foreground">
				<BadgeDollarSign size={40} />
				<span className="font-bold text-xl">Need donations?</span>
			</div>
			<span className="text-balance text-center text-muted-foreground">
				List for sale to get donations.
			</span>
			<CreateListingDialog
				hypercertId={hypercert.hypercertId}
				trigger={
					<Button className="gap-2" size={"sm"}>
						<span>List for sale</span>
						<ArrowRight size={16} />
					</Button>
				}
			/>
		</div>
	);
};

const SoldVariant = () => {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-2">
			<div className="flex flex-col items-center justify-center gap-2 text-destructive">
				<CircleAlert size={40} />
				<span className="font-bold text-xl">Sold Out</span>
			</div>
			<span className="text-balance text-center text-muted-foreground">
				This hypercert is no longer for sale.
			</span>
		</div>
	);
};

const VariantSelector = () => {
	const hypercert = useFullHypercert();
	const {
		totalUnits,
		unitsForSale,
		cheapestOrder: { pricePerPercentInUSD },
		sales,
	} = hypercert;
	const { address } = useAccount();

	const { data: totalSalesInUSD, isLoading } = useQuery({
		queryKey: ["totalSalesInUSD", sales],
		queryFn: async (): Promise<number> => {
			if (!sales || sales.length === 0) return 0;
			const salesInUSDPromises = sales.map(async (sale) => {
				return convertCurrencyPriceToUSD(sale.currency, sale.currencyAmount);
			});
			const salesInUSD = await Promise.all(salesInUSDPromises);
			let total = 0;
			for (const sale of salesInUSD) {
				if (sale !== null) {
					total += sale;
				}
			}
			return total;
		},
		enabled: pricePerPercentInUSD !== undefined && unitsForSale > 0n,
	});

	if (pricePerPercentInUSD === undefined) {
		if (hypercert.creatorAddress.toLowerCase() === address?.toLowerCase()) {
			return <ListingOptionVariant />;
		}
		return <ComingVariant />;
	}
	if (unitsForSale === 0n) return <SoldVariant />;
	const unitsSold = totalUnits - unitsForSale;
	const percentCompleted = calculateBigIntPercentage(unitsSold, totalUnits);
	if (percentCompleted === undefined) return <SoldVariant />;
	if (isLoading || totalSalesInUSD === undefined) {
		// Loading state, can show a spinner or just nothing
		return null;
	}
	return (
		<OpenVariant
			percentageUnitsSold={percentCompleted}
			goalInUSD={formatDecimals(100 * pricePerPercentInUSD)}
			totalSalesInUSD={formatDecimals(totalSalesInUSD)}
		/>
	);
};

const FundingView = () => {
	return (
		<div className="relative min-h-40 w-full max-w-full overflow-hidden rounded-xl border border-border bg-background/50 p-4 md:w-auto md:max-w-md md:flex-1 md:basis-full">
			<VariantSelector />
		</div>
	);
};

export default FundingView;
