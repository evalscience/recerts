import Progress from "@/app/components/shared/progress";
import type { FullHypercert } from "@/app/graphql-queries/hypercerts";
import { Button } from "@/components/ui/button";
import { calculateBigIntPercentage } from "@/lib/calculateBigIntPercentage";
import { ArrowRight, ChevronRight } from "lucide-react";
import React from "react";
import PaymentFlow from "./PaymentFlow";

const FundingProgressView = ({ hypercert }: { hypercert: FullHypercert }) => {
	const {
		totalUnits,
		unitsForSale,
		cheapestOrder: { pricePerPercentInUSD },
	} = hypercert;
	if (unitsForSale === undefined) return null;
	const unitsSold = totalUnits - unitsForSale;
	const percentCompleted = calculateBigIntPercentage(unitsSold, totalUnits);
	if (percentCompleted === undefined) return null;
	if (pricePerPercentInUSD === undefined) return null;
	return (
		<div className="relative w-full max-w-full overflow-hidden rounded-xl border border-border bg-background/50 p-4 md:w-auto md:max-w-md md:flex-1">
			<div className="relative z-[5] flex items-center justify-between">
				<div className="flex flex-col items-start">
					<span className="text-muted-foreground">Reached</span>
					<span className="font-bold text-xl">
						{pricePerPercentInUSD}$
						{(percentCompleted * pricePerPercentInUSD).toFixed()}
					</span>
				</div>
				<div className="flex flex-col items-end">
					<span className="text-muted-foreground">Goal</span>
					<span className="font-bold text-xl">
						${(100 * pricePerPercentInUSD).toFixed()}
					</span>
				</div>
			</div>
			<Progress percentage={percentCompleted} className="mt-2 bg-beige-muted" />
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

export default FundingProgressView;
