import EthAvatar from "@/components/ui/eth-avatar";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { ShieldCheck } from "lucide-react";
import React from "react";

const EvaluatorChip = ({ address }: { address: `0x${string}` }) => {
	return (
		<li className="flex items-center gap-1.5 rounded-full border border-transparent bg-muted/80 p-2 pr-3 hover:border-border hover:bg-muted">
			<EthAvatar address={address} size={22} />
			<span className="text-sm">{address}</span>
		</li>
	);
};

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
			<div className="mt-4 flex w-full flex-col gap-2">
				<span className="font-bold text-muted-foreground text-sm">
					Other Evaluators:
				</span>
				<ul className="flex flex-wrap items-center gap-1">
					<EvaluatorChip address="0x012345678910" />
					<EvaluatorChip address="0x012345678910" />
					<EvaluatorChip address="0x012345678910" />
					<EvaluatorChip address="0x012345678910" />
					<EvaluatorChip address="0x012345678910" />
					<EvaluatorChip address="0x012345678910" />
				</ul>
			</div>
		</div>
	);
};

export default EvaluationDetails;
