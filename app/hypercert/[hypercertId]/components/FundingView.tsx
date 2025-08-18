"use client";

import usePriceFeed from "@/app/PriceFeedProvider";
import Progress from "@/app/components/shared/progress";
import useFullHypercert from "@/app/contexts/full-hypercert";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal/context";
import QuickTooltip from "@/components/ui/quicktooltip";
import { RAW_TOKENS_CONFIG } from "@/config/raw-tokens";
import type { FullHypercert } from "@/graphql/hypercerts/queries/hypercerts";
import { calculateBigIntPercentage } from "@/lib/calculateBigIntPercentage";
import { convertCurrencyPriceToUSD, formatDecimals } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
	ArrowRight,
	BadgeDollarSign,
	CircleAlert,
	Clock,
	RefreshCcw,
} from "lucide-react";
import React from "react";
import { useAccount } from "wagmi";
import usePaymentProgressStore from "./PurchaseFlow/payment-progress/store";
import SelectAmount from "./PurchaseFlow/select-amount";
import SelectOrder from "./PurchaseFlow/select-order";
import usePurchaseFlowStore from "./PurchaseFlow/store";

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
	goalInUSD,
}: {
	totalSalesInUSD: number;
	goalInUSD: number;
}) => {
	// Calculate progress percentage (how much of the goal is achieved)
	const progressPercentage = Math.min((totalSalesInUSD * 100) / goalInUSD, 100);

	// Calculate where to show the goal line on the progress bar
	// If we haven't reached the goal yet, show the goal at 100%
	// If we've exceeded the goal, show the goal at a proportional position
	const goalPercentageOnBar =
		totalSalesInUSD <= goalInUSD ? 100 : (goalInUSD / totalSalesInUSD) * 100;
	const { show, pushModalByVariant, stack } = useModal();
	const purchasePaymentStatus = usePaymentProgressStore(
		(state) => state.status,
	);
	const resetPaymentProgress = usePaymentProgressStore((state) => state.reset);

	const hypercert = useFullHypercert();

	const handleShowPurchaseFlow = () => {
		const lastModalId = stack.length > 0 ? stack[stack.length - 1] : null;
		if (
			!lastModalId ||
			!lastModalId.startsWith("purchase-flow") ||
			purchasePaymentStatus === "success"
		) {
			resetPaymentProgress();
			pushModalByVariant(
				{
					id: "purchase-flow-select-order",
					content: <SelectOrder hypercert={hypercert} />,
				},
				true,
			);
			show();
			return;
		}
		show();
	};
	return (
		<div className="flex h-full w-full flex-col justify-between font-sans">
			<div className="group flex w-full flex-col">
				<div className="flex flex-col items-center">
					<span className="font-semibold text-2xl text-primary">
						${totalSalesInUSD}
					</span>
					<span className="text-beige-muted-foreground text-sm">
						out of ${goalInUSD}
					</span>
					<span className="text-muted-foreground text-xs">sold so far</span>
				</div>
				<div className="mt-4 flex w-full flex-col items-center">
					<div className="relative w-full">
						<Progress
							percentage={progressPercentage}
							className="h-2 rounded bg-beige-muted"
						/>
						{goalPercentageOnBar < 99 && (
							<div
								className="-translate-x-[1px] absolute top-0 bottom-0 w-[2px] rounded bg-white/80"
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
				<Button
					onClick={handleShowPurchaseFlow}
					variant="secondary"
					className="gap-2"
				>
					Buy <ArrowRight size={14} />
				</Button>
			</div>
		</div>
	);
};

const ComingVariant = () => {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-2">
			<div className="flex flex-col items-center justify-center gap-1 text-beige-muted-foreground">
				<Clock size={28} />
				<span className="text-sm">This hypercert is not listed for sale.</span>
			</div>
			<span className="text-balance text-center text-muted-foreground text-xs">
				Stay tuned for updates.
			</span>
		</div>
	);
};

const SoldVariant = () => {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-2">
			<div className="flex flex-col items-center justify-center gap-1 text-destructive">
				<CircleAlert size={28} />
				<span className="text-sm">Sold Out</span>
			</div>
			<span className="text-balance text-center text-muted-foreground text-xs">
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
	const priceFeed = usePriceFeed();

	// Calculate total sales in USD - with USDGLO fallback
	const totalSalesInUSD = React.useMemo(() => {
		if (!sales || sales.length === 0) {
			return 0;
		}

		let total = 0;
		for (const sale of sales) {
			try {
				// Try priceFeed conversion first
				if (priceFeed.status === "ready") {
					const usd = priceFeed.toUSD(
						sale.currency as `0x${string}`,
						BigInt(sale.currencyAmount),
					);
					if (usd !== null) {
						total += usd;
						continue;
					}
				}

				// Fallback: Handle USD-pegged stablecoins like USDGLO
				const currencyLower = sale.currency.toLowerCase();
				const isUSDGLO =
					currencyLower === "0x4f604735c1cf31399c6e711d5962b2b3e0225ad3";

				if (isUSDGLO) {
					// USDGLO is USD-pegged, so 1 USDGLO = 1 USD (with 18 decimals)
					const usdValue = Number(sale.currencyAmount) / 10 ** 18;
					total += usdValue;
				}
			} catch (error) {
				console.warn("Failed to convert sale to USD:", error);
			}
		}
		return total;
	}, [sales, priceFeed]);

	// Always show component if we have hypercert data, similar to Support component
	if (pricePerPercentInUSD === undefined) {
		return <ComingVariant />;
	}
	if (unitsForSale === 0n) return <SoldVariant />;
	const unitsSold = totalUnits - unitsForSale;
	const percentCompleted = calculateBigIntPercentage(unitsSold, totalUnits);
	if (percentCompleted === undefined) return <SoldVariant />;
	return (
		<OpenVariant
			goalInUSD={formatDecimals(100 * pricePerPercentInUSD)}
			totalSalesInUSD={formatDecimals(totalSalesInUSD)}
		/>
	);
};

const FundingView = () => {
	return (
		<div className="relative min-h-36 w-full max-w-full overflow-hidden rounded-lg border border-border/60 bg-background/40 p-3 md:w-auto md:max-w-md md:flex-1 md:basis-full">
			<VariantSelector />
		</div>
	);
};

export default FundingView;
