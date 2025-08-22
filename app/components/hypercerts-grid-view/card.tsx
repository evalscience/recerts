"use client";

import CircularProgress from "@/components/ui/circular-progress";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Hypercert } from "@/graphql/hypercerts/queries/hypercerts";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

// * REFACTORED from hypercerts-app hypercert-window
const Card = ({
	hypercert,
	totalSalesInUSD,
	contributors,
}: {
	hypercert: Hypercert;
	totalSalesInUSD: number | null;
	contributors?: string[];
}) => {
	const {
		hypercertId,
		unitsForSale,
		pricePerPercentInUSD,
		topics,
		hasReviews,
	} = hypercert;

	const [reviewStatus, setReviewStatus] = useState<"Under review" | "Reviewed">(
		hasReviews ? "Reviewed" : "Under review",
	);

	useEffect(() => {
		let cancelled = false;
		const fetchStatus = async () => {
			try {
				const res = await fetch("/api/airtable-hypercert-ids?debug=1", {
					cache: "no-store",
				});
				if (!res.ok) return;
				const json = (await res.json()) as {
					statuses?: Record<string, "Under review" | "Reviewed">;
				};
				const s = json.statuses?.[hypercertId];
				if (!cancelled && s) setReviewStatus(s);
			} catch {}
		};
		fetchStatus();
		return () => {
			cancelled = true;
		};
	}, [hypercertId]);

	return (
		<Link href={`/hypercert/${hypercertId}`} passHref>
			<article className="group relative flex h-[280px] flex-col overflow-hidden rounded-xl border border-border/20 bg-white shadow-sm transition-all duration-200 dark:border-neutral-600 hover:border-border/40 dark:bg-background hover:shadow-lg">
				<div className="relative h-[200px] w-full overflow-hidden bg-white p-3 dark:bg-white">
					<Image
						src={`/api/hypercert-image/${hypercertId}`}
						alt={"Hypercert image"}
						height={600}
						width={800}
						className="mx-auto h-full w-full object-contain object-center transition duration-200 group-hover:scale-[1.01]"
					/>
				</div>

				<section className="flex w-full flex-1 px-4 py-4">
					<div className="flex w-full items-center justify-between gap-3">
						<div className="flex min-w-0 flex-1 items-center">
							{Array.isArray(topics) && topics.length > 0 ? (
								<TagsTwoRows topics={topics} idPrefix={String(hypercertId)} />
							) : null}
						</div>
						<div className="flex items-center">
							{reviewStatus === "Under review" ? (
								<span className="mr-3 inline-block rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-900 text-xs dark:bg-amber-900/20 dark:text-amber-300">
									Under review
								</span>
							) : (
								<span className="mr-3 inline-block rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-900 text-xs dark:bg-emerald-900/20 dark:text-emerald-300">
									Reviewed
								</span>
							)}
							{pricePerPercentInUSD === undefined ? null : unitsForSale ===
							  0n ? (
								<span className="inline-block rounded-full bg-destructive/10 px-3 py-1 font-medium text-destructive text-xs">
									Sold
								</span>
							) : totalSalesInUSD !== null ? (
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<div className="inline-flex flex-col items-end">
												<CircularProgress
													value={totalSalesInUSD / pricePerPercentInUSD}
													text={
														Math.floor(totalSalesInUSD / pricePerPercentInUSD) >
														999
															? ">999%"
															: `${Math.floor(
																	totalSalesInUSD / pricePerPercentInUSD,
															  ).toFixed(0)}%`
													}
													textClassName="text-foreground"
												/>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<div>
												<div className="font-medium">Funding</div>
												<div className="text-muted-foreground text-sm">
													${Math.floor(totalSalesInUSD).toFixed(0)} raised
												</div>
												<div className="text-muted-foreground text-sm">
													${Math.floor(pricePerPercentInUSD * 100).toFixed(0)}{" "}
													target
												</div>
											</div>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							) : null}
						</div>
					</div>
				</section>
			</article>
		</Link>
	);
};

export default Card;

function TagsTwoRows({
	topics,
	idPrefix,
}: { topics: string[]; idPrefix: string }) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [visibleCount, setVisibleCount] = useState<number>(topics.length);

	const maxHeightPx = 48; // ~ two rows of 24px chips

	useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// Reset to measure from full
		setVisibleCount(topics.length);

		const measure = () => {
			if (!container) return;
			const chips = Array.from(
				container.querySelectorAll<HTMLSpanElement>("[data-chip='tag']"),
			);
			let lastIndexThatFits = chips.length - 1;
			for (let i = 0; i < chips.length; i++) {
				const chip = chips[i];
				const bottom = chip.offsetTop + chip.offsetHeight;
				if (bottom > maxHeightPx) {
					lastIndexThatFits = Math.max(0, i - 1);
					break;
				}
			}
			setVisibleCount(Math.max(0, lastIndexThatFits + 1));
		};

		// Defer measurement till after paint
		requestAnimationFrame(measure);

		const ro = new ResizeObserver(() => requestAnimationFrame(measure));
		ro.observe(container);
		return () => ro.disconnect();
	}, [topics]);

	const overflow = Math.max(0, topics.length - visibleCount);
	const visible = topics.slice(0, visibleCount);

	const allTags = (
		<div className="flex max-w-[420px] flex-wrap items-center">
			{topics.map((t) => (
				<span
					key={`${idPrefix}-topic-full-${t}`}
					className="mr-2 mb-1 inline-flex items-center rounded-full border border-border/30 bg-background/50 px-2.5 py-1 text-[11px] text-neutral-700 leading-4 dark:border-border/20 dark:text-neutral-200"
					data-chip="tag"
				>
					{t}
				</span>
			))}
		</div>
	);

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div
						ref={containerRef}
						className="flex max-h-12 min-w-0 flex-1 flex-wrap items-center overflow-hidden"
					>
						{visible.map((t) => (
							<span
								key={`${idPrefix}-topic-${t}`}
								className="mr-2 mb-1 inline-flex items-center rounded-full border border-border/30 bg-background/50 px-2.5 py-1 text-[11px] text-neutral-700 leading-4 dark:border-neutral-600 dark:text-neutral-200"
								data-chip="tag"
							>
								{t}
							</span>
						))}
						{overflow > 0 ? (
							<span
								className="mr-2 mb-1 inline-flex items-center rounded-full border border-border/30 bg-background/50 px-2.5 py-1 text-[11px] text-neutral-700 leading-4 dark:border-neutral-600 dark:text-neutral-200"
								data-chip="tag"
							>
								+{overflow}
							</span>
						) : null}
					</div>
				</TooltipTrigger>
				{overflow > 0 ? <TooltipContent>{allTags}</TooltipContent> : null}
			</Tooltip>
		</TooltipProvider>
	);
}
