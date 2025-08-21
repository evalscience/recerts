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
			<article className="group relative flex h-[300px] flex-col overflow-hidden rounded-lg border border-border/60 bg-background shadow-sm transition-shadow hover:shadow-md">
				<div className="relative h-[240px] w-full overflow-hidden border-border/50 border-b bg-muted/30 p-2 dark:bg-white">
					<Image
						src={`/api/hypercert-image/${hypercertId}`}
						alt={"Hypercert image"}
						height={600}
						width={800}
						className="mx-auto h-full w-full object-contain object-center transition duration-300 group-hover:scale-[1.02]"
					/>
				</div>

				<section className="flex w-full flex-1 px-3 py-3">
					<div className="flex w-full items-center justify-between gap-3">
						<div className="flex min-w-0 flex-1 items-center">
							{Array.isArray(topics) && topics.length > 0 ? (
								<TagsTwoRows topics={topics} idPrefix={String(hypercertId)} />
							) : null}
						</div>
						<div className="flex items-center">
							{reviewStatus === "Under review" ? (
								<span className="mr-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-amber-900 text-xs dark:bg-amber-900/30 dark:text-amber-200">
									Under review
								</span>
							) : (
								<span className="mr-2 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-900 text-xs dark:bg-emerald-900/30 dark:text-emerald-200">
									Reviewed
								</span>
							)}
							{pricePerPercentInUSD === undefined ? null : unitsForSale ===
							  0n ? (
								<span className="inline-block rounded-full bg-destructive/15 px-2 py-0.5 text-destructive text-sm">
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
													textClassName="text-black"
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
					className="mr-1 mb-1 inline-flex items-center rounded-full border px-2 py-[2px] text-[11px] text-neutral-600 leading-4 dark:text-neutral-300"
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
								className="mr-1 mb-1 inline-flex items-center rounded-full border px-2 py-[2px] text-[11px] text-neutral-600 leading-4 dark:text-neutral-300"
								data-chip="tag"
							>
								{t}
							</span>
						))}
						{overflow > 0 ? (
							<span
								className="mr-1 mb-1 inline-flex items-center rounded-full border px-2 py-[2px] text-[11px] text-neutral-600 leading-4 dark:text-neutral-300"
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
