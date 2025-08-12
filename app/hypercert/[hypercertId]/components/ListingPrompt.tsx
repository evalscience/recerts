"use client";

import CreateListingDialog from "@/app/components/create-listing-dialog";
import { Button } from "@/components/ui/button";
import type { FullHypercert } from "@/graphql/hypercerts/queries/hypercerts";
import { ArrowRight, BadgeDollarSign } from "lucide-react";
import type React from "react";
import { useAccount } from "wagmi";

type ListingPromptProps = {
	hypercert: FullHypercert;
};

const ListingPrompt: React.FC<ListingPromptProps> = ({ hypercert }) => {
	const { address } = useAccount();

	const isCreator =
		hypercert.creatorAddress?.toLowerCase() === address?.toLowerCase();
	const isListed = hypercert.cheapestOrder.pricePerPercentInUSD !== undefined;

	if (!isCreator || isListed) return null;

	return (
		<div className="w-full overflow-hidden rounded-lg border border-border/60 bg-background/40 p-4">
			<div className="flex flex-col items-center gap-2 text-center text-beige-muted-foreground">
				<BadgeDollarSign size={24} />
				<div className="text-sm">Need donations?</div>
				<div className="text-muted-foreground text-xs">
					List this hypercert for sale to start receiving support.
				</div>
				<CreateListingDialog
					hypercertId={hypercert.hypercertId}
					trigger={
						<Button className="mt-2 gap-2" size="sm" variant="secondary">
							<span>List for sale</span>
							<ArrowRight size={14} />
						</Button>
					}
				/>
			</div>
		</div>
	);
};

export default ListingPrompt;
