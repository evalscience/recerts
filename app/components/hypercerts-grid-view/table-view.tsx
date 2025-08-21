"use client";

import CircularProgress from "@/components/ui/circular-progress";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Hypercert } from "@/graphql/hypercerts/queries/hypercerts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

export default function TableView({
	hypercerts,
	getTotalSalesInUSD,
}: {
	hypercerts: Hypercert[];
	getTotalSalesInUSD: (h: Hypercert) => number | null;
}) {
	const [expandedById, setExpandedById] = useState<Record<string, boolean>>({});
	const [reviewStatusById, setReviewStatusById] = useState<
		Record<string, "Under review" | "Reviewed">
	>({});

	useEffect(() => {
		let cancelled = false;
		const load = async () => {
			try {
				const res = await fetch("/api/airtable-hypercert-ids?debug=1", {
					cache: "no-store",
				});
				if (!res.ok) return;
				const json = (await res.json()) as {
					statuses?: Record<string, "Under review" | "Reviewed">;
				};
				if (!cancelled && json.statuses) setReviewStatusById(json.statuses);
			} catch {}
		};
		load();
		return () => {
			cancelled = true;
		};
	}, []);

	const formatYear = (timestamp?: bigint) => {
		if (!timestamp) return "—";
		try {
			const ms = Number(timestamp) * 1000;
			if (!Number.isFinite(ms)) return "—";
			return new Date(ms).getFullYear();
		} catch {
			return "—";
		}
	};

	const toggle = (id: string) =>
		setExpandedById((prev) => ({ ...prev, [id]: !prev[id] }));

	const SubjectBadge = ({ text }: { text: string }) => (
		<span className="mr-1 mb-1 inline-flex items-center rounded-full border px-2 py-[2px] text-[11px] text-muted-foreground leading-4">
			{text}
		</span>
	);

	const SubjectTagsCompact = ({
		topics,
		idPrefix,
	}: { topics: string[]; idPrefix: string }) => {
		if (!topics.length) return <span className="text-muted-foreground">—</span>;

		const first = topics[0];
		const overflow = Math.max(0, topics.length - 1);

		const allTags = (
			<div className="flex max-w-[480px] flex-wrap items-center">
				{topics.map((t) => (
					<span
						key={`${idPrefix}-topic-full-${t}`}
						className="mr-1 mb-1 inline-flex items-center rounded-full border px-2 py-[2px] text-[11px] text-muted-foreground leading-4"
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
						<div className="flex flex-wrap items-center">
							<SubjectBadge text={first} />
							{overflow > 0 ? (
								<span className="mr-1 mb-1 inline-flex items-center rounded-full border px-2 py-[2px] text-[11px] text-muted-foreground leading-4">
									+{overflow}
								</span>
							) : null}
						</div>
					</TooltipTrigger>
					{overflow > 0 ? <TooltipContent>{allTags}</TooltipContent> : null}
				</Tooltip>
			</TooltipProvider>
		);
	};

	return (
		<div className="w-full overflow-x-auto">
			<table
				aria-label="Hypercerts table"
				className="w-full table-auto text-left"
			>
				<colgroup>
					<col className="w-[8%]" />
					<col className="w-[36%]" />
					<col className="w-[18%]" />
					<col className="w-[22%]" />
					<col className="w-[8%]" />
					<col className="w-[8%]" />
				</colgroup>
				<thead className="text-muted-foreground text-xs">
					<tr className="border-border/50 border-b">
						<th className="py-4 pr-4 text-left font-medium">Year</th>
						<th className="py-4 pr-4 text-left font-medium">Title</th>
						<th className="py-4 pr-4 text-left font-medium">Authors</th>
						<th className="py-4 pr-4 text-left font-medium">Subject areas</th>
						<th className="py-4 pr-4 text-left font-medium">Status</th>
						<th className="py-4 pr-0 text-right font-medium">Funding</th>
					</tr>
				</thead>
				<tbody className="text-sm">
					{hypercerts.map((h) => {
						const isOpen = !!expandedById[h.hypercertId];
						const year = formatYear(h.creationBlockTimestamp);
						const totalSalesInUSD = getTotalSalesInUSD(h);
						const targetUSD = h.pricePerPercentInUSD;
						const isSold = targetUSD !== undefined && h.unitsForSale === 0n;
						return (
							<Fragment key={h.hypercertId}>
								<tr className="border-border/30 border-b transition-colors hover:bg-muted/10">
									<td className="py-4 pr-4 align-top text-muted-foreground text-sm">
										{year}
									</td>
									<td className="py-4 pr-4 align-top">
										<div className="inline-flex max-w-full items-center gap-2">
											<button
												type="button"
												aria-expanded={isOpen ? "true" : "false"}
												onClick={() => toggle(h.hypercertId)}
												className="group inline-flex items-center text-left"
												aria-label={isOpen ? "Collapse" : "Expand"}
											>
												<span
													className={cn(
														"text-muted-foreground transition-transform group-hover:text-foreground",
														isOpen ? "rotate-90" : "rotate-0",
													)}
												>
													▸
												</span>
											</button>
											<Link
												href={`/hypercert/${h.hypercertId}`}
												className="truncate font-medium text-[15px] hover:underline"
											>
												{h.name ?? "Untitled"}
											</Link>
										</div>
									</td>
									<td className="py-4 pr-4 align-top text-muted-foreground text-sm">
										{Array.isArray(h.contributors) && h.contributors.length
											? h.contributors.join(", ").replace(/, ([^,]*)$/, " & $1")
											: "—"}
									</td>
									<td className="py-4 pr-4 align-top">
										{Array.isArray(h.topics) && h.topics.length ? (
											<SubjectTagsCompact
												topics={h.topics}
												idPrefix={String(h.hypercertId)}
											/>
										) : (
											<span className="text-muted-foreground text-sm">—</span>
										)}
									</td>
									<td className="py-4 pr-4 align-top">
										{(reviewStatusById[h.hypercertId] ??
											(h.hasReviews ? "Reviewed" : "Under review")) ===
										"Under review" ? (
											<span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700 text-xs dark:bg-amber-900/30 dark:text-amber-300">
												Under review
											</span>
										) : (
											<span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700 text-xs dark:bg-emerald-900/30 dark:text-emerald-300">
												Reviewed
											</span>
										)}
									</td>
									<td className="py-4 pr-0 text-right align-top">
										{isSold ? (
											<span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 font-medium text-red-700 text-xs dark:bg-red-900/30 dark:text-red-300">
												Sold
											</span>
										) : targetUSD !== undefined && totalSalesInUSD !== null ? (
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<div className="inline-flex flex-col items-end justify-end">
															<CircularProgress
																value={totalSalesInUSD / targetUSD}
																text={
																	Math.floor(totalSalesInUSD / targetUSD) > 999
																		? ">999%"
																		: `${Math.floor(
																				totalSalesInUSD / targetUSD,
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
																${Math.floor(targetUSD * 100).toFixed(0)} target
															</div>
														</div>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										) : (
											<span className="text-muted-foreground">—</span>
										)}
									</td>
								</tr>
								{isOpen ? (
									<tr className="border-border/30 border-b last:border-b-0">
										<td colSpan={6} className="bg-muted/5">
											<div className="px-6 py-6">
												<div className="mb-3 font-medium text-foreground text-sm">
													Abstract
												</div>
												<p className="max-w-4xl text-muted-foreground text-sm leading-relaxed">
													{h.description ?? "No abstract provided."}
												</p>
											</div>
										</td>
									</tr>
								) : null}
							</Fragment>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
