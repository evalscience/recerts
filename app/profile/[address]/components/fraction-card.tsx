"use client";
import {
	type Hypercert,
	fetchFullHypercertById,
} from "@/app/graphql-queries/hypercerts";
import type { Fraction } from "@/app/graphql-queries/user-fractions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { calculateBigIntPercentage } from "@/lib/calculateBigIntPercentage";
import {
	bigintToFormattedDate,
	cn,
	formatCurrency,
	formatDate,
} from "@/lib/utils";
import {
	ArrowUpRight,
	CalendarRange,
	CircleAlert,
	CircleSlash2,
	Loader2,
	RotateCw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export type FractionWithCountAndWorth = Fraction & {
	worthInUSD?: number | null;
	count: number;
};

export const NoFractions = () => {
	return (
		<div className="flex flex-col items-center gap-4 pt-6 text-center md:px-20">
			<CircleAlert className="text-beige-muted-foreground/50" size={40} />
			<p className="px-8 text-beige-muted-foreground">
				No recent support activity
			</p>
		</div>
	);
};

function FractionCard({ fraction }: { fraction: FractionWithCountAndWorth }) {
	const { hypercertId, name, description, image, work, worthInUSD } = fraction;

	return (
		<article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border">
			{worthInUSD === undefined ? (
				<div className="flex items-center justify-center gap-2 bg-background px-4 py-2 text-center">
					<Loader2 size={18} className="animate-spin text-primary" />
					<span className="text-muted-foreground">Loading...</span>
				</div>
			) : worthInUSD === null ? null : (
				<div className="flex items-center justify-center bg-background px-4 py-2 text-center">
					<span className="mx-6 font-bold text-primary">
						${Math.floor(worthInUSD * 100) / 100}
					</span>
				</div>
			)}

			<div className="relative flex h-[200px] w-full items-start justify-center overflow-hidden rounded-t-2xl bg-muted p-4">
				<Image
					// src={`/api/hypercert/${hypercert_id}/image`}
					src={image ?? ""}
					alt={name ?? "Untitled"}
					height={200}
					width={200}
					className="h-auto w-full transition group-hover:scale-[1.05] group-hover:blur-sm group-hover:brightness-75"
				/>
				{hypercertId !== undefined && (
					<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
						<Link href={`/hypercert/${hypercertId}`} target="_blank" passHref>
							<Button variant={"secondary"} className="gap-2">
								View Hypercert <ArrowUpRight size={20} />
							</Button>
						</Link>
					</div>
				)}
			</div>
			<section
				className="w-full flex-1 space-y-2 border-t border-t-border bg-background/90 p-4 backdrop-blur-md"
				style={{
					boxShadow: "0 -10px 10px rgba(0, 0, 0, 0.1)",
				}}
			>
				<div className="flex flex-wrap gap-1">
					{work.scope?.map((scope) => (
						<Badge
							key={scope}
							variant="secondary"
							className={cn("items-center justify-between rounded-3xl")}
						>
							<p className="ml-1 font-light text-xs">{scope}</p>
						</Badge>
					))}
				</div>
				<p
					className={`line-clamp-2 max-h-12 flex-1 text-ellipsis font-baskerville font-semibold text-lg leading-5${
						name ? "text-foreground" : "text-muted-foreground"
					}`}
				>
					{name ?? "[Untitled]"}
				</p>
				{work.from !== undefined && work.to !== undefined && (
					<div className="flex items-center gap-2 text-muted-foreground">
						<CalendarRange className="" size={16} />
						{work.from !== undefined && (
							<time
								className="text-sm text-vd-blue-400"
								dateTime={bigintToFormattedDate(work.from)}
							>
								{bigintToFormattedDate(work.from)}
							</time>
						)}
						<span className="text-sm text-vd-blue-400"> - </span>
						{work.to !== undefined && (
							<time
								className="text-sm text-vd-blue-400"
								dateTime={bigintToFormattedDate(work.to)}
							>
								{bigintToFormattedDate(work.to)}
							</time>
						)}
					</div>
				)}
				<p
					className={
						"line-clamp-2 max-h-12 flex-1 text-ellipsis text-muted-foreground"
					}
				>
					{description ?? "..."}
				</p>
			</section>
		</article>
	);
}

export default FractionCard;
