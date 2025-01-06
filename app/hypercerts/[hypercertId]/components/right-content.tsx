import type { FullHypercert } from "@/app/graphql-queries/hypercerts";
import MapRenderer from "@/components/map-renderer";
import React from "react";
import EvaluationDetails from "./evaluation-details";
import ImpactDetails from "./impact-details";

const RightContent = ({ hypercert }: { hypercert: FullHypercert }) => {
	return (
		<div className="flex w-full flex-initial flex-col gap-6 md:w-auto md:flex-[2]">
			<section className="flex w-full flex-col gap-2">
				<h2 className="font-bold text-muted-foreground text-xl">Impact</h2>
				<ImpactDetails hypercert={hypercert} />
			</section>
			<section className="flex w-full flex-col gap-2">
				<h2 className="font-bold text-muted-foreground text-xl">
					Verification
				</h2>
				<EvaluationDetails />
			</section>
			{hypercert.uri && (
				<section className="flex w-full flex-col gap-2">
					<h2 className="font-bold text-muted-foreground text-xl">
						Site Boundaries
					</h2>
					<div className="flex w-full items-center justify-center">
						<MapRenderer uri={hypercert.uri} />
					</div>
				</section>
			)}
		</div>
	);
};

export default RightContent;
