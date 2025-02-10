import type { Hypercert } from "@/app/graphql-queries/hypercerts";
import React from "react";
import type { CombinedSale } from "../../page";
import CreatedHypercerts from "./created-hypercerts";
import Header from "./header";
import SupportedHypercerts from "./supported-hypercerts";

const Content = ({
	view,
	combinedSales,
	address,
	createdHypercerts,
}: {
	view: "created" | "supported";
	combinedSales: CombinedSale[];
	createdHypercerts: Hypercert[];
	address: string;
}) => {
	return (
		<section className="mt-2 flex w-full flex-1 flex-col gap-6">
			<Header address={address} view={view} />
			{view === "created" ? (
				<CreatedHypercerts hypercerts={createdHypercerts} />
			) : (
				<SupportedHypercerts combinedSales={combinedSales} />
			)}
		</section>
	);
};

export default Content;
