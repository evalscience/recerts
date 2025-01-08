import type { FullHypercert } from "@/app/graphql-queries/hypercerts";
import EthAddress from "@/components/eth-address";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { calculateBigIntPercentage } from "@/lib/calculateBigIntPercentage";
import { bigintToFormattedDate } from "@/lib/utils";
import { blo } from "blo";
import { Calendar, HandHeart, UserCircle2 } from "lucide-react";
import React from "react";
import BuyButton from "./BuyButtonWrapper";

const BuyFraction = ({ text }: { text: string }) => {
	return (
		<div className="flex w-full flex-col items-center rounded-xl border border-border bg-background px-8 py-4">
			<HandHeart size={50} className="text-gray-400 dark:text-gray-700" />
			<p className="mt-2">{text}</p>
			<BuyButton className="mt-4" size={"sm"}>
				Buy
			</BuyButton>
		</div>
	);
};

const Support = ({ hypercert }: { hypercert: FullHypercert }) => {
	const { totalUnits, pricePerPercentInUSD } = hypercert;
	const salesCount = hypercert.sales?.length ?? 0;
	if (salesCount === 0) {
		return <BuyFraction text="Be the first to support this contribution." />;
	}
	//   const DUMMY = [
	//     {
	//       creation_block_timestamp: 1729230541n,
	//       amounts: [1000000n],
	//       buyer: "0x1C9F765C579F94f6502aCd9fc356171d85a1F8D0",
	//       transaction_hash:
	//         "0xbc36ab98575c0e197834d3ce238cd03df695728d7855795701ee2d966d7d9b1e",
	//     },
	//     {
	//       creation_block_timestamp: 1729233725n,
	//       amounts: [1000000n],
	//       buyer: "0x2f5416f811E73111269BF4bA3c1Cf1DE0AeEFeD1",
	//       transaction_hash:
	//         "0x23a668c471eaff0ed6cbed9be504a122c4ab4ce6d00f9d89c4b5c0d7d3227973",
	//     },
	//     {
	//       creation_block_timestamp: 1729236921n,
	//       amounts: [83333n],
	//       buyer: "0xBEa26DE685Ef828b60cA53b40Ecc9Bab35645fDF",
	//       transaction_hash:
	//         "0x1950a5ca8fead2fae235b56ef4b42ac80f05370096910f18cc578c1c18abd755",
	//     },
	//     {
	//       creation_block_timestamp: 1729245763n,
	//       amounts: [416666n],
	//       buyer: "0x223c656ED35bFB7A8E358140ca1E2077BE090b2E",
	//       transaction_hash:
	//         "0x7436c32a04e43643bef629ac79f99012736954c6aa2bef018fb1ff4a87771c9d",
	//     },
	//   ];

	return (
		<div className="flex w-full flex-col gap-2">
			<ul className="flex w-full flex-col gap-1">
				{hypercert.sales?.map((sale) => {
					const soldUnits = sale.amounts.reduce((acc, curr) => acc + curr, 0n);
					const percent = calculateBigIntPercentage(soldUnits, totalUnits);

					return (
						<li
							key={sale.transactionHash}
							className="flex items-center justify-between rounded-2xl border border-border px-4 py-2"
						>
							<div className="flex items-center gap-4">
								<Avatar className="h-[40px] w-[40px]">
									<AvatarImage
										src={blo(sale.buyer as `0x${string}`)}
										height={40}
										width={40}
									/>
									<AvatarFallback>
										<UserCircle2 size={40} className="text-primary" />
									</AvatarFallback>
								</Avatar>
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
			<BuyFraction text="To support this contribution, buy a fraction of the hypercert." />
		</div>
	);
};

export default Support;
