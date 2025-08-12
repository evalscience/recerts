import type { FullHypercert } from "@/graphql/hypercerts/queries/hypercerts";
import React from "react";
import Attestations from "./Attestations";
import Contributors from "./Contributors";
import FundingView from "./FundingView";
import ListingPrompt from "./ListingPrompt";
import Reviews from "./Reviews";
import SectionWrapper from "./SectionWrapper";
import EvaluationDetails from "./evaluation-details";

const RightContent = ({ hypercert }: { hypercert: FullHypercert }) => {
	return (
		<div className="flex w-full flex-initial flex-col gap-6 lg:w-auto lg:flex-[2]">
			{/* Show funding view here if listed */}
			{hypercert.cheapestOrder.pricePerPercentInUSD !== undefined ? (
				<FundingView />
			) : null}
			<Attestations />
			<Contributors hypercert={hypercert} />
			<SectionWrapper title={"Verification"}>
				<EvaluationDetails hypercert={hypercert} />
			</SectionWrapper>
			<Reviews />
			<ListingPrompt hypercert={hypercert} />
		</div>
	);
};

export default RightContent;
