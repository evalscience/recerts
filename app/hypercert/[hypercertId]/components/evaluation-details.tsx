import { Button } from "@/components/ui/button";
import EthAvatar from "@/components/ui/eth-avatar";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { Separator } from "@/components/ui/separator";
import UserChip from "@/components/user-chip";
import { Info, ShieldCheck } from "lucide-react";
import React from "react";

const EvaluationDetails = () => {
	return (
		<div className="group overflow-hidden">
			<EvervaultCard>
				<div className="flex w-full items-center gap-2">
					<ShieldCheck className="text-primary" size={24} />
					<span className="font-bold text-lg">Verified by Gainforest</span>
				</div>
			</EvervaultCard>
			{/* <div className="flex w-full flex-col items-center gap-1 px-8 py-4">
        <span className="text-center text-muted-foreground leading-none">
          This hypercerts and the work it represents have been verified by
        </span>
        <span className="text-center font-bold text-foreground text-xl">
          GainForest.Earth
        </span>
      </div> */}
			{false && (
				<div className="mt-4 flex w-full flex-col gap-2">
					<span className="font-bold text-muted-foreground text-sm">
						Other Evaluators:
					</span>
					<ul className="flex flex-wrap items-center gap-1">
						<UserChip address="0x012345678910" />
						<UserChip address="0x012345678910" />
						<UserChip address="0x012345678910" />
						<UserChip address="0x012345678910" />
						<UserChip address="0x012345678910" />
						<li className="flex h-8 items-center justify-center rounded-full border border-border bg-muted px-2 text-sm">
							+2
						</li>
						<Button variant={"ghost"} size={"sm"}>
							View all
						</Button>
					</ul>
				</div>
			)}
		</div>
	);
};

export default EvaluationDetails;
