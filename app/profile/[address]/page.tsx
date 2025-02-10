import type { Address } from "viem";

import PageError from "@/app/components/shared/PageError";

import { fetchHypercertsByUserId } from "@/app/graphql-queries/user-hypercerts";
import { catchError } from "@/app/utils";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

import {
	type SaleByUser,
	type SaleByUserHypercert,
	fetchSalesByUser,
} from "@/app/graphql-queries/sales";
import {
	convertCurrencyPriceToUSD,
	getValueFromSearchParams,
} from "@/lib/utils";
import Content from "./components/content";
import ProfileCard from "./components/profile-card";
import StatCard from "./components/stat-card";

export type CombinedSale = {
	totalAmountInUSD: number;
	unitsBought: bigint;
	hypercert: SaleByUserHypercert;
	id: string;
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
	searchParams,
}: {
	params: { address: Address };
	searchParams: { view: string | string[] | undefined };
}) {
	const view = getValueFromSearchParams(searchParams, "view", "supported", [
		"created",
		"supported",
	]);
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
					view={view}
					address={address}
					stats={{
						hypercertsCreated: validHypercertsCount,
						hypercertsSupported: combinedSales.length,
						salesMadeCount: sales.length,
					}}
				/>
				<StatCard
					title={"Hypercerts supported"}
					display={combinedSales.length}
				/>
				<StatCard
					title={"Total amount contributed"}
					display={
						<>
							{totalSalesInUSD}
							<span className="text-xl">&nbsp;USD</span>
						</>
					}
				/>
			</div>
			<Content
				view={view}
				createdHypercerts={hypercerts}
				combinedSales={combinedSales}
				address={address}
			/>
		</MotionWrapper>
	);
}
