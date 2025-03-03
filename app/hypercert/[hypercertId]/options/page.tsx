import { fetchFullHypercertById } from "@/app/graphql-queries/hypercerts";
import { Button } from "@/components/ui/button";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { BadgeDollarSign, ChevronLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import React from "react";
import { FullHypercertProvider } from "../contexts/full-hypercert";
import OrderSection from "./_components/OrderSection";
import VerificationSection from "./_components/VerificationSection";
import Authorizer from "./authorizer";

const Page = async ({ params }: { params: { hypercertId: string } }) => {
	const hypercertId = params.hypercertId;
	const hypercert = await fetchFullHypercertById(hypercertId);

	return (
		<FullHypercertProvider value={hypercert}>
			<MotionWrapper
				type="main"
				className="flex w-full flex-col items-center justify-start"
				initial={{ opacity: 0, filter: "blur(10px)" }}
				animate={{ opacity: 1, filter: "blur(0px)" }}
				transition={{ duration: 0.5 }}
			>
				<Authorizer address={hypercert.creatorAddress}>
					<div className="flex w-full max-w-6xl flex-col gap-2 p-8">
						<Link href={`/hypercert/${hypercertId}`}>
							<Button variant={"link"} className="gap-2 p-0">
								<ChevronLeft size={20} /> View this ecocert
							</Button>
						</Link>

						<div className="flex flex-col gap-4">
							<section className="flex w-full items-center gap-4">
								<div>
									<h1 className="font-baskerville font-bold text-2xl">
										{hypercert.metadata.name ?? "Untitled Ecocert"}
									</h1>
								</div>
							</section>

							<section className="rounded-2xl border border-border bg-background p-4">
								<h1 className="flex items-center gap-3 font-baskerville font-bold text-2xl">
									<BadgeDollarSign size={28} className="text-primary" />
									<span>Order</span>
								</h1>
								<OrderSection />
							</section>

							<section className="rounded-2xl border border-border bg-background p-4">
								<h1 className="flex items-center gap-3 font-baskerville font-bold text-2xl">
									<ShieldCheck size={28} className="text-primary" />
									<span>Verification</span>
								</h1>
								<VerificationSection />
							</section>
						</div>
					</div>
				</Authorizer>
			</MotionWrapper>
		</FullHypercertProvider>
	);
};

export default Page;
