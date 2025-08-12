import type { FullHypercert } from "@/graphql/hypercerts/queries/hypercerts";
import React from "react";
import Attestations from "./Attestations";
import Contributors from "./Contributors";
import SectionWrapper from "./SectionWrapper";
import EvaluationDetails from "./evaluation-details";

const RightContent = ({ hypercert }: { hypercert: FullHypercert }) => {
	return (
		<div className="flex w-full flex-initial flex-col gap-6 lg:w-auto lg:flex-[2]">
			<Attestations />
			<Contributors hypercert={hypercert} />
			<SectionWrapper title={"Verification"}>
				<EvaluationDetails hypercert={hypercert} />
			</SectionWrapper>
		</div>
	);
};

export default RightContent;
