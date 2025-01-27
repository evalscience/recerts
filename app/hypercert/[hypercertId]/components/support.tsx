import type { FullHypercert } from "@/app/graphql-queries/hypercerts";
import EthAddress from "@/components/eth-address";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EthAvatar from "@/components/ui/eth-avatar";
import { calculateBigIntPercentage } from "@/lib/calculateBigIntPercentage";
import { bigintToFormattedDate } from "@/lib/utils";
import { blo } from "blo";
import { Calendar, HandHeart, UserCircle2 } from "lucide-react";
import type React from "react";
import BuyButton from "./BuyButtonWrapper";
import PaymentFlow from "./PaymentFlow";

const BuyFraction = ({
	text,
	hypercert,
}: {
	text: React.ReactNode;
	hypercert: FullHypercert;
}) => {
	return (
		<div className="d relative flex w-full flex-col items-center overflow-hidden px-8 py-4 pt-8">
			<div className="-bottom-20 absolute h-32 w-full rounded-full bg-gradient-to-r from-primary/20 to-primary/40 blur-xl" />
			<div className="relative flex items-center justify-center">
				<div className="absolute h-12 w-12 rounded-full bg-beige-muted-foreground/40 blur-lg" />
				<HandHeart
					size={50}
					className="scale-100 text-beige-muted-foreground"
				/>
			</div>
			<div className="mt-2 scale-100">{text}</div>
		</div>
	);
};

const Wrapper = ({
	children,
	buyFraction,
}: {
	children: React.ReactNode;
	buyFraction: React.ReactNode;
}) => {
	return (
		<div className="w-full overflow-hidden rounded-2xl border border-border bg-background">
			<section className="flex w-full flex-col gap-4 p-4">
				<h2 className="font-baskerville font-bold text-muted-foreground text-xl">
					Support
				</h2>
				{children}
			</section>
			{buyFraction}
		</div>
	);
};

const Support = ({ hypercert }: { hypercert: FullHypercert }) => {
	const { totalUnits, pricePerPercentInUSD } = hypercert;
	const salesCount = hypercert.sales?.length ?? 0;
	if (salesCount === 0) {
		return (
			<Wrapper
				buyFraction={
					<BuyFraction
						text={
							<p className="flex flex-col items-center justify-center text-center">
								<span className="font-bold text-lg">
									Be the pioneer, lead the way.
								</span>
								<span>
									Be the very first to support this hypercert by owning a piece.
								</span>
							</p>
						}
						hypercert={hypercert}
					/>
				}
				children={null}
			/>
		);
	}

	return (
		<Wrapper
			buyFraction={
				<BuyFraction
					text={
						<p className="flex flex-col items-center justify-center text-center">
							<span className="font-bold text-lg">
								Join the movement and make a difference.
							</span>
							<span>Grab your share of the hypercert today!</span>
						</p>
					}
					hypercert={hypercert}
				/>
			}
		>
			<div className="flex w-full flex-col gap-2">
				<ul className="flex w-full flex-col gap-1">
					{hypercert.sales?.map((sale) => {
						const soldUnits = sale.amounts.reduce(
							(acc, curr) => acc + curr,
							0n,
						);
						const percent = calculateBigIntPercentage(soldUnits, totalUnits);

						return (
							<li
								key={sale.transactionHash}
								className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-2"
							>
								<div className="flex items-center gap-4">
									<EthAvatar address={sale.buyer as `0x${string}`} size={40} />
									<div className="flex h-full flex-col items-start gap-1">
										<EthAddress address={sale.buyer} />
										<span className="flex items-center text-muted-foreground text-sm">
											<Calendar size={14} className="mr-2" />
											<span>
												{bigintToFormattedDate(sale.creationBlockTimestamp)}
											</span>
										</span>
									</div>
								</div>
								<span className="font-bold text-lg text-primary">
									{pricePerPercentInUSD === undefined || percent === undefined
										? "N/A"
										: `$${(pricePerPercentInUSD * percent).toFixed(2)}`}
								</span>
							</li>
						);
					})}
				</ul>
			</div>
		</Wrapper>
	);
};

export default Support;
