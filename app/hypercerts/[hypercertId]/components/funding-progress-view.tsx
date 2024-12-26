import Progress from "@/app/components/progress";
import { FullHypercert } from "@/app/graphql-queries/hypercerts";
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
    <div className="relative border border-border bg-accent/20 rounded-xl w-full md:w-auto md:flex-1 max-w-full md:max-w-md p-4 overflow-hidden">
      <div className="absolute -top-16 -left-16 h-32 w-32 rounded-full bg-primary/50 blur-xl z-0"></div>
      <div className="flex items-center justify-between relative z-[5]">
        <div className="flex flex-col items-start">
          <span className="text-muted-foreground">Reached</span>
          <span className="text-xl font-bold">
            ${(percentCompleted * pricePerPercentInUSD).toFixed()}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-muted-foreground">Goal</span>
          <span className="text-xl font-bold">
            ${(100 * pricePerPercentInUSD).toFixed()}
          </span>
        </div>
      </div>
      <Progress percentage={percentCompleted} className="mt-2" />
      <div className="flex items-center justify-end mt-4">
        <Button className="gap-2" size={"sm"}>
          Buy <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default FundingProgressView;
