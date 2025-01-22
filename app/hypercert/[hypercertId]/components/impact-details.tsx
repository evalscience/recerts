import type { FullHypercert } from "@/app/graphql-queries/hypercerts";
import EthAddress from "@/components/eth-address";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EthAvatar from "@/components/ui/eth-avatar";
import { bigintToFormattedDate, cn } from "@/lib/utils";
import { blo } from "blo";
import {
	ArrowUpRight,
	Calendar,
	Clock,
	HandHeart,
	UserCircle2,
	Users2,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const ImpactDetails = ({ hypercert }: { hypercert: FullHypercert }) => {
	return (
		<div className="mt-2 flex flex-col gap-3">
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
			{hypercert.work.from !== undefined && (
				<div className="flex w-full items-center justify-between rounded-2xl bg-accent p-4 hover:bg-accent/50">
					<span className="flex items-center justify-center gap-2 text-muted-foreground">
						<Calendar size={16} /> <span>From</span>
					</span>
					<span className="font-bold text-foreground text-lg">
						{bigintToFormattedDate(hypercert.work.from)}
					</span>
				</div>
			)}
			{hypercert.work.to !== undefined && (
				<div className="flex w-full items-center justify-between rounded-2xl bg-accent p-4 hover:bg-accent/50">
					<span className="flex items-center justify-center gap-2 text-muted-foreground">
						<Calendar size={16} /> <span>To</span>
					</span>{" "}
					<span className="font-bold text-foreground text-lg">
						{bigintToFormattedDate(hypercert.work.to)}
					</span>
				</div>
			)}
			{hypercert.work.to !== undefined && (
				<div className="flex w-full items-center justify-between rounded-2xl bg-accent p-4 hover:bg-accent/50">
					<span className="flex items-center justify-center gap-2 text-muted-foreground">
						<Users2 size={16} /> <span>Contributors</span>
					</span>{" "}
					<span className="flex items-center justify-center gap-3 font-bold text-foreground">
						<span className="flex items-center justify-center">
							{hypercert.contributors?.map((contributor, i) => (
								<div
									className={cn(
										"h-[32px] w-[16px]",
										i === (hypercert.contributors?.length ?? i) - 1
											? "w-[32px]"
											: "",
									)}
								>
									<EthAvatar
										address={contributor as `0x${string}`}
										size={32}
										className="border-border shadow-md"
									/>
								</div>
							))}
						</span>
						<span>{hypercert.contributors?.length}</span>
					</span>
				</div>
			)}

			<div className="mt-4 flex flex-wrap items-center gap-4">
				<Link
					href={`https://testnet.hypercerts.org/hypercert/${hypercert.hypercertId}`}
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
