"use client";

import CircularProgress from "@/components/ui/circular-progress";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Hypercert } from "@/graphql/hypercerts/queries/hypercerts";
import { getChainInfo } from "@/lib/chainInfo";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";

export default function TableView({
	hypercerts,
	getTotalSalesInUSD,
}: {
	hypercerts: Hypercert[];
	getTotalSalesInUSD: (h: Hypercert) => number | null;
}) {
	const [expandedById, setExpandedById] = useState<Record<string, boolean>>({});

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

	return (
		<div className="w-full overflow-x-auto">
			<table
				aria-label="Hypercerts table"
				className="w-full table-auto text-left font-serif"
			>
				<colgroup>
					<col className="w-[10%]" />
					<col className="w-[40%]" />
					<col className="w-[18%]" />
					<col className="w-[24%]" />
					<col className="w-[8%]" />
				</colgroup>
				<thead className="text-muted-foreground text-xs">
					<tr className="border-b">
						<th className="py-2 pr-2 font-medium">Year</th>
						<th className="py-2 pr-2 font-medium">Title</th>
						<th className="py-2 pr-2 font-medium">Authors</th>
						<th className="py-2 pr-2 font-medium">Subject areas</th>
						<th className="py-2 pr-0 text-right font-medium">Funding</th>
					</tr>
				</thead>
				<tbody className="text-sm">
					{hypercerts.map((h) => {
						const isOpen = !!expandedById[h.hypercertId];
						const year = formatYear(h.creationBlockTimestamp);
						const totalSalesInUSD = getTotalSalesInUSD(h);
						const targetUSD = h.pricePerPercentInUSD;
						const isSold = targetUSD !== undefined && h.unitsForSale === 0n;
						const chainInfo = getChainInfo(h.chainId);
						return (
							<Fragment key={h.hypercertId}>
								<tr className="border-b transition-colors hover:bg-muted/20">
									<td className="py-3 pr-2 align-top text-muted-foreground">
										{year}
									</td>
									<td className="py-3 pr-2 align-top">
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
											{chainInfo ? (
												<span className="inline-flex items-center gap-1 rounded-md bg-muted/40 px-1.5 py-[2px]">
													<Image
														src={chainInfo.logoSrc}
														alt={`${chainInfo.label} logo`}
														width={12}
														height={12}
														className="rounded-[2px]"
													/>
													<span className="text-[10px] text-muted-foreground">
														{chainInfo.label}
													</span>
												</span>
											) : null}
										</div>
									</td>
									<td className="py-3 pr-2 align-top text-[13px] text-muted-foreground italic">
										{Array.isArray(h.contributors) && h.contributors.length
											? h.contributors.join(", ").replace(/, ([^,]*)$/, " & $1")
											: "—"}
									</td>
									<td className="py-3 pr-0 align-top">
										{Array.isArray(h.topics) && h.topics.length ? (
											h.topics
												.slice(0, 10)
												.map((t, i) => (
													<SubjectBadge
														key={`${h.hypercertId}-topic-${i}`}
														text={t}
													/>
												))
										) : (
											<span className="text-muted-foreground">—</span>
										)}
									</td>
									<td className="py-3 pr-0 text-right align-top">
										{isSold ? (
											<span className="inline-block rounded-full bg-destructive/15 px-2 py-0.5 text-destructive text-xs">
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
									<tr className="border-b last:border-b-0">
										<td colSpan={5} className="bg-muted/20">
											<div className="px-4 py-4">
												<div className="mb-2 font-medium text-[15px]">
													Abstract
												</div>
												<p className="text-[13px] text-muted-foreground leading-6">
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
