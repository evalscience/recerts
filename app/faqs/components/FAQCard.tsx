"use client";
import { cn } from "@/lib/utils";
import autoAnimate from "@formkit/auto-animate";
import { ChevronDown } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

const FAQCard = ({
	question,
	answer,
}: {
	question: React.ReactNode;
	answer: React.ReactNode;
}) => {
	const thisRef = useRef<HTMLDivElement>(null);
	const [isExpanded, setIsExpanded] = useState(false);

	useEffect(() => {
		if (thisRef.current) {
			autoAnimate(thisRef.current);
		}
	});
	return (
		<div
			className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-background/50 p-2"
			ref={thisRef}
		>
			<button
				type="button"
				className={cn(
					"flex items-start justify-between rounded-xl border border-border px-4 py-3 font-baskerville font-bold",
					isExpanded
						? "bg-beige-muted text-beige-muted-foreground"
						: "bg-white",
				)}
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<span className="text-left text-xl">{question}</span>
				<div className="flex h-[28px] items-center justify-center">
					{
						<ChevronDown
							className={cn(
								"transition-transform",
								isExpanded ? "rotate-180" : "",
							)}
							size={20}
						/>
					}
				</div>
			</button>
			{isExpanded && (
				<div className="rounded-xl bg-white/80 p-4 text-justify">{answer}</div>
			)}
		</div>
	);
};

export default FAQCard;
