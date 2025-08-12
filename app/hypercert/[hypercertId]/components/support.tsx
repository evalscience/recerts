import { Button } from "@/components/ui/button";
import UserChip from "@/components/user-chip";
import type { FullHypercert } from "@/graphql/hypercerts/queries/hypercerts";
import { formatTokens } from "@/lib/format-tokens";
import { bigintToFormattedDate } from "@/lib/utils";
import {
	type ChainId,
	type ChainInfo,
	type Currency,
	chainInfo,
	currenciesByNetwork,
} from "@hypercerts-org/marketplace-sdk";
import {
	ArrowUpRight,
	ArrowUpRightFromSquare,
	Calendar,
	HandHeart,
} from "lucide-react";
import Link from "next/link";
import type React from "react";

const BuyFraction = ({
	text,
	hypercert,
}: {
	text: React.ReactNode;
	hypercert: FullHypercert;
}) => {
	return (
		<div className="relative flex w-full flex-col items-center overflow-hidden px-6 py-4">
			<HandHeart size={36} className="text-muted-foreground" />
			<div className="mt-2 text-center text-muted-foreground text-sm">
				{text}
			</div>
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
	const salesCount = hypercert.sales?.length ?? 0;
	if (salesCount === 0) {
		return (
			<Wrapper
				buyFraction={
					<BuyFraction
						text={
							<p className="text-center text-muted-foreground text-sm">
								Be the first to support this hypercert.
							</p>
						}
						hypercert={hypercert}
					/>
				}
				children={null}
			/>
		);
	}

	type CurrencyWithExplorerBaseURL = Currency & {
		explorerBaseURL: string;
	};

	const allCurrencies: Array<CurrencyWithExplorerBaseURL> = Object.entries(
		currenciesByNetwork,
	).reduce((acc, [chainId, currencies]) => {
		let chain: ChainInfo;
		try {
			chain = chainInfo[Number.parseInt(chainId) as ChainId];
		} catch {
			return acc;
		}
		acc.push(
			...Object.values(currencies).map((currency) => ({
				...currency,
				explorerBaseURL: `${chain.explorer}`,
			})),
		);
		return acc;
	}, [] as CurrencyWithExplorerBaseURL[]);

	type SaleWithCurrencyInfo = FullHypercert["sales"][number] & {
		currencyInfo: CurrencyWithExplorerBaseURL;
	};

	const salesWithCurrencyInfo: SaleWithCurrencyInfo[] = hypercert.sales
		.map((sale) => {
			const currency = allCurrencies.find(
				(currency) => currency.address === sale.currency,
			);
			if (!currency) {
				return null;
			}
			return {
				...sale,
				currencyInfo: currency,
			};
		})
		.filter((sale) => sale !== null);

	const newestToOldestSales = salesWithCurrencyInfo.sort((a, b) => {
		return Number(b.creationBlockTimestamp - a.creationBlockTimestamp);
	});

	return (
		<Wrapper
			buyFraction={
				<BuyFraction
					text={
						<p className="text-center text-muted-foreground text-sm">
							Support this hypercert.
						</p>
					}
					hypercert={hypercert}
				/>
			}
		>
			<table className="w-full font-sans">
				<tbody>
					{newestToOldestSales
						.map((sale, index) => {
							const currency = sale.currencyInfo;

							const saleAmount = formatTokens(
								sale.currencyAmount,
								currency.decimals,
							);

							return (
								<tr
									key={sale.transactionHash}
									className={
										index === 0 ? undefined : "border-t border-t-border"
									}
								>
									<td>
										<UserChip
											address={sale.buyer as `0x${string}`}
											className="border-none bg-transparent hover:bg-transparent"
											showCopyButton="hover"
										/>
									</td>
									<td
										className="table-cell whitespace-nowrap pr-4 [@media(max-width:36rem)]:hidden"
										width={"1px"}
									>
										<span className="flex items-center text-muted-foreground text-sm">
											<Calendar className="mr-2 size-3" />
											<span>
												{bigintToFormattedDate(sale.creationBlockTimestamp)}
											</span>
										</span>
									</td>
									<td
										className="whitespace-nowrap text-right text-base text-primary [@media(max-width:30rem)]:whitespace-normal [@media(max-width:30rem)]:text-xs"
										width={"1px"}
									>
										<b>{saleAmount}</b> {currency.symbol}
									</td>
									<td width={"1px"}>
										<Link
											href={`${currency.explorerBaseURL}/tx/${sale.transactionHash}`}
											target="_blank"
										>
											<Button variant="link" size={"icon"} className="p-0">
												<ArrowUpRightFromSquare className="size-[0.85rem]" />
											</Button>
										</Link>
									</td>
								</tr>
							);
						})
						?.filter((sale) => sale !== null)}
				</tbody>
			</table>
		</Wrapper>
	);
};

export default Support;
