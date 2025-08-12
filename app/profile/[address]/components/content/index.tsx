import type { Hypercert } from "@/graphql/hypercerts/queries/hypercerts";
import { HeartHandshake, Sparkle } from "lucide-react";
import React from "react";
import type { CombinedSale } from "../../page";
import CreatedHypercerts from "./created-hypercerts";
import SupportedHypercerts from "./supported-hypercerts";

const Content = ({
	view,
	combinedSales,
	createdHypercerts,
}: {
	view: "created" | "supported";
	combinedSales: CombinedSale[];
	createdHypercerts: Hypercert[];
}) => {
	return (
		<section className="mt-1 flex w-full flex-1 flex-col gap-4">
			<span className="ml-2 flex items-center gap-2 font-baskerville font-semibold text-muted-foreground text-xl">
				{view === "created" ? (
					<Sparkle className="text-primary" size={18} />
				) : (
					<HeartHandshake className="text-primary" size={18} />
				)}
				<span>{view === "created" ? "My" : "Supported"} Hypercerts</span>
			</span>
			{view === "created" ? (
				<CreatedHypercerts hypercerts={createdHypercerts} />
			) : (
				<SupportedHypercerts combinedSales={combinedSales} />
			)}
		</section>
	);
};

export default Content;
