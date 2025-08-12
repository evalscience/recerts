import { forwardRef, memo, useEffect, useRef, useState } from "react";

export interface HypercertCardProps {
	title?: string;
	workStartDate?: Date;
	workEndDate?: Date;
	badges?: string[];
	displayOnly?: boolean;
	hypercertId?: string;
	contributors?: string[];
	abstract?: string;
	styleVariant?: "style1" | "style2" | "style3";
}

const HypercertCard = forwardRef<HTMLDivElement, HypercertCardProps>(
	(
		{
			title = "Your title here",
			workStartDate,
			workEndDate,
			badges = [],
			displayOnly = false,
			contributors = [],
			abstract = "",
			styleVariant = "style1",
		}: HypercertCardProps,
		ref,
	) => {
		// Build a contributors display that trims before breaking a name and appends "et al." when too long
		const buildContributorsDisplay = (contributorsList: string[]): string => {
			if (!contributorsList || contributorsList.length === 0) return "";
			const MAX_LENGTH = 68; // heuristic fit for card width at current font size
			const displayParts: string[] = [];
			let currentLength = 0;
			for (const [index, name] of contributorsList.entries()) {
				const separator = index === 0 ? "" : ", ";
				const addition = separator + name.trim();
				if (currentLength + addition.length <= MAX_LENGTH) {
					displayParts.push(index === 0 ? name.trim() : name.trim());
					currentLength += addition.length;
				} else {
					// cannot fit this name fully; append et al. if there are remaining authors
					if (index < contributorsList.length) {
						return `${displayParts.join(", ")}, et al.`;
					}
					break;
				}
			}
			// If all names fit exactly
			return displayParts.join(", ");
		};

		const contributorsDisplay = buildContributorsDisplay(contributors);

		// date range intentionally hidden in preview

		// Dynamically compute how many lines of abstract can fit
		const sectionRef = useRef<HTMLDivElement>(null);
		const abstractRef = useRef<HTMLParagraphElement>(null);
		// topics removed
		const [abstractClamp, setAbstractClamp] = useState<number>(6);
		const [abstractMaxHeightPx, setAbstractMaxHeightPx] = useState<number>(120);

		useEffect(() => {
			const recalc = () => {
				if (!sectionRef.current || !abstractRef.current) return;
				const abstractEl = abstractRef.current;
				const containerEl = sectionRef.current;
				const lineHeightPx = Number.parseFloat(
					getComputedStyle(abstractEl).lineHeight || "20",
				);
				// Reserve space to bottom; no topics
				const bufferPx = 16;
				const availablePx =
					containerEl.clientHeight - abstractEl.offsetTop - bufferPx;
				const lines = Math.max(1, Math.floor(availablePx / lineHeightPx));
				const baseAdjusted = Math.max(1, lines - 1);
				const styleAdjusted =
					styleVariant === "style1"
						? Math.max(1, baseAdjusted - 1)
						: baseAdjusted;
				setAbstractClamp(styleAdjusted);
				setAbstractMaxHeightPx(Math.max(40, availablePx));
			};
			recalc();
			window.addEventListener("resize", recalc);
			return () => window.removeEventListener("resize", recalc);
		}, [styleVariant]);

		// Topics rendering removed

		// removed topics computation

		return (
			<article
				ref={ref}
				className="relative h-[420px] w-[336px] overflow-clip rounded-xl border border-black bg-white"
			>
				<section
					ref={sectionRef}
					className="relative flex h-full flex-col items-center gap-1 p-4 pb-6 text-center"
				>
					{styleVariant === "style2" ? (
						<>
							{/* Title with tight black rules above and below */}
							<div className="w-full">
								<div className="mx-1 h-[6px] w-[calc(100%-0.5rem)] bg-black" />
								<h5
									className="mt-[6px] mb-3 line-clamp-4 text-ellipsis pb-[2px] font-baskerville font-bold text-[28px] text-slate-900 leading-[36px] tracking-[-0.01em]"
									title={title}
								>
									{title}
								</h5>
								<div className="mx-1 h-[3px] w-[calc(100%-0.5rem)] bg-black" />
							</div>
							{contributorsDisplay && (
								<p
									className="mx-auto mt-2 max-w-[90%] truncate text-base text-slate-700 leading-5"
									title={contributors.join(", ")}
								>
									{contributorsDisplay}
								</p>
							)}
							{/* Centered Abstract heading */}
							{abstract && (
								<>
									<p className="mt-3 font-baskerville font-semibold text-slate-900 text-sm uppercase tracking-[0.08em]">
										Abstract
									</p>
									<p
										ref={abstractRef}
										className="mt-1 text-slate-700 text-xs leading-4"
										style={{
											display: "-webkit-box",
											WebkitBoxOrient:
												"vertical" as unknown as React.CSSProperties["WebkitBoxOrient"],
											WebkitLineClamp:
												abstractClamp as unknown as React.CSSProperties["WebkitLineClamp"],
											overflow: "hidden",
											wordBreak: "break-word",
											overflowWrap: "anywhere",
										}}
									>
										{abstract}
									</p>
								</>
							)}
						</>
					) : styleVariant === "style1" ? (
						<>
							{/* Style 1: no bars, classic title and inline abstract label */}
							<div>
								<h5
									className="line-clamp-10 text-ellipsis pb-[2px] font-baskerville font-bold text-[30px] text-slate-900 leading-[36px] tracking-[-0.02em]"
									title={title}
								>
									{title}
								</h5>
								{contributorsDisplay && (
									<p
										className="mx-auto mt-2 max-w-[90%] truncate text-base text-slate-700 leading-5"
										title={contributors.join(", ")}
									>
										{contributorsDisplay}
									</p>
								)}
							</div>
							{abstract && (
								<p
									ref={abstractRef}
									className="mt-2 text-slate-700 text-xs leading-4"
									style={{
										display: "-webkit-box",
										WebkitBoxOrient:
											"vertical" as unknown as React.CSSProperties["WebkitBoxOrient"],
										WebkitLineClamp:
											abstractClamp as unknown as React.CSSProperties["WebkitLineClamp"],
										overflow: "hidden",
										wordBreak: "break-word",
										overflowWrap: "anywhere",
									}}
								>
									<span className="font-semibold">Abstract.</span> {abstract}
								</p>
							)}
						</>
					) : (
						<>
							{/* Style 3: tiny headline above title, two-column abstract */}
							<div className="w-full">
								<p className="text-[10px] text-slate-600 uppercase leading-3 tracking-[0.18em]">
									recerts
								</p>
								<h5
									className="mt-1 line-clamp-4 text-ellipsis pb-[2px] font-baskerville font-bold text-[28px] text-slate-900 leading-[36px] tracking-[-0.01em]"
									title={title}
								>
									{title}
								</h5>
							</div>
							{contributorsDisplay && (
								<p
									className="mx-auto mt-1.5 max-w-[90%] truncate text-slate-700 text-sm leading-[18px]"
									title={contributors.join(", ")}
								>
									{contributorsDisplay}
								</p>
							)}
							{abstract && (
								<div
									ref={abstractRef}
									className="mt-2 text-[10px] text-slate-700 leading-[14px] [column-count:2] [column-gap:12px]"
									style={{
										maxHeight: abstractMaxHeightPx,
										overflow: "hidden",
									}}
								>
									<span className="font-semibold">Abstract.</span> {abstract}
								</div>
							)}
						</>
					)}
					<div className="mt-auto" />
					{/* date range hidden */}
				</section>
			</article>
		);
	},
);

HypercertCard.displayName = "HypercertCard";

export default memo(HypercertCard);
