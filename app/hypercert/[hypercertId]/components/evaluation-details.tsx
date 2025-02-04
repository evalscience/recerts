"use client";
import type { FullHypercert } from "@/app/graphql-queries/hypercerts";
import { Button } from "@/components/ui/button";
import EthAvatar from "@/components/ui/eth-avatar";
import { EvervaultCard } from "@/components/ui/evervault-card";
import { Separator } from "@/components/ui/separator";
import UserChip from "@/components/user-chip";
import { Info, ShieldCheck } from "lucide-react";
import React, { useState } from "react";

const EvaluationDetails = ({ hypercert }: { hypercert: FullHypercert }) => {
	const { attestations } = hypercert;
	const attesters = new Set(
		attestations.map((attestation) => attestation.attester),
	);
	const [viewingAll, setViewingAll] = useState(false);

	const hasGainforestAttestation = [...attesters].some(
		(attester) =>
			attester === "0xEf48752C933b1050187e89A9F909De2b9e0BDCE6" ||
			attester === "0x40713Ca5223eFb79E861E282495092D2563c1eCE",
	);

	return (
		<div className="group overflow-hidden">
			{hasGainforestAttestation && (
				<EvervaultCard>
					<div className="flex w-full items-center gap-2">
						<ShieldCheck className="text-primary" size={24} />
						<span className="font-bold text-lg">Verified by Gainforest</span>
					</div>
				</EvervaultCard>
			)}
			{attesters.size === 0 && (
				<div className="flex w-full flex-col items-center gap-1 px-8 py-4">
					<span className="text-center text-muted-foreground leading-none">
						This hypercerts and the work has not been verified yet.
					</span>
				</div>
			)}
			{attesters.size > 0 && (
				<div className="mt-4 flex w-full flex-col gap-2">
					<span className="font-bold text-muted-foreground text-sm">
						Other Evaluators:
					</span>
					<ul className="flex flex-wrap items-center gap-1">
						{[...attesters]
							.slice(0, viewingAll ? undefined : 3)
							.map((attester) => (
								<UserChip address={attester as `0x${string}`} key={attester} />
							))}
						{attesters.size > 3 && (
							<>
								<li className="flex h-8 items-center justify-center rounded-full border border-border bg-muted px-2 text-sm">
									+{attesters.size - 3}
								</li>
								<Button
									variant={"ghost"}
									size={"sm"}
									onClick={() => setViewingAll(!viewingAll)}
								>
									{viewingAll ? "View less" : "View all"}
								</Button>
							</>
						)}
					</ul>
				</div>
			)}
		</div>
	);
};

export default EvaluationDetails;
