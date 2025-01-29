import { ArrowUpRightFromSquare, Star } from "lucide-react";
import Link from "next/link";
import type { Address } from "viem";

import PageError from "@/app/components/shared/PageError";

import { fetchHypercertsByUserId } from "@/app/graphql-queries/user-hypercerts";
import { catchError } from "@/app/utils";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Separator } from "@/components/ui/separator";

import {
	type SaleByUser,
	type SaleByUserHypercert,
	fetchSalesByUser,
} from "@/app/graphql-queries/sales";
import ProfileCard from "./components/profile-card";
import SalesGrid from "./components/sales-grid";
import StatCard from "./components/stat-card";

export type CombinedSale = {
	totalAmountInUSD: number;
	unitsBought: bigint;
	hypercert: SaleByUserHypercert;
	id: string;
};

// ❗❗❗ Use the `currency` param in the following function get the latest price data.
// ❗❗❗ Using 1USD for now, because the currency is USD pegged for now.
const convertCurrencyPriceToUSD = (currency: string, tokens: bigint) => {
	const weiFactor = BigInt(10 ** 18);
	const precision = 4;
	const precisionMultiplier = BigInt(10 ** precision);

	return (
		Number((tokens * precisionMultiplier) / weiFactor) /
		Number(precisionMultiplier)
	);
};

const combineSales = (sales: SaleByUser[]) => {
	const saleIndexer = new Map<string, number>();
	const combinedSales: CombinedSale[] = [];

	for (let i = 0; i < sales.length; i++) {
		const sale = sales[i];
		const amountInUSD = convertCurrencyPriceToUSD(
			sale.currency,
			sale.currencyAmount,
		);

		const hypercertId = sale.hypercert.hypercertId;
		if (!saleIndexer.has(hypercertId)) {
			saleIndexer.set(hypercertId, combinedSales.length);
			combinedSales.push({
				totalAmountInUSD: amountInUSD,
				unitsBought: sale.unitsBought,
				hypercert: sale.hypercert,
				id: sale.id,
			});
			continue;
		}

		const index = saleIndexer.get(hypercertId);
		if (index === undefined) continue; // This will never happen.
		combinedSales[index].totalAmountInUSD += amountInUSD;
		combinedSales[index].unitsBought += sale.unitsBought;
	}

	return combinedSales;
};

export default async function ProfilePage({
	params: { address },
}: {
	params: { address: Address };
}) {
	// const DUMMY_ADDRESS = "0x223c656ed35bfb7a8e358140ca1e2077be090b2e";
	const [salesError, sales] = await catchError(fetchSalesByUser(address));

	if (salesError) {
		return (
			<PageError
				title="We couldn't load the user data."
				body="Please try refreshing the page or check the URL."
			/>
		);
	}

	const [hypercertsError, userHypercerts] = await catchError(
		fetchHypercertsByUserId(address),
	);
	if (hypercertsError) {
		return (
			<PageError
				title="We couldn't load the user data."
				body="Please try refreshing the page or check the URL."
			/>
		);
	}

	const combinedSales = combineSales(sales ?? []);
	const totalSalesInUSD =
		Math.floor(
			combinedSales.reduce((acc, sale) => {
				return acc + sale.totalAmountInUSD;
			}, 0) * 100,
		) / 100;

	const { hypercerts } = userHypercerts;
	const hypercertIdSet = new Set<string>();
	const validHypercerts = hypercerts.filter((hypercert) => {
		if (hypercert.hypercertId === undefined) return false;
		if (hypercertIdSet.has(hypercert.hypercertId)) return false;
		if (hypercert.name === undefined) return false;
		hypercertIdSet.add(hypercert.hypercertId);
		return true;
	});
	const validHypercertsCount = validHypercerts.length;

	return (
		<MotionWrapper
			type="main"
			className="mx-auto flex max-w-6xl flex-col items-start gap-8 p-10 md:flex-row"
			initial={{ opacity: 0, filter: "blur(10px)" }}
			animate={{ opacity: 1, filter: "blur(0px)" }}
			transition={{ duration: 0.5 }}
		>
			<div className="flex w-full max-w-full flex-col gap-4 md:max-w-[300px]">
				<ProfileCard
					address={address}
					stats={{
						hypercertsCreated: validHypercertsCount,
						salesMadeCount: sales.length,
					}}
				/>
				{validHypercertsCount > 0 && (
					<div className="relative w-full rounded-2xl bg-beige-muted p-4">
						<span className="flex items-center gap-2 font-baskerville text-xl">
							<Star size={20} className="text-beige-muted-foreground" />
							Creator
						</span>
						<Separator className="my-2 bg-beige-muted-foreground/40" />
						<span className="text-beige-muted-foreground text-sm">
							Created {validHypercertsCount} hypercerts so far...
						</span>
						<ul className="mt-2 flex w-full flex-col gap-1">
							{validHypercerts.map((hypercert) => {
								return (
									<Link
										href={`/hypercert/${hypercert.hypercertId}`}
										key={hypercert.hypercertId}
										target="_blank"
									>
										<li className="flex items-center justify-between gap-2 rounded-xl bg-black/10 p-2 px-4 hover:bg-black/15">
											<span className="max-w-[75%] truncate">
												{hypercert.name}
											</span>
											<ArrowUpRightFromSquare size={16} />
										</li>
									</Link>
								);
							})}
						</ul>
					</div>
				)}
			</div>
			<section className="flex flex-1 flex-col gap-8">
				<section className="flex items-stretch gap-4">
					<StatCard
						title={"Hypercerts supported"}
						display={combinedSales.length}
					/>
					<StatCard title={"Total contributions"} display={totalSalesInUSD} />
				</section>
				<section className="flex w-full flex-col gap-4">
					<span className="font-baskerville font-bold text-3xl">
						Recent Support Activity
					</span>
					<SalesGrid combinedSales={combinedSales} />
				</section>
			</section>
		</MotionWrapper>
	);
}
