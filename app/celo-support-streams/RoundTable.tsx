import { Button } from "@/components/ui/button";
import QuickTooltip from "@/components/ui/quicktooltip";
import UserChip from "@/components/user-chip";
import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { celo } from "viem/chains";
import { getCurrencyFromAddress } from "../hypercert/[hypercertId]/components/PurchaseFlow/utils/getCurrencyFromAddress";
import type { SalesByHypercert } from "./sales-data-by-period";

dayjs.extend(relativeTime);

const RoundDataTable = ({ roundData }: { roundData: SalesByHypercert[] }) => {
	let evenOddCounter = 0;
	return (
		<table className="w-full">
			<thead className="border-b border-b-border">
				<tr>
					<th className="pb-2">Hypercert</th>
					<th className="pb-2">Amount</th>
					<th className="pb-2">Buyer</th>
					<th className="pb-2">Time</th>
					<th className="pb-2">View</th>
				</tr>
			</thead>
			<tbody>
				{roundData.map((saleByHypercert, hypercertIndex) =>
					saleByHypercert.sales.map((sale, saleIndex) => {
						const currency = getCurrencyFromAddress(42220, sale.currency);
						const key = `${hypercertIndex}-${saleIndex}`;
						if (!currency) {
							console.error(`Currency ${sale.currency} not found`);
							return null;
						}
						evenOddCounter++;

						return (
							<tr
								key={key}
								className={
									evenOddCounter % 2 === 0 ? "bg-transparent" : "bg-background"
								}
							>
								<td style={{ maxWidth: "200px" }}>
									<Link
										href={`/hypercert/${saleByHypercert.hypercertId}`}
										target="_blank"
									>
										{saleByHypercert.hypercertName.slice(0, 20)}...
									</Link>
								</td>
								<td>{`${BigNumber(sale.currencyAmount)
									.div(10 ** currency.decimals)
									.toFixed(2)} ${currency.symbol}`}</td>
								<td>
									<UserChip
										key={sale.transactionHash}
										address={sale.buyer as `0x${string}`}
										className="bg-transparent"
									/>
								</td>
								<td>
									<QuickTooltip
										content={dayjs(sale.timestamp * 1000).format(
											"hh:mm:ss A, DD/MM/YYYY",
										)}
									>
										<span>{dayjs(sale.timestamp * 1000).format("DD/MM")}</span>
									</QuickTooltip>
								</td>
								<td>
									<Link
										href={`${celo.blockExplorers.default.url}/tx/${sale.transactionHash}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Button variant={"outline"} size={"sm"} className="gap-2">
											View <ArrowUpRight size={14} />
										</Button>
									</Link>
								</td>
							</tr>
						);
					}),
				)}
			</tbody>
		</table>
	);
};

export default RoundDataTable;
