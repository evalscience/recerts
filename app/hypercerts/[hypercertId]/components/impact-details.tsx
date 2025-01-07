import type { FullHypercert } from "@/app/graphql-queries/hypercerts";
import EthAddress from "@/components/eth-address";
import { Button } from "@/components/ui/button";
import { bigintToFormattedDate } from "@/lib/utils";
import {
	ArrowUpRight,
	Calendar,
	Clock,
	HandHeart,
	UserCircle2,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const ImpactDetails = ({ hypercert }: { hypercert: FullHypercert }) => {
	return (
		<div className="rounded-xl border border-border bg-background p-4">
			{/* <span className="font-bold text-muted-foreground text-sm">Scope</span>
      <ul className="flex items-center gap-2 flex-wrap mb-6">
        {hypercert.work.scope?.map((scope, i) => (
          <li
            key={i}
            className="bg-muted text-foreground/80 py-1 px-3 rounded-full"
          >
            {scope}
          </li>
        ))}
      </ul> */}
			<div className="flex items-center gap-2">
				{hypercert.work.from !== undefined && (
					<div className="flex flex-1 flex-col items-start gap-2 rounded-lg bg-muted p-4">
						<div className="flex w-full items-center justify-end gap-2 text-muted-foreground">
							<span className="text-sm">From</span>
							<Calendar size={16} />
						</div>
						<span className="font-bold text-foreground text-lg">
							{bigintToFormattedDate(hypercert.work.from)}
						</span>
					</div>
				)}
				{hypercert.work.to !== undefined && (
					<div className="flex flex-1 flex-col items-start gap-2 rounded-lg bg-muted p-4">
						<div className="flex w-full items-center justify-end gap-2 text-muted-foreground">
							<span className="text-sm">To</span>
							<Calendar size={16} />
						</div>
						<span className="font-bold text-foreground text-lg">
							{bigintToFormattedDate(hypercert.work.to)}
						</span>
					</div>
				)}
			</div>
			<div className="mt-2 flex items-center rounded-lg bg-muted p-2">
				<div className="flex h-20 w-20 items-center justify-center">
					<HandHeart size={40} className="text-muted-foreground" />
				</div>
				<div className="flex flex-col items-start">
					<span className="text-muted-foreground text-sm">Contributors</span>
					<span className="text-foreground">
						{hypercert.contributors?.map((contributor, i) => (
							<EthAddress
								key={contributor.toLowerCase()}
								address={contributor}
							/>
						))}
					</span>
				</div>
			</div>
			<div className="mt-4 flex flex-wrap items-center gap-4">
				<Link
					href={`https://testnet.hypercerts.org/hypercerts/${hypercert.hypercertId}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button variant={"link"} className="group gap-1 p-0">
						<span>View Hypercert</span>
						<ArrowUpRight
							size={18}
							className="group-hover:-translate-y-0.5 opacity-70 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 group-hover:opacity-100"
							aria-hidden="true"
						/>
					</Button>
				</Link>
				<Link
					href="https://testnet.hypercerts.org/docs/intro"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button variant={"link"} className="group gap-1 p-0">
						<span>What is a Hypercert?</span>
						<ArrowUpRight
							size={18}
							className="group-hover:-translate-y-0.5 opacity-70 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 group-hover:opacity-100"
							aria-hidden="true"
						/>
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default ImpactDetails;
