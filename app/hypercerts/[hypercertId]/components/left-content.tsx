import type { FullHypercert } from "@/app/graphql-queries/hypercerts";
import React from "react";
import NFT3D from "./nft-3d";
import Support from "./support";

const LeftContent = ({ hypercert }: { hypercert: FullHypercert }) => {
	return (
		<div className="flex w-full flex-initial flex-col gap-6 md:w-auto md:flex-[3]">
			{hypercert.image && (
				<div className="flex w-full items-center justify-center">
					<div className="w-full max-w-sm">
						<NFT3D src={hypercert.image} />
					</div>
				</div>
			)}
			<section className="flex w-full flex-col">
				<h2 className="font-baskerville font-bold text-muted-foreground text-xl">
					Description
				</h2>
				<p>{hypercert.description}</p>
			</section>
			<section className="flex w-full flex-col gap-2">
				<h2 className="font-baskerville font-bold text-muted-foreground text-xl">
					Support
				</h2>
				<Support hypercert={hypercert} />
			</section>
		</div>
	);
};

export default LeftContent;
