"use client";

import { Button } from "@/components/ui/button";

import usePriceFeed, { type PriceFeedContext } from "@/app/PriceFeedProvider";
import { ShowingDisplay, VDPaginator } from "@/components/global/vd-paginator";
import type { Hypercert } from "@/graphql/hypercerts/queries/hypercerts";
import { fetchHypercertIDs } from "@/graphql/hypercerts/queries/hypercerts";
import autoAnimate from "@formkit/auto-animate";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Card from "./card";
import GraphView from "./graph-view";
import Search, { type SortOption, type SortKey } from "./search";
import TableView from "./table-view";

const calculateHypercertTotalSalesInUSD = (
	hypercert: Hypercert,
	priceFeed: PriceFeedContext,
) => {
	const { sales } = hypercert;
	const totalSalesInUSD =
		priceFeed.status === "ready"
			? sales.reduce((acc, sale) => {
					return (
						acc +
						(priceFeed.toUSD(
							sale.currency as `0x${string}`,
							BigInt(sale.currencyAmount),
						) ?? 0)
					);
			  }, 0)
			: null;
	return totalSalesInUSD;
};

export function GridView({ hypercerts }: { hypercerts: Hypercert[] }) {
	const searchInputState = useState("");
	const [searchInput, setSearchInput] = searchInputState;
	const chainFilterState = useState<string>("all");
	const [selectedChainId, setSelectedChainId] = chainFilterState;
	const sortOptionsState = useState<SortOption>({
		key: "date",
		order: "asc",
	});
	const [sortOptions, setSortOptions] = sortOptionsState;
	const viewState = useState<"grid" | "table" | "graph">("grid");
	const [view] = viewState;
	const priceFeed = usePriceFeed();
	const filteredHypercerts = useMemo(() => {
		const chainFiltered =
			selectedChainId !== "all"
				? hypercerts.filter(
						(h) => String(h.chainId) === String(selectedChainId),
				  )
				: hypercerts;
		if (searchInput === "") {
			return chainFiltered;
		}
		const fuse = new Fuse(chainFiltered, {
			keys: ["name", "description"],
			threshold: 0.1,
			ignoreLocation: true,
		});
		return fuse.search(searchInput).map((result) => result.item);
	}, [hypercerts, searchInput, selectedChainId]);

	const gridRef = useRef<HTMLDivElement>(null);

	// Temporarily disable verified badge usage in preview cards
	// const { data: verifiedIds } = useQuery({
	//   queryKey: ["hypercert-ids-in-hyperboard"],
	//   queryFn: fetchHypercertIDs,
	// });

	const clearAllFilters = useCallback(() => {
		setSearchInput("");
		setSelectedChainId("all");
	}, [setSearchInput, setSelectedChainId]);

	// biome-ignore lint/correctness/useExhaustiveDependencies(filteredHypercerts): gridRef updates when filteredHypercerts changes, so it is required in the dependency array, but the callback is independent from it
	useEffect(() => {
		if (gridRef.current) {
			autoAnimate(gridRef.current);
		}
	}, [filteredHypercerts]);

	const sortedHypercerts = useMemo(() => {
		const key = sortOptions.key;
		const order = sortOptions.order;
		const arr = [...filteredHypercerts];
		if (key === "date") {
			arr.sort((a, b) => {
				const diff =
					Number(a.creationBlockTimestamp) - Number(b.creationBlockTimestamp);
				return order === "asc" ? diff : -diff;
			});
		} else if (key === "price") {
			arr.sort((a, b) => {
				const aPrice = a.pricePerPercentInUSD ?? 0;
				const bPrice = b.pricePerPercentInUSD ?? 0;
				return order === "asc" ? aPrice - bPrice : bPrice - aPrice;
			});
		} else if (key === "totalSales") {
			arr.sort((a, b) => {
				const aSales = calculateHypercertTotalSalesInUSD(a, priceFeed) ?? 0;
				const bSales = calculateHypercertTotalSalesInUSD(b, priceFeed) ?? 0;
				return order === "asc" ? aSales - bSales : bSales - aSales;
			});
		}
		return arr;
	}, [filteredHypercerts, sortOptions, priceFeed]);

	return (
		<section
			className="flex w-full flex-col items-center px-2 py-6 md:px-6"
			id="discover"
		>
			<section className="flex w-full max-w-[1400px] flex-1 flex-col">
				{hypercerts.length > 0 && (
					<Search
						inputState={searchInputState}
						sortOptionsState={sortOptionsState}
						viewState={viewState}
						chainFilterState={chainFilterState}
					/>
				)}
				<div className="p-3" />
				{filteredHypercerts.length ? (
					view === "grid" ? (
						<div
							className="grid auto-rows-[300px] grid-cols-[minmax(280px,_1fr)] gap-3 self-center lg:grid-cols-[280px_280px_280px] md:grid-cols-[280px_280px] xl:grid-cols-[280px_280px_280px_280px]"
							ref={gridRef}
						>
							{sortedHypercerts.map((hypercert: Hypercert) => (
								<Card
									hypercert={hypercert}
									key={hypercert.hypercertId}
									totalSalesInUSD={calculateHypercertTotalSalesInUSD(
										hypercert,
										priceFeed,
									)}
									contributors={hypercert.contributors}
								/>
							))}
						</div>
					) : view === "table" ? (
						<TableView
							hypercerts={sortedHypercerts}
							getTotalSalesInUSD={(h: Hypercert) =>
								calculateHypercertTotalSalesInUSD(h, priceFeed)
							}
						/>
					) : (
						<GraphView hypercerts={sortedHypercerts} />
					)
				) : (
					<section className="flex w-full items-center justify-center py-6">
						<div className="flex flex-col items-center pb-24 text-center md:pb-10">
							<TriangleAlert
								className="mb-4 text-muted-foreground/75"
								size={60}
							/>
							<p className="font-bold text-lg text-muted-foreground">
								We couldn't find any recerts matching your search or filter.
							</p>
							<p className="text-muted-foreground">
								Please remove some of your filters and try again.
							</p>
							<Button
								variant={"secondary"}
								className="mt-4"
								onClick={clearAllFilters}
							>
								Clear all filters
							</Button>
						</div>
					</section>
				)}
				{
					<section className="mt-4 flex flex-col items-center justify-center gap-2">
						{filteredHypercerts.length > 0 && (
							<ShowingDisplay
								currentPage={1}
								totalItemAmount={filteredHypercerts.length}
								itemsPerPage={filteredHypercerts.length}
							/>
						)}
						{/* <VDPaginator
							needsPagination={needsPagination}
							currentPage={currentPage}
							maxPage={maxPage}
							loadPage={loadPage}
						/> */}
					</section>
				}
			</section>
		</section>
	);
}
