import Progress from "@/app/components/shared/progress";
import type { FullHypercert } from "@/app/graphql-queries/hypercerts";
import { Button } from "@/components/ui/button";
import { calculateBigIntPercentage } from "@/lib/calculateBigIntPercentage";
import { formatUSD } from "@/lib/utils";
import { ArrowRight, CircleAlert, Clock } from "lucide-react";
import React from "react";
import PaymentFlow from "./PaymentFlow";

const OpenVariant = ({
	reached,
	goal,
	hypercert,
}: { reached: number; goal: number; hypercert: FullHypercert }) => {
	return (
		<div className="flex h-full w-full flex-col justify-between">
			<div className="flex w-full flex-col">
				<div className="relative z-[5] flex items-center justify-between">
					<div className="flex flex-col items-start">
						<span className="text-muted-foreground">Reached</span>
						<span className="font-bold text-xl">${reached}</span>
					</div>
					<div className="flex flex-col items-end">
						<span className="text-muted-foreground">Goal</span>
						<span className="font-bold text-xl">${goal}</span>
					</div>
				</div>
				<Progress
					percentage={(reached * 100) / goal}
					className="mt-2 bg-beige-muted"
				/>
			</div>
			<div className="mt-4 flex items-center justify-end">
				<PaymentFlow hypercert={hypercert}>
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
				<span className="font-bold text-xl">Coming Soon</span>
			</div>
			<span className="text-muted-foreground">Stay tuned for updates.</span>
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
			<span className="text-muted-foreground">
				This hypercert is no longer for sale.
			</span>
		</div>
	);
};

const VariantSelector = ({ hypercert }: { hypercert: FullHypercert }) => {
	const {
		totalUnits,
		unitsForSale,
		cheapestOrder: { pricePerPercentInUSD },
	} = hypercert;
	if (unitsForSale === undefined) return <ComingVariant />;
	const unitsSold = totalUnits - unitsForSale;
	const percentCompleted = calculateBigIntPercentage(unitsSold, totalUnits);
	if (percentCompleted === undefined) return <SoldVariant />;
	if (pricePerPercentInUSD === undefined) return <SoldVariant />;
	return (
		<OpenVariant
			reached={formatUSD(percentCompleted * pricePerPercentInUSD)}
			goal={formatUSD(100 * pricePerPercentInUSD)}
			hypercert={hypercert}
		/>
	);
};

const FundingView = ({ hypercert }: { hypercert: FullHypercert }) => {
	return (
		<div className="relative h-40 w-full max-w-full overflow-hidden rounded-xl border border-border bg-background/50 p-4 md:w-auto md:max-w-md md:flex-1 md:basis-full">
			<VariantSelector hypercert={hypercert} />
		</div>
	);
};

export default FundingView;
