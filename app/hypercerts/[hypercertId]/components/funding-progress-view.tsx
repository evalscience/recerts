import Progress from "@/app/components/progress";
import type { FullHypercert } from "@/app/graphql-queries/hypercerts";
import { Button } from "@/components/ui/button";
import { calculateBigIntPercentage } from "@/lib/calculateBigIntPercentage";
import { ArrowRight, ChevronRight } from "lucide-react";
import React from "react";

const FundingProgressView = ({ hypercert }: { hypercert: FullHypercert }) => {
	const { totalUnits, unitsForSale, pricePerPercentInUSD } = hypercert;
	if (unitsForSale === undefined) return null;
	const unitsSold = totalUnits - unitsForSale;
	const percentCompleted = calculateBigIntPercentage(unitsSold, totalUnits);
	if (percentCompleted === undefined) return null;
	if (pricePerPercentInUSD === undefined) return null;
	return (
		<div className="relative w-full max-w-full overflow-hidden rounded-xl border border-border bg-accent/20 p-4 md:w-auto md:max-w-md md:flex-1">
			<div className="-top-16 -left-16 absolute z-0 h-32 w-32 rounded-full bg-primary/50 blur-xl" />
			<div className="relative z-[5] flex items-center justify-between">
				<div className="flex flex-col items-start">
					<span className="text-muted-foreground">Reached</span>
					<span className="font-bold text-xl">
						${(percentCompleted * pricePerPercentInUSD).toFixed()}
					</span>
				</div>
				<div className="flex flex-col items-end">
					<span className="text-muted-foreground">Goal</span>
					<span className="font-bold text-xl">
						${(100 * pricePerPercentInUSD).toFixed()}
					</span>
				</div>
			</div>
			<Progress percentage={percentCompleted} className="mt-2" />
			<div className="mt-4 flex items-center justify-end">
				<Button className="gap-2" size={"sm"}>
					Buy <ArrowRight size={16} />
				</Button>
			</div>
		</div>
	);
};

export default FundingProgressView;
